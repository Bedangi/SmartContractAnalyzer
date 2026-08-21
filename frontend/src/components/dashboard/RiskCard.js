function RiskCard({
  title,
  description,
  score,
  icon,
  theme = "primary",
}) {
  const themes = {
    primary: {
      text: "text-primary",
      background: "bg-primary/10",
      progress: "bg-primary",
      hover: "hover:border-primary",
    },

    secondary: {
      text: "text-secondary",
      background: "bg-secondary/10",
      progress: "bg-secondary",
      hover: "hover:border-secondary",
    },

    error: {
      text: "text-error",
      background: "bg-error/10",
      progress: "bg-error",
      hover: "hover:border-error",
    },
  };

  const selectedTheme = themes[theme] || themes.primary;

  return (
    <div
      className={`
        bg-white
        p-lg
        rounded-xl
        border
        border-outline-variant
        transition-all
        group
        ${selectedTheme.hover}
      `}
    >
      {/* Icon + Score */}
      <div className="flex items-start justify-between mb-4">

        <div
          className={`
            w-10
            h-10
            rounded-lg
            flex
            items-center
            justify-center
            group-hover:scale-110
            transition-transform
            ${selectedTheme.background}
            ${selectedTheme.text}
          `}
        >
          <span className="material-symbols-outlined">
            {icon}
          </span>
        </div>

        <span
          className={`
            text-headline-lg
            font-display-lg
            ${selectedTheme.text}
          `}
        >
          {score}
        </span>

      </div>

      {/* Information */}
      <h4 className="font-title-md text-primary mb-1">
        {title}
      </h4>

      <p className="text-label-sm text-on-surface-variant mb-4">
        {description}
      </p>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className={`h-full ${selectedTheme.progress}`}
          style={{
            width: `${Math.min(Math.max(score, 0), 100)}%`,
          }}
        />
      </div>

    </div>
  );
}

export default RiskCard;