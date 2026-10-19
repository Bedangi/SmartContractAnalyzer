
const API_BASE_URL = "http://127.0.0.1:8000";

export async function classifyDocument(contract) {
  const response = await fetch(
    `${API_BASE_URL}/api/classification/analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        document_id: contract.document_id,
        title: contract.title,
        clauses: contract.clauses.map((clause) => ({
          id: clause.id,
          text: clause.text,
        })),
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.detail || "Failed to classify contract clauses."
    );
  }

  return response.json();
}
