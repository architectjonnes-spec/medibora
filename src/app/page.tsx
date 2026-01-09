import { Stethoscope } from 'lucide-react';
import SymptomAnalyzer from '@/components/symptom-analyzer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <div className="container mx-auto flex items-center gap-3">
          <Stethoscope className="text-primary w-8 h-8" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            TriageAssist AI
          </h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <SymptomAnalyzer />
      </main>
      <footer className="p-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> This is an AI-powered tool for clinical decision support and not a substitute for professional medical advice. All decisions remain the responsibility of the healthcare professional.
        </div>
      </footer>
    </div>
  );
}
