function LegalDocument({
  clauses = [],
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
        className="sticky top-0 z-20 bg-white border-b  border-outline-variant px-lg py-md"
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
                      : "border-outline-variant bg-white hover:border-primary/40 hover:bg-surface-container-low"
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
                          : "text-on-surface"
                      }
                    `}
                  >
                    {clause.section || clause.id}
                  </span>

                  {isSelected && (
                    <span className="text-primary material-symbols-outlined">
                      check_circle
                    </span>
                  )}

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