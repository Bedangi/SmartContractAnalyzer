function ComparisonHeader({ onExport }) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">

      <div>
        <h2 className="font-headline-lg text-primary">
          Market Comparison
        </h2>

        <p className="text-on-surface-variant font-label-md">
          {/* How SocialNet Plus stacks up against direct competitors. */}
        </p>
      </div>

      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 transition-colors border rounded-lg border-outline-variant font-label-md hover:bg-surface-container-high"
      >
        <span className="text-sm material-symbols-outlined">
          download
        </span>

        Export PDF Report
      </button>

    </div>
  );
}

export default ComparisonHeader;