function ExecutiveSummary({ data }) {
  const {
    summary,
    readingTime,
    recommendation,
  } = data;

  return (
    <div className="bg-white rounded-xl border border-outline-variant border-l-4 border-l-error p-xl flex flex-col justify-between shadow-sm">

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <h3 className="font-title-md text-title-md text-primary">
            Executive Summary
          </h3>

          <span className="material-symbols-outlined text-error">
            warning
          </span>

        </div>

        <p className="font-body-md text-on-surface-variant italic leading-relaxed">
          "{summary}"
        </p>

      </div>

      <div className="space-y-4 pt-6">

        {/* Reading Time */}
        <div className="flex items-center justify-between text-label-md">

          <span className="text-on-surface-variant flex items-center gap-1">

            <span className="material-symbols-outlined text-[18px]">
              menu_book
            </span>

            Reading Time

          </span>

          <span className="text-primary font-bold">
            {readingTime}
          </span>

        </div>

        {/* Recommendation */}
        <div className="bg-error-container text-on-error-container p-3 rounded-lg text-center">

          <p className="text-label-sm font-bold uppercase tracking-widest mb-1">
            {recommendation.label}
          </p>

          <p className="font-title-md font-bold">
            {recommendation.value}
          </p>

        </div>

      </div>

    </div>
  );
}

export default ExecutiveSummary;