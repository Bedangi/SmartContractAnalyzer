import ComparisonCard from "./ComparisonCard";
import { comparisonData } from "../../data/dashboardData";

function Comparison() {
  return (
    <section className="space-y-4">

      <h3 className="font-headline-lg text-headline-lg text-primary">
        Comparison
      </h3>

      <div className="bg-surface-container-low rounded-xl border border-outline-variant p-xl space-y-6">

        <p className="text-label-md text-on-surface-variant">
          Websites with similar services but better risk profiles:
        </p>

        {/* Comparison Cards */}
        <div className="space-y-4">

          {comparisonData.map((company) => (
            <ComparisonCard
              key={company.id}
              name={company.name}
              category={company.category}
              score={company.score}
              rating={company.rating}
              icon={company.icon}
            />
          ))}

        </div>

        {/* Action */}
        <div className="pt-4">

          <button className="w-full py-3 border border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors">
            Detailed Comparison
          </button>

        </div>

      </div>

    </section>
  );
}

export default Comparison;