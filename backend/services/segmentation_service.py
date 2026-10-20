
import os
import re
from typing import Optional

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
import time
from google.genai import errors

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing. Check backend/.env"
    )

MODEL_NAME = "gemini-3.8-flash"

# Keep chunks small enough to leave room for structured JSON output.
CHUNK_SIZE = 10_000
MIN_DOCUMENT_LENGTH = 50
MAX_DOCUMENT_LENGTH = 500_000

client = genai.Client(
    api_key=API_KEY,
    http_options=types.HttpOptions(timeout=90000),
)


class LegalClause(BaseModel):
    section: str = Field(
        description="Original heading or section number, if identifiable"
    )
    parent_section: Optional[str] = Field(
        description="Parent heading, or null if not applicable"
    )
    text: str = Field(
        description="Exact original text of this legal provision"
    )


class SegmentationResult(BaseModel):
    clauses: list[LegalClause]


def normalize_text(text: str) -> str:
    """Normalize whitespace for source-text validation."""
    return re.sub(r"\s+", " ", text).strip()


def split_long_paragraph(paragraph: str) -> list[str]:
    """Split oversized paragraphs without cutting ordinary words."""
    pieces = []
    remaining = paragraph.strip()

    while len(remaining) > CHUNK_SIZE:
        limit = remaining.rfind(" ", 0, CHUNK_SIZE)

        if limit < CHUNK_SIZE // 2:
            limit = CHUNK_SIZE

        pieces.append(remaining[:limit].strip())
        remaining = remaining[limit:].strip()

    if remaining:
        pieces.append(remaining)

    return pieces


def split_into_chunks(text: str) -> list[str]:
    """
    Split at paragraph boundaries where possible.
    Oversized paragraphs are split separately.
    """
    paragraphs = [
        p.strip()
        for p in re.split(r"\n\s*\n", text)
        if p.strip()
    ]

    chunks = []
    current_parts = []
    current_length = 0

    for paragraph in paragraphs:
        if len(paragraph) > CHUNK_SIZE:
            if current_parts:
                chunks.append("\n\n".join(current_parts))
                current_parts = []
                current_length = 0

            chunks.extend(split_long_paragraph(paragraph))
            continue

        extra_length = len(paragraph) + (
            2 if current_parts else 0
        )

        if (
            current_parts
            and current_length + extra_length > CHUNK_SIZE
        ):
            chunks.append("\n\n".join(current_parts))
            current_parts = []
            current_length = 0

        current_parts.append(paragraph)
        current_length += len(paragraph) + (
            2 if len(current_parts) > 1 else 0
        )

    if current_parts:
        chunks.append("\n\n".join(current_parts))

    return chunks


def generate_with_retry(prompt, chunk_number, max_attempts=4):
    for attempt in range(1, max_attempts + 1):
        try:
            return client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": SegmentationResult,
                    "temperature": 0,
                },
            )

        except errors.APIError as exc:
            status_code = getattr(exc, "code", None)

            if status_code not in (429, 500, 502, 503, 504):
                raise

            if attempt == max_attempts:
                raise

            delay = 2 ** attempt
            print(
                f"[Segmentation] Chunk {chunk_number}: Gemini "
                f"returned {status_code}. Retrying in {delay}s "
                f"(attempt {attempt + 1}/{max_attempts})...",
                flush=True,
            )
            time.sleep(delay)

    raise RuntimeError("Gemini request failed after retries.")

def segment_chunk(chunk: str, chunk_number: int) -> list[dict]:
    """Ask Gemini to segment one source chunk."""
    prompt = f"""
You are a legal-document segmentation assistant.

Segment SOURCE CHUNK {chunk_number} into independently meaningful
legal provisions, clauses, and subsections.

Rules:
1. Preserve each clause's wording exactly as it appears in the source.
2. Do not summarize, paraphrase, correct, or invent text.
3. Do not omit any source provision, heading, list item, or exception.
4. Include the original clause heading/number in the text when it
   is part of the source provision.
5. Put the original heading or section number in the section field.
6. Use parent_section for a subsection's parent heading when clear.
7. Do not split every sentence into a separate clause.
8. Keep related sentences together when they form one provision.
9. Preserve source order.
10. This is only segmentation. Do not classify clauses or assess risk.
11. Do not add content from outside this chunk.

SOURCE CHUNK:
<document>
{chunk}
</document>
"""

    print(
        f"[Segmentation] Starting chunk {chunk_number} "
        f"({len(chunk)} characters)",
        flush=True,
    )

    response = generate_with_retry(prompt, chunk_number)
    
    print(
        f"[Segmentation] Gemini responded for chunk {chunk_number}",
        flush=True,
    )

    if not response.text:
        raise RuntimeError(
            f"Gemini returned an empty response for chunk {chunk_number}."
        )

    result = SegmentationResult.model_validate_json(response.text)
    source_normalized = normalize_text(chunk)
    output = []

    for clause in result.clauses:
        clause_text = clause.text.strip()

        if not clause_text:
            continue

        # Do not silently accept wording that Gemini has rewritten.
        if normalize_text(clause_text) not in source_normalized:
            raise RuntimeError(
                f"Chunk {chunk_number} returned text that could not "
                "be matched to the original source. Retry or inspect "
                "this chunk rather than accepting potentially rewritten "
                "legal wording."
            )

        output.append({
            "section": clause.section,
            "parent_section": clause.parent_section,
            "text": clause_text,
        })

    if not output:
        raise RuntimeError(
            f"No usable clauses were returned for chunk {chunk_number}."
        )

    return output


def segment_document(document: dict) -> dict:
    title = document.get("title", "Legal Document")
    document_id = document.get("document_id", "UNKNOWN")

    if isinstance(document.get("text"), str):
        full_text = document["text"].strip()
    else:
        source_clauses = document.get("clauses", [])
        full_text = "\n\n".join(
            str(clause.get("text", clause.get("clause", ""))).strip()
            for clause in source_clauses
            if isinstance(clause, dict)
        ).strip()

    if len(full_text) < MIN_DOCUMENT_LENGTH:
        raise ValueError("Document text is empty or too short.")

    if len(full_text) > MAX_DOCUMENT_LENGTH:
        raise ValueError(
            "Document exceeds 500,000 characters. "
            "Please reduce irrelevant page text or process it in batches."
        )

    chunks = split_into_chunks(full_text)
    
    if not chunks:
        raise ValueError("No readable document text was found.")

    print(
        f"[Segmentation] Document split into {len(chunks)} chunks",
        flush=True,
    )

    all_clauses = []

    # Sequential processing avoids a burst of simultaneous API calls.
    # for chunk_number, chunk in enumerate(chunks, start=1):
    #     print(
    #         f"[Segmentation] Processing chunk {chunk_number}/{len(chunks)}",
    #         flush=True,
    #     )
    #     chunk_clauses = segment_chunk(chunk, chunk_number)
    #     all_clauses.extend(chunk_clauses)
    
    selected_chunk = chunks[0]
    all_clauses = segment_chunk(selected_chunk, 1)

    clauses = [
        {
            "id": f"C{index}",
            "section": clause["section"],
            "parent_section": clause["parent_section"],
            "text": clause["text"],
        }
        for index, clause in enumerate(all_clauses, start=1)
    ]

    return {
        "document_id": document_id,
        "title": title,
        "source_url": document.get("source_url"),
        "chunk_count": 1,
        "total_chunks": len(chunks),
        "clauses": clauses,
    }
