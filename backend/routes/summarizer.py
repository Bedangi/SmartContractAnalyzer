from fastapi import APIRouter, HTTPException

from modules.summarizer.summarizer import analyze_contract


router = APIRouter(
    prefix="/api/summarizer",
    tags=["Summarizer"]
)


@router.post("/analyze")
def analyze(document: dict):

    try:

        overall_summary, report = analyze_contract(
            document
        )

        return {
            "document_id": document.get("document_id"),
            "title": document.get("title"),
            "overall_summary": overall_summary,
            "clauses": report,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )