function ExpertInsight({ insight }) {
  return (
    <div className="flex items-start border-l-4 rounded-lg p-md bg-secondary-container/10 border-secondary gap-md">

      <span className="mt-1 material-symbols-outlined text-secondary">
        lightbulb
      </span>

      <div>

        <p className="mb-1 text-sm font-bold text-secondary">
          {insight.title}
        </p>

        <p className="text-xs text-on-surface-variant">
          {insight.text}
        </p>

      </div>

    </div>
  );
}

export default ExpertInsight;