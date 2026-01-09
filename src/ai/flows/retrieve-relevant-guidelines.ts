'use server';

/**
 * @fileOverview This file defines a Genkit flow to retrieve relevant sections from medical guidelines based on inputted symptoms.
 *
 * - retrieveRelevantGuidelines - A function that orchestrates the retrieval of relevant guidelines.
 * - RetrieveRelevantGuidelinesInput - The input type for the retrieveRelevantGuidelines function.
 * - RetrieveRelevantGuidelinesOutput - The return type for the retrieveRelevantGuidelines function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetrieveRelevantGuidelinesInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms entered by the user.'),
});
export type RetrieveRelevantGuidelinesInput = z.infer<typeof RetrieveRelevantGuidelinesInputSchema>;

const RetrieveRelevantGuidelinesOutputSchema = z.object({
  guidelineSections: z.array(z.string()).describe('The relevant sections from the medical guidelines.'),
});
export type RetrieveRelevantGuidelinesOutput = z.infer<typeof RetrieveRelevantGuidelinesOutputSchema>;

export async function retrieveRelevantGuidelines(input: RetrieveRelevantGuidelinesInput): Promise<RetrieveRelevantGuidelinesOutput> {
  return retrieveRelevantGuidelinesFlow(input);
}

const retrieveGuidelinesPrompt = ai.definePrompt({
  name: 'retrieveGuidelinesPrompt',
  input: {schema: RetrieveRelevantGuidelinesInputSchema},
  output: {schema: RetrieveRelevantGuidelinesOutputSchema},
  prompt: `You are an AI assistant designed to retrieve relevant sections from medical guidelines based on user-provided symptoms.

  Symptoms: {{{symptoms}}}

  Return the relevant sections from medical guidelines that are most relevant to the symptoms provided.  The response should be an array of strings.
  Ensure that the guideline sections returned directly address the symptoms described and provide context for potential conditions, red flags, and next steps.
  Focus on extracting the most pertinent information to aid healthcare workers in understanding the basis for recommendations.
  Do not diagnose or prescribe anything.  Only retrieve guidelines.
  `, 
});

const retrieveRelevantGuidelinesFlow = ai.defineFlow(
  {
    name: 'retrieveRelevantGuidelinesFlow',
    inputSchema: RetrieveRelevantGuidelinesInputSchema,
    outputSchema: RetrieveRelevantGuidelinesOutputSchema,
  },
  async input => {
    const {output} = await retrieveGuidelinesPrompt(input);
    return output!;
  }
);
