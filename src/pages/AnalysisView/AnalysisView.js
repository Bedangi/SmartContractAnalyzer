import { useState } from "react";

import AppLayout from "../../components/layout/AppLayout";

import LegalDocument from "../../components/analysis/LegalDocument";
import AIRiskPanel from "../../components/analysis/AIRiskPanel";

import {
  documentData,
  legalSections,
  aiAnalysis,
  aiSuggestions,
} from "../../data/analysisData";

function AnalysisView() {
  const [selectedClause, setSelectedClause] = useState("12.2");

  return (
    <AppLayout activePage="History">

      <div className="h-[calc(100vh-64px)] -m-lg lg:-m-xl flex flex-col md:flex-row bg-background">

        <LegalDocument
          document={documentData}
          sections={legalSections}
          selectedClause={selectedClause}
          onClauseSelect={setSelectedClause}
        />

        <AIRiskPanel
          analysis={aiAnalysis}
          suggestions={aiSuggestions}
          selectedClause={selectedClause}
        />

      </div>

    </AppLayout>
  );
}

export default AnalysisView;