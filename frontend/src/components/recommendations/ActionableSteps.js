function ActionableSteps({ steps }) {
  return (
    <div className="p-6 border bg-surface-container rounded-xl border-outline-variant">

      <h3 className="flex items-center gap-2 mb-4 font-extrabold uppercase font-label-md text-primary">
        <span className="text-base material-symbols-outlined">
          task_alt
        </span>

        Actionable Steps
      </h3>

      <ul className="space-y-3">

        {steps.map((step) => (
          <li
            key={step.id}
            className="flex items-start gap-3 text-sm"
          >
            <span className="material-symbols-outlined text-secondary text-sm mt-0.5">
              check_circle
            </span>

            <span>
              {step.text}
            </span>
          </li>
        ))}

      </ul>

    </div>
  );
}

export default ActionableSteps;