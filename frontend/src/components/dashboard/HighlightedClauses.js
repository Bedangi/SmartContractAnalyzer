import { useState } from "react";

import ClauseCard from "./ClauseCard";
import { getRiskCategory } from "../../constants/riskCategories";
import { useAnalysis } from "../../context/AnalysisContext";
import { useNavigate } from "react-router-dom";

function HighlightedClauses() {
  const [filter, setFilter] = useState("all");

  const { riskAnalysisResult } = useAnalysis();

  // Get actual results from the risk module
  const clauses =
    riskAnalysisResult?.clauses || [];

  // Only High and Medium risk clauses
  const highlightedClauses =
    clauses.filter(
      (clause) =>
        clause.risk_level === "High" ||
        clause.risk_level === "Medium"
    );

  // Apply UI filter
  const filteredClauses =
    filter === "critical"
      ? highlightedClauses.filter(
          (clause) =>
            clause.risk_level === "High"
        )
      : highlightedClauses;

  const navigate = useNavigate();
  return (
    <section className="space-y-4 xl:col-span-2">

      {/* Header */}
      <div className="flex items-center justify-between">

        <h3 className="font-headline-lg text-headline-lg text-primary">
          Highlighted Clauses
        </h3>

        {/* Filters */}
        <div className="flex gap-2">

          <button
            onClick={() => setFilter("all")}
            className={`
              px-3
              py-1
              rounded-full
              text-label-sm
              font-bold
              transition-colors
              ${
                filter === "all"
                  ? "bg-surface-container-high text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }
            `}
          >
            High & Medium
          </button>

          <button
            onClick={() => setFilter("critical")}
            className={`
              px-3
              py-1
              rounded-full
              text-label-sm
              font-bold
              transition-colors
              ${
                filter === "critical"
                  ? "bg-error/10 text-error"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }
            `}
          >
            High Only
          </button>

        </div>

      </div>

      {/* Clause List */}
      <div className="space-y-3">

        {filteredClauses.length > 0 ? (

          filteredClauses.map((clause) => {

            const riskCategory =
              clause.labels?.length > 0
                ? getRiskCategory(
                    clause.labels[0]
                  )
                : null;

            return (
              <ClauseCard
                key={clause.clause_id}
                title={
                  clause.section ||
                  `Clause ${clause.clause_id}`
                }
                riskLevel={
                  clause.risk_level
                }
                riskType={
                  clause.risk_level === "High"
                    ? "critical"
                    : "medium"
                }
                text={clause.text}
                riskScore={
                  clause.risk_score
                }
                category={
                  riskCategory?.name
                }
                onClick={() =>
                  navigate(
                    `/analysis/${riskAnalysisResult.document_id}?clause=${clause.clause_id}`
                  )
                }
              />
            );
          })

        ) : (

          <div className="p-6 text-center bg-white border rounded-xl border-outline-variant">

            <span className="block mb-2 material-symbols-outlined text-secondary">
              check_circle
            </span>

            <p className="font-semibold text-on-surface">
              No highlighted clauses
            </p>

            <p className="mt-1 text-sm text-on-surface-variant">
              No high or medium risk clauses were detected.
            </p>

          </div>

        )}

      </div>

    </section>
  );
}

export default HighlightedClauses;