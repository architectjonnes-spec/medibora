// src/ai/flows/generate-triage-recommendations.ts
'use server';
/**
 * @fileOverview Generates triage recommendations based on patient symptoms using an LLM and RAG with medical guidelines.
 *
 * - generateTriageRecommendations - A function that takes patient symptoms as input and returns triage recommendations.
 * - TriageInput - The input type for the generateTriageRecommendations function.
 * - TriageOutput - The return type for the generateTriageRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TriageInputSchema = z.object({
  symptoms: z.string().describe('The patient symptoms described in text.'),
});
export type TriageInput = z.infer<typeof TriageInputSchema>;

const TriageOutputSchema = z.object({
  possible_conditions: z.array(z.string()).describe('Possible medical conditions based on the symptoms.'),
  red_flags: z.array(z.string()).describe('Critical symptoms that require immediate attention.'),
  recommended_questions: z.array(z.string()).describe('Follow-up questions to ask the patient.'),
  next_steps: z.array(z.string()).describe('Recommended next steps for the patient (tests, referrals, escalation).'),
  confidence_level: z.enum(['low', 'medium', 'high']).describe('The confidence level for the recommendations.'),
  disclaimer: z.string().describe('A disclaimer indicating that this is not a medical diagnosis.'),
});
export type TriageOutput = z.infer<typeof TriageOutputSchema>;

export async function generateTriageRecommendations(input: TriageInput): Promise<TriageOutput> {
  return generateTriageRecommendationsFlow(input);
}

const triagePrompt = ai.definePrompt({
  name: 'triagePrompt',
  input: {schema: TriageInputSchema},
  output: {schema: TriageOutputSchema},
  prompt: `You are an AI assistant that provides triage recommendations based on patient symptoms and medical guidelines.

  Analyze the following symptoms:
  {{symptoms}}

  Provide a structured response including possible conditions, red flags, recommended questions, and next steps.
  Include a confidence level for your recommendations.
  Add a disclaimer that this is not a medical diagnosis.

  Format your response as a JSON object:
  {
    "possible_conditions": [],
    "red_flags": [],
    "recommended_questions": [],
    "next_steps": [],
    "confidence_level": "low | medium | high",
    "disclaimer": "This is not a medical diagnosis"
  }`,
});

const generateTriageRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateTriageRecommendationsFlow',
    inputSchema: TriageInputSchema,
    outputSchema: TriageOutputSchema,
  },
  async input => {
    const {output} = await triagePrompt(input);
    return output!;
  }
);
