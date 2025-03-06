import React, { useState } from 'react';
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
import { FileText, UploadCloud, XCircle, RefreshCw, Info } from 'lucide-react';

interface FileUploadFormProps {
  acceptedFileTypes: string[];
  onClose: () => void;
  onSubmit: (files: File[], batchName: string) => void;
}

export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  acceptedFileTypes = [],
  onClose,
  onSubmit,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [batchName, setBatchName] = useState<string>('');
  const [processingSubmission, setProcessingSubmission] =
    useState<boolean>(false);

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number): void => {
    setSelectedFiles((files) => files.filter((_, i) => i !== index));
  };

  const handleSubmit = (): void => {
    setProcessingSubmission(true);

    // Simulate API call delay
    setTimeout(() => {
      onSubmit(selectedFiles, batchName);
      setProcessingSubmission(false);
    }, 1000);
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
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
                accept={acceptedFileTypes.join(',')}
              />
              <Label htmlFor="file-upload" asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Select Files
                </Button>
              </Label>
            </div>
          </div>

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
