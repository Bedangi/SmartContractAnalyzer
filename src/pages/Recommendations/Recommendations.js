import { useState } from "react";

import AppLayout from "../../components/layout/AppLayout";

import RecommendationHero from "../../components/recommendations/RecommendationHero";
import ComparisonHeader from "../../components/recommendations/ComparisonHeader";
import ComparisonTable from "../../components/recommendations/ComparisonTable";

import {
  recommendationData,
  comparisonCompanies,
  comparisonRows,
  verdicts,
} from "../../data/recommendationsData";

function Recommendations() {
  const [selectedCompany, setSelectedCompany] = useState("socialnet");

  const handleExport = () => {
    console.log("Export PDF requested");
  };

  return (
    <AppLayout activePage="Compare">

      <div className="space-y-xl">

        {/* AI Recommendation */}
        <RecommendationHero
          data={recommendationData}
        />

        {/* Market Comparison */}
        <section>

          <ComparisonHeader
            onExport={handleExport}
          />

          <ComparisonTable
            companies={comparisonCompanies}
            rows={comparisonRows}
            verdicts={verdicts}
            selectedCompany={selectedCompany}
            onCompanySelect={setSelectedCompany}
          />

        </section>

        <div className="h-20 lg:hidden" />

      </div>

    </AppLayout>
  );
}

export default Recommendations;