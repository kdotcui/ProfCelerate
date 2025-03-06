import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, FileText, Upload } from 'lucide-react';
import { Assignment } from '@/types/class';

interface AssignmentDetailsProps {
  assignment: Assignment;
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

export const AssignmentDetails: React.FC<AssignmentDetailsProps> = ({
  assignment,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2 rounded-full">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-gray-500">
                {formatDate(assignment.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-full">
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Points</p>
              <p className="text-sm text-gray-500">
                {assignment.points} points possible
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Grading Criteria</h3>
          <div className="prose max-w-none">
            <p>{assignment.description}</p>
            <p>
              This assignment requires students to implement a binary search
              tree (BST) data structure and perform various operations on it.
              The implementation should include the following functionalities:
            </p>
            <ul>
              <li>Insert a value into the BST</li>
              <li>Delete a value from the BST</li>
              <li>Search for a value in the BST</li>
              <li>Perform traversals (in-order, pre-order, post-order)</li>
              <li>Find the height of the BST</li>
              <li>Check if the BST is balanced</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">File Requirements</h3>
          <div className="flex items-start gap-2">
            <Upload className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">
                {assignment.type === 'voice' ? 'Audio' : 'PDF'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
