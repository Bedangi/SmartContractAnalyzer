import ClauseInsight from "./ClauseInsight";
import ExpertInsight from "./ExpertInsight";
import AIChatInput from "./AIChatInput";

function AIRiskPanel({
  analysis,
  suggestions,
  selectedClause,
}) {
  const selectedAnalysis =
    analysis.clauses[selectedClause];

  return (
    <section className="w-full md:w-[450px] xl:w-[500px] h-[calc(100vh-64px)] flex flex-col bg-surface-container-low border-l border-outline-variant">

      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b shadow-sm p-lg border-outline-variant">

        <div className="flex items-center gap-sm">

          <span className="material-symbols-outlined text-secondary">
            auto_awesome
          </span>

          <h2 className="font-title-md text-title-md text-primary">
            AI Risk Analysis
          </h2>

        </div>

        <div className="flex gap-xs">

          <span className="px-3 py-1 font-bold rounded-full bg-error-container text-on-error-container text-label-sm">
            {analysis.criticalCount} Critical
          </span>

          <span className="px-3 py-1 font-bold rounded-full bg-secondary-container text-on-secondary-container text-label-sm">
            {analysis.warningCount} Warnings
          </span>

        </div>

      </div>

      {/* Analysis */}
      <div className="flex-1 overflow-y-auto p-lg space-y-lg">

        {selectedAnalysis && (
          <>
            <ClauseInsight
              clause={selectedAnalysis}
            />

            <ExpertInsight
              insight={selectedAnalysis.expertInsight}
            />
          </>
        )}

        <div className="h-24" />

      </div>

      {/* Chat */}
      <AIChatInput
        suggestions={suggestions}
      />

    </section>
  );
}

export default AIRiskPanel;