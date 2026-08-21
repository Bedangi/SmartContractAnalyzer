import json
import os


OUTPUT_DIR = "outputs"


def ensure_output_dir():

    os.makedirs(
        OUTPUT_DIR,
        exist_ok=True
    )


def print_report(
    contract_name,
    overall_summary,
    report
):

    print("\n")

    print("=" * 90)
    print(f"CONTRACT: {contract_name}")
    print("=" * 90)


    print("\nOVERALL CONTRACT SUMMARY")

    print("-" * 90)

    print(overall_summary)


    print("\n")
    print("=" * 90)
    print("CLAUSE-BY-CLAUSE SUMMARY")
    print("=" * 90)


    for i, clause in enumerate(
        report,
        start=1
    ):

        print(
            f"\n{i}. {clause['section']}"
        )

        print("-" * 90)

        print("\nSummary:")

        print(
            clause["summary"]
        )


def save_json(
    contract_name,
    overall_summary,
    report
):

    ensure_output_dir()


    data = {

        "contract_name": contract_name,

        "overall_summary": overall_summary,

        "clauses": report

    }


    with open(
        os.path.join(
            OUTPUT_DIR,
            "report.json"
        ),
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            indent=4,
            ensure_ascii=False
        )


def save_text(
    contract_name,
    overall_summary,
    report
):

    ensure_output_dir()


    path = os.path.join(
        OUTPUT_DIR,
        "report.txt"
    )


    with open(
        path,
        "w",
        encoding="utf-8"
    ) as f:

        f.write("=" * 90 + "\n")

        f.write(
            f"CONTRACT: {contract_name}\n"
        )

        f.write("=" * 90 + "\n\n")


        f.write(
            "OVERALL CONTRACT SUMMARY\n"
        )

        f.write(
            "-" * 90 + "\n"
        )

        f.write(
            overall_summary + "\n\n"
        )


        f.write("=" * 90 + "\n")

        f.write(
            "CLAUSE-BY-CLAUSE SUMMARY\n"
        )

        f.write("=" * 90 + "\n")


        for i, clause in enumerate(
            report,
            start=1
        ):

            f.write(
                f"\n{i}. {clause['section']}\n"
            )

            f.write(
                "-" * 90 + "\n\n"
            )

            f.write(
                "Summary:\n"
            )

            f.write(
                clause["summary"] + "\n\n"
            )