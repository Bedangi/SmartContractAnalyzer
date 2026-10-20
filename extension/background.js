
import { currentContract } from "./contractData.js";

const API_BASE = "http://127.0.0.1:8000";

const statusElement = document.getElementById("status");
const titleElement = document.getElementById("page-title");
const analyzeButton = document.getElementById("analyze-button");

const clauseCountElement = document.getElementById("clause-count");
const highRiskCountElement = document.getElementById("high-risk-count");
const serviceCountElement = document.getElementById("service-count");

const summaryContent = document.getElementById("summary-content");
const riskCounts = document.getElementById("risk-counts");
const riskContent = document.getElementById("risk-content");
const categoryCounts = document.getElementById("category-counts");
const classificationContent = document.getElementById(
  "classification-content"
);

let isAnalyzing = false;

// --------------------------------------------------
// API HELPER
// --------------------------------------------------

async function callAPI(path, documentData) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(documentData),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`${path} failed (${response.status}): ${details}`);
  }

  return response.json();
}

// --------------------------------------------------
// ORIGINAL EXTRACTION + SEGMENTATION FLOW
// Preserved for later. Not called in the current flow.
// --------------------------------------------------

const MIN_TEXT_LENGTH = 500;
const MAX_TEXT_LENGTH = 500_000;

async function extractPageText() {
  // This function is intentionally not used right now.
  // When re-enabled, restore the previous extraction and
  // segmentation implementation here.
  console.info("Live extraction/segmentation is currently disabled.");
}

// --------------------------------------------------
// GENERAL UI HELPERS
// --------------------------------------------------

function clearElement(element) {
  if (element) element.replaceChildren();
}

function showMessage(container, message) {
  if (!container) return;

  const paragraph = document.createElement("p");
  paragraph.className = "empty-state";
  paragraph.textContent = message;

  container.replaceChildren(paragraph);
}

function addBadge(container, label, type = "neutral") {
  const badge = document.createElement("span");
  badge.className = `badge ${type}`;
  badge.textContent = label;
  container.appendChild(badge);
}

function createResultCard(title, body, badgeText, badgeType = "neutral") {
  const card = document.createElement("article");
  card.className = "result-card";

  const heading = document.createElement("h4");
  heading.textContent = title || "Untitled clause";
  card.appendChild(heading);

  if (badgeText) {
    const badgeContainer = document.createElement("div");
    badgeContainer.style.marginTop = "8px";
    addBadge(badgeContainer, badgeText, badgeType);
    card.appendChild(badgeContainer);
  }

  if (body) {
    const paragraph = document.createElement("p");
    paragraph.textContent = body;
    card.appendChild(paragraph);
  }

  return card;
}

function getClauseText(clause) {
  if (typeof clause === "string") return clause;

  return String(clause?.text ?? clause?.clause ?? "");
}

function getRiskLevel(clause) {
  const raw = String(clause?.risk_level ?? "").toLowerCase();

  if (raw.includes("high")) return "high";
  if (raw.includes("medium")) return "medium";
  if (raw.includes("low")) return "low";

  // Some risk APIs provide risk_score rather than risk_level.
  const score = Number(clause?.risk_score);

  if (Number.isFinite(score)) {
    if (score >= 5) return "high";
    if (score >= 2) return "medium";
    return "low";
  }

  return "unknown";
}

function riskLabel(level) {
  if (level === "high") return "High Risk";
  if (level === "medium") return "Medium Risk";
  if (level === "low") return "Low Risk";
  return "Risk Unavailable";
}

function riskBadgeType(level) {
  if (level === "high") return "high";
  if (level === "medium") return "medium";
  if (level === "low") return "low";
  return "neutral";
}

// --------------------------------------------------
// TAB NAVIGATION
// --------------------------------------------------

function initializeTabs() {
  const buttons = document.querySelectorAll(".tab");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      document.querySelectorAll(".tab").forEach((tab) => {
        tab.classList.toggle("active", tab === button);
      });

      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.toggle(
          "active",
          panel.id === `${target}-panel`
        );
      });
    });
  });
}

// --------------------------------------------------
// SUMMARY RENDERING
// --------------------------------------------------

function renderSummary(data) {
  if (!summaryContent) return;

  const summary = data?.overall_summary;

  if (!summary) {
    showMessage(summaryContent, "No summary was returned by the API.");
    return;
  }

  const paragraph = document.createElement("p");
  paragraph.textContent = summary;
  paragraph.style.margin = "0";
  paragraph.style.whiteSpace = "pre-wrap";

  summaryContent.className = "result-card";
  summaryContent.replaceChildren(paragraph);
}

// --------------------------------------------------
// RISK RENDERING
// --------------------------------------------------

function renderRisk(data) {
  clearElement(riskCounts);
  clearElement(riskContent);

  const clauses = Array.isArray(data?.clauses) ? data.clauses : [];
  const ranked = data?.ranked_clauses || {};

  // The current backend response groups ranked clauses
  // under High Risk, Medium Risk, and Low Risk.
  const high = Array.isArray(ranked["High Risk"])
    ? ranked["High Risk"]
    : [];

  const medium = Array.isArray(ranked["Medium Risk"])
    ? ranked["Medium Risk"]
    : [];

  const low = Array.isArray(ranked["Low Risk"])
    ? ranked["Low Risk"]
    : [];

  // Use the backend's grouped results when present.
  // Otherwise classify the clauses from their risk fields.
  let groups;

  if (high.length + medium.length + low.length > 0) {
    groups = [
      { label: "High Risk", level: "high", clauses: high },
      { label: "Medium Risk", level: "medium", clauses: medium },
      { label: "Low Risk", level: "low", clauses: low },
    ];
  } else {
    groups = [
      {
        label: "High Risk",
        level: "high",
        clauses: clauses.filter((c) => getRiskLevel(c) === "high"),
      },
      {
        label: "Medium Risk",
        level: "medium",
        clauses: clauses.filter((c) => getRiskLevel(c) === "medium"),
      },
      {
        label: "Low Risk",
        level: "low",
        clauses: clauses.filter((c) => getRiskLevel(c) === "low"),
      },
    ];
  }

  const totalHigh = groups[0].clauses.length;
  const totalMedium = groups[1].clauses.length;
  const totalLow = groups[2].clauses.length;

  addBadge(riskCounts, `High: ${totalHigh}`, "high");
  addBadge(riskCounts, `Medium: ${totalMedium}`, "medium");
  addBadge(riskCounts, `Low: ${totalLow}`, "low");

  highRiskCountElement.textContent = String(totalHigh);

  if (clauses.length === 0 && totalHigh + totalMedium + totalLow === 0) {
    showMessage(riskContent, "The risk API returned no clause results.");
    return;
  }

  groups.forEach((group) => {
    group.clauses.forEach((clause) => {
      const text = getClauseText(clause);

      const title =
        clause.section ||
        clause.clause_id ||
        clause.id ||
        group.label;

      const card = createResultCard(
        title,
        text,
        group.label,
        riskBadgeType(group.level)
      );

      if (clause.risk_score != null) {
        const score = document.createElement("p");
        score.textContent = `Risk score: ${clause.risk_score}`;
        card.appendChild(score);
      }

      riskContent.appendChild(card);
    });
  });

  if (!riskContent.children.length) {
    showMessage(riskContent, "No risk findings to display.");
  }
}

// --------------------------------------------------
// CLASSIFICATION RENDERING
// --------------------------------------------------

function renderClassification(data) {
  clearElement(categoryCounts);
  clearElement(classificationContent);

  const clauses = Array.isArray(data?.clauses) ? data.clauses : [];

  if (clauses.length === 0) {
    showMessage(
      classificationContent,
      "The classification API returned no clauses."
    );
    return;
  }

  const counts = new Map();

  clauses.forEach((clause) => {
    const category = clause.category || "Uncategorized";
    counts.set(category, (counts.get(category) || 0) + 1);
  });

  [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      addBadge(categoryCounts, `${category}: ${count}`, "neutral");
    });

  clauses.forEach((clause, index) => {
    const category = clause.category || "Uncategorized";
    const text = getClauseText(clause);

    const title =
      clause.section ||
      clause.clause_id ||
      clause.id ||
      `Clause ${index + 1}`;

    const card = createResultCard(title, text, category, "neutral");

    if (clause.confidence != null) {
      const confidence = document.createElement("p");
      confidence.textContent = `Confidence: ${clause.confidence}`;
      card.appendChild(confidence);
    }

    if (clause.reason) {
      const reason = document.createElement("p");
      reason.textContent = `Reason: ${clause.reason}`;
      card.appendChild(reason);
    }

    classificationContent.appendChild(card);
  });
}

// --------------------------------------------------
// ANALYZE STORED CONTRACT
// --------------------------------------------------

async function analyzeStoredContract() {
  if (isAnalyzing) return;

  isAnalyzing = true;

  if (analyzeButton) {
    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";
  }

  let successfulServices = 0;

  try {
    if (!currentContract || !Array.isArray(currentContract.clauses)) {
      throw new Error(
        "contractData.js must export currentContract with a clauses array."
      );
    }

    const clauses = currentContract.clauses.map((clause, index) => {
      const text = getClauseText(clause);

      return {
        ...(typeof clause === "object" && clause !== null ? clause : {}),
        id: clause?.id ?? clause?.clause_id ?? `C${index + 1}`,
        text,
      };
    });

    if (clauses.length === 0) {
      throw new Error("No clauses found in contractData.js.");
    }

    if (clauses.some((clause) => !clause.text.trim())) {
      throw new Error(
        "A stored clause has no readable text. Check contractData.js."
      );
    }

    const documentData = {
      ...currentContract,
      clauses,
    };

    titleElement.textContent =
      currentContract.title || "Legal Document";

    clauseCountElement.textContent = String(clauses.length);
    highRiskCountElement.textContent = "—";
    serviceCountElement.textContent = "0/3";

    renderSummary(null);
    showMessage(riskContent, "Analyzing contract risks...");
    showMessage(classificationContent, "Classifying clauses...");
    clearElement(riskCounts);
    clearElement(categoryCounts);

    statusElement.textContent =
      `Loaded ${clauses.length} clauses. Analyzing...`;

    const tasks = [
      {
        label: "Summary",
        path: "/api/summarizer/analyze",
        render: renderSummary,
        fallback: summaryContent,
      },
      {
        label: "Risk",
        path: "/api/risk/analyze",
        render: renderRisk,
        fallback: riskContent,
      },
      {
        label: "Classification",
        path: "/api/classification/analyze",
        render: renderClassification,
        fallback: classificationContent,
      },
    ];

    // Render each service as soon as its response arrives.
    await Promise.all(
      tasks.map(async (task) => {
        try {
          const data = await callAPI(task.path, documentData);

          task.render(data);
          successfulServices++;

          serviceCountElement.textContent =
            `${successfulServices}/3`;
        } catch (error) {
          console.error(`${task.label} API failed:`, error);

          showMessage(
            task.fallback,
            `${task.label} failed: ${error.message}`
          );
        }
      })
    );

    statusElement.textContent =
      `Analysis finished: ${successfulServices} of 3 services succeeded.`;
  } catch (error) {
    console.error("Contract analysis failed:", error);
    statusElement.textContent = error.message || "Analysis failed.";
  } finally {
    isAnalyzing = false;

    if (analyzeButton) {
      analyzeButton.disabled = false;
      analyzeButton.textContent = "Analyze contract";
    }
  }
}

// --------------------------------------------------
// STARTUP
// --------------------------------------------------

initializeTabs();

analyzeButton?.addEventListener("click", analyzeStoredContract);

// Use stored, already-segmented clauses.
// Do not run website extraction or LLM segmentation right now.
analyzeStoredContract();
