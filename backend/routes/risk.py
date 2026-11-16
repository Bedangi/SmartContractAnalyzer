from fastapi import APIRouter, HTTPException

from modules.risk.risk_scorer import ToSRiskScorer


router = APIRouter(
    prefix="/api/risk",
    tags=["Risk Analysis"]
)


# Load the model once when the API starts.
# We do NOT want to reload Legal-BERT for every request.
scorer = ToSRiskScorer()


# ---------------------------------------------------------------
# DOCUMENT-LEVEL RISK (Guarino et al., 2021, Table 2 weights)
# ---------------------------------------------------------------
# Weighted unfairness = sum(weight of each clause) / number of clauses.
# A clause with no red flag counts as 0. If a clause triggers several
# categories, the highest category weight is used (the formula expects
# one category per clause).
# The 0-100 scaling and the Low/Medium/High cutoffs are implementation
# choices, NOT from the paper.
DOCUMENT_CATEGORY_WEIGHTS = {
    "Limitation of liability": 2,
    "Unilateral termination": 2,
    "Unilateral change": 2,
    "Content removal": 2,
    "Contract by using": 2,
    "Choice of law": 1,
    "Jurisdiction": 1,
    "Arbitration": 1,
}
MAX_DOCUMENT_WEIGHT = 2


def compute_document_risk(results):
    total_clauses = len(results)

    if total_clauses == 0:
        return {
            "score": 0.0,
            "level": "Low Risk",
            "flagged_clauses": 0,
            "total_clauses": 0,
            "weighted_unfairness": 0.0,
            "method": "Guarino et al. (2021) weighted unfairness",
        }

    total_weight = 0
    flagged = 0

    for clause in results:
        weights = [
            DOCUMENT_CATEGORY_WEIGHTS[flag["category"]]
            for flag in clause["red_flags"]
            if flag["category"] in DOCUMENT_CATEGORY_WEIGHTS
        ]
        if weights:
            flagged += 1
            total_weight += max(weights)

    unfairness = total_weight / total_clauses
    score = round(100 * unfairness / MAX_DOCUMENT_WEIGHT, 2)

    if score < 40:
        level = "Low Risk"
    elif score < 70:
        level = "Medium Risk"
    else:
        level = "High Risk"

    return {
        "score": score,
        "level": level,
        "flagged_clauses": flagged,
        "total_clauses": total_clauses,
        "weighted_unfairness": round(unfairness, 4),
        "method": "Guarino et al. (2021) weighted unfairness",
    }


@router.post("/analyze")
def analyze(document: dict):

    try:

        clauses = document.get("clauses", [])

        if not clauses:
            raise HTTPException(
                status_code=400,
                detail="No clauses provided."
            )

        results = []

        for index, clause in enumerate(clauses):

            text = clause.get("text", "")

            if not text.strip():
                continue

            risk_result = scorer.analyze_clause(text)

            results.append({

                # We don't need an ID from the frontend.
                # The original position lets us match the
                # result back to the original clause.
                "clause_id": clause.get("id"),

                "section": clause.get("section"),
                "parent_section": clause.get(
                    "parent_section"
                ),
                "text": text,

                "risk_score": risk_result[
                    "overall_risk_score"
                ],

                "risk_level": risk_result[
                    "risk_level"
                ],

                "labels": [
                    flag["category"]
                    for flag in risk_result[
                        "red_flags"
                    ]
                ],

                "red_flags": risk_result[
                    "red_flags"
                ],

                "all_probabilities": risk_result[
                    "all_probabilities"
                ],

            })

        # ---------------------------------------------
        # RANK
        # ---------------------------------------------

        ranked_clauses = sorted(
            results,
            key=lambda clause: clause["risk_score"],
            reverse=True
        )

        high_risk = []
        medium_risk = []
        low_risk = []

        for clause in ranked_clauses:

            level = clause[
                "risk_level"
            ].lower()

            if level == "high":
                high_risk.append(clause)

            elif level == "medium":
                medium_risk.append(clause)

            else:
                low_risk.append(clause)

        return {

            "document_id": document.get(
                "document_id"
            ),

            "title": document.get(
                "title"
            ),

            "clauses": results,

            "ranked_clauses": {

                "High Risk": high_risk,

                "Medium Risk": medium_risk,

                "Low Risk": low_risk,

            },

            # NEW (additive): whole-document risk score.
            # All fields above are unchanged.
            "document_risk": compute_document_risk(results),

        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )