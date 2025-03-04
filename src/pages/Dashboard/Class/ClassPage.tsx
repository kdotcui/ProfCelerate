import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  BadgeCheck,
  BookOpen,
  Users,
  Settings,
  GraduationCap,
} from 'lucide-react';
import { AutograderDashboard } from '@/components/autograder/autograder-dashboard';
import { ClassHeader } from '@/components/class/class-header';
// import { fetchClassById } from '@/lib/api/classes'; // Mock API

// Types
import { ClassData } from '@/types/class';
import { fetchClassById } from '@/lib/api/classes';

const ClassPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('autograder');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadClass = async () => {
      try {
        if (id) {
          const data = await fetchClassById(parseInt(id));
          setClassData(data);
        }
      } catch (error) {
        console.error('Failed to load class:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClass();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading class data...
      </div>
    );
  }

  if (!classData) {
    return <div className="text-center p-8">Class not found</div>;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink to="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink to="/dashboard/classes">Classes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink to={`/dashboard/classes/${classData.id}`}>
            {classData.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Class header with key information */}
      <ClassHeader classData={classData} />

      {/* Tabs for different tools/features */}
      <Tabs
        defaultValue="autograder"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {/* <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Overview
            </TabsTrigger> */}
            <TabsTrigger value="autograder" className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" />
              Autograder
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="flex items-center gap-2"
              disabled
            >
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger
              value="gradebook"
              className="flex items-center gap-2"
              disabled
            >
              <GraduationCap className="h-4 w-4" />
              Gradebook
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2"
              disabled
            >
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab content */}
        {/* <TabsContent value="overview" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Class Overview</CardTitle>
              <CardDescription>
                Summary of class information and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Class overview will be implemented in a future update.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('autograder')}
                >
                  Go to Autograder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="autograder" className="mt-0">
          <AutograderDashboard classId={id!} />
        </TabsContent>

        <TabsContent value="students" className="mt-0">
          {/* Future feature */}
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Students feature coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="gradebook" className="mt-0">
          {/* Future feature */}
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Gradebook feature coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          {/* Future feature */}
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Settings feature coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassPage;
