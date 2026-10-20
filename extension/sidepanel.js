import { currentContract } from "./contractData.js";

// --------------------------------------------------
// 0. ELEMENTS + CONFIG
// --------------------------------------------------

const statusElement = document.getElementById("status");
const titleElement = document.getElementById("page-title");
const summaryContent = document.getElementById("summary-content");
const riskCounts = document.getElementById("risk-counts");
const riskContent = document.getElementById("risk-content");
const categoryCounts = document.getElementById("category-counts");
const classificationContent = document.getElementById("classification-content");
const clauseCountElement = document.getElementById("clause-count");
const highRiskCountElement = document.getElementById("high-risk-count");
const serviceCountElement = document.getElementById("service-count");
const analyzeButton = document.getElementById("analyze-button");
let clauseSummaries = [];

// Backend API
const API_BASE = "http://127.0.0.1:8000";

const MIN_TEXT_LENGTH = 500;
const MAX_TEXT_LENGTH = 500_000;

let isAnalyzing = false;

// --------------------------------------------------
// 1. API HELPER
// --------------------------------------------------

async function callAPI(path, documentData) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(documentData),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`${path} failed (${response.status}): ${details}`);
  }

  return response.json();
}

// --------------------------------------------------
// 2. DOM HELPERS
// --------------------------------------------------

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = String(text);
  return node;
}

function setError(container, message) {
  container.replaceChildren(
    el("p", "empty-state", `Could not complete: ${message}`)
  );
}

function resetResults() {
  summaryContent.className = "empty-state";
  summaryContent.replaceChildren(
    document.createTextNode("Your contract summary will appear here.")
  );
  riskCounts.replaceChildren();
  riskContent.replaceChildren(
    el("p", "empty-state", "Risk findings will appear here.")
  );
  categoryCounts.replaceChildren();
  classificationContent.replaceChildren(
    el("p", "empty-state", "Classification results will appear here.")
  );
  clauseCountElement.textContent = "—";
  highRiskCountElement.textContent = "—";
  serviceCountElement.textContent = "0/3";
}

// --------------------------------------------------
// 3. TABS
// --------------------------------------------------

function initTabs() {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".tab-panel")
        .forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      document
        .getElementById(`${tab.dataset.tab}-panel`)
        ?.classList.add("active");
    });
  });
}

// --------------------------------------------------
// 4. RENDERERS
// --------------------------------------------------

function renderSummary(data) {
  clauseSummaries = Array.isArray(data.clauses) ? data.clauses : [];

  summaryContent.classList.remove("empty-state");
  summaryContent.replaceChildren(
    el("p", null, data.overall_summary || "No summary returned.")
  );
}

function renderRiskDetails(clause) {
  const details = el("div", "risk-detail result-card");

  details.appendChild(el("h4", null, "Risk Details"));

  // Overall risk level and weighted risk score
  const level = clause.risk_level || "Not provided";
  const score = Number(clause.risk_score ?? 0);

  details.appendChild(
    el("p", null, `Overall risk level: ${level}`)
  );

  details.appendChild(
    el("p", null, `Overall risk score: ${score.toFixed(2)} / 9.5`)
  );

  // Show all category probabilities returned by the model
  const probabilities = clause.all_probabilities;

  if (probabilities && typeof probabilities === "object") {
    details.appendChild(
      el("h4", null, "Category Probabilities")
    );

    Object.entries(probabilities).forEach(([category, probability]) => {
      const value = Number(probability);

      if (!Number.isFinite(value)) return;

      const percentage = Math.max(0, Math.min(100, value * 100));

      const row = el("div", "probability-row");

      const label = el("div", "probability-label");
      label.appendChild(el("span", null, category));
      label.appendChild(
        el("span", null, `${percentage.toFixed(1)}%`)
      );

      const track = el("div", "probability-track");
      const bar = el("div", "probability-bar");
      bar.style.width = `${percentage}%`;

      track.appendChild(bar);
      row.append(label, track);
      details.appendChild(row);
    });
  }

  // Show only categories that crossed their thresholds
  const redFlags = Array.isArray(clause.red_flags)
    ? clause.red_flags
    : [];

  details.appendChild(
    el("h4", null, `Triggered Red Flags (${redFlags.length})`)
  );

  if (redFlags.length === 0) {
    details.appendChild(
      el("p", "empty-state", "No categories crossed their configured thresholds.")
    );
  } else {
    redFlags.forEach((flag) => {
      const flagCard = el("div", "red-flag-detail");

      flagCard.appendChild(
        el("p", null, flag.category || "Unknown category")
      );

      details.appendChild(flagCard);
    });
  }


  
  // Find the corresponding clause summary
  const clauseSummary = clauseSummaries.find((item) => {
    if (item.id != null && clause.clause_id != null) {
      return String(item.id) === String(clause.clause_id);
    }

    return (
      item.section != null &&
      clause.section != null &&
      item.section === clause.section
    );
  });

  if (clauseSummary?.summary) {
    details.appendChild(
      el("h4", null, "Clause Summary")
    );

    details.appendChild(
      el("p", null, clauseSummary.summary)
    );
  }

  
  return details;
}

function renderRisk(data) {
  const ranked = data.ranked_clauses || {};

  const groups = [
    { label: "High Risk", key: "High Risk", cls: "risk-high" },
    { label: "Medium Risk", key: "Medium Risk", cls: "risk-medium" },
    { label: "Low Risk", key: "Low Risk", cls: "risk-low" },
  ];

  const lists = groups.map((g) =>
    Array.isArray(ranked[g.key]) ? ranked[g.key] : []
  );

  highRiskCountElement.textContent = lists[0].length;

  riskCounts.replaceChildren(
    ...groups.map((g, i) =>
      el("span", `risk-pill ${g.cls}`, `${g.label}: ${lists[i].length}`)
    )
  );

  riskContent.replaceChildren();

  groups.forEach((g, i) => {
    riskContent.appendChild(el("h4", null, g.label));

    if (lists[i].length === 0) {
      riskContent.appendChild(
        el("p", "empty-state", "No clauses in this category.")
      );
      return;
    }

    lists[i].forEach((clause) => {
      const card = el("div", `result-card ${g.cls}`);
      card.appendChild(
        el("strong", null, clause.section || clause.clause_id || "Clause")
      );
      card.appendChild(
        el("p", null, clause.text || clause.clause || "Clause text unavailable")
      );
      if (clause.reason) {
        card.appendChild(el("p", "reason", `Reason: ${clause.reason}`));
      }
      
      card.style.cursor = "pointer";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute(
        "aria-label",
        `View risk details for ${
          clause.section || clause.clause_id || "this clause"
        }`
      );

      function toggleRiskDetails() {
        // Close any previously opened details panel.
        const previousDetails = riskContent.querySelector(".risk-detail");
        const wasThisClauseOpen =
          previousDetails?.previousElementSibling === card;

        previousDetails?.remove();

        // Clicking the same clause again closes its details.
        if (wasThisClauseOpen) return;

        // Create a new details panel immediately below this clause.
        const details = renderRiskDetails(clause);
        card.insertAdjacentElement("afterend", details);
      }

      card.addEventListener("click", toggleRiskDetails);

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleRiskDetails();
        }
      });

      riskContent.appendChild(card);

    });
  });
}

function renderClassification(data) {
  const clauses = Array.isArray(data.clauses) ? data.clauses : [];

  const tally = {};
  clauses.forEach((c) => {
    const cat = c.category || "Uncategorized";
    tally[cat] = (tally[cat] || 0) + 1;
  });

  categoryCounts.replaceChildren(
    ...Object.entries(tally).map(([cat, n]) =>
      el("span", "category-pill", `${cat}: ${n}`)
    )
  );

  classificationContent.replaceChildren();

  if (clauses.length === 0) {
    classificationContent.appendChild(
      el("p", "empty-state", "No classifications returned.")
    );
    return;
  }

  clauses.forEach((clause) => {
    const card = el("div", "result-card");
    const conf =
      clause.confidence != null ? ` (Confidence: ${clause.confidence})` : "";

    card.appendChild(
      el("strong", null, `${clause.category || "Uncategorized"}${conf}`)
    );
    card.appendChild(el("p", null, clause.clause || clause.text || ""));
    if (clause.reason) {
      card.appendChild(el("p", "reason", `Reason: ${clause.reason}`));
    }
    classificationContent.appendChild(card);
  });
}

// --------------------------------------------------
// 5. SUMMARY, RISK, AND CLASSIFICATION
// --------------------------------------------------

async function runAnalysis(documentData) {
  const tasks = [
    {
      label: "Summary",
      path: "/api/summarizer/analyze",
      render: renderSummary,
      target: summaryContent,
    },
    {
      label: "Risk Analysis",
      path: "/api/risk/analyze",
      render: renderRisk,
      target: riskContent,
    },
    {
      label: "Clause Classification",
      path: "/api/classification/analyze",
      render: renderClassification,
      target: classificationContent,
    },
  ];

  // Run each API independently.
  const results = await Promise.allSettled(
    tasks.map((t) => callAPI(t.path, documentData))
  );

  let successCount = 0;

  results.forEach((result, i) => {
    const task = tasks[i];

    if (result.status === "rejected") {
      console.error(`${task.label} failed:`, result.reason);
      setError(task.target, result.reason?.message || String(result.reason));
      return;
    }

    console.log(`${task.label} response:`, result.value);

    try {
      task.render(result.value || {});
      successCount++;
    } catch (err) {
      console.error(`Rendering ${task.label} failed:`, err);
      setError(
        task.target,
        `Response received but could not be displayed (${err.message})`
      );
    }
  });

  serviceCountElement.textContent = `${successCount}/${tasks.length}`;
  statusElement.textContent = `Analysis finished: ${successCount} of ${tasks.length} services succeeded.`;
}

// --------------------------------------------------
// 6. LOAD PRE-SEGMENTED CLAUSES FROM contractData.js
// --------------------------------------------------

async function analyzeStoredContract() {
  if (isAnalyzing) return;
  isAnalyzing = true;

  if (analyzeButton) {
    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";
  }

  try {
    if (!currentContract || !Array.isArray(currentContract.clauses)) {
      throw new Error(
        "Invalid contractData.js: expected currentContract.clauses."
      );
    }

    if (currentContract.clauses.length === 0) {
      throw new Error("No clauses found in contractData.js.");
    }

    // Normalize clause objects so downstream APIs receive text fields.
    const normalizedClauses = currentContract.clauses.map((clause, index) => {
      const text =
        typeof clause === "string" ? clause : clause.text ?? clause.clause ?? "";

      return {
        ...(typeof clause === "object" && clause !== null ? clause : {}),
        id: clause?.id ?? `C${index + 1}`,
        text: String(text),
      };
    });

    if (normalizedClauses.some((c) => !c.text.trim())) {
      throw new Error("At least one stored clause has no text.");
    }

    resetResults();

    if (titleElement) {
      titleElement.textContent = currentContract.title || "Legal Document";
    }
    clauseCountElement.textContent = normalizedClauses.length;
    statusElement.textContent = `Loaded ${normalizedClauses.length} clauses. Starting analysis...`;

    await runAnalysis({ ...currentContract, clauses: normalizedClauses });
  } catch (error) {
    console.error("Stored contract analysis error:", error);
    statusElement.textContent =
      error.message || "Could not analyze the contract.";
  } finally {
    isAnalyzing = false;

    if (analyzeButton) {
      analyzeButton.disabled = false;
      analyzeButton.textContent = "Analyze contract";
    }
  }
}

// --------------------------------------------------
// 7. WEBSITE EXTRACTION + SEGMENTATION
//    Preserved for later; not called in the current flow.
//    To use it: call extractPageText() instead of
//    analyzeStoredContract() in the startup section.
// --------------------------------------------------

async function extractPageText() {
  if (isAnalyzing) return;
  isAnalyzing = true;

  if (analyzeButton) {
    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";
  }

  resetResults();
  statusElement.textContent = "Extracting page text...";

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    if (!tab?.id || !tab.url || !/^https?:\/\//i.test(tab.url)) {
      throw new Error("Open a regular website before using the extension.");
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const visibleText = (element) => {
          const style = getComputedStyle(element);

          if (style.display === "none" || style.visibility === "hidden") {
            return "";
          }

          return element.innerText?.trim() || "";
        };

        const candidates = [
          ...document.querySelectorAll("main, article, [role='main']"),
        ];

        let bestText = "";

        for (const element of candidates) {
          const text = visibleText(element);
          if (text.length > bestText.length) bestText = text;
        }

        if (!bestText) {
          bestText = visibleText(document.body);
        }

        const dialogText = [
          ...document.querySelectorAll("[role='dialog'], dialog[open]"),
        ]
          .map(visibleText)
          .filter(Boolean)
          .join("\n\n");

        if (dialogText.length > bestText.length) {
          bestText = dialogText;
        }

        return {
          title: document.title,
          url: location.href,
          text: bestText,
        };
      },
    });

    const page = results?.[0]?.result;

    if (!page) {
      throw new Error("Could not extract text from this page.");
    }

    const extractedText = (page.text || "").trim();

    if (titleElement) {
      titleElement.textContent = page.title || "Untitled page";
    }

    if (extractedText.length < MIN_TEXT_LENGTH) {
      throw new Error(
        "Not enough page text found. Open the full Terms or Privacy Policy page."
      );
    }

    if (extractedText.length > MAX_TEXT_LENGTH) {
      throw new Error("The extracted page exceeds 500,000 characters.");
    }

    const documentData = {
      document_id: `EXT_${Date.now()}`,
      title: page.title || "Legal Document",
      source_url: page.url,
      text: extractedText,
    };

    statusElement.textContent = "Sending document for segmentation...";

    // Original LLM segmentation API call, retained for later.
    const segmentedDocument = await callAPI(
      "/api/segmentation/analyze",
      documentData
    );

    const clauses = segmentedDocument.clauses || [];

    if (!clauses.length) {
      throw new Error("Segmentation returned no clauses.");
    }

    const analysisDocument = {
      ...documentData,
      ...segmentedDocument,
      clauses,
    };

    clauseCountElement.textContent = clauses.length;
    statusElement.textContent = `Segmented into ${clauses.length} clauses. Starting analysis...`;

    await runAnalysis(analysisDocument);
  } catch (error) {
    console.error("Extraction/segmentation error:", error);
    statusElement.textContent = error.message || "An error occurred.";
  } finally {
    isAnalyzing = false;

    if (analyzeButton) {
      analyzeButton.disabled = false;
      analyzeButton.textContent = "Analyze contract";
    }
  }
}

// --------------------------------------------------
// 8. STARTUP
// --------------------------------------------------

// Current flow: use clauses from contractData.js.
// The live scraping + segmentation flow (extractPageText) remains available.
// Do not call extractPageText() here unless you want to switch flows.

function initializeExtension() {
  initTabs();
  analyzeButton?.addEventListener("click", extractPageText);

  // Automatically analyze the stored contract when the panel opens.
  extractPageText();
}

initializeExtension();