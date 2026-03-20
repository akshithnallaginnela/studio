"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpenCheck, CalendarCheck, CircleDollarSign, User, Pencil, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getExams, type Exam, type StudentRecord } from "@/services/student";

export default function DashboardPage() {
  const router = useRouter();
  const [studentData, setStudentData] = React.useState<StudentRecord | null>(null);
  const [exams, setExams] = React.useState<Exam[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedData = sessionStorage.getItem('studentData');
    if (storedData) {
      try {
        const parsedData: StudentRecord = JSON.parse(storedData);
        setStudentData(parsedData);
        loadExams();
      } catch (error) {
        router.push('/');
      }
    } else {
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  const loadExams = async () => {
    const data = await getExams();
    setExams(data);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('studentData');
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">CampusConnect</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:inline">Welcome, {studentData?.name}</span>
          <Button variant="secondary" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="flex-grow p-6 md:p-8 lg:p-12 max-w-6xl mx-auto w-full">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="exams">Tests & Exams</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Results</CardTitle>
                  <BookOpenCheck className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentData?.results || 'N/A'}</div>
                  <p className="text-xs text-muted-foreground mt-1">Latest academic grade.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                  <CalendarCheck className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentData?.attendance || 'N/A'}</div>
                  <p className="text-xs text-muted-foreground mt-1">Current term presence.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fee Dues</CardTitle>
                  <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${studentData?.feeDues?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Outstanding balance.</p>
                </CardContent>
              </Card>
            </div>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">You have no recent exam activity. Start by checking the Tests tab!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exams.length > 0 ? exams.map((exam) => (
                <Card key={exam.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription>{exam.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                      <span>{exam.questions.length} Questions</span>
                      <span>Published {new Date(exam.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => router.push(`/exams/${exam.id}`)}
                    >
                      <Pencil className="w-4 h-4" /> Start Test
                    </Button>
                  </CardContent>
                </Card>
              )) : (
                <p className="text-muted-foreground text-center col-span-full py-12">No exams scheduled at the moment.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} CampusConnect. All rights reserved.
      </footer>
    </div>
  );
}
