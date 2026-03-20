'use server';
/**
 * @fileOverview AI flow to generate exam questions.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const GenerateQuestionsInputSchema = z.object({
  subject: z.string().describe('The subject of the exam.'),
  topic: z.string().describe('The specific topic within the subject.'),
  count: z.number().min(1).max(10).describe('Number of questions to generate.'),
});

const QuestionSchema = z.object({
  text: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
});

const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema),
});

export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;
export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateQuestionsPrompt',
  input: { schema: GenerateQuestionsInputSchema },
  output: { schema: GenerateQuestionsOutputSchema },
  prompt: `You are an expert academic examiner. 
  Generate {{count}} multiple-choice questions for the subject: {{subject}} on the topic: {{topic}}.
  Each question must have exactly 4 options and one correct answer (index 0-3).
  Ensure the questions are challenging but fair for a college level.`,
});

export async function generateExamQuestions(input: GenerateQuestionsInput): Promise<GenerateQuestionsOutput> {
  const { output } = await generateQuestionsPrompt(input);
  if (!output) throw new Error("Failed to generate questions");
  return output;
}
