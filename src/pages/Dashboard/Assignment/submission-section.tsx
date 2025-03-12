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
import { FileUp, UploadCloud, MoreVertical, Trash2, Eye } from 'lucide-react';
import { SubmissionBatch } from './assignment-page';
import { FileUploadForm } from './file-upload-form';
import { GradedSubmissions } from './graded-submissions';
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
import { deleteSubmissionBatch } from '@/lib/deleteOperations';
import { toast } from 'sonner';

interface SubmissionSectionProps {
  submissions: SubmissionBatch[];
  onUpload: () => void;
  classId: string;
  assignmentId: string;
  onSubmissionDeleted: (submissionId: string) => void;
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

export function SubmissionSection({
  submissions,
  onUpload,
  classId,
  assignmentId,
  onSubmissionDeleted,
}: SubmissionSectionProps) {
  const navigate = useNavigate();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(
    null
  );

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      await deleteSubmissionBatch(submissionId);
      toast.success('Submission deleted successfully');
      onSubmissionDeleted(submissionId);
      setShowDeleteAlert(false);
      setSubmissionToDelete(null);
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      toast.error(error.message || 'Failed to delete submission');
    }
  };

  const handleViewSubmission = (submissionId: string) => {
    navigate(
      `/dashboard/classes/${classId}/assignments/${assignmentId}/submissions/${submissionId}`
    );
  };

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
          <Card
            key={submission.id}
            className="hover:shadow-sm transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-4">
                <CardTitle className="text-sm font-medium">
                  {submission.name}
                </CardTitle>
                <Badge
                  variant={
                    submission.status === 'completed'
                      ? 'default'
                      : submission.status === 'grading'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {submission.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {submission.status === 'completed' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewSubmission(submission.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View Results</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {submission.status === 'completed' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleViewSubmission(submission.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Results
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        setSubmissionToDelete(submission.id);
                        setShowDeleteAlert(true);
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Submission
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div>Uploaded: {formatDate(submission.uploadedAt)}</div>
                <div>Files: {submission.fileCount}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={showDeleteAlert}
        onOpenChange={(open) => {
          setShowDeleteAlert(open);
          if (!open) setSubmissionToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this submission and all its results.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (submissionToDelete) {
                  handleDeleteSubmission(submissionToDelete);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
