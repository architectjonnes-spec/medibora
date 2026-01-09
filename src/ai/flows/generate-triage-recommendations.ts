'use server';
/**
 * @fileOverview Generates triage recommendations based on patient symptoms using an LLM.
 *
 * - generateTriageRecommendations - A function that takes patient symptoms as input and returns triage recommendations.
 * - TriageInput - The input type for the generateTriageRecommendations function.
 * - TriageOutput - The return type for the generateTriageRecommendations function.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
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

// Initialize Genkit and the AI plugin directly in the server file.
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});


export async function generateTriageRecommendations(input: TriageInput): Promise<TriageOutput> {
  return generateTriageRecommendationsFlow(input);
}

const triagePrompt = ai.definePrompt({
  name: 'triagePrompt',
  input: {schema: TriageInputSchema},
  output: {schema: TriageOutputSchema},
  prompt: `You are an AI assistant for Medi bora, providing triage recommendations based on patient symptoms.

  Analyze the following symptoms:
  "{{{symptoms}}}"

  Provide a structured response including possible conditions, red flags, recommended questions for the clinician to ask, and next steps for the patient (e.g., tests, referrals, escalation).
  Also, include a confidence level for your recommendations (low, medium, or high).
  Finally, add a disclaimer that this is not a medical diagnosis and is for informational purposes only.

  Your entire response must be a single, valid JSON object that conforms to the output schema.
  `,
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
