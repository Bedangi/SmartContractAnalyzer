import json


def rank_clauses(file):

    # Read input file
    with open(file, "r") as f:
        clauses = json.load(f)


    # Sort by risk score
    clauses = sorted(
        clauses,
        key=lambda x: x["risk_score"],
        reverse=True
    )


    high = []
    medium = []
    low = []


    for clause in clauses:

        level = clause["risk_level"].lower()

        if level == "high":
            high.append(clause)

        elif level == "medium":
            medium.append(clause)

        else:
            low.append(clause)


    result = {

        "High Risk": high,
        "Medium Risk": medium,
        "Low Risk": low

    }


    return result



# Run ranking

result = rank_clauses(
    "risk_result.json"
)


# Save output

with open(
    "ranked_results.json",
    "w"
) as f:

    json.dump(
        result,
        f,
        indent=4
    )


# Display output

print("\n========== HIGH RISK ==========")

for c in result["High Risk"]:
    print(
        c["clause_id"],
        "Score:",
        c["risk_score"]
    )


print("\n========== MEDIUM RISK ==========")

for c in result["Medium Risk"]:
    print(
        c["clause_id"],
        "Score:",
        c["risk_score"]
    )


print("\n========== LOW RISK ==========")

for c in result["Low Risk"]:
    print(
        c["clause_id"],
        "Score:",
        c["risk_score"]
    )


print("\nRanking Completed!")