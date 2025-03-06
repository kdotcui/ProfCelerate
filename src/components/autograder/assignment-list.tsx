import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Users,
  ExternalLink,
  Edit,
} from 'lucide-react';
import { Assignment } from '@/types/assignment';
import { formatDate } from '@/lib/utils';

interface AssignmentListProps {
  assignments: Assignment[];
  loading: boolean;
  classId: string;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  loading,
  classId,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col gap-4 w-full">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No assignments yet</h3>
        <p className="mt-1 text-gray-500">
          Get started by creating your first assignment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {assignments.map((assignment) => (
        <Card
          key={assignment.id}
          className="overflow-hidden flex flex-col h-full"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-medium">
                  {assignment.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {assignment.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created: {formatDate(assignment.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Updated: {formatDate(assignment.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t flex justify-between items-center bg-gray-50">
            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className="font-normal bg-blue-50"
                      >
                        {assignment.points} points
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Maximum points for this assignment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit assignment details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="default" size="sm" asChild>
                      <Link
                        to={`/dashboard/classes/${classId}/assignments/${assignment.id}`}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View assignment details and submissions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
