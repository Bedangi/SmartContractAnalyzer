import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { currentContract } from "../../data/contractData";
import { runAnalysis } from "../../services/analysisService";
import { useAnalysis } from "../../context/AnalysisContext";

function AnalysisLauncher() {
  const navigate = useNavigate();

  const {
    setContract,
    setAnalysisResult,
  } = useAnalysis();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStartAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      setContract(currentContract);

      const result =
        await runAnalysis(currentContract);

      setAnalysisResult(result);

      navigate(
        `/analysis/${currentContract.document_id}`
      );

    } catch (error) {
      console.error(
        "Analysis failed:",
        error
      );

      setError(
        error.message ||
        "Failed to analyze contract."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-container-low">

      <div className="w-full max-w-lg p-8 bg-white border shadow-sm rounded-2xl border-outline-variant">

        <h1 className="mb-2 text-xl font-bold text-primary">
          New Analysis
        </h1>

        <p className="mb-6 text-sm text-on-surface-variant">
          {currentContract.title}
        </p>

        <p className="mb-6 text-sm text-on-surface-variant">
          {currentContract.clauses.length} clauses
          are ready for analysis.
        </p>

        {error && (
          <div className="p-4 mb-4 rounded-lg bg-error-container text-on-error-container">
            {error}
          </div>
        )}

        <button
          onClick={handleStartAnalysis}
          disabled={loading}
          className="w-full py-3 font-bold  rounded-xl bg-primary text-on-primary disabled:opacity-50"
        >
          {loading
            ? "Analyzing Contract..."
            : "Start Analysis"}
        </button>

      </div>

    </div>
  );
}

export default AnalysisLauncher;