function ClauseCard({
  title,
  riskLevel,
  riskType,
  text,
}) {
  const isCritical = riskType === "critical";

  return (
    <div
      className={`
        bg-white
        p-lg
        rounded-xl
        border
        border-outline-variant
        border-l-4
        flex
        flex-col
        md:flex-row
        gap-lg
        group
        cursor-pointer
        hover:shadow-md
        transition-all
        ${isCritical ? "border-l-error" : "border-l-primary"}
      `}
    >
      {/* Clause Content */}
      <div className="flex-1 space-y-3">

        <div className="flex items-center gap-3">

          <h5 className="font-title-md text-primary">
            {title}
          </h5>

          <span
            className={`
              px-2
              py-0.5
              rounded
              text-[10px]
              font-bold
              uppercase
              tracking-widest
              ${
                isCritical
                  ? "bg-error/10 text-error"
                  : "bg-primary/10 text-primary"
              }
            `}
          >
            {riskLevel}
          </span>

        </div>

        <p
          className={`
            text-body-md
            text-on-surface-variant
            p-3
            rounded-lg
            ${
              isCritical
                ? "bg-secondary/5 border-l-2 border-secondary"
                : ""
            }
          `}
        >
          "{text}"
        </p>

      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">

        {/* <button className="flex items-center gap-2 px-4 py-2 font-bold transition-transform rounded-lg bg-secondary text-on-secondary text-label-md active:scale-95">

          <span className="material-symbols-outlined text-[18px]">
            smart_toy
          </span>

          Ask AI
        </button> */}

        {/* <button className="flex items-center justify-center w-10 h-10 transition-colors border rounded-lg border-outline-variant hover:bg-surface-container-high">

          <span className="material-symbols-outlined">
            more_vert
          </span>

        </button> */}

      </div>
    </div>
  );
}

export default ClauseCard;