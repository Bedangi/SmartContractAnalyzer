function ClauseInsight({ clause }) {
  return (
    <div
    className={`
        bg-white
        rounded-xl
        border
        border-outline-variant
        shadow-sm
        overflow-hidden
        transition-all
        duration-300
        ring-2
        ring-primary/10
            
    `}
    >

      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b p-lg bg-error-container/30 border-error/10">

        <span className="font-bold tracking-wider uppercase font-label-md text-error">
          Analysis: {clause.title}
        </span>

        <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold bg-white rounded-full shadow-sm text-error whitespace-nowrap">

          <span className="text-sm material-symbols-outlined">
            priority_high
          </span>

          {clause.riskLevel}

        </span>

      </div>

      <div className="p-lg space-y-lg">

        {/* Translation */}
        <div>

          <h4 className="mb-2 text-xs tracking-widest uppercase font-label-md text-on-surface-variant">
            Plain English Translation
          </h4>

          <p className="border-l-4 rounded-lg font-body-md text-on-surface p-md bg-background border-primary">
            {clause.translation}
          </p>

        </div>

        {/* Risks */}
        <div>

          <h4 className="mb-2 text-xs tracking-widest uppercase font-label-md text-on-surface-variant">
            Why this is risky
          </h4>

          <ul className="space-y-sm">

            {clause.risks.map((risk, index) => (
              <li
                key={index}
                className="flex gap-2"
              >
                <span className="mt-1 text-sm material-symbols-outlined text-error">
                  cancel
                </span>

                <span className="font-body-md text-on-surface">
                  {risk}
                </span>
              </li>
            ))}

          </ul>

        </div>

        {/* Impact */}
        <div>

          <h4 className="mb-2 text-xs tracking-widest uppercase font-label-md text-on-surface-variant">
            Potential Impact
          </h4>

          <div className="text-sm italic border rounded-lg p-md bg-error-container/10 border-error/20 text-on-surface-variant">
            {clause.impact}
          </div>

        </div>

        {/* Recommendation */}
        <div className="border-t pt-md border-outline-variant">

          <h4 className="mb-3 text-xs tracking-widest uppercase font-label-md text-on-surface-variant">
            AI Recommendation
          </h4>

          <div className="flex gap-md">

            {clause.recommendations.map((recommendation, index) => (
              <button
                key={recommendation}
                className={`
                  flex-1
                  py-2
                  px-4
                  rounded-lg
                  font-bold
                  text-sm
                  active:scale-95
                  transition-transform
                  ${
                    index === 0
                      ? "bg-primary text-on-primary"
                      : "border border-outline text-on-surface hover:bg-surface-container-low"
                  }
                `}
              >
                {recommendation}
              </button>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ClauseInsight;