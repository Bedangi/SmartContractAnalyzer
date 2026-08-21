function ClauseCard({
  title,
  riskLevel,
  riskType,
  text,
  riskScore,
  category,
  onClick,
}) {
  const isCritical =
    riskLevel === "High";

  const isMedium =
    riskLevel === "Medium";

  const borderColor = isCritical
    ? "border-l-error"
    : "border-l-secondary";

  const badgeStyle = isCritical
    ? "bg-error/10 text-error"
    : "bg-secondary/10 text-secondary";

  const backgroundStyle = isCritical
    ? "bg-error/5 border-error/20"
    : "bg-secondary/5 border-secondary/20";

  return (
    <div
      onClick={onClick}
      className={`
        bg-white
        p-lg
        rounded-xl
        border
        border-outline-variant
        border-l-4
        ${borderColor}
        flex
        flex-col
        md:flex-row
        gap-lg
        group
        cursor-pointer
        hover:shadow-md
        transition-all
      `}
    >

      {/* Clause Content */}
      <div className="flex-1 space-y-3">

        <div className="flex flex-wrap items-center gap-3">

          <h5 className="font-title-md text-primary">
            {title}
          </h5>

          {/* Risk Level */}
          <span
            className={`
              px-2
              py-0.5
              rounded
              text-[10px]
              font-bold
              uppercase
              tracking-widest
              ${badgeStyle}
            `}
          >
            {riskLevel}
          </span>

          {/* Category */}
          {category && (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide rounded bg-surface-container-high text-on-surface-variant">
              {category}
            </span>
          )}

        </div>

        {/* Clause Text */}
        <p
          className={`
            text-body-md
            text-on-surface-variant
            p-3
            rounded-lg
            border-l-2
            ${backgroundStyle}
          `}
        >
          "{text}"
        </p>

      </div>

      {/* Risk Score */}
      <div className="flex items-center shrink-0 md:flex-col md:items-end md:justify-center">

        <span className="text-xs tracking-wider uppercase text-on-surface-variant">
          Risk Score
        </span>

        <span
          className={`
            ml-2
            md:ml-0
            text-2xl
            font-bold
            ${
              isCritical
                ? "text-error"
                : "text-secondary"
            }
          `}
        >
          {riskScore}
        </span>

        <span className="ml-1 text-xs text-on-surface-variant md:ml-0">
          / 10
        </span>

      </div>

    </div>
  );
}

export default ClauseCard;