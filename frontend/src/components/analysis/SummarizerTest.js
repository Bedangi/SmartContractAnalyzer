import { useState } from "react";
import { analyzeContract } from "../../services/summarizerService";
import { useAnalysis } from "../../context/AnalysisContext";

function SummarizerTest() {
  const { analysisResult, setAnalysisResult } =
  useAnalysis();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testDocument = {
    document_id: "TEST_001",

    title: "Test Contract",

    metadata: {
      language: "English",
    },

    clauses: [
      {
        id: "C1",
        section: "Clause 1",
        text:
          "The customer may terminate this agreement by providing thirty days written notice.",
      },

      {
        id: "C2",
        section: "Clause 2",
        text:
          "The customer shall pay all applicable fees within thirty days of receiving an invoice.",
      },
    ],
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await analyzeContract(
        testDocument
      );

      setAnalysisResult(data);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-2xl font-bold text-primary">
        Summarizer API Test
      </h1>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="px-5 py-3 font-bold rounded-lg bg-primary text-on-primary disabled:opacity-50"
      >
        {loading
          ? "Analyzing..."
          : "Analyze Contract"}
      </button>

      {error && (
        <div className="p-4 rounded-lg bg-error-container text-on-error-container">
          <strong>Error:</strong> {error}
        </div>
      )}

      {analysisResult && (
        <div className="space-y-6">

          {/* Overall Summary */}
          <div className="p-6 bg-white border border-outline-variant rounded-xl">

            <h2 className="mb-3 text-lg font-bold">
              Overall Summary
            </h2>

            <p className="leading-relaxed text-on-surface-variant">
              {analysisResult.overall_summary}
            </p>

          </div>

          {/* Clause Summaries */}
          <div className="space-y-4">

            <h2 className="text-lg font-bold">
              Clause Summaries
            </h2>

            {analysisResult.clauses.map((clause) => (
              <div
                key={clause.id}
                className="p-6 bg-white border border-outline-variant rounded-xl"
              >

                <h3 className="mb-2 font-bold text-primary">
                  {clause.section}
                </h3>

                <p className="mb-3 text-sm text-on-surface-variant">
                  {clause.original_text}
                </p>

                <div className="p-4 rounded-lg bg-secondary-container/20">
                  <p className="text-sm font-medium">
                    {clause.summary}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default SummarizerTest;