import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { AssignmentList } from './assignment-list';
import { CreateAssignmentDialog } from './create-assignment-dialog';
import { fetchAssignments } from '@/lib/api/classes'; // Mock API

import { Assignment } from '@/types/class';

interface AutograderDashboardProps {
  classId: string;
}

export const AutograderDashboard: React.FC<AutograderDashboardProps> = ({
  classId,
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      try {
        const data = await fetchAssignments(classId);
        setAssignments(data);
      } catch (error) {
        console.error('Failed to load assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, [classId, refreshTrigger]);

  const handleCreateAssignment = async (
    newAssignment: Omit<Assignment, 'id'>
  ) => {
    // In a real app, this would make an API call to create the assignment
    // For now, we'll simulate adding it to our local data
    const mockId = Math.floor(Math.random() * 10000).toString();
    const assignmentWithId: Assignment = {
      id: mockId,
      ...newAssignment,
      submissions: 0,
      createdAt: new Date().toISOString(),
    };

    setAssignments((prev) => [...prev, assignmentWithId]);
    setCreateDialogOpen(false);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Autograder</CardTitle>
              <CardDescription>
                Create and manage automatically graded assignments
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                />
              </Button>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Create Assignment
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AssignmentList
            assignments={assignments}
            loading={loading}
            classId={classId}
          />
        </CardContent>
      </Card>

      <CreateAssignmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateAssignment}
      />
    </>
  );
};
