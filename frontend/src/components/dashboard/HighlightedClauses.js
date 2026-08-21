import { useState } from "react";

import ClauseCard from "./ClauseCard";
import { clauseData } from "../../data/dashboardData";

function HighlightedClauses() {
  const [filter, setFilter] = useState("all");

  const filteredClauses =
    filter === "critical"
      ? clauseData.filter(
          (clause) => clause.riskType === "critical"
        )
      : clauseData;

  return (
    <section className="xl:col-span-2 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">

        <h3 className="font-headline-lg text-headline-lg text-primary">
          Highlighted Clauses
        </h3>

        {/* Filters */}
        <div className="flex gap-2">

          <button
            onClick={() => setFilter("all")}
            className={`
              px-3
              py-1
              rounded-full
              text-label-sm
              font-bold
              transition-colors
              ${
                filter === "all"
                  ? "bg-surface-container-high text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }
            `}
          >
            All
          </button>

          <button
            onClick={() => setFilter("critical")}
            className={`
              px-3
              py-1
              rounded-full
              text-label-sm
              font-bold
              transition-colors
              ${
                filter === "critical"
                  ? "bg-error/10 text-error"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }
            `}
          >
            Critical Only
          </button>

        </div>
      </div>

      {/* Clause List */}
      <div className="space-y-3">

        {filteredClauses.map((clause) => (
          <ClauseCard
            key={clause.id}
            title={clause.title}
            riskLevel={clause.riskLevel}
            riskType={clause.riskType}
            text={clause.text}
          />
        ))}

      </div>

    </section>
  );
}

export default HighlightedClauses;