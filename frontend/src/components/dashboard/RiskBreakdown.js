import RiskCard from "./RiskCard";
import { riskData } from "../../data/dashboardData";

function RiskBreakdown() {
  return (
    <section>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-lg">

        <h3 className="font-headline-lg text-headline-lg text-primary">
          Risk Breakdown
        </h3>

        <button className="text-primary font-label-md flex items-center gap-1 hover:underline">
          View Full Report

          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>

      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">

        {riskData.map((risk) => (
          <RiskCard
            key={risk.id}
            title={risk.title}
            description={risk.description}
            score={risk.score}
            icon={risk.icon}
            theme={risk.theme}
          />
        ))}

      </div>

    </section>
  );
}

export default RiskBreakdown;