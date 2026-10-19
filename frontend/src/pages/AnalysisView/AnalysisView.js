import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import LegalDocument from "../../components/analysis/LegalDocument";
import AIRiskPanel from "../../components/analysis/AIRiskPanel";

import { useAnalysis } from "../../context/AnalysisContext";

function AnalysisView() {
  const [searchParams] = useSearchParams();
  const {
    contract,
    analysisResult,
    riskAnalysisResult,
    classificationResult,
  } = useAnalysis();

  const [selectedClause, setSelectedClause] =
    useState(null);

  // Select the first clause when the contract becomes available
  useEffect(() => {
    if (!contract?.clauses?.length) {
      return;
    }

    const clauseFromUrl =
      searchParams.get("clause");

    const clauseExists =
      contract.clauses.some(
        (clause) =>
          clause.id === clauseFromUrl
      );

    if (clauseExists) {
      setSelectedClause(clauseFromUrl);
    } else if (!selectedClause) {
      setSelectedClause(
        contract.clauses[0].id
      );
    }
  }, [
    contract,
    searchParams,
    selectedClause,
  ]);

  // Original clause from the current contract
  const selectedClauseData =
    contract?.clauses?.find(
      (clause) =>
        clause.id === selectedClause
    );
  const selectedClauseSummary =
    analysisResult?.clauses?.find(
      (clause) =>
        clause.id === selectedClause
    );

  // AI result for the selected clause
  const selectedClauseAnalysis =
    riskAnalysisResult?.clauses?.find(
      (clause) =>
        clause.clause_id === selectedClause
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
          riskAnalysisResult={riskAnalysisResult}
          classificationResult={classificationResult}
          selectedClause={selectedClause}
          onClauseSelect={setSelectedClause}
        />

        {/* RIGHT: AI Analysis */}
        <AIRiskPanel
          selectedClause={selectedClause}
          selectedClauseData={selectedClauseData}
          selectedClauseAnalysis={selectedClauseAnalysis}
          selectedClauseSummary={selectedClauseSummary}
        />

      </div>

    </AppLayout>
  );
}

export default AnalysisView;