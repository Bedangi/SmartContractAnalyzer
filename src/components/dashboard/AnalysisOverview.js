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
    <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant p-xl flex flex-col md:flex-row items-center gap-xl relative overflow-hidden group">

      {/* Decorative background */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors duration-700" />

      {/* Score Ring */}
      <div className="relative w-48 h-48 flex items-center justify-center shrink-0">

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
            className="text-secondary transition-all duration-1000 ease-out"
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
      <div className="flex-1 space-y-3 text-center md:text-left z-10">

        <div className="flex items-center justify-center md:justify-start gap-3">

          {/* Company Icon */}
          <div className="w-12 h-12 bg-surface-container-low rounded-lg border border-outline-variant flex items-center justify-center">

            <span className="material-symbols-outlined text-primary text-[28px]">
              {company.icon}
            </span>

          </div>

          <div>

            <h2 className="font-headline-lg text-headline-lg text-primary">
              {company.name}
            </h2>

            <p className="font-label-md text-secondary font-bold uppercase tracking-wider">
              {status}
            </p>

          </div>

        </div>

        <p className="text-on-surface-variant font-body-md max-w-md">
          {description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">

          {verification?.verified && (
            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-label-sm flex items-center gap-1">

              <span className="material-symbols-outlined text-[16px]">
                verified
              </span>

              {verification.label}

            </span>
          )}

          <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-label-sm">
            {lastUpdated}
          </span>

        </div>

      </div>

    </div>
  );
}

export default AnalysisOverview;