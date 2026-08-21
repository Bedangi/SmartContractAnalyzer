import ClauseInsight from "./ClauseInsight";
import AnalysisUnavailable from "../common/AnalysisUnavailable";

function AIRiskPanel({
  selectedClauseData,
  selectedClauseAnalysis,
  selectedClauseSummary,
}) {
  return (
    <section
      className="
        w-full
        md:w-[450px]
        xl:w-[500px]
        h-[calc(100vh-64px)]
        flex
        flex-col
        bg-surface-container-low
        border-l
        border-outline-variant
      "
    >

      {/* Header */}
      <div
        className="flex items-center justify-between bg-white border-b shadow-sm p-lg border-outline-variant"
      >

        <div className="flex items-center gap-sm">

          <h2 className="font-title-md text-title-md text-primary">
            Risk Analysis
          </h2>

        </div>

        {/* These are UI placeholders for now.
            Real values will come from the risk module. */}
         {selectedClauseAnalysis && (
          <div className="flex gap-xs">

              <span
                className={`
                  px-3
                  py-1
                  font-bold
                  rounded-full
                  text-label-sm
                  ${
                    selectedClauseAnalysis.risk_level === "High"
                      ? "bg-error-container text-on-error-container"
                      : selectedClauseAnalysis.risk_level === "Medium"
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-surface-container-high text-on-surface-variant"
                  }
                `}
              >
                {selectedClauseAnalysis.risk_level}
              </span>

            </div>
          )}

      </div>

      {/* Analysis */}
      <div className="flex-1 overflow-y-auto p-lg space-y-lg">

        {!selectedClauseData ? (

          <AnalysisUnavailable
            message="Select a clause to view its analysis."
          />

        ) : !selectedClauseAnalysis ? (

          <AnalysisUnavailable
            message="Risk analysis is not available for this clause yet."
          />

        ) : (

          <ClauseInsight
            clause={selectedClauseData}
            analysis={selectedClauseAnalysis}
            summary={selectedClauseSummary}
          />

        )}
        <div className="h-24" />

      </div>

    </section>
  );
}

export default AIRiskPanel;