import { useAnalysis } from "../../context/AnalysisContext";

function AnalysisOverview() {
  const {
    contract,
    riskAnalysisResult,
  } = useAnalysis();

  const clauses =
    riskAnalysisResult?.clauses || [];

  
  // -----------------------------------------
  // Document-level risk score
  // -----------------------------------------

  const documentRisk = riskAnalysisResult?.document_risk;

  const rawScore = Number(documentRisk?.score);

  const hasDocumentScore =
    documentRisk?.score != null &&
    Number.isFinite(rawScore);

  const safeScore = hasDocumentScore
    ? Math.round(Math.min(Math.max(rawScore, 0), 100))
    : 0;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (safeScore / 100) * circumference;

  // Ring color based on document-level risk.
  const documentRiskLevel =
    documentRisk?.level?.toLowerCase() || "";

  const ringColor =
    documentRiskLevel.includes("high")
      ? "text-error"
      : documentRiskLevel.includes("medium")
        ? "text-secondary"
        : documentRiskLevel.includes("low")
          ? "text-primary"
          : "text-surface-container-highest";


  // -----------------------------------------
  // Contract information
  // -----------------------------------------

  const companyName =
    contract?.metadata?.company ||
    contract?.company ||
    contract?.title ||
    "Contract";

  // -----------------------------------------
  // Overall status
  // -----------------------------------------

  let status = "Not Analyzed";

  if (riskAnalysisResult) {

    const hasHighRisk =
      clauses.some(
        (clause) =>
          clause.risk_level === "High"
      );

    const hasMediumRisk =
      clauses.some(
        (clause) =>
          clause.risk_level === "Medium"
      );

    if (hasHighRisk) {
      status = "High Risk Detected";
    } else if (hasMediumRisk) {
      status = "Moderate Risk Detected";
    } else {
      status = "Low Risk";
    }
  }

  const statusStyles = (() => {
    if (status === "High Risk Detected") {
      return {
        text: "text-error",
        ring: "text-error",
      };
    }

    if (status === "Moderate Risk Detected") {
      return {
        text: "text-secondary",
        ring: "text-secondary",
      };
    }

    if (status === "Low Risk") {
      return {
        text: "text-primary",
        ring: "text-primary",
      };
    }

    return {
      text: "text-on-surface-variant",
      ring: "text-surface-container-highest",
    };
  })();
  // -----------------------------------------
  // Description
  // -----------------------------------------

  const description =
    riskAnalysisResult
      ? `${clauses.length} clauses analyzed.`
      : "Start an analysis to evaluate the contract's legal and risk profile.";

  return (
    <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden bg-white border-rounded-xl border-outline-variant p-xl md:flex-row md:gap-8 group">

      {/* Decorative background */}
      <div className="absolute w-64 h-64 transition-colors duration-700 rounded-full -right-20 -top-20 bg-secondary/5 blur-3xl group-hover:bg-secondary/10" />

      {/* Document Risk Score Ring */}
      <div className="relative z-10 flex items-center justify-center w-36 h-36 shrink-0">

        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background ring */}
          <circle
            className="text-surface-container-highest"
            cx="50"
            cy="50"
            fill="transparent"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
          />

          {/* Document score ring */}
          <circle
            className={`transition-all duration-1000 ease-out ${ringColor}`}
            cx="50"
            cy="50"
            fill="transparent"
            r={radius}
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <span className="text-3xl font-extrabold text-blue-900">
            {hasDocumentScore ? safeScore : "--"}
          </span>

          <span className="text-sm text-on-surface-variant">
            / 100
          </span>

        </div>
      </div>


      {/* Analysis Information */}
      <div className="z-10 flex-1 min-w-0 space-y-3 text-center md:text-left">

        <div className="flex items-center justify-center gap-3 md:justify-start">

          {/* Company / Contract Icon */}
          <div className="flex items-center justify-center w-12 h-12 border rounded-lg bg-surface-container-low border-outline-variant">

            <span className="material-symbols-outlined text-primary text-[28px]">
              description
            </span>

          </div>

          <div>

            <h2 className="font-headline-lg text-headline-lg text-primary">
              {companyName}
            </h2>

            {/* <p className={`font-bold tracking-wider uppercase font-label-md ${statusStyles.text}`}>
              {status}
            </p> */}

          </div>

        </div>

        <p className="max-w-md text-on-surface-variant font-body-md">
          {description}
        </p>

      </div>

    </div>
  );
}

export default AnalysisOverview;