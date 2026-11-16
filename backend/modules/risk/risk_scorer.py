import os
import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "models",
    "legal-bert-unfair-tos",
)

# The 8 unfair categories (same names/order as before). The new model may also
# have a "Fair" output; it is ignored for red flags and scoring.
LABELS = [
    "Limitation of liability",
    "Unilateral termination",
    "Unilateral change",
    "Content removal",
    "Contract by using",
    "Choice of law",
    "Jurisdiction",
    "Arbitration",
]

SEVERITY_WEIGHTS = {
    "Limitation of liability": 8.0,
    "Unilateral termination": 8.5,
    "Unilateral change": 7.5,
    "Content removal": 7.0,
    "Contract by using": 4.0,
    "Choice of law": 6.0,
    "Jurisdiction": 8.0,
    "Arbitration": 9.5,
}

MAX_LENGTH = 256
DEFAULT_THRESHOLD = 0.5  # same as the new predict.py


class ToSRiskScorer:
    def __init__(self, model_path=None):
        if model_path is None:
            model_path = MODEL_DIR
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Risk model not found at: {model_path}")

        print(f"Loading risk scorer model from: {model_path}...")

        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        # No num_labels override: use the head size stored in the checkpoint.
        self.model = AutoModelForSequenceClassification.from_pretrained(model_path)
        self.model.eval()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

        # Map model output index -> category name, taken from the model's config
        # (this is what predict.py does). Falls back to LABELS order if the
        # config only has generic names like LABEL_0.
        id2label = self.model.config.id2label
        n_out = self.model.config.num_labels
        self.index_to_category = {}
        for i in range(n_out):
            name = id2label.get(i, id2label.get(str(i)))
            if name in SEVERITY_WEIGHTS:
                self.index_to_category[i] = name
        if not self.index_to_category:
            self.index_to_category = {i: LABELS[i] for i in range(min(n_out, len(LABELS)))}
        print(f"Label mapping: {self.index_to_category}")

        # Per-category thresholds (by name). Optional thresholds.json is still
        # honoured if present (keyed by old LABELS index); otherwise 0.5.
        self.thresholds = {c: DEFAULT_THRESHOLD for c in LABELS}
        threshold_path = os.path.join(model_path, "thresholds.json")
        if os.path.exists(threshold_path):
            try:
                with open(threshold_path, "r") as f:
                    loaded = json.load(f)
                for k, v in loaded.items():
                    if str(k).isdigit() and int(k) < len(LABELS):
                        self.thresholds[LABELS[int(k)]] = float(v)
                    elif k in self.thresholds:
                        self.thresholds[k] = float(v)
                print(f"Loaded class-specific thresholds: {self.thresholds}")
            except Exception as e:
                print(f"Error loading thresholds.json: {e}. Using 0.5 thresholds.")

    def analyze_clause(self, clause_text):
        """
        Same return format as before:
        {overall_risk_score, risk_level, red_flags, all_probabilities}
        """
        inputs = self.tokenizer(
            clause_text.strip(),
            return_tensors="pt",
            truncation=True,
            max_length=MAX_LENGTH,
            padding=True,
        )
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            logits = self.model(**inputs).logits
            probs = torch.sigmoid(logits).cpu().numpy()[0]

        red_flags = []
        weighted_scores = []
        all_probabilities = {c: 0.0 for c in LABELS}

        for idx, category in self.index_to_category.items():
            prob = float(probs[idx])
            weight = SEVERITY_WEIGHTS[category]
            thresh = self.thresholds.get(category, DEFAULT_THRESHOLD)

            weighted_score = prob * weight
            weighted_scores.append(weighted_score)
            all_probabilities[category] = prob

            if prob >= thresh:
                red_flags.append({
                    "category": category,
                    "probability": prob,
                    "class_threshold": thresh,
                    "severity_weight": weight,
                    "calculated_risk": float(weighted_score),
                })

        overall_score = float(max(weighted_scores)) if weighted_scores else 0.0

        if overall_score >= 6.0:
            risk_level = "High"
        elif overall_score >= 3.0:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        return {
            "overall_risk_score": round(overall_score, 2),
            "risk_level": risk_level,
            "red_flags": red_flags,
            "all_probabilities": all_probabilities,
        }