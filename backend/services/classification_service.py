
import httpx
from fastapi import HTTPException

CLASSIFIER_URL = "http://127.0.0.1:8001/api/classification/analyze"


async def classify_document(document: dict) -> dict:
    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                CLASSIFIER_URL,
                json=document,
            )

        response.raise_for_status()
        return response.json()

    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Classifier returned an error: {exc.response.text}",
        ) from exc

    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=503,
            detail=(
                "Classification service is unavailable. "
                "Make sure legal_clause_classifier is running on port 8001."
            ),
        ) from exc
