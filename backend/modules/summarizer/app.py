import json

from summarizer import analyze_contract

from formatter import (
    print_report,
    save_json,
    save_text
)


INPUT_FILE = "contracts/segmented_output.json"


def main():

    print("\n")
    print("=" * 90)
    print("         LEGAL CONTRACT SUMMARIZER")
    print("=" * 90)

    print("\nLoading segmented contract...\n")


    # --------------------------------
    # LOAD SEGMENTED CONTRACT
    # --------------------------------

    with open(
        INPUT_FILE,
        "r",
        encoding="utf-8"
    ) as f:

        document = json.load(f)


    print(
        f"Contract: {document['title']}"
    )

    print(
        f"Clauses: {len(document['clauses'])}"
    )

    print("\nAnalyzing Contract...\n")


    # --------------------------------
    # ANALYZE
    # --------------------------------

    overall_summary, report = analyze_contract(
        document
    )


    # --------------------------------
    # PRINT REPORT
    # --------------------------------

    print_report(
        document["title"],
        overall_summary,
        report
    )


    # --------------------------------
    # SAVE JSON
    # --------------------------------

    save_json(
        document["title"],
        overall_summary,
        report
    )


    # --------------------------------
    # SAVE TXT
    # --------------------------------

    save_text(
        document["title"],
        overall_summary,
        report
    )


    print("\n")
    print("=" * 90)
    print("Analysis Completed Successfully!")
    print("=" * 90)

    print("\nGenerated Files")

    print("--------------------------")

    print("outputs/report.json")
    print("outputs/report.txt")

    print("\n")


if __name__ == "__main__":
    main()