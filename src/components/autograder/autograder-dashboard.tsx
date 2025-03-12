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
import { RefreshCw } from 'lucide-react';
import { AssignmentList } from './assignment-list';
import { Assignment } from '@/types/assignment';

interface AutograderDashboardProps {
  classId: string;
}

export const AutograderDashboard: React.FC<AutograderDashboardProps> = ({
  classId,
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      try {
        // const data = await fetchAssignments(classId);
        // setAssignments(data);
      } catch (error) {
        console.error('Failed to load assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, [classId, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Autograder</CardTitle>
            <CardDescription className="mt-1">
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
  );
};
