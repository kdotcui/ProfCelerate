// src/pages/About.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Clock, Brain, ChartBar, Users } from 'lucide-react';

export default function About() {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About ProfCelerate</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering professors to focus on what matters most - teaching and mentoring students.
          </p>
        </div>

        {/* Problem Statement */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">The Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Professors spend countless hours grading repetitive assignments, time that could be better spent on:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Developing innovative teaching methods</li>
              <li>Providing personalized feedback to students</li>
              <li>Conducting research and advancing their field</li>
              <li>Mentoring students in their academic journey</li>
            </ul>
            <p className="text-lg mt-4">
              On average, professors spend 20-30 hours per week on grading, with much of this time spent on repetitive tasks that could be automated.
            </p>
          </CardContent>
        </Card>

        {/* Solution */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Time-Saving Automation</h3>
                </div>
                <p>
                  ProfCelerate uses advanced AI to automatically grade assignments, saving professors up to 70% of their grading time.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Intelligent Feedback</h3>
                </div>
                <p>
                  Our AI provides detailed, constructive feedback that helps students understand their mistakes and learn from them.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ChartBar className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Analytics & Insights</h3>
                </div>
                <p>
                  Get valuable insights into student performance patterns and identify areas where students need additional support.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Enhanced Teaching</h3>
                </div>
                <p>
                  Focus on meaningful interactions with students and develop more engaging course content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">The Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">70%</div>
                <p className="text-muted-foreground">Time saved on grading</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <p className="text-muted-foreground">Hours saved per semester</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">Professor satisfaction rate</p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">What Professors Say</h3>
              <blockquote className="border-l-4 border-primary pl-4 italic">
                "ProfCelerate has transformed how I approach grading. I now have more time to focus on helping my students succeed and developing new teaching methods."
              </blockquote>
              <p className="text-muted-foreground mt-2">- Dr. Sarah Johnson, Computer Science Professor</p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Teaching?</h2>
          <p className="text-muted-foreground mb-8">
            Join the growing community of professors who are saving time and improving student outcomes with ProfCelerate.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </div>
  );
}
