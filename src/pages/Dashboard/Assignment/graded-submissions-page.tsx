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
import { ChevronLeft, FileText, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { transformToCamelCase } from '@/lib/caseConversion';

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
  isBase64: boolean;
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

  const handleDownload = (
    fileContent: string,
    fileName: string,
    isBase64: boolean
  ) => {
    try {
      let content: string | Uint8Array;
      let type: string;

      if (isBase64) {
        // For base64 content (PDFs, images, etc.)
        // Remove the data URL prefix if present
        const base64Data = fileContent.split(',')[1] || fileContent;
        // Convert base64 to Uint8Array for binary data
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        content = bytes;
        type = 'application/pdf'; // Set the correct MIME type for PDFs
      } else {
        // For text content
        content = fileContent;
        type = 'text/plain';
      }

      // Create a blob from the content
      const blob = new Blob([content], { type });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      // Append to body, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
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
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Submission List */}
        <div className="col-span-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Submissions</h2>
            <Badge variant="secondary">
              {submissions.length}{' '}
              {submissions.length === 1 ? 'submission' : 'submissions'}
            </Badge>
          </div>
          <div className="space-y-2">
            {submissions.map((submission) => (
              <Button
                key={submission.id}
                variant={
                  selectedSubmission?.id === submission.id
                    ? 'default'
                    : 'outline'
                }
                className="w-full justify-start gap-2 py-6"
                onClick={() => setSelectedSubmission(submission)}
              >
                <FileText className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {submission.fileName}
                  </span>
                  <span className="text-xs text-gray-500">
                    Score: {submission.totalScore}
                    {submission.totalPoints &&
                      ` / ${submission.totalPoints} (${calculatePercentage(
                        submission.totalScore,
                        submission.totalPoints
                      )}%)`}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Submission Details */}
        <div className="col-span-8">
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">
                    {selectedSubmission.fileName}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() =>
                      handleDownload(
                        selectedSubmission.fileContent,
                        selectedSubmission.fileName,
                        selectedSubmission.isBase64
                      )
                    }
                  >
                    <Download className="h-4 w-4" />
                    Download Original
                  </Button>
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
                >
                  Score: {selectedSubmission.totalScore}
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
                          <Badge
                            variant={
                              calculatePercentage(
                                result.score,
                                selectedSubmission.totalPoints
                              ) >= 70
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {result.score}
                            {selectedSubmission.totalPoints &&
                              ` / ${
                                selectedSubmission.totalPoints
                              } (${calculatePercentage(
                                result.score,
                                selectedSubmission.totalPoints
                              )}%)`}
                          </Badge>
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
    </div>
  );
};
