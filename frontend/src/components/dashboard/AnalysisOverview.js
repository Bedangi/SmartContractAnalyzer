function AnalysisOverview({ analysis }) {
  const {
    company,
    score,
    status,
    description,
    verification,
    lastUpdated,
  } = analysis;

  // SVG score ring
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const safeScore = Math.min(Math.max(score, 0), 100);

  const offset =
    circumference - (safeScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center overflow-hidden bg-white border-rounded-xl border-outline-variant p-xl md:flex-row group">

      {/* Decorative background */}
      <div className="absolute w-64 h-64 transition-colors duration-700 rounded-full -right-20 -top-20 bg-secondary/5 blur-3xl group-hover:bg-secondary/10" />

      {/* Score Ring */}
      <div className="relative flex items-center justify-center w-48 h-48 shrink-0">

        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            className="text-surface-container-highest"
            cx="50"
            cy="50"
            fill="transparent"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
          />

          <circle
            className="transition-all duration-1000 ease-out text-secondary"
            cx="50"
            cy="50"
            fill="transparent"
            r={radius}
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <span className="font-display-lg text-display-lg text-primary">
            {safeScore}
          </span>

          <span className="font-label-md text-on-surface-variant">
            / 100
          </span>

        </div>

      </div>

      {/* Analysis Information */}
      <div className="z-10 flex-1 space-y-3 text-center md:text-left">

        <div className="flex items-center justify-center gap-3 md:justify-start">

          {/* Company Icon */}
          <div className="flex items-center justify-center w-12 h-12 border rounded-lg bg-surface-container-low border-outline-variant">

            <span className="material-symbols-outlined text-primary text-[28px]">
              {company.icon}
            </span>

          </div>

          <div>

            <h2 className="font-headline-lg text-headline-lg text-primary">
              {company.name}
            </h2>

            <p className="font-bold tracking-wider uppercase font-label-md text-secondary">
              {status}
            </p>

          </div>

        </div>

        <p className="max-w-md text-on-surface-variant font-body-md">
          {description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 pt-2 md:justify-start">

          {/* {verification?.verified && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-label-sm">

              <span className="material-symbols-outlined text-[16px]">
                verified
              </span>

              {verification.label}

            </span>
          )} */}

          {/* <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm">
            {lastUpdated}
          </span> */}

        </div>

      </div>

    </div>
  );
}

export default AnalysisOverview;