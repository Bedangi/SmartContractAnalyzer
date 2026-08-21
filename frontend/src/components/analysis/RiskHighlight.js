function RiskHighlight({
  risk,
  selected,
  onClick,
  children,
}) {
  const isCritical = risk === "critical";

  return (
    <p
      onClick={onClick}
      className={`
        cursor-pointer
        transition-all
        rounded-sm
        ${
          isCritical
            ? "bg-error/10 border-l-[3px] border-error pl-1"
            : "bg-secondary/10 border-l-[3px] border-secondary pl-1"
        }

        ${
          selected
            ? isCritical
              ? "ring-2 ring-error/50 bg-error/20"
              : "ring-2 ring-secondary/50 bg-secondary/20"
            : "hover:bg-opacity-20"
        }
      `}
    >
      <span
        className={`
          font-bold mr-2
          ${isCritical ? "text-error" : "text-secondary"}
        `}
      >
        {isCritical
          ? "[CRITICAL RISK]"
          : "[MODERATE RISK]"}
      </span>

      {children}
    </p>
  );
}

export default RiskHighlight;