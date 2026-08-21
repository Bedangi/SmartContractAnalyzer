import { analyzeContract } from "./summarizerService";

export async function runAnalysis(contract) {
  const result = await analyzeContract(contract);

  return result;
}