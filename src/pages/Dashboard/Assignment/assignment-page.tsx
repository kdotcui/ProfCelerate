import React, { useState, useEffect, JSX } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, FileUp, RefreshCw } from 'lucide-react';

// Import components
import { AssignmentDetails } from './assignment-details';
import { SubmissionSection } from './submission-section';
import { FileUploadForm } from './file-upload-form';
import { Assignment } from '@/types/class';

export interface SubmissionBatch {
  id: string;
  name: string;
  uploadedAt: string;
  status: 'grading' | 'completed' | 'failed';
  fileCount: number;
  gradedCount: number;
}

// Mock data (would come from API in real implementation)
const mockAssignment: Assignment = {
  id: '1',
  title: 'Programming Assignment 3: Data Structures',
  description:
    'Implement a binary search tree and perform various operations on it.',
  points: 100,
  createdAt: '2025-03-01T10:00:00Z',
  type: 'voice',
  submissions: 0,
};

const mockSubmissions: SubmissionBatch[] = [
  {
    id: 'batch1',
    name: 'Section A Submissions',
    uploadedAt: '2025-03-10T14:30:00Z',
    status: 'completed',
    fileCount: 28,
    gradedCount: 28,
  },
  {
    id: 'batch2',
    name: 'Section B Submissions',
    uploadedAt: '2025-03-12T10:15:00Z',
    status: 'grading',
    fileCount: 32,
    gradedCount: 18,
  },
];

const AssignmentPage: React.FC = () => {
  const { classId, assignmentId } = useParams<{
    classId: string;
    assignmentId: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionBatch[]>([]);
  const [activeTab, setActiveTab] = useState<string>('details');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);

  useEffect(() => {
    // Mock API fetch
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        // Simulate API call delay
        setTimeout(() => {
          setAssignment(mockAssignment);
          setSubmissions(mockSubmissions);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch assignment data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  const handleRefresh = (): void => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  console.log('ids: ', classId, assignmentId);

  const handleBack = (): void => {
    navigate(-1);
  };

  const handleSubmitFiles = (files: File[], batchName: string): void => {
    // Here you would call your API to upload and process files
    console.log('Submitting files:', files, 'Batch name:', batchName);

    // Add new batch to the submissions list
    const newBatch: SubmissionBatch = {
      id: `batch${submissions.length + 1}`,
      name: batchName || `Batch ${submissions.length + 1}`,
      uploadedAt: new Date().toISOString(),
      status: 'grading',
      fileCount: files.length,
      gradedCount: 0,
    };

    setSubmissions([newBatch, ...submissions]);
    setShowUploadForm(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">Assignment not found</h3>
          <Button className="mt-4" onClick={handleBack}>
            Back to Class
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string): JSX.Element => {
    if (status === 'published') {
      return <Badge className="bg-green-500">Published</Badge>;
    } else if (status === 'draft') {
      return <Badge className="bg-yellow-500">Draft</Badge>;
    } else {
      return <Badge className="bg-gray-500">Archived</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink to="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to="/dashboard/classes">Classes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to={`/dashboard/classes/${classId}`}>
              Class
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to="#">{assignment.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Class
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </div>

      {/* Assignment header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{assignment.title}</h2>
              </div>
              <CardDescription>{assignment.description}</CardDescription>
            </div>
            <div>
              <Button
                className="flex items-center gap-2"
                // onClick={() => setShowUploadForm(true)}
              >
                <FileUp className="h-4 w-4" />
                Edit Assignment
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for Assignment details and Submissions */}
      <Tabs
        defaultValue="details"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="details">Assignment Details</TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions ({submissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <AssignmentDetails assignment={assignment} />
        </TabsContent>

        <TabsContent value="submissions">
          <SubmissionSection
            submissions={submissions}
            onUpload={() => setShowUploadForm(true)}
          />
        </TabsContent>
      </Tabs>

      {/* File Upload Modal */}
      {showUploadForm && (
        <FileUploadForm
          acceptedFileTypes={
            assignment.type === 'voice' ? ['audio/*'] : ['application/pdf']
          }
          onClose={() => setShowUploadForm(false)}
          onSubmit={handleSubmitFiles}
        />
      )}
    </div>
  );
};

export default AssignmentPage;
