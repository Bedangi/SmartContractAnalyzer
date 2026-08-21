import AnalysisUnavailable from "../common/AnalysisUnavailable";

function ClauseInsight({
  clause,
  analysis,
}) {
  return (
    <div
      className="overflow-hidden transition-all duration-300 bg-white border shadow-sm rounded-xl border-outline-variant ring-2 ring-primary/10"
    >

      {/* Header */}
      <div
        className="flex items-center justify-between gap-3 border-b p-lg bg-surface-container-low border-outline-variant"
      >

        <span
          className="font-bold tracking-wider uppercase font-label-md text-primary"
        >
          {clause?.section || clause?.id}
        </span>

      </div>

      <div className="p-lg space-y-lg">

        {/* Original Clause */}
        {/* <div>

          <h4
            className="mb-2 text-xs tracking-widest uppercase font-label-md text-on-surface-variant"
          >
            Original Clause
          </h4>

          <p
            className="border-l-4 rounded-lg font-body-md text-on-surface p-md bg-background border-outline-variant"
          >
            {clause?.text ||
              "Original clause not available."}
          </p>

        </div> */}

        {/* Plain English Translation */}
        <div>

          <h4
            className="mb-2 text-xs tracking-widest uppercase font-label-md text-on-surface-variant"
          >
            Plain English Translation
          </h4>

          {analysis?.summary ? (

            <p
              className="border-l-4 rounded-lg font-body-md text-on-surface p-md bg-background border-primary"
            >
              {analysis.summary}
            </p>

          ) : (

            <AnalysisUnavailable
              message="Plain English translation is not available yet."
            />

          )}

        </div>

        {/* Risk Analysis */}
        {/* <div>

          <h4
            className="mb-2 text-xs tracking-widest uppercase font-label-md text-on-surface-variant"
          >
            Why this is risky
          </h4>

          <AnalysisUnavailable
            message="Risk analysis is not available yet."
          />

        </div> */}

        {/* Potential Impact */}
        {/* <div>

          <h4
            className="mb-2 text-xs tracking-widest uppercase font-label-md text-on-surface-variant"
          >
            Potential Impact
          </h4>

          <AnalysisUnavailable
            message="Impact analysis is not available yet."
          />

        </div> */}

        {/* Recommendation */}
        {/* <div>

          <h4
            className="mb-2 text-xs tracking-widest uppercase font-label-md text-on-surface-variant"
          >
            AI Recommendation
          </h4>

          <AnalysisUnavailable
            message="Recommendations are not available yet."
          />

        </div> */}

      </div>

    </div>
  );
}

export default ClauseInsight;