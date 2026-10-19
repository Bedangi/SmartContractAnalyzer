import { useMemo, useState } from "react";

function LegalDocument({
  clauses = [],
  riskAnalysisResult,
  classificationResult,
  selectedClause,
  onClauseSelect,
}) {
  const [activeCategory, setActiveCategory] = useState("All Clauses");

  const classifiedClauses = Array.isArray(classificationResult)
    ? classificationResult
    : classificationResult?.clauses || [];

  // Map original clause IDs to their predicted categories.
  const categoryMap = useMemo(
    () =>
      new Map(
        classifiedClauses.map((item) => [
          item.id,
          item.category || "Uncategorized",
        ])
      ),
    [classifiedClauses]
  );

  // Always group the original clauses so no clause disappears.
  const groupedClauses = useMemo(
    () =>
      clauses.reduce((groups, clause) => {
        const category =
          categoryMap.get(clause.id) || "Uncategorized";

        if (!groups[category]) {
          groups[category] = [];
        }

        groups[category].push(clause);
        return groups;
      }, {}),
    [clauses, categoryMap]
  );

  const categories = Object.keys(groupedClauses);

  const filteredClauses =
    activeCategory === "All Clauses"
      ? clauses
      : groupedClauses[activeCategory] || [];

  const getRiskClasses = (riskLevel) => {
    if (riskLevel === "High") {
      return {
        border: "border-error/50",
        background: "bg-error-container/20",
        badge: "bg-error-container text-on-error-container",
        text: "text-error",
      };
    }

    if (riskLevel === "Medium") {
      return {
        border: "border-secondary/50",
        background: "bg-secondary-container/20",
        badge: "bg-secondary-container text-on-secondary-container",
        text: "text-secondary",
      };
    }

    return {
      border: "border-outline-variant",
      background: "bg-white",
      badge: "bg-surface-container-high text-on-surface-variant",
      text: "text-on-surface-variant",
    };
  };

  return (
    <section
      className="
        flex-1
        h-[calc(100vh-64px)]
        overflow-y-auto
        bg-background
      "
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-outline-variant px-lg py-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-title-md text-primary">
              Legal Document
            </h2>

            <p className="text-sm text-on-surface-variant">
              {filteredClauses.length} of {clauses.length} clauses
            </p>
          </div>
        </div>

        {/* Clickable category filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="button"
            onClick={() => setActiveCategory("All Clauses")}
            className={`
              px-3 py-2 rounded-full border text-sm font-semibold
              transition-colors
              ${
                activeCategory === "All Clauses"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-on-surface-variant border-outline-variant hover:border-primary"
              }
            `}
          >
            All Clauses ({clauses.length})
          </button>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`
                px-3 py-2 rounded-full border text-sm font-semibold
                transition-colors
                ${
                  activeCategory === category
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-on-surface-variant border-outline-variant hover:border-primary"
                }
              `}
            >
              {category} ({groupedClauses[category].length})
            </button>
          ))}
        </div>
      </div>

      {/* Filtered clause list */}
      <div className="p-lg space-y-lg">
        {filteredClauses.length > 0 ? (
          filteredClauses.map((clause) => {
            const isSelected = clause.id === selectedClause;

            const riskAnalysis =
              riskAnalysisResult?.clauses?.find(
                (result) => result.clause_id === clause.id
              );

            const riskLevel = riskAnalysis?.risk_level || null;
            const riskClasses = getRiskClasses(riskLevel);

            return (
              <button
                key={clause.id}
                type="button"
                onClick={() => onClauseSelect(clause.id)}
                className={`
                  w-full
                  text-left
                  rounded-xl
                  border
                  p-lg
                  transition-all
                  duration-200
                  ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                      : `${riskClasses.border} ${riskClasses.background} hover:border-primary/40`
                  }
                `}
              >
                {/* Clause header */}
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span
                    className={`
                      text-sm
                      font-bold
                      ${
                        isSelected
                          ? "text-primary"
                          : riskClasses.text
                      }
                    `}
                  >
                    {clause.section || clause.id}
                  </span>

                  <div className="flex items-center gap-2">
                    {riskLevel && (
                      <span
                        className={`
                          px-2
                          py-1
                          rounded-full
                          text-xs
                          font-bold
                          ${riskClasses.badge}
                        `}
                      >
                        {riskLevel}
                      </span>
                    )}

                    {isSelected && (
                      <span className="text-primary material-symbols-outlined">
                        check_circle
                      </span>
                    )}
                  </div>
                </div>

                {/* Original clause text */}
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {clause.text}
                </p>
              </button>
            );
          })
        ) : (
          <div className="p-6 text-center text-on-surface-variant">
            No clauses available in this category.
          </div>
        )}
      </div>
    </section>
  );
}

export default LegalDocument;
