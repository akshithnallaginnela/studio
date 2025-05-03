"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck, CalendarCheck, CircleDollarSign, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { StudentRecord } from "@/services/student"; // Import the type

export default function DashboardPage() {
  const router = useRouter();
  const [studentData, setStudentData] = React.useState<StudentRecord | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch data from sessionStorage on component mount (client-side only)
    const storedData = sessionStorage.getItem('studentData');
    if (storedData) {
      try {
        const parsedData: StudentRecord = JSON.parse(storedData);
        setStudentData(parsedData);
      } catch (error) {
        console.error("Failed to parse student data:", error);
        // Handle error, maybe redirect to login
        router.push('/');
      }
    } else {
      // If no data, redirect to login
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('studentData');
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">CampusConnect Dashboard</h1>
        <Button variant="secondary" onClick={handleLogout}>Logout</Button>
      </header>

      <main className="flex-grow p-6 md:p-8 lg:p-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Results</CardTitle>
              <BookOpenCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-1/2" />
              ) : (
                <div className="text-2xl font-bold">{studentData?.results || 'N/A'}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Your latest academic results.</p>
            </CardContent>
          </Card>

          <Card className="transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <CalendarCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-1/3" />
              ) : (
                <div className="text-2xl font-bold">{studentData?.attendance || 'N/A'}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Your overall attendance percentage.</p>
            </CardContent>
          </Card>

          <Card className="transform transition duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fee Dues</CardTitle>
              <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-1/4" />
              ) : (
                <div className="text-2xl font-bold">
                  {studentData?.feeDues !== undefined ? `$${studentData.feeDues.toFixed(2)}` : 'N/A'}
                </div>
              )}
               <p className="text-xs text-muted-foreground mt-1">Outstanding fee balance.</p>
            </CardContent>
          </Card>

          {/* Placeholder for future features like History */}
           <Card className="md:col-span-2 lg:col-span-3 transform transition duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile & History</CardTitle>
              <User className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View your detailed profile and history of results, attendance, and fees (coming soon).</p>
               <Button variant="outline" className="mt-4" disabled>View History</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} CampusConnect - Your College Portal.
      </footer>
    </div>
  );
}
