function LegalDocument({
  clauses = [],
  riskAnalysisResult,
  selectedClause,
  onClauseSelect,
}) {
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
      <div
        className="sticky top-0 z-20 bg-white border-b border-outline-variant px-lg py-md"
      >

        <div className="flex items-center justify-between">

          <div>
            <h2 className="font-bold text-title-md text-primary">
              Legal Document
            </h2>

            <p className="text-sm text-on-surface-variant">
              {clauses.length} clauses
            </p>
          </div>

        </div>

      </div>

      {/* Clauses */}
      <div className="p-lg space-y-md">

        {clauses.length > 0 ? (

          clauses.map((clause) => {

            const isSelected =
              clause.id === selectedClause;

            const riskAnalysis =
              riskAnalysisResult?.clauses?.find(
                (result) =>
                  result.clause_id === clause.id
              );

            const riskLevel =
              riskAnalysis?.risk_level || null;
              
            const getRiskClasses = () => {

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

              if (riskLevel === "Low") {
                return {
                  border: "border-outline-variant",
                  background: "bg-white",
                  badge: "bg-surface-container-high text-on-surface-variant",
                  text: "text-on-surface-variant",
                };
              }

              return {
                border: "border-outline-variant",
                background: "bg-white",
                badge: "bg-surface-container-high text-on-surface-variant",
                text: "text-on-surface-variant",
              };
            };

            const riskClasses = getRiskClasses();
          
            return (
              <button
                key={clause.id}
                onClick={() =>
                  onClauseSelect(clause.id)
                }
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

                {/* Clause Header */}
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

                {/* Original Text */}
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {clause.text}
                </p>

              </button>
            );
          })

        ) : (

          <div className="p-6 text-center text-on-surface-variant">
            No clauses available.
          </div>

        )}

      </div>

    </section>
  );
}

export default LegalDocument;