function VerdictCell({ verdict, selected }) {
  const styles = {
    danger: {
      wrapper: "border-error/20 risk-glow-critical",
      title: "text-error",
    },

    safe: {
      wrapper: "border-secondary/20 risk-glow-safe",
      title: "text-secondary",
    },

    neutral: {
      wrapper: "border-outline-variant",
      title: "text-on-surface-variant",
    },
  };

  const style = styles[verdict.type] || styles.neutral;

  return (
    <td className={`
    p-6
    align-top
    transition-colors
    ${
      selected
        ? "bg-primary/5"
        : ""
    }
  `}>

      <div
        className={`
          p-3
          rounded-lg
          border
          bg-white
          ${style.wrapper}
        `}
      >

        <div
          className={`
            ${style.title}
            font-extrabold
            text-xs
            uppercase
            mb-1
          `}
        >
          {verdict.title}
        </div>

        <p className="text-[11px] leading-relaxed">
          {verdict.description}
        </p>

      </div>

    </td>
  );
}

export default VerdictCell;