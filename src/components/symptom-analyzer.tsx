"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  AlertTriangle,
  HeartPulse,
  Lightbulb,
  Loader2,
  Sparkles,
  ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getTriageRecommendations } from "@/app/actions";
import type { TriageOutput } from "@/ai/flows/generate-triage-recommendations";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: "Please describe the symptoms in at least 10 characters.",
  }),
});

export default function SymptomAnalyzer() {
  const [result, setResult] = useState<TriageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getTriageRecommendations(values.symptoms);
      setResult(response);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getConfidenceBadge = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return <Badge variant="destructive">Low</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'high':
        return <Badge variant="default">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderResults = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    if (!result) {
      return (
        <div className="text-center p-12 border-2 border-dashed rounded-lg">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium text-foreground">AI Triage Results</h3>
            <p className="mt-1 text-sm text-muted-foreground">Enter patient symptoms to see AI-powered recommendations.</p>
        </div>
      );
    }
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        {result.red_flags && result.red_flags.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-bold">Urgent Red Flags Detected!</AlertTitle>
            <AlertDescription>
              <p>Immediate attention is required for the following:</p>
              <ul className="list-disc pl-5 mt-2">
                {result.red_flags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Confidence Level:</h3>
            {getConfidenceBadge(result.confidence_level)}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    <HeartPulse className="w-6 h-6 text-primary" />
                    <CardTitle>Possible Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                    {result.possible_conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                    ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    <Lightbulb className="w-6 h-6 text-primary" />
                    <CardTitle>Recommended Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                    {result.recommended_questions.map((question, index) => (
                        <li key={index}>{question}</li>
                    ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <ClipboardList className="w-6 h-6 text-primary" />
                <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                {result.next_steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
                </ul>
            </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold font-headline">Symptom Input</h2>
        <p className="text-muted-foreground">
          Enter the patient's symptoms below. Be as descriptive as possible for the most accurate recommendations.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Patient Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Patient presents with high fever, persistent cough, and difficulty breathing for the last 3 days.'"
                      className="min-h-[200px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Symptoms
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold font-headline">Triage Recommendations</h2>
        <div className="bg-card p-4 sm:p-6 rounded-lg border min-h-[300px]">
            {renderResults()}
        </div>
      </div>
    </div>
  );
}


const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
        <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    </div>
);