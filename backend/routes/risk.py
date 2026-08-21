from fastapi import APIRouter, HTTPException

from modules.risk.risk_scorer import ToSRiskScorer


router = APIRouter(
    prefix="/api/risk",
    tags=["Risk Analysis"]
)


# Load the model once when the API starts.
# We do NOT want to reload Legal-BERT for every request.
scorer = ToSRiskScorer()


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

            }

        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )