import RiskHighlight from "./RiskHighlight";

function LegalDocument({
  document,
  sections,
  selectedClause,
  onClauseSelect,
}) {
  return (
    <section className="flex-1 h-[calc(100vh-64px)] overflow-y-auto p-lg lg:p-2xl border-r border-outline-variant bg-white">

      <div className="max-w-3xl mx-auto">

        {/* Document Header */}
        <div className="flex items-center justify-between mb-xl">

          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">
              {document.title}
            </h1>

            <p className="font-label-md text-on-surface-variant">
              Last updated: {document.lastUpdated}
              {" • "}
              {document.pages}
              {" • "}
              {document.plan}
            </p>
          </div>

          <button
            className="p-2 transition-colors rounded-full hover:bg-surface-container-low"
            aria-label="Print document"
          >
            <span className="material-symbols-outlined">
              print
            </span>
          </button>

        </div>

        {/* Legal Text */}
        <div className="leading-relaxed space-y-lg text-on-surface font-body-md">

          {sections.map((section) => (
            <div key={section.id}>

              {section.title && (
                <h3 className="font-title-md text-title-md mt-xl">
                  {section.title}
                </h3>
              )}

              {section.paragraphs.map((paragraph) => {

                if (paragraph.risk) {
                  return (
                    <RiskHighlight
                      key={paragraph.id}
                      risk={paragraph.risk}
                      selected={
                        selectedClause === paragraph.id
                      }
                      onClick={() =>
                        onClauseSelect(paragraph.id)
                      }
                    >
                      {paragraph.text}
                    </RiskHighlight>
                  );
                }

                return (
                  <p
                    key={paragraph.id}
                    className={
                      paragraph.muted
                        ? "text-on-surface-variant italic"
                        : ""
                    }
                  >
                    {paragraph.text}
                  </p>
                );
              })}

            </div>
          ))}

          <div className="h-32" />

        </div>

      </div>

    </section>
  );
}

export default LegalDocument;