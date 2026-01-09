import { config } from 'dotenv';
config();

// Ensure this path points to your consolidated flow file.
import '@/ai/flows/generate-triage-recommendations.ts';
