import os
import torch
import numpy as np
import json
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "models",
    "legal-bert_weighted_bce",
)

LABELS = [
    "Limitation of liability",
    "Unilateral termination",
    "Unilateral change",
    "Content removal",
    "Contract by using",
    "Choice of law",
    "Jurisdiction",
    "Arbitration"
]

SEVERITY_WEIGHTS = {
    "Limitation of liability": 8.0,
    "Unilateral termination": 8.5,
    "Unilateral change": 7.5,
    "Content removal": 7.0,
    "Contract by using": 4.0,
    "Choice of law": 6.0,
    "Jurisdiction": 8.0,
    "Arbitration": 9.5
}

class ToSRiskScorer:
    def __init__(self, model_path=None):
        # Determine model path
        if model_path is None:
            model_path = MODEL_DIR
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Risk model not found at: {model_path}"
            )
            
        print(f"Loading risk scorer model from: {model_path}...")
        
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            model_path, 
            num_labels=len(LABELS),
            problem_type="multi_label_classification"
        )
        self.model.eval() 
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        
        threshold_path = os.path.join(model_path, "thresholds.json")
        if os.path.exists(threshold_path):
            try:
                with open(threshold_path, "r") as f:
                    loaded_thresh = json.load(f)
                    self.thresholds = {int(k): float(v) for k, v in loaded_thresh.items()}
                print(f"Loaded class-specific thresholds: {self.thresholds}")
            except Exception as e:
                print(f"Error loading thresholds.json: {e}. Defaulting to 0.5 threshold.")
                self.thresholds = {i: 0.5 for i in range(len(LABELS))}
        else:
            self.thresholds = {i: 0.5 for i in range(len(LABELS))}

    def analyze_clause(self, clause_text):
        """
        Calculates category probabilities, weighted risk scores, red flags, 
        overall risk score (max of category scores), and qualitative risk level.
        """
        # Tokenize the input text and send token tensors to device (GPU/CPU)
        inputs = self.tokenizer(clause_text, return_tensors="pt", truncation=True, max_length=256, padding=True)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        # Run forward pass without calculating gradients (faster inference)
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            # Sigmoid activation: converts logits (-inf to +inf) to probabilities (0.0 to 1.0)
            probs = torch.sigmoid(logits).cpu().numpy()[0]
            
        red_flags = []
        weighted_scores = []
        
        # Loop through each of the 8 categories
        for idx, prob in enumerate(probs):
            category = LABELS[idx]
            weight = SEVERITY_WEIGHTS[category]
            
            # Fetch custom optimized threshold for this category (default to 0.5 if missing)
            thresh = self.thresholds.get(idx, 0.5)
            
            # Calculate category risk score = Probability * Severity Weight
            weighted_score = prob * weight
            weighted_scores.append(weighted_score)
            
            # Trigger a Red Flag if the probability meets or exceeds the category threshold
            if prob >= thresh:
                red_flags.append({
                    "category": category,
                    "probability": float(prob),
                    "class_threshold": thresh,
                    "severity_weight": weight,
                    "calculated_risk": float(weighted_score)
                })
        
        # Overall Risk Score is the maximum of all individual category risk scores
        overall_score = float(max(weighted_scores)) if len(weighted_scores) > 0 else 0.0
        
        # Map Overall Risk Score to Qualitative Risk Level (High, Medium, Low)
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
            "all_probabilities": {LABELS[i]: float(probs[i]) for i in range(len(LABELS))}
        }

# """Standalone T&C risk scoring adapter for the UNCHANGED predict.py.

# Use from the main app:
#     from risk_scoring import score_document
#     result = score_document(clauses, tokenizer, model, device)

# Or use existing captured text output:
#     from risk_scoring import score_from_predict_outputs
#     result = score_from_predict_outputs(outputs)

# Research basis: Guarino et al. (2021), Section 4, Table 2 and the
# weighted unfairness formula. The 0-100 rescaling, multi-label handling,
# and Low/Medium/High cutoffs below are IMPLEMENTATION choices, not from
# that paper. The existing detector predicts unfair-category presence,
# not independently assessed severity.
# """

# import contextlib
# import io
# import re
# from typing import List, Optional

# # Category weights from Guarino et al. (2021), Table 2.
# CATEGORY_WEIGHTS = {
#     "Limitation of liability": 2,
#     "Unilateral termination": 2,
#     "Unilateral change": 2,
#     "Content removal": 2,
#     "Contract by using": 2,
#     "Choice of law": 1,
#     "Jurisdiction": 1,
#     "Arbitration": 1,
# }

# _ANSI = re.compile(r"\x1b\[[0-9;]*m")
# _FLAG = re.compile(r"Flag Status\s*:\s*(.*)", re.IGNORECASE)
# _LABEL = re.compile(r"^\s*[•*-]\s*(.+?)\s*\((\d+(?:\.\d+)?)% confidence\)\s*$")


# def _extract_categories(output: str) -> List[str]:
#     """Parse stdout printed by predict.evaluate_clause, without changing predict.py."""
#     clean = _ANSI.sub("", output)
#     match = _FLAG.search(clean)
#     if not match:
#         raise ValueError("Missing 'Flag Status' in predict.py output")
#     status = match.group(1).upper()
#     if "NO RED FLAG" in status:
#         return []
#     if "RED FLAG" not in status:
#         raise ValueError("Unrecognized prediction status")

#     categories = []
#     for line in clean.splitlines():
#         item = _LABEL.match(line)
#         if item:
#             name = item.group(1).strip()
#             if name in CATEGORY_WEIGHTS:
#                 categories.append(name)
#     if not categories:
#         raise ValueError("Red flag present, but no recognized unfair-category label found")
#     return categories


# def score_from_predict_outputs(outputs: List[str]) -> dict:
#     """Score an entire document from one printed predict.py output per clause.

#     Every clause, including NO RED FLAG clauses, must be included. Since
#     the published scoring formula requires one category per clause, this
#     adapter uses the highest category weight if multiple labels trigger.
#     """
#     if not outputs:
#         raise ValueError("Provide at least one prediction output")

#     total = 0
#     for output in outputs:
#         categories = _extract_categories(output)
#         if categories:
#             total += max(CATEGORY_WEIGHTS[c] for c in categories)

#     # Guarino et al. (2021): weighted unfairness = sum(weights) / n clauses.
#     unfairness = total / len(outputs)
#     # Implementation display scaling: the max category weight is 2.
#     risk = round(100 * unfairness / 2, 2)

#     # Provisional display cutoffs, NOT published in Guarino et al.
#     level = "Low Risk" if risk < 40 else "Medium Risk" if risk < 70 else "High Risk"
#     return {"risk_score_0_to_100": risk, "risk_level": level}


# def score_document(clauses: List[str], tokenizer=None, model=None, device=None) -> dict:
#     """Run unchanged predict.evaluate_clause for each clause and score the outputs.

#     If main app already loaded Legal-BERT, pass tokenizer, model, device
#     to reuse it. Otherwise, they will be loaded once with predict.load_model().
#     """
#     from predict import evaluate_clause, load_model

#     if not clauses or any(not isinstance(c, str) or not c.strip() for c in clauses):
#         raise ValueError("clauses must be a non-empty list of non-blank strings")
#     if tokenizer is None or model is None or device is None:
#         tokenizer, model, device = load_model()
#     id2label = model.config.id2label

#     outputs = []
#     for clause in clauses:
#         captured = io.StringIO()
#         with contextlib.redirect_stdout(captured):
#             evaluate_clause(clause, tokenizer, model, device, id2label)
#         outputs.append(captured.getvalue())
#     return score_from_predict_outputs(outputs)




