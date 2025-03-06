import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CheckCircle,
  RefreshCw,
  XCircle,
  Eye,
  Download,
  FileUp,
  UploadCloud,
} from 'lucide-react';
import { SubmissionBatch } from './assignment-page';
import { FileUploadForm } from './file-upload-form';
import { GradedSubmissions } from './graded-submissions';

interface SubmissionSectionProps {
  submissions: SubmissionBatch[];
  onUpload: () => void;
  classId: string;
  assignmentId: string;
}

// Format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

export const SubmissionSection: React.FC<SubmissionSectionProps> = ({
  submissions,
  onUpload,
  classId,
  assignmentId,
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  if (submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            Upload student submissions for grading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No submissions yet</h3>
            <p className="mt-1 text-gray-500">
              Upload files to start AI-powered grading
            </p>
            <Button variant="outline" className="mt-4" onClick={onUpload}>
              Upload Files
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Submissions</h2>
        <Button onClick={onUpload} className="flex items-center gap-2">
          <FileUp className="h-4 w-4" />
          Upload Files
        </Button>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{submission.name}</h3>
                <p className="text-sm text-gray-500">
                  {submission.fileCount}{' '}
                  {submission.fileCount === 1 ? 'file' : 'files'} •{' '}
                  {new Date(submission.uploadedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    submission.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : submission.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {submission.status.charAt(0).toUpperCase() +
                    submission.status.slice(1)}
                </span>
                {submission.status === 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/dashboard/classes/${classId}/assignments/${assignmentId}/submissions/${submission.id}`
                      )
                    }
                  >
                    View Results
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedSubmission && (
        <div className="mt-8">
          <GradedSubmissions submissionId={selectedSubmission} />
        </div>
      )}
    </div>
  );
};
