import ActionableSteps from "./ActionableSteps";

function RecommendationHero({ data }) {
  return (
    <section className="mb-12">

      <div className="relative p-8 overflow-hidden border border-l-4 bg-white/70 backdrop-blur-xl border-slate-200 rounded-2xl border-l-secondary">

        {/* Decorative glow */}
        <div className="absolute w-64 h-64 rounded-full -right-16 -top-16 bg-secondary/5 blur-3xl" />

        <div className="relative z-10">

          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-6 mb-6 md:flex-row">

            <div className="flex items-center gap-3">

              {/* <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary-container text-secondary">

                <span
                  className="text-3xl material-symbols-outlined"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  auto_awesome
                </span>

              </div> */}

              <div>

                <h1 className="font-headline-lg text-primary">
                  Recommendation
                </h1>

                <p className="text-on-surface-variant font-label-md">
                  Target:{" "}
                  <span className="font-bold text-on-surface">
                    {data.target}
                  </span>{" "}
                  {data.agreement}
                </p>

              </div>

            </div>

            {/* Reliability */}
            <div className="flex flex-col items-start md:items-end">

              <span className="tracking-wider uppercase text-on-surface-variant font-label-sm">
                Reliability Score
              </span>

              <span className="leading-tight font-display-lg text-primary">
                {data.reliabilityScore}%
              </span>

            </div>

          </div>

          {/* Content */}
          <div className="grid gap-8 md:grid-cols-2">

            {/* Summary */}
            <div className="space-y-4">

              <p className="font-body-lg text-on-surface-variant">
                {data.summary}
              </p>

              <div className="flex flex-wrap gap-2">

                {data.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`
                      px-3
                      py-1
                      text-xs
                      font-bold
                      rounded-full
                      border
                      ${
                        tag.type === "error"
                          ? "bg-error-container text-on-error-container border-error/10"
                          : "bg-secondary-container text-on-secondary-container border-secondary/10"
                      }
                    `}
                  >
                    {tag.label}
                  </span>
                ))}

              </div>

            </div>

            {/* Actionable Steps */}
            <ActionableSteps
              steps={data.actionableSteps}
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default RecommendationHero;