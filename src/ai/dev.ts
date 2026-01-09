import { config } from 'dotenv';
config();

import '@/ai/flows/generate-triage-recommendations.ts';
import '@/ai/flows/retrieve-relevant-guidelines.ts';
import '@/ai/flows/display-confidence-scores.ts';
import '@/ai/flows/flag-urgent-symptoms.ts';