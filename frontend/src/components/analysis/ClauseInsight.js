import AnalysisUnavailable from "../common/AnalysisUnavailable";
import { getRiskCategory } from "../../constants/riskCategories";

function ClauseInsight({
  clause,
  analysis,
  summary,
}) {
  if (!clause || !analysis) {
    return (
      <div className="p-6 text-center text-on-surface-variant">
        Risk analysis not available yet.
      </div>
    );
  }
  
  const riskLevel = analysis.risk_level || "Low";
  const riskScore = analysis.risk_score ?? 0;
  const labels = analysis.labels || [];
  const redFlags = analysis.red_flags || [];

  const getRiskStyles = () => {
    if (riskLevel === "High") {
      return {
        header:
          "bg-error-container/30 border-error/10",
        text: "text-error",
        badge:
          "bg-error-container text-on-error-container",
        border: "border-error",
      };
    }

    if (riskLevel === "Medium") {
      return {
        header:
          "bg-secondary-container/30 border-secondary/10",
        text: "text-secondary",
        badge:
          "bg-secondary-container text-on-secondary-container",
        border: "border-secondary",
      };
    }
    return {
      header:
        "bg-surface-container-high border-outline-variant",
      text: "text-primary",
      badge:
        "bg-surface-container-high text-on-surface-variant",
      border: "border-outline-variant",
    };
  };

  const styles = getRiskStyles();
  return (
    
    <div
      className="overflow-hidden transition-all duration-300 bg-white border shadow-sm rounded-xl border-outline-variant ring-2 ring-primary/10"
    >

      {/* Header */}
      <div
        className={`
          flex
          items-center
          justify-between
          gap-3
          border-b
          p-lg
          ${styles.header}
        `}
      >

        <span
          className={`font-bold tracking-wider uppercase font-label-md ${styles.text}`}
        >
          {clause.section}
        </span>
        
        <span
          className={`
            px-3
            py-1
            rounded-full
            text-xs
            font-bold
            whitespace-nowrap
            ${styles.badge}
          `}
        >
          {riskLevel}
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

          {summary?.summary ? (

            <p
              className={`border-l-4 rounded-lg font-body-md text-on-surface p-md bg-background ${styles.border}`}
            >
              {summary.summary}
            </p>

          ) : (

            <AnalysisUnavailable
              message="Summary is not available yet."
            />

          )}

        </div>

        {/* Risk Analysis */}
        <div>

          <h4
            className="mb-2 text-xs tracking-widest uppercase font-label-md text-on-surface-variant"
          >
            Risk Score
          </h4>

          <div className="flex items-center gap-3">

            <span
              className={`
                text-3xl
                font-bold
                ${styles.text}
              `}
            >
              {riskScore}
            </span>

            <span className="text-sm text-on-surface-variant">
              / 10
            </span>

          </div>

        </div>

        {/* Detected Risk Categories */}
        <div>

          <h4 className="mb-2 text-xs tracking-widest uppercase font-label-md text-on-surface-variant">
            Detected Risk Categories
          </h4>

          {labels.length > 0 ? (

            <div className="flex flex-wrap gap-2">

              {labels.map((label) => {
                const category = getRiskCategory(label);
                return (
                <span
                  key={label}
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-semibold
                    ${styles.badge}
                  `}
                >
                  {category.name}
                </span>

              );
            })}

            </div>

          ) : (

            <p className="text-sm text-on-surface-variant">
              No specific risk categories detected.
            </p>
          )}

        </div>
        
        {/* Why This Is Risky */}
        <div>

          <h4 className="mb-2 text-xs tracking-widest uppercase font-label-md text-on-surface-variant">
            Why this is risky
          </h4>

          {redFlags.length > 0 ? (

            <ul className="space-y-sm">

              {redFlags.map((flag) => (

                <li
                  key={flag.category}
                  className="flex gap-2"
                >

                  <span
                    className={`
                      mt-1
                      text-sm
                      material-symbols-outlined
                      ${styles.text}
                    `}
                  >
                    priority_high
                  </span>
                  <span className="font-body-md text-on-surface">

                    This clause may create risk related to{" "}

                    <strong>
                      {getRiskCategory(flag.category).name}
                    </strong>

                    {" "}with a detected probability of{" "}

                    <strong>
                      {(flag.probability * 100).toFixed(1)}%
                    </strong>.

                  </span>

                </li>

              ))}

            </ul>

          ) : (
            <p className="text-sm text-on-surface-variant">
              No significant risk flags were detected for this clause.
            </p>

          )}

        </div>
        
         {/* Model Categories / Probabilities */}
        <div>

          <h4 className="mb-3 text-xs tracking-widest uppercase font-label-md text-on-surface-variant">
            Category Probabilities
          </h4>

          <div className="space-y-3">

            {Object.entries(
              analysis.all_probabilities || {}
            ).map(([category, probability]) => (

              <div key={category}>

                <div className="flex items-center justify-between mb-1">

                  <span className="text-sm text-on-surface">
                    {getRiskCategory(category).name}
                  </span>

                  <span className="text-xs font-semibold text-on-surface-variant">
                    {(probability * 100).toFixed(1)}%
                  </span>

                </div>

                <div className="w-full h-2 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className={`
                      h-full
                      rounded-full
                      transition-all
                      duration-500
                      ${
                        probability >= 0.5
                          ? "bg-error"
                          : "bg-secondary"
                      }
                    `}
                    style={{
                      width: `${Math.min(
                        probability * 100,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>

            ))}
            </div>

        </div>


      </div>

    </div>
  );
}

export default ClauseInsight;