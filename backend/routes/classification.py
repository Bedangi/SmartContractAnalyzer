
from fastapi import APIRouter, HTTPException, Request

from services.classification_service import classify_document

router = APIRouter(
    prefix="/api/classification",
    tags=["Clause Classification"],
)


@router.post("/analyze")
async def analyze_classification(document: dict, request: Request):
    clauses = document.get("clauses", [])

    if not clauses:
        raise HTTPException(
            status_code=400,
            detail="No clauses provided.",
        )

    return await classify_document(document)
