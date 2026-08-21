const API_BASE_URL = "http://127.0.0.1:8000";


export async function analyzeRisk(document) {

  const response = await fetch(
    `${API_BASE_URL}/api/risk/analyze`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(document),
    }
  );


  if (!response.ok) {

    const errorData =
      await response.json().catch(
        () => ({})
      );

    throw new Error(
      errorData.detail ||
      "Risk analysis failed."
    );
  }


  return response.json();
}