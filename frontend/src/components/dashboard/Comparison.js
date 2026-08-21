import ComparisonCard from "./ComparisonCard";
import { comparisonData } from "../../data/dashboardData";
import { useNavigate } from "react-router-dom";

function Comparison() {
  const navigate = useNavigate();
  return (
    <section className="space-y-4">

      <h3 className="font-headline-lg text-headline-lg text-primary">
        Comparison
      </h3>

      <div className="space-y-6 border bg-surface-container-low rounded-xl border-outline-variant p-xl">

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

          <button onClick={() => navigate("/recommendations/demo")} className="w-full py-3 font-bold transition-colors border border-primary text-primary rounded-xl hover:bg-primary/5">
            Detailed Comparison
          </button>

        </div>

      </div>

    </section>
  );
}

export default Comparison;