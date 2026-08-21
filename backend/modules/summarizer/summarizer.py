import ollama


MODEL = "gemma3:4b"


# ============================================================
# PROMPT FOR INDIVIDUAL SEGMENTS
# ============================================================

SEGMENT_PROMPT = """
You are an expert legal assistant.

Summarize the following section of a legal contract.

Rules:
- Use simple English.
- Rewrite completely.
- Do not copy sentences from the original text.
- Preserve the important legal meaning.
- Do not add information that is not present.
- Keep the summary concise.
- Maximum 40 words.

Return ONLY the summary.
"""


# ============================================================
# PROMPT FOR FULL CONTRACT
# ============================================================

CONTRACT_PROMPT = """
You are an expert legal assistant.

You are given summaries of sections from a legal contract.

Create ONE overall summary of the entire contract.

Rules:
- Use simple English.
- Combine the important information from all sections.
- Focus on the main purpose of the agreement.
- Mention important rights, obligations, payments, restrictions,
  termination conditions, liability, and other major terms.
- Do not repeat every section.
- Do not invent information.
- Do not copy sentences from the original contract.
- Keep the final summary around 120 words.

Return ONLY the overall contract summary.
"""


# ============================================================
# SUMMARIZE ONE SEGMENT
# ============================================================

def summarize_segment(text):

    response = ollama.chat(

        model=MODEL,

        messages=[

            {
                "role": "system",
                "content": SEGMENT_PROMPT
            },

            {
                "role": "user",
                "content": text
            }

        ],

        options={
            "temperature": 0,
            "num_predict": 100
        }

    )

    return response["message"]["content"].strip()


# ============================================================
# SUMMARIZE ENTIRE CONTRACT
# ============================================================

def summarize_contract(segment_summaries):

    # Combine the short summaries of all segments
    summarized_text = "\n\n".join(

        item["summary"]

        for item in segment_summaries

    )


    response = ollama.chat(

        model=MODEL,

        messages=[

            {
                "role": "system",
                "content": CONTRACT_PROMPT
            },

            {
                "role": "user",
                "content": summarized_text
            }

        ],

        options={
            "temperature": 0,
            "num_predict": 250
        }

    )

    return response["message"]["content"].strip()


# ============================================================
# MAIN ANALYSIS FUNCTION
# ============================================================

def analyze_contract(document):

    segments = document["clauses"]

    print(
        f"Total segments: {len(segments)}"
    )


    # --------------------------------------------------------
    # STEP 1: SUMMARIZE EACH SEGMENT
    # --------------------------------------------------------

    segment_summaries = []


    for i, segment in enumerate(
        segments,
        start=1
    ):

        print(
            f"Summarizing segment {i}/{len(segments)}..."
        )


        summary = summarize_segment(
            segment["text"]
        )


        segment_summaries.append({

            "id": segment["id"],

            "section": segment["section"],

            "original_text": segment["text"],

            "summary": summary

        })


    # --------------------------------------------------------
    # STEP 2: CREATE OVERALL CONTRACT SUMMARY
    # --------------------------------------------------------

    print(
        "\nGenerating overall contract summary..."
    )


    overall_summary = summarize_contract(
        segment_summaries
    )


    # --------------------------------------------------------
    # RETURN BOTH
    # --------------------------------------------------------

    return overall_summary, segment_summaries