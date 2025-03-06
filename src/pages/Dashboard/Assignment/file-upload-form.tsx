import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FileText,
  UploadCloud,
  XCircle,
  RefreshCw,
  Info,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadFormProps {
  acceptedFileTypes: string[];
  onClose: () => void;
  onSubmit: (files: File[], batchName: string) => void;
  gradingCriteria?: string;
}

export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  acceptedFileTypes = [],
  onClose,
  onSubmit,
  gradingCriteria,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [batchName, setBatchName] = useState<string>('');
  const [processingSubmission, setProcessingSubmission] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateFileType = (file: File): boolean => {
    if (acceptedFileTypes.includes('audio/*')) {
      return file.type.startsWith('audio/');
    }
    if (acceptedFileTypes.includes('application/pdf')) {
      return file.type === 'application/pdf';
    }
    return false;
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      const validFiles = newFiles.filter(validateFileType);
      const invalidFiles = newFiles.filter((file) => !validateFileType(file));

      if (invalidFiles.length > 0) {
        setError(
          `Some files were not added because they are not supported. Supported types: ${acceptedFileTypes.join(
            ', '
          )}`
        );
      }

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(validateFileType);
      const invalidFiles = newFiles.filter((file) => !validateFileType(file));

      if (invalidFiles.length > 0) {
        setError(
          `Some files were not added because they are not supported. Supported types: ${acceptedFileTypes.join(
            ', '
          )}`
        );
      }

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const removeFile = (index: number): void => {
    setSelectedFiles((files) => files.filter((_, i) => i !== index));
    setError(null);
  };

  const handleSubmit = (): void => {
    if (!gradingCriteria?.trim()) {
      toast.error('Please set grading criteria before uploading files');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setProcessingSubmission(true);
    setError(null);

    // Simulate API call delay
    setTimeout(() => {
      onSubmit(selectedFiles, batchName);
      setProcessingSubmission(false);
    }, 1000);
  };

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Student Submissions</DialogTitle>
          <DialogDescription>
            Upload student submissions for AI-powered automatic grading.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batch-name">Batch Name</Label>
            <Input
              id="batch-name"
              placeholder="E.g., Section A Submissions"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Drag and drop student submissions here, or click to select files
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Accepted file types: {acceptedFileTypes.join(', ')}
              </p>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
                accept={acceptedFileTypes.join(',')}
              />
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={handleSelectFiles}
              >
                Select Files
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 text-sm font-medium">
                Selected Files ({selectedFiles.length})
              </div>
              <div className="divide-y max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(index)}
                    >
                      <XCircle className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700">
                  For best results, ensure student files follow a consistent
                  naming format.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={processingSubmission}
          >
            Cancel
          </Button>
          <Button
            disabled={selectedFiles.length === 0 || processingSubmission}
            onClick={handleSubmit}
          >
            {processingSubmission ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Upload & Start Grading'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
