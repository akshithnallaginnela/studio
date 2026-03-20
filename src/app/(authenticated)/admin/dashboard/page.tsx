"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, Plus, Sparkles, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getExams, saveExam, type Exam, type Question } from "@/services/student";
import { generateExamQuestions } from "@/ai/flows/generate-exam-flow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [exams, setExams] = React.useState<Exam[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [newExam, setNewExam] = React.useState({
    title: "",
    subject: "Computer Science",
    topic: "",
    count: 3
  });

  React.useEffect(() => {
    const data = sessionStorage.getItem('studentData');
    if (!data || JSON.parse(data).role !== 'admin') {
      router.push('/');
      return;
    }
    loadExams();
  }, [router]);

  const loadExams = async () => {
    const data = await getExams();
    setExams(data);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('studentData');
    router.push('/');
  };

  const handleCreateExam = async () => {
    if (!newExam.title || !newExam.topic) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please fill in all fields." });
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateExamQuestions({
        subject: newExam.subject,
        topic: newExam.topic,
        count: newExam.count
      });

      const exam: Exam = {
        id: Math.random().toString(36).substr(2, 9),
        title: newExam.title,
        description: `Exam on ${newExam.topic}`,
        status: 'published',
        createdAt: new Date().toISOString(),
        questions: generated.questions.map((q, i) => ({ ...q, id: `q-${i}` }))
      };

      await saveExam(exam);
      await loadExams();
      
      toast({ title: "Exam Created", description: "New exam has been published for students." });
      setNewExam({ title: "", subject: "Computer Science", topic: "", count: 3 });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate exam." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" /> Admin Portal
        </h1>
        <Button variant="secondary" onClick={handleLogout}>Logout</Button>
      </header>

      <main className="flex-grow p-6 md:p-8 lg:p-12 max-w-6xl mx-auto w-full">
        <Tabs defaultValue="exams" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="exams">Manage Exams</TabsTrigger>
            <TabsTrigger value="students">Students List</TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Create New Exam
                  </CardTitle>
                  <CardDescription>Use AI to generate exam questions instantly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Exam Title</Label>
                    <Input 
                      placeholder="e.g. Mid-term React Basics" 
                      value={newExam.title} 
                      onChange={e => setNewExam({...newExam, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Input 
                      placeholder="e.g. Hooks and State Management" 
                      value={newExam.topic}
                      onChange={e => setNewExam({...newExam, topic: e.target.value})}
                    />
                  </div>
                  <Button className="w-full gap-2" onClick={handleCreateExam} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isGenerating ? "Generating Questions..." : "Generate & Publish Exam"}
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-muted-foreground" /> Recent Exams
                </h3>
                {exams.map(exam => (
                  <Card key={exam.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{exam.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {exam.questions.length} Questions • Created {new Date(exam.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast({title: "Details", description: "Viewing exam details coming soon!"})}>
                        View
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" /> Student Management
                </CardTitle>
                <CardDescription>View and manage enrolled students.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {[
                    { name: 'Alice Smith', email: 'student1@college.edu', roll: 'roll123' },
                    { name: 'Bob Johnson', email: 'student2@college.edu', roll: 'roll456' }
                  ].map((s, i) => (
                    <div key={i} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.email} • {s.roll}</p>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

import { ShieldCheck } from "lucide-react";
