function AnalysisUnavailable({
  message = "Analysis not available yet.",
}) {
  return (
    <div
      className="flex items-center gap-3 p-4 border rounded-lg  bg-surface-container-low border-outline-variant"
    >

      <span className="material-symbols-outlined text-outline">
        pending
      </span>

      <p className="text-sm text-on-surface-variant">
        {message}
      </p>

    </div>
  );
}

export default AnalysisUnavailable;