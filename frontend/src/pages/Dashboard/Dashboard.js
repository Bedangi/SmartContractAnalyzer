import AppLayout from "../../components/layout/AppLayout";

import AnalysisOverview from "../../components/dashboard/AnalysisOverview";
import ExecutiveSummary from "../../components/dashboard/ExecutiveSummary";
import RiskBreakdown from "../../components/dashboard/RiskBreakdown";
import HighlightedClauses from "../../components/dashboard/HighlightedClauses";
import Comparison from "../../components/dashboard/Comparison";

import {
  executiveSummaryData,
} from "../../data/dashboardData";
import { useAnalysis } from "../../context/AnalysisContext";

function Dashboard() {
  const {riskAnalysisResult,}= useAnalysis();
  
  return (
    <AppLayout>

      <div className="space-y-xl">

        {/* Analysis Overview */}
        <section className="grid grid-cols-1 gap-lg">

          <AnalysisOverview  />

          <ExecutiveSummary data={executiveSummaryData} />

        </section>

        {/* Risk Breakdown */}
        <RiskBreakdown riskAnalysisResult={riskAnalysisResult}/>

        {/* Clauses + Comparison */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-xl">

          <HighlightedClauses />

          <Comparison />

        </section>

        {/* Mobile bottom navigation spacing */}
        <div className="h-20 lg:hidden" />

      </div>

    </AppLayout>
  );
}

export default Dashboard;