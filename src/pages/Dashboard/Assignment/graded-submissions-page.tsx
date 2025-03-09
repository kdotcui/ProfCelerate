import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  FileText,
  Download,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { transformToCamelCase } from '@/lib/caseConversion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { deleteSubmissionBatch } from '@/lib/deleteOperations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface GradingResult {
  question: string;
  mistakes: string[];
  score: number;
  feedback: string;
}

interface GradedSubmission {
  id: string;
  fileName: string;
  totalScore: number;
  createdAt: string;
  results: GradingResult[];
  overallFeedback: string;
  submissionId: string;
  totalPoints?: number;
  fileContent: string;
}

interface SubmissionResult {
  id: string;
  file_name: string;
  file_content: string;
  grading_results: {
    totalScore: number;
    results: GradingResult[];
    overallFeedback: string;
  };
  created_at: string;
  submission_id: string;
}

const downloadFile = (submission: GradedSubmission) => {
  try {
    // Verify that the content is a valid base64 data URL
    if (!submission.fileContent.startsWith('data:')) {
      throw new Error('Invalid file content format');
    }

    // Extract the MIME type and base64 data
    const [header, base64Data] = submission.fileContent.split(',');
    if (!base64Data) {
      throw new Error('Invalid base64 data format');
    }

    const mimeType =
      header.split(':')[1]?.split(';')[0] || 'application/octet-stream';

    // Convert base64 to blob
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = submission.fileName;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (e) {
      console.error('Error processing base64 data:', e);
      throw new Error('Failed to process file data');
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error('Failed to download file. Please try again.');
  }
};

export const GradedSubmissionsPage: React.FC = () => {
  const { classId, assignmentId, submissionId } = useParams<{
    classId: string;
    assignmentId: string;
    submissionId: string;
  }>();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<GradedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<GradedSubmission | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteBatchAlert, setShowDeleteBatchAlert] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (submissionId) {
      fetchGradedSubmissions();
    }
  }, [submissionId]);

  const fetchSubmissionPoints = async (submissionId: string) => {
    try {
      const { data: submission, error } = await supabase
        .from('submissions')
        .select('assignment_id')
        .eq('id', submissionId)
        .single();

      if (error) throw error;

      const { data: assignment, error: assignmentError } = await supabase
        .from('assignments')
        .select('points')
        .eq('id', submission.assignment_id)
        .single();

      if (assignmentError) throw assignmentError;

      return assignment.points;
    } catch (error) {
      console.error('Error fetching submission points:', error);
      return null;
    }
  };

  const fetchGradedSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submission_results')
        .select('*')
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedSubmissions = await Promise.all(
        (data as SubmissionResult[]).map(async (submission) => {
          const camelCaseSubmission = transformToCamelCase(
            submission
          ) as SubmissionResult;
          const totalPoints = await fetchSubmissionPoints(
            submission.submission_id
          );

          return {
            id: camelCaseSubmission.id,
            fileName: submission.file_name,
            totalScore: submission.grading_results.totalScore,
            createdAt: camelCaseSubmission.created_at,
            results: submission.grading_results.results,
            overallFeedback: submission.grading_results.overallFeedback,
            submissionId: submission.submission_id,
            gradedResults: submission.grading_results,
            totalPoints,
            fileContent: submission.file_content,
            isBase64: submission.file_content.startsWith('data:'),
          };
        })
      );

      setSubmissions(transformedSubmissions);
      if (transformedSubmissions.length > 0) {
        setSelectedSubmission(transformedSubmissions[0]);
      }
    } catch (error) {
      console.error('Error fetching graded submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (
    score: number,
    totalPoints: number | undefined
  ) => {
    if (!totalPoints) return score;
    return Math.round((score / totalPoints) * 100);
  };

  const handleBack = () => {
    navigate(`/dashboard/classes/${classId}/assignments/${assignmentId}`);
  };

  const handleDeleteSubmissionResult = async (resultId: string) => {
    try {
      const { error } = await supabase
        .from('submission_results')
        .delete()
        .eq('id', resultId);

      if (error) throw error;

      setSubmissions(submissions.filter((sub) => sub.id !== resultId));
      if (selectedSubmission?.id === resultId) {
        setSelectedSubmission(
          submissions.find((sub) => sub.id !== resultId) || null
        );
      }
      setShowDeleteAlert(false);
      setSubmissionToDelete(null);
      toast.success('Submission result deleted successfully');
    } catch (error: any) {
      console.error('Error deleting submission result:', error);
      toast.error(error.message || 'Failed to delete submission result');
    }
  };

  const handleDeleteEntireBatch = async () => {
    if (!submissionId) return;

    try {
      await deleteSubmissionBatch(submissionId);
      setShowDeleteBatchAlert(false);
      toast.success('Submission batch deleted successfully');
      navigate(`/dashboard/classes/${classId}/assignments/${assignmentId}`);
    } catch (error: any) {
      console.error('Error deleting submission batch:', error);
      toast.error(error.message || 'Failed to delete submission batch');
    }
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

  if (submissions.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No graded submissions found.</p>
          <Button onClick={handleBack} className="mt-4">
            Back to Assignment
          </Button>
        </div>
      </div>
    );
  }

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
            <BreadcrumbLink
              to={`/dashboard/classes/${classId}/assignments/${assignmentId}`}
            >
              Assignment
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to="#">Graded Submissions</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Assignment
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setShowDeleteBatchAlert(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Entire Submission
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Submission List */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Submissions</h2>
            <Badge variant="secondary">
              {submissions.length}{' '}
              {submissions.length === 1 ? 'submission' : 'submissions'}
            </Badge>
          </div>
          <div className="space-y-2">
            {submissions.map((submission) => (
              <Card
                key={submission.id}
                className={`cursor-pointer transition-colors ${
                  selectedSubmission?.id === submission.id
                    ? 'border-primary'
                    : ''
                }`}
                onClick={() => setSelectedSubmission(submission)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <CardTitle
                      className="text-sm font-medium truncate"
                      title={submission.fileName}
                    >
                      {submission.fileName}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(submission);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSubmissionToDelete(submission.id);
                            setShowDeleteAlert(true);
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Result
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-500">
                    <span>Score: {submission.totalScore}</span>
                    {submission.totalPoints && (
                      <span className="ml-1">
                        (Points: {submission.totalPoints} -
                        <span
                          className={
                            calculatePercentage(
                              submission.totalScore,
                              submission.totalPoints
                            ) === 100
                              ? 'text-green-600 font-medium'
                              : ''
                          }
                        >
                          {calculatePercentage(
                            submission.totalScore,
                            submission.totalPoints
                          )}
                          %
                        </span>
                        )
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Submission Details */}
        <div className="col-span-12 lg:col-span-8">
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <h2
                    className="text-2xl font-bold truncate"
                    title={selectedSubmission.fileName}
                  >
                    {selectedSubmission.fileName}
                  </h2>
                </div>

                <Badge
                  variant={
                    calculatePercentage(
                      selectedSubmission.totalScore,
                      selectedSubmission.totalPoints
                    ) >= 70
                      ? 'default'
                      : 'destructive'
                  }
                  className={`flex-shrink-0 ${
                    calculatePercentage(
                      selectedSubmission.totalScore,
                      selectedSubmission.totalPoints
                    ) === 100
                      ? 'bg-green-500 hover:bg-green-600'
                      : ''
                  }`}
                >
                  {selectedSubmission.totalScore}
                  {selectedSubmission.totalPoints &&
                    ` / ${
                      selectedSubmission.totalPoints
                    } (${calculatePercentage(
                      selectedSubmission.totalScore,
                      selectedSubmission.totalPoints
                    )}%)`}
                </Badge>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Overall Feedback</h3>
                  <p className="text-gray-600">
                    {selectedSubmission.overallFeedback}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Detailed Results</h3>
                  <div className="space-y-4">
                    {selectedSubmission.results.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{result.question}</h4>
                          <Badge variant="secondary">{result.score}</Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{result.feedback}</p>
                        {result.mistakes.length > 0 && (
                          <div className="mt-2">
                            <h5 className="text-sm font-medium text-red-600 mb-1">
                              Mistakes Found:
                            </h5>
                            <ul className="list-disc list-inside text-sm text-red-600">
                              {result.mistakes.map((mistake, i) => (
                                <li key={i}>{mistake}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Result Alert Dialog */}
      <AlertDialog
        open={showDeleteAlert}
        onOpenChange={(open) => {
          setShowDeleteAlert(open);
          if (!open) setSubmissionToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this submission result. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (submissionToDelete) {
                  handleDeleteSubmissionResult(submissionToDelete);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Batch Alert Dialog */}
      <AlertDialog
        open={showDeleteBatchAlert}
        onOpenChange={setShowDeleteBatchAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entire Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this submission batch and all its
              results. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteEntireBatch}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
