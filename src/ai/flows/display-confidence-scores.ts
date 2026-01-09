'use server';

/**
 * @fileOverview A flow that generates triage recommendations with confidence levels.
 *
 * - triageRecommendations - A function that generates triage recommendations with confidence levels.
 * - TriageRecommendationsInput - The input type for the triageRecommendations function.
 * - TriageRecommendationsOutput - The return type for the triageRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TriageRecommendationsInputSchema = z.object({
  symptoms: z.string().describe('The patient symptoms described in text.'),
});

export type TriageRecommendationsInput = z.infer<typeof TriageRecommendationsInputSchema>;

const TriageRecommendationsOutputSchema = z.object({
  possible_conditions: z.array(z.string()).describe('Possible medical conditions based on the symptoms.'),
  red_flags: z.array(z.string()).describe('Critical symptoms that require immediate attention.'),
  recommended_questions: z.array(z.string()).describe('Follow-up questions to ask the patient.'),
  next_steps: z.array(z.string()).describe('Recommended next steps for diagnosis and treatment.'),
  confidence_level: z
    .enum(['low', 'medium', 'high'])
    .describe('The confidence level of the AI in its recommendations.'),
  disclaimer: z.string().describe('A disclaimer that this is not a medical diagnosis.'),
});

export type TriageRecommendationsOutput = z.infer<typeof TriageRecommendationsOutputSchema>;

export async function triageRecommendations(input: TriageRecommendationsInput): Promise<TriageRecommendationsOutput> {
  return triageRecommendationsFlow(input);
}

const triageRecommendationsPrompt = ai.definePrompt({
  name: 'triageRecommendationsPrompt',
  input: {schema: TriageRecommendationsInputSchema},
  output: {schema: TriageRecommendationsOutputSchema},
  prompt: `You are an AI assistant that provides triage recommendations based on the patient's symptoms.

  Analyze the following symptoms and provide a structured JSON response with possible conditions, red flags, recommended questions, and next steps.
  Also, provide a confidence level for your recommendations (low, medium, or high).
  Include a disclaimer that this is not a medical diagnosis.

  Symptoms: {{{symptoms}}}

  The response should be in the following JSON format:
  {
    "possible_conditions": [],
    "red_flags": [],
    "recommended_questions": [],
    "next_steps": [],
    "confidence_level": "low | medium | high",
    "disclaimer": "This is not a medical diagnosis"
  }`,
});

const triageRecommendationsFlow = ai.defineFlow(
  {
    name: 'triageRecommendationsFlow',
    inputSchema: TriageRecommendationsInputSchema,
    outputSchema: TriageRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await triageRecommendationsPrompt(input);
    return output!;
  }
);
