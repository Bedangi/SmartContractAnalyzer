import { apiRequest } from "./api";

export async function analyzeContract(document) {
  return apiRequest(
    "/api/summarizer/analyze",
    {
      method: "POST",
      body: JSON.stringify(document),
    }
  );
}