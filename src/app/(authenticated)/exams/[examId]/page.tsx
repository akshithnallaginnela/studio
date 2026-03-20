"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getExams, type Exam } from "@/services/student";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ExamPage() {
  const { examId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [exam, setExam] = React.useState<Exam | null>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      const exams = await getExams();
      const found = exams.find(e => e.id === examId);
      if (found) {
        setExam(found);
      } else {
        router.push('/dashboard');
      }
    };
    load();
  }, [examId, router]);

  if (!exam) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const currentQ = exam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQ.id]: parseInt(value) });
  };

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    exam.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    setIsSubmitted(true);
    toast({ title: "Exam Submitted", description: `You scored ${correct}/${exam.questions.length}` });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="text-primary w-10 h-10" />
            </div>
            <CardTitle className="text-2xl">Exam Completed!</CardTitle>
            <CardDescription>Well done on finishing the test.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold">
              {score} / {exam.questions.length}
            </div>
            <p className="text-muted-foreground">Your results have been recorded and sent to your professor.</p>
            <Button className="w-full" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <header className="flex justify-between items-center bg-background p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="font-bold text-lg">{exam.title}</h1>
            <p className="text-xs text-muted-foreground">Question {currentQuestion + 1} of {exam.questions.length}</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>Exit</Button>
        </header>

        <Progress value={progress} className="h-2" />

        <Card>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {currentQ.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[currentQ.id]?.toString()} 
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {currentQ.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2 rounded-md border p-4 hover:bg-accent transition-colors">
                  <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                  <Label htmlFor={`opt-${idx}`} className="flex-grow cursor-pointer text-base">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            disabled={currentQuestion === 0} 
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
          >
            Previous
          </Button>
          
          {currentQuestion === exam.questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={answers[currentQ.id] === undefined}>
              Submit Exam
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={answers[currentQ.id] === undefined}>
              Next Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
