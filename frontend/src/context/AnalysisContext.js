import { createContext, useContext, useState } from "react";

import { currentContract } from "../data/contractData";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [contract, setContract] =
    useState(currentContract);

  const [analysisResult, setAnalysisResult] =
    useState(null);

  return (
    <AnalysisContext.Provider
      value={{
        contract,
        setContract,

        analysisResult,
        setAnalysisResult,
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