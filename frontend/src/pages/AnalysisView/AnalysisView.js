import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import LegalDocument from "../../components/analysis/LegalDocument";
import AIRiskPanel from "../../components/analysis/AIRiskPanel";

import { useAnalysis } from "../../context/AnalysisContext";

function AnalysisView() {
  const {
    contract,
    analysisResult,
  } = useAnalysis();

  const [selectedClause, setSelectedClause] =
    useState(null);

  // Select the first clause when the contract becomes available
  useEffect(() => {
    if (
      contract?.clauses?.length > 0 &&
      !selectedClause
    ) {
      setSelectedClause(
        contract.clauses[0].id
      );
    }
  }, [contract, selectedClause]);

  // Original clause from the current contract
  const selectedClauseData =
    contract?.clauses?.find(
      (clause) =>
        clause.id === selectedClause
    );

  // AI result for the selected clause
  const selectedClauseAnalysis =
    analysisResult?.clauses?.find(
      (clause) =>
        clause.id === selectedClause
    );

  return (
    <AppLayout activePage="History">

      <div
        className="
          h-[calc(100vh-64px)]
          -m-lg
          lg:-m-xl
          flex
          flex-col
          md:flex-row
          bg-background
        "
      >

        {/* LEFT: Original Contract */}
        <LegalDocument
          clauses={contract?.clauses || []}
          selectedClause={selectedClause}
          onClauseSelect={setSelectedClause}
        />

        {/* RIGHT: AI Analysis */}
        <AIRiskPanel
          selectedClause={selectedClause}
          selectedClauseData={selectedClauseData}
          selectedClauseAnalysis={selectedClauseAnalysis}
        />

      </div>

    </AppLayout>
  );
}

export default AnalysisView;