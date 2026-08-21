import RiskCard from "./RiskCard";
import { getRiskCategory } from "../../constants/riskCategories";

const CATEGORY_CONFIG = [
  {
    key: "Limitation of liability",
    icon: "gavel",
    theme: "error",
  },
  {
    key: "Unilateral termination",
    icon: "cancel",
    theme: "error",
  },
  {
    key: "Unilateral change",
    icon: "edit_note",
    theme: "secondary",
  },
  {
    key: "Content removal",
    icon: "delete",
    theme: "secondary",
  },
  {
    key: "Contract by using",
    icon: "description",
    theme: "primary",
  },
  {
    key: "Choice of law",
    icon: "balance",
    theme: "primary",
  },
  {
    key: "Jurisdiction",
    icon: "location_on",
    theme: "secondary",
  },
  {
    key: "Arbitration",
    icon: "gavel",
    theme: "error",
  },
];

function RiskBreakdown({ riskAnalysisResult }) {
  const clauses =
  riskAnalysisResult?.clauses || [];
  const categoryCounts =
  CATEGORY_CONFIG.reduce(
    (counts, category) => {

      counts[category.key] =
        clauses.filter(
          (clause) =>
            clause.labels?.includes(
              category.key
            )
        ).length;

      return counts;

    },
    {}
  );


  return (
    <section>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-lg">

        <h3 className="font-headline-lg text-headline-lg text-primary">
          Risk Breakdown
        </h3>

        {/* <button className="flex items-center gap-1 text-primary font-label-md hover:underline">
          View Full Report

          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button> */}

      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">

        {CATEGORY_CONFIG.map(
          (category) => {

            const categoryInfo =
              getRiskCategory(
                category.key
              );

            const count =
              categoryCounts[
                category.key
              ] || 0;
              
              const percentage =
              clauses.length > 0
                ? (count / clauses.length) * 100
                : 0;

            return (
              <RiskCard
                key={category.key}
                title={categoryInfo.name}
                description={
                  categoryInfo.description
                }
                score={count}
                percentage={percentage}
                icon={category.icon}
                theme={category.theme}
              />
            );

          }
        )}

      </div>

    </section>
  );
}

export default RiskBreakdown;