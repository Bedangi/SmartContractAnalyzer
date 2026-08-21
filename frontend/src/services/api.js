const API_BASE_URL = "http://localhost:8000";

export async function apiRequest(
  endpoint,
  options = {}
) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    }
  );

  if (!response.ok) {
    let errorMessage = "Something went wrong";

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.detail || errorMessage;
    } catch {
      // Keep default error message
    }

    throw new Error(errorMessage);
  }

  return response.json();
}