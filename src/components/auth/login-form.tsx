"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/navigation';
import { Loader2, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getStudentRecord } from "@/services/student";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid college email address.",
  }),
  password: z.string().min(1, {
    message: "Roll number cannot be empty.",
  }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const studentData = await getStudentRecord(values.email, values.password);

      // Store data temporarily for dashboard navigation.
      sessionStorage.setItem('studentData', JSON.stringify(studentData));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${studentData.name || 'Student'}!`,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or roll number. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">CampusConnect</CardTitle>
          <CardDescription className="text-center">
            Enter your college email and roll number to access your portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@college.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number (Password)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Your Roll Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Alert variant="default" className="bg-muted border-none">
        <Info className="h-4 w-4" />
        <AlertTitle className="text-xs font-semibold">Demo Credentials</AlertTitle>
        <AlertDescription className="text-xs space-y-1 mt-1">
          <div>Email: <code className="bg-background px-1 rounded">student1@college.edu</code></div>
          <div>Roll: <code className="bg-background px-1 rounded">roll123</code></div>
          <div className="pt-1">Email: <code className="bg-background px-1 rounded">test@example.com</code></div>
          <div>Roll: <code className="bg-background px-1 rounded">testpass</code></div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
