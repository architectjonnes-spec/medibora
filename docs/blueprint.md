# **App Name**: TriageAssist AI

## Core Features:

- Symptom Input: Text-based input of patient symptoms to initiate the triage process.
- Guideline Retrieval: Automatically retrieve relevant sections from WHO and Kenya MoH guidelines based on inputted symptoms, using vector embeddings and FAISS or Azure Cognitive Search.
- AI-Powered Triage Recommendations: Generates structured, guideline-backed suggestions, including possible conditions, red flags, and next steps, utilizing an LLM tool with RAG.
- Red Flag Detection: Identifies and highlights critical symptoms that require immediate attention and escalation.
- Confidence Scoring: Provides a confidence level (low, medium, high) for each AI-generated recommendation, ensuring transparency and supporting human decision-making.
- Web Interface: User-friendly web interface for easy symptom entry and clear display of AI output and recommendations.
- API Endpoint: FastAPI-based REST API for handling input validation, output formatting, and system logging.

## Style Guidelines:

- Primary color: Light sky blue (#87CEEB) for a calm and trustworthy feel, referencing the importance of clarity and communication in healthcare. The color evokes feelings of trust and serenity.
- Background color: Very light blue (#F0F8FF), nearly white, creating a clean and professional backdrop.
- Accent color: Soft lavender (#E6E6FA) for subtle highlighting and to draw attention to important elements. This creates a contrast without overwhelming the light color palette.
- Body and headline font: 'Inter' (sans-serif) for a modern, clean, and readable appearance.
- Use clear and universally recognized icons to represent different symptoms and recommendations.
- Clean, intuitive layout with a focus on displaying information in a structured and easily digestible manner.
- Subtle transitions and animations to provide feedback and guide the user through the triage process without being distracting.