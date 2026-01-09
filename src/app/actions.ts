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
  } catch (error) {
    console.error("Error getting triage recommendations:", error);
    // In a real app, you might want to log this error to a monitoring service
    throw new Error("Failed to get triage recommendations from AI service.");
  }
}
