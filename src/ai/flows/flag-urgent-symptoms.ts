'use server';
/**
 * @fileOverview Identifies and highlights critical symptoms that require immediate attention and escalation.
 *
 * - flagUrgentSymptoms - A function that handles the identification of urgent symptoms.
 * - FlagUrgentSymptomsInput - The input type for the flagUrgentSymptoms function.
 * - FlagUrgentSymptomsOutput - The return type for the flagUrgentSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagUrgentSymptomsInputSchema = z.object({
  symptoms: z.string().describe('The symptoms reported by the patient.'),
});
export type FlagUrgentSymptomsInput = z.infer<typeof FlagUrgentSymptomsInputSchema>;

const FlagUrgentSymptomsOutputSchema = z.object({
  urgentSymptoms: z
    .array(z.string())
    .describe('List of symptoms that require immediate attention.'),
  explanation: z.string().describe('Explanation of why these symptoms are urgent.'),
});
export type FlagUrgentSymptomsOutput = z.infer<typeof FlagUrgentSymptomsOutputSchema>;

export async function flagUrgentSymptoms(input: FlagUrgentSymptomsInput): Promise<FlagUrgentSymptomsOutput> {
  return flagUrgentSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flagUrgentSymptomsPrompt',
  input: {schema: FlagUrgentSymptomsInputSchema},
  output: {schema: FlagUrgentSymptomsOutputSchema},
  prompt: `You are an AI assistant that helps clinicians identify urgent symptoms that require immediate attention.
  Based on the patient's reported symptoms, identify any red-flag symptoms and explain why they are urgent. 
  If there are no urgent symptoms, the urgentSymptoms field should be an empty array.

  Symptoms: {{{symptoms}}}
  `,
});

const flagUrgentSymptomsFlow = ai.defineFlow(
  {
    name: 'flagUrgentSymptomsFlow',
    inputSchema: FlagUrgentSymptomsInputSchema,
    outputSchema: FlagUrgentSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
