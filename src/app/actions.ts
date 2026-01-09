// src/app/actions.ts
"use server";

import { generateTriageRecommendations } from "@/ai/flows/generate-triage-recommendations";
import type { TriageOutput } from "@/ai/flows/generate-triage-recommendations";

export async function getTriageRecommendations(
  symptoms: string
): Promise<TriageOutput> {
  if (!symptoms) {
    throw new Error("Symptoms cannot be empty.");
  }

  try {
    const result = await generateTriageRecommendations({ symptoms });
    return result;
  } catch (error: any) {
    console.error("Error getting triage recommendations:", error);
    // Pass the specific error message back to the client
    throw new Error(error.message || "Failed to get triage recommendations from AI service.");
  }
}
