# Smart Contract Analyzer

An AI-assisted legal document analysis platform for understanding
**Terms of Service, Privacy Policies, and other contracts**. It combines
a React website, a Python/FastAPI backend, NLP and machine-learning
components, LLM-assisted analysis, and a Chrome side-panel extension.

> **Disclaimer:** This project is an informational decision-support
> tool, not a substitute for advice from a qualified lawyer. Automated
> labels and explanations should be reviewed in the context of the
> complete agreement and applicable law.

## Contents

-   [Overview](#overview)
-   [Key capabilities](#key-capabilities)
-   [Architecture](#architecture)
-   [End-to-end workflow](#end-to-end-workflow)
-   [Modules](#modules)
-   [How modules communicate](#how-modules-communicate)
-   [API endpoints](#api-endpoints)
-   [Classification pipeline](#classification-pipeline)
-   [Document-level risk score](#document-level-risk-score)
-   [Technology stack](#technology-stack)
-   [Datasets and knowledge sources](#datasets-and-knowledge-sources)
-   [Repository layout](#repository-layout)
-   [Getting started](#getting-started)
-   [Configuration](#configuration)
-   [Example payloads](#example-payloads)
-   [Development notes](#development-notes)
-   [Limitations](#limitations)
-   [Roadmap](#roadmap)
-   [Contributing](#contributing)
-   [License](#license)

------------------------------------------------------------------------

## Overview

Legal agreements are often lengthy and difficult for non-specialists to
interpret. Important obligations, limitations, and conditions may be
distributed across many sections. Smart Contract Analyzer aims to make
these documents easier to inspect by segmenting them into clauses,
summarizing their contents, identifying potentially concerning
provisions, and assigning legal categories and risk levels.

At a high level, the system:

1.  Receives legal document text or pre-segmented clauses.
2.  Splits raw document text into meaningful clause units when needed.
3.  Runs summarization, risk analysis, and clause classification.
4.  Aggregates clause findings into a document-level risk overview.
5.  Displays the results through the React website or Chrome extension.

The analysis services are modular. Summarization, risk analysis, and
classification are invoked independently, allowing successful results to
be displayed even if another service fails.

## Key capabilities

-   Analysis of Terms of Service, Privacy Policies, and contract text.
-   Clause segmentation for downstream clause-level processing.
-   Plain-language document and clause summaries.
-   Detection of potentially risky provisions and red flags.
-   Clause risk scores, severity labels, and ranked findings.
-   Classification into predefined legal categories with confidence and
    a reason.
-   ML-first classification with an LLM fallback for uncertain
    predictions.
-   Retrieval of relevant dataset examples and legal context.
-   Graph-based retrieval of related legal knowledge.
-   A normalized document-level risk score from 0 to 100.
-   Two user-facing interfaces: a React website and a Chrome side panel.

## Architecture

The system has three logical layers:

1.  **Presentation:** React website and Chrome extension.
2.  **Application/API:** Main FastAPI backend, which accepts document
    data and coordinates analysis.
3.  **Analysis:** Segmentation, summarization, risk analysis, and
    classification. The classification engine is also exposed as a
    separate FastAPI service in the current development setup.

``` mermaid
flowchart TD
    U[User] --> W[React Website]
    U --> E[Chrome Side Panel]
    W --> API[Main FastAPI Backend]
    E --> API
    API --> SEG[Segmentation Service]
    SEG --> API
    API --> SUM[Summarization Service]
    API --> RISK[Risk Analysis Service]
    API --> ADAPTER[Classification Adapter]
    ADAPTER --> CLSAPI[Classification FastAPI Service]
    CLSAPI --> PIPE[Classification Pipeline]
    PIPE --> EMB[Embedding Model]
    PIPE --> ML[Local ML Classifier]
    PIPE --> DVS[Dataset Vector Store]
    PIPE --> LVS[Legal Vector Store]
    PIPE --> GRAPH[Graph Retriever]
    PIPE --> LLM[LLM Fallback Router]
    SUM --> API
    RISK --> API
    CLSAPI --> API
    API --> W
    API --> E
```

This is a logical architecture diagram. Exact deployment boundaries and
file names may differ between local configurations.

## End-to-end workflow

### 1. Document input

The user supplies a legal document through the website or extension. The
input may contain document metadata and raw text, or a list of already
segmented clauses.

Typical fields include a document title, source URL, document text, and
clause identifiers/text when segmentation has already happened.

### 2. Clause segmentation

When raw text is supplied, it is sent to the segmentation endpoint. The
segmentation service identifies meaningful clause boundaries and returns
structured clause records.

### 3. Parallel analysis

Once clauses are available, the application invokes three analysis
services:

-   Summarization
-   Risk analysis
-   Clause classification

The extension uses `Promise.allSettled` for independent service calls.
This means a failure in one service does not automatically prevent the
other results from being rendered.

### 4. Result aggregation and display

The client receives JSON responses and displays the document summary,
clause-level risk findings, category predictions, confidence values, and
explanations. The risk response can also include a `document_risk`
aggregate.

------------------------------------------------------------------------

## Modules

### 1. React website

**Technology:** React and JavaScript, with the project's HTML/CSS
styling.

The website is the main interface for submitting documents and reviewing
analysis. It calls the backend APIs and renders document-level and
clause-level results.

#### Shared application state

The project uses an `AnalysisContext` to share state between React
components. The context discussed in the project contains:

-   `contract`
-   `analysisResult`
-   `riskAnalysisResult`
-   `classificationResult`

It exposes setters such as `setContract`, `setAnalysisResult`,
`setRiskAnalysisResult`, and `setClassificationResult`.

For components that need both clause-level findings and the overall
document score, store the **complete risk API response** in
`riskAnalysisResult`, not only its `clauses` array. This allows the UI
to read both `riskAnalysisResult.clauses` and
`riskAnalysisResult.document_risk`.

### 2. Main FastAPI backend

**Technology:** Python and FastAPI.

The main backend provides the HTTP API consumed by the website and
extension. It accepts document data or clauses, invokes the appropriate
analysis service, and returns JSON results.

It acts as an integration layer so that the clients do not need to know
the internal implementation of each analysis module.

### 3. Clause segmentation

**Purpose:** Convert a full legal document into meaningful clause units.

The segmentation workflow discussed for this project uses Gemini as an
LLM-backed segmentation provider. The service has used chunking to
process long documents rather than sending an arbitrarily large document
in one request.

Conceptual processing stages:

1.  Receive document text and metadata.
2.  Prepare and normalize the text.
3.  Divide large input into manageable chunks when required.
4.  Ask the segmentation model to identify clause boundaries and return
    structured output.
5.  Validate and normalize the returned clause records.
6.  Return clauses to the caller.

The intended output is a list of clause objects with stable identifiers
and text. Additional metadata may be preserved where available.

**Segmentation quality is important.** A legal clause can contain
multiple sentences, exceptions, conditions, and nested subclauses.
Splitting mechanically at every sentence or paragraph can damage legal
meaning. The segmenter should preserve related text and distinguish
genuine boundaries from continuations.

> A custom hierarchical legal segmentation engine has been discussed as
> a future improvement. Do not describe it as implemented unless it
> exists in the current checkout. The active workflow documented here is
> the Gemini-backed segmentation service.

### 4. Document summarization

**Purpose:** Make lengthy legal documents easier to understand.

The summarization service receives document or clause input and returns
a readable summary. The extension calls:

`POST /api/summarizer/analyze`

The UI displays the overall summary and can associate clause summaries
with clause identifiers when those are present in the response.

The exact summarization model/provider, prompt design, and response
schema should be documented from the current summarizer source code;
those implementation details were not confirmed in the project material
available for this README.

### 5. Risk analysis and ranking

**Purpose:** Identify provisions that may deserve closer attention and
communicate their potential severity.

The risk service evaluates clauses and returns clause-level findings.
The response used by the extension includes information such as:

-   Clause identifier and text
-   Risk score and risk level
-   Category probabilities
-   Triggered red flags
-   Ranked clauses
-   Clause summaries, when available
-   Document-level risk information

The extension groups clauses into High Risk, Medium Risk, and Low Risk
sections. Users can expand individual cards to inspect risk details,
category probabilities, triggered red flags, and summaries.

### 6. Clause classification

**Purpose:** Assign each clause to a predefined legal category and
explain the prediction.

The website-facing endpoint is:

`POST /api/classification/analyze`

The current development architecture uses a separate classification
FastAPI service. The main backend's classification adapter communicates
with that service, which runs the classifier and returns the results.

Classification results include fields such as:

-   `id`
-   `clause`
-   `category`
-   `confidence`
-   `reason`
-   `classification_method`
-   `provider`

### 7. Chrome extension

**Technology:** Chrome Extension Manifest V3, HTML, CSS, and JavaScript.

The extension exposes analysis in a Chrome side panel. Its
responsibilities include presenting the current document/contract,
sending document data or clauses to the backend, calling analysis
endpoints, displaying service status, and rendering summaries, risk
findings, and classifications.

The side panel includes:

-   Current-document header and analysis status
-   Clause count and high-risk count
-   Service success indicator
-   Summary, Risk, and Classification tabs
-   Expandable risk details
-   Expandable classification explanations

The risk view groups clauses by severity and exposes details such as
category probabilities and triggered red flags. The classification view
shows the predicted category, confidence, clause text, and reason.

**Input-mode note:** The project has included a
stored-contract/test-data workflow using `contractData.js` and work
toward extracting text from the active webpage. The previously shared
`sidepanel.js` initialized `analyzeStoredContract()` and loaded
`currentContract` from `contractData.js`. Check the current
`initializeExtension()` before describing live webpage extraction as the
default behavior.

------------------------------------------------------------------------

## How modules communicate

  ------------------------------------------------------------------------
  Source            Destination        Data              Purpose
  ----------------- ------------------ ----------------- -----------------
  React website     Main FastAPI       Document          Start analysis
                    backend            metadata, text,   
                                       or clauses        

  Chrome extension  Main FastAPI       Document data or  Start
                    backend            clauses           browser-based
                                                         analysis

  Main backend      Segmentation       Raw document text Produce
                    service            and metadata      structured
                                                         clauses

  Main backend      Summarization      Document/clause   Generate
                    service            input             summaries

  Main backend      Risk service       Structured        Detect red flags
                                       clauses           and calculate
                                                         risk

  Main backend      Classification     Structured        Request category
                    adapter            clauses           predictions

  Classification    Classification     Clause IDs and    Run classifier
  adapter           FastAPI service    text              

  Classification    Embedding/vector   Clause text and   Retrieve similar
  pipeline          stores             embedding         examples and
                                                         legal context

  Classification    Graph retriever    Retrieved legal   Enrich legal
  pipeline                             context           context

  Classification    Local ML / LLM     Clause and        Produce
  pipeline          router             retrieved context classification

  Backend           Website /          JSON results      Render analysis
                    extension                            
  ------------------------------------------------------------------------

### Shared clause data

Segmentation is the upstream producer of structured clauses. Risk
analysis and classification both depend on clause text and identifiers.
Stable IDs allow the clients to associate results from different
services with the same source clause.

A normalized clause commonly has this shape:

``` json
{
  "id": "C1",
  "text": "The provider may modify these terms at any time."
}
```

The exact request schema may include additional metadata. The Pydantic
models in the current backend are authoritative.

## API endpoints

The following endpoints were confirmed in the extension integration
discussed for this project.

  -------------------------------------------------------------------------------
  Method                  Endpoint                        Responsibility
  ----------------------- ------------------------------- -----------------------
  `POST`                  `/api/segmentation/analyze`     Segment document text
                                                          into clauses

  `POST`                  `/api/summarizer/analyze`       Generate document
                                                          and/or clause summaries

  `POST`                  `/api/risk/analyze`             Analyze clause risk,
                                                          return red flags and
                                                          ranked findings

  `POST`                  `/api/classification/analyze`   Classify clauses
                                                          through the
                                                          classification service
  -------------------------------------------------------------------------------

FastAPI's interactive documentation is normally available at `/docs`
when enabled.

Development addresses discussed so far:

-   Main website-facing backend: `http://127.0.0.1:8000`
-   Separate classification API: `http://127.0.0.1:8001`

The exact internal classifier route and service URL should be checked in
the current adapter/configuration.

## Classification pipeline

The classification engine combines semantic retrieval, local machine
learning, graph context, and an LLM fallback.

### Embedding generation

The embedding model configured during development is:

`BAAI/bge-base-en-v1.5`

Clause embeddings are used to retrieve semantically similar dataset
examples and relevant legal passages.

### Retrieval sources

The pipeline has two logical retrieval sources:

-   **Dataset vector store:** Retrieves examples that help contextualize
    category predictions.
-   **Legal vector store:** Retrieves relevant passages from the legal
    corpus.

The retrieved legal context is then passed to the graph retriever.

### Graph retrieval

The graph component enriches retrieved legal passages with related legal
concepts and connected context. The project has used the Constitution of
India PDF as a legal knowledge source for graph construction.

### ML-first, LLM-fallback flow

1.  Generate embeddings for the input clauses.
2.  Retrieve dataset examples and legal passages.
3.  Retrieve related graph context.
4.  Run the local ML classifier.
5.  If the prediction meets its acceptance criteria, return the local
    result.
6.  If the prediction is uncertain, send the clause, category
    definitions, dataset context, and graph context to the LLM router.
7.  Return the category, confidence, reason, classification method, and
    provider.

``` mermaid
flowchart TD
    A[Clause input] --> B[Generate embedding]
    B --> C[Dataset vector search]
    B --> D[Legal vector search]
    D --> E[Graph context retrieval]
    C --> F[Local ML classifier]
    E --> F
    F --> G{Prediction accepted?}
    G -->|Yes| H[Use local prediction]
    G -->|No| I[LLM router with retrieved context]
    H --> J[Build classification result]
    I --> J
    J --> K[Return category, confidence, reason and method]
```

This design avoids sending every clause to an LLM while retaining a
fallback for uncertain predictions.

## Document-level risk score

The risk service adds a `document_risk` object to its response. The
fields include:

  -----------------------------------------------------------------------
  Field                               Meaning
  ----------------------------------- -----------------------------------
  `score`                             Normalized document risk score from
                                      0 to 100

  `level`                             `Low Risk`, `Medium Risk`, or
                                      `High Risk`

  `flagged_clauses`                   Number of clauses counted as
                                      flagged

  `total_clauses`                     Number of clauses considered

  `weighted_unfairness`               Aggregate weighted value before
                                      normalization

  `method`                            Description/identifier of the
                                      calculation method
  -----------------------------------------------------------------------

The current custom aggregation uses the following category weights:

  Category                    Weight
  ------------------------- --------
  Limitation of liability          2
  Unilateral termination           2
  Unilateral change                2
  Content removal                  2
  Contract by using                2
  Choice of law                    1
  Jurisdiction                     1
  Arbitration                      1

For each clause, the calculation adds the maximum applicable category
weight when one or more red flags are present. It aggregates the
weighted values across clauses and normalizes against a maximum weight
of 2:

\[ `\text{Weighted Unfairness}`{=tex} =
`\frac{\text{Sum of clause weights}}{\text{Total clauses}}`{=tex} \]

\[ `\text{Document Risk Score}`{=tex} = 100
`\times `{=tex}`\frac{\text{Weighted Unfairness}}{2}`{=tex} \]

The implementation uses these thresholds:

-   **Low Risk:** score below 40
-   **Medium Risk:** score from 40 to below 70
-   **High Risk:** score of 70 or above

The category weights follow the weighted-unfairness approach discussed
during development. The 0--100 normalization and 40/70 thresholds are
implementation choices, not universal legal standards or thresholds
prescribed by the cited research. The aggregate score should be read
alongside the underlying flagged clauses.

## Technology stack

  -----------------------------------------------------------------------
  Area                                Technologies
  ----------------------------------- -----------------------------------
  Frontend                            React, JavaScript, HTML, CSS

  Backend/API                         Python, FastAPI, REST

  Browser integration                 Chrome Extension Manifest V3,
                                      JavaScript, HTML, CSS

  NLP / ML                            Text embeddings, local ML
                                      classification, semantic retrieval

  LLM integration                     Gemini for the discussed
                                      segmentation workflow; LLM router
                                      for uncertain classification

  Retrieval                           Dataset and legal vector stores

  Knowledge graph                     Graph-based legal context retrieval

  Data processing                     Python, JSON, pandas for dataset
                                      preparation/inspection

  Development/deployment              Docker is part of the project's
                                      technology stack; confirm the
                                      current Compose configuration for
                                      exact commands
  -----------------------------------------------------------------------

## Datasets and knowledge sources

The following datasets and resources have been discussed or used during
development:

-   **LexGLUE:** Legal NLP benchmark collection used for legal
    text/category-related work.
-   **UNFAIR-ToS:** LexGLUE task/dataset focused on unfair terms in
    online Terms of Service.
-   **OPP-115:** Privacy policy corpus with annotations describing
    data-practice categories.
-   **Constitution of India:** Used as a legal knowledge source for
    graph retrieval.

The dataset loader and vector-store preparation code determine which
files are actually loaded in a particular environment. Not every dataset
discussed is necessarily present in every checkout. Development notes
indicated that a separate UnfairToS download was unavailable in one
local environment, so the loader was adjusted to proceed without it.

## Repository layout

The following is a **logical layout** to explain module
responsibilities, not a guaranteed verbatim listing of every directory
in the current checkout. Verify actual paths before using this as a file
map.

``` text
SmartContractAnalyzer/
│
├── frontend/                         # React website
│   └── src/
│       ├── components/                # Dashboard and analysis UI
│       ├── context/
│       │   └── AnalysisContext.jsx    # Shared contract and result state
│       ├── pages/                     # Website pages
│       └── ...
│
├── backend/                          # Main FastAPI application
│   ├── routes/                        # API route handlers
│   ├── services/
│   │   ├── segmentation_service.py    # Document-to-clause segmentation
│   │   ├── ...                        # Summarization and risk services
│   │   └── ...                        # Classification service adapter
│   └── ...
│
├── extension/                        # Chrome Manifest V3 extension
│   ├── manifest.json
│   ├── background.js
│   ├── sidepanel.html
│   ├── sidepanel.css
│   ├── sidepanel.js
│   └── contractData.js                # Stored/test contract data
│
├── legal_clause_classifier/           # Separate classification service/project
│   ├── api.py                         # Classification FastAPI entry point
│   ├── pipeline.py                    # ML-first / LLM-fallback pipeline
│   ├── config.py                      # Paths and model configuration
│   ├── datasets/                       # Dataset loading utilities
│   ├── embeddings/                     # Embedding and vector-store code
│   ├── graph/                          # Legal graph construction/retrieval
│   ├── llm/                            # LLM classification/router
│   └── ...
│
├── README.md
└── ...
```

## Getting started

The commands below are a starting point based on the development setup
discussed so far. The exact frontend scripts, backend entry-point
module, dependency files, and Compose configuration must be verified
against the current checkout.

### Prerequisites

-   Python version supported by the backend and classifier dependencies.
-   Node.js and npm (or the package manager used by the frontend).
-   Gemini credentials for the segmentation workflow, if enabled.
-   Credentials for the configured LLM provider used by classification
    fallback, if enabled.
-   Chrome/Chromium to load the extension.
-   Git.

### 1. Clone the repository

``` bash
git clone <repository-url>
cd SmartContractAnalyzer
```

### 2. Start the main backend

Create and activate a virtual environment:

``` bash
python -m venv .venv
```

Windows PowerShell:

``` powershell
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:

``` bash
source .venv/bin/activate
```

Install dependencies using the backend's dependency file:

``` bash
pip install -r requirements.txt
```

Configure the required environment variables, then start the main
FastAPI app using its actual module path. For example, if `main.py`
exposes `app`:

``` bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

If the entry point differs, replace `main:app` with the module and
application object used by the repository.

### 3. Start the classification service

The classifier is a separate FastAPI application in the development
architecture. From its project directory, activate the appropriate
environment, install its dependencies, configure model/data paths and
provider credentials, and start its API.

For example, if `api.py` exposes `app`:

``` bash
uvicorn api:app --host 127.0.0.1 --port 8001 --reload
```

The main backend's classification adapter must point to this service.

### 4. Start the React website

From the frontend directory:

``` bash
npm install
npm run dev
```

Use the scripts defined in the frontend's `package.json`. Configure the
frontend API base URL to point to the main backend.

### 5. Load the Chrome extension

1.  Open `chrome://extensions`.
2.  Enable **Developer mode**.
3.  Select **Load unpacked**.
4.  Choose the project's `extension/` directory (the directory
    containing `manifest.json`).
5.  Open a supported page or the extension's configured test workflow.
6.  Ensure the main backend and required analysis services are running.

The extension API base URL must match the address where the main backend
is listening.

## Configuration

Do not commit API keys, passwords, or other secrets. Store them in
environment variables or a local `.env` file excluded from version
control.

Classifier settings discussed during development include:

  -----------------------------------------------------------------------
  Variable / setting                  Purpose
  ----------------------------------- -----------------------------------
  `XAI_API_KEY`                       API key for the xAI provider when
                                      used by the classifier's LLM router

  `GROK_MODEL`                        Grok model name; discussed default:
                                      `grok-4.20-reasoning`

  `EMBEDDING_MODEL`                   Embedding model; discussed value:
                                      `BAAI/bge-base-en-v1.5`

  `TOP_K_LEGAL`                       Number of legal-context retrieval
                                      results

  `TOP_K_CATEGORIES`                  Number of dataset/category
                                      retrieval results

  `CHUNK_SIZE`                        Legal corpus chunk size

  `CHUNK_OVERLAP`                     Overlap between legal corpus chunks
  -----------------------------------------------------------------------

The classifier configuration also defines local paths for input clauses,
classified output, legal corpus, category ontology, vector store, and
legal graph.

The segmentation service requires credentials for its configured Gemini
integration. Use the exact environment variable name read by the current
segmentation code. The main backend also needs the classifier service
URL expected by its adapter.

Example local `.env` shape (include only variables actually read by your
code):

``` dotenv
XAI_API_KEY=your_xai_api_key
GROK_MODEL=grok-4.20-reasoning
# Add the Gemini key variable expected by the segmentation service.
# Add the classifier service URL expected by the main backend.
```

## Example payloads

These are illustrative shapes for understanding the data flow. The
Pydantic request models and actual service responses are authoritative.

### Document input

``` json
{
  "title": "Example Terms of Service",
  "url": "https://example.com/terms",
  "text": "Full legal document text goes here..."
}
```

### Segmented clause

``` json
{
  "id": "C1",
  "text": "The provider may modify these terms at any time."
}
```

### Classification result

``` json
{
  "id": "C1",
  "clause": "The provider may modify these terms at any time.",
  "category": "Unilateral change",
  "confidence": 0.91,
  "reason": "The clause allows the provider to change the terms without describing a corresponding user approval process.",
  "classification_method": "local_ml",
  "provider": "local"
}
```

### Document risk result

``` json
{
  "document_risk": {
    "score": 62.5,
    "level": "Medium Risk",
    "flagged_clauses": 2,
    "total_clauses": 8,
    "weighted_unfairness": 1.25,
    "method": "weighted_unfairness"
  }
}
```

The values above are examples only; they are not the result of analyzing
a real contract.

## Development notes

-   Keep clause IDs stable across segmentation, summarization, risk
    analysis, and classification.
-   Keep API response schemas consistent with both clients.
-   Store the complete risk response in React state when the UI needs
    both clause-level findings and the `document_risk` aggregate.
-   Keep the classification API asynchronous when awaiting the
    asynchronous `classify_clauses` pipeline method.
-   Handle service failures independently so one failure does not
    discard successful results from other modules.
-   Validate model output structure before returning it to the client.
-   Avoid logging API keys, full sensitive contracts, or personally
    identifiable information.
-   Do not commit `.env`, virtual environments, generated model files,
    or local datasets unless required and permitted by their licenses.

## Limitations

-   Risk labels are indicators for review, not legal conclusions.
-   A clause may be risky only in combination with other provisions or
    under a particular jurisdiction.
-   Predictions can be incomplete or incorrect, and segmentation quality
    affects downstream results.
-   LLM explanations can be inaccurate and should be checked against the
    source clause.
-   Dataset coverage and annotation quality limit classifier
    performance.
-   A single document score compresses multiple findings into one
    number; interpret it alongside the underlying clauses.
-   Do not upload confidential or personal legal documents unless the
    deployment's data-handling and privacy arrangements are appropriate.

## Roadmap

Potential areas for continued development:

-   Verify and complete live webpage text extraction as the default
    Chrome extension input path.
-   Improve segmentation with a hierarchy-aware legal segmenter that
    preserves nested clauses, exceptions, and continuation paragraphs.
-   Add measurable segmentation and classification evaluation.
-   Expand category validation to identify clause/category mismatches
    and return the clause ID with a reason.
-   Improve traceability from each finding to its source clause and
    supporting context.
-   Add tests for API schemas, service failures, long documents, and
    malformed model responses.
-   Document and automate the complete local and Docker-based startup
    process.

These are proposed or ongoing improvements. Move them into the
implemented-features section only after they are present and verified in
the codebase.

## Contributing

1.  Create a feature branch.
2.  Keep changes focused and modular.
3.  Preserve existing API contracts unless all clients are updated
    together.
4.  Add or update tests for changed behavior.
5.  Document new environment variables and setup requirements.
6.  Open a pull request with a clear explanation of the change.


## To start
cd D:\smartcontractanalyzer\backend
.\.venv\Scripts\Activate.ps1
(.venv) PS D:\smartcontractanalyzer\backend>  python -m uvicorn app:app --reload

cd D:\smartcontractanalyzer\frontend
npm start

## Go to legal_clause_classifier
start venv
.venv\Scripts\activate
python -m uvicorn api:app --host 127.0.0.1 --port 8001 --reload