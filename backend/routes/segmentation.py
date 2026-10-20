
from fastapi import APIRouter, HTTPException

from services.segmentation_service import segment_document

router = APIRouter(
    prefix="/api/segmentation",
    tags=["Legal Segmentation"],
)


@router.post("/analyze")
def analyze_segmentation(document: dict):
    try:
        return segment_document(document)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Segmentation failed: {exc}",
        )
