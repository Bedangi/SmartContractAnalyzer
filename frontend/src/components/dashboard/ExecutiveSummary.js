import { useAnalysis } from "../../context/AnalysisContext";
import AnalysisUnavailable from "../../components/common/AnalysisUnavailable";
function ExecutiveSummary({ data }) {
  const {
    summary,
    readingTime,
    recommendation,
  } = data;
  const { analysisResult } = useAnalysis();

  return (
    <div className="flex flex-col justify-between bg-white border border-l-4 shadow-sm rounded-xl border-outline-variant border-l-error p-xl">

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <h3 className="font-title-md text-title-md text-primary">
            Executive Summary
          </h3>

          {/* <span className="material-symbols-outlined text-error">
            warning
          </span> */}

        </div>

        {analysisResult?.overall_summary ? (
          <p className="italic leading-relaxed font-body-md text-on-surface-variant">
            {analysisResult.overall_summary}
          </p>
        ) : (
          <p className="italic leading-relaxed font-body-md text-on-surface-variant">
            Start an analysis to generate the
            executive summary.
          </p>
        )}

      </div>

      <div className="pt-6 space-y-4">

        {/* Reading Time */}
        <div className="flex items-center justify-between text-label-md">

          {/* <span className="flex items-center gap-1 text-on-surface-variant">

            <span className="material-symbols-outlined text-[18px]">
              menu_book
            </span>

            Reading Time

          </span>

          <span className="font-bold text-primary">
            {readingTime}
          </span> */}

        </div>

        {/* Recommendation */}
        {/* <div className="p-3 text-center rounded-lg bg-error-container text-on-error-container">

          <p className="mb-1 font-bold tracking-widest uppercase text-label-sm">
            {recommendation.label}
          </p>

          <p className="font-bold font-title-md">
            {recommendation.value}
          </p>

        </div> */}

      </div>

    </div>
  );
}

export default ExecutiveSummary;