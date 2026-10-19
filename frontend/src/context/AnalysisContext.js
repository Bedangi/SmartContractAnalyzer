import { createContext, useContext, useState } from "react";

import { currentContract } from "../data/contractData";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [contract, setContract] =
    useState(currentContract);

  // Summarizer result
  const [analysisResult, setAnalysisResult] =
    useState(null);

  // Risk analysis result
  const [riskAnalysisResult, setRiskAnalysisResult] =
    useState(null);

  // Legal clause classification result
  const [classificationResult, setClassificationResult] =
    useState(null);

  return (
    <AnalysisContext.Provider
      value={{
        contract,
        setContract,

        analysisResult,
        setAnalysisResult,

        riskAnalysisResult,
        setRiskAnalysisResult,

        classificationResult,
        setClassificationResult,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error(
      "useAnalysis must be used inside AnalysisProvider"
    );
  }

  return context;
}