function ComparisonCell({ value,selected }) {
  const getStyles = () => {
    switch (value.type) {
      case "danger":
        return {
          badge:
            "bg-error-container text-on-error-container",
          icon: "text-error",
        };

      case "safe":
        return {
          badge:
            "bg-secondary-container text-on-secondary-container",
          icon: "text-secondary",
        };

      default:
        return {
          badge:
            "bg-surface-container-highest text-on-surface-variant",
          icon: "text-on-surface-variant",
        };
    }
  };

  const styles = getStyles();

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

      {value.icon && (
        <div
          className={`flex items-center gap-2 mb-1 ${styles.icon}`}
        >
          <span className="text-sm material-symbols-outlined">
            {value.icon}
          </span>

          <span className="font-bold">
            {value.title}
          </span>
        </div>
      )}

      {!value.icon && (
        <span
          className={`
            inline-block
            px-2
            py-0.5
            ${styles.badge}
            text-[10px]
            font-extrabold
            rounded
            uppercase
          `}
        >
          {value.title}
        </span>
      )}

      <p className="mt-2 text-xs text-on-surface-variant">
        {value.description}
      </p>

    </td>
  );
}

export default ComparisonCell;