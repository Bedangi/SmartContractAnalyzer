function ComparisonCard({
  name,
  category,
  score,
  rating,
  icon,
}) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-outline-variant hover:shadow-sm transition-shadow">

      {/* Icon */}
      <div className="w-12 h-12 bg-surface-container-low rounded flex items-center justify-center shrink-0">

        <span className="material-symbols-outlined text-primary text-[24px]">
          {icon}
        </span>

      </div>

      {/* Information */}
      <div className="flex-1">

        <h6 className="font-label-md font-bold text-primary">
          {name}
        </h6>

        <p className="text-label-sm text-on-surface-variant">
          {category}
        </p>

      </div>

      {/* Score */}
      <div className="text-right">

        <span className="text-title-md font-display-lg text-secondary">
          {score}
        </span>

        <p className="text-[10px] text-secondary font-bold uppercase">
          {rating}
        </p>

      </div>

    </div>
  );
}

export default ComparisonCard;