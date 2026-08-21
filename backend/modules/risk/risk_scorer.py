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

