import React from 'react';
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

interface SubmissionSectionProps {
  submissions: SubmissionBatch[];
  onUpload: () => void;
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
}) => {
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Submission Batches</CardTitle>
            <CardDescription>
              Manage uploaded submission batches
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2" onClick={onUpload}>
            <FileUp className="h-4 w-4" />
            New Batch
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-sm font-medium">
            <div className="col-span-4">Batch Name</div>
            <div className="col-span-3">Uploaded</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Files</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y">
            {submissions.map((batch) => (
              <div
                key={batch.id}
                className="grid grid-cols-12 px-4 py-3 items-center hover:bg-gray-50"
              >
                <div className="col-span-4 font-medium">{batch.name}</div>
                <div className="col-span-3 text-sm text-gray-500">
                  {formatDate(batch.uploadedAt)}
                </div>
                <div className="col-span-2">
                  {batch.status === 'completed' && (
                    <Badge className="bg-green-500 flex items-center w-fit gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                  {batch.status === 'grading' && (
                    <Badge className="bg-blue-500 flex items-center w-fit gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Grading
                    </Badge>
                  )}
                  {batch.status === 'failed' && (
                    <Badge className="bg-red-500 flex items-center w-fit gap-1">
                      <XCircle className="h-3 w-3" />
                      Failed
                    </Badge>
                  )}
                </div>
                <div className="col-span-2 text-sm">
                  <span className="font-medium">{batch.gradedCount}</span>/
                  {batch.fileCount} graded
                </div>
                <div className="col-span-1 flex justify-end gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Submissions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download Results</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
