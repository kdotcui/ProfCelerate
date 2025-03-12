import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  BadgeCheck,
  BookOpen,
  Users,
  Settings,
  GraduationCap,
  Calendar,
  Clock,
  FileText,
  MoreVertical,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ClassData } from '@/types/class';
import { Assignment } from '@/types/assignment';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import EditClassDialog from './EditClassDialog';
import { ClassHeader } from '@/components/class/class-header';
import { CreateAssignmentDialog } from '@/components/autograder/create-assignment-dialog';
import { deleteClass } from '@/lib/deleteOperations';
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
import PageHeader from '@/components/ui/PageHeader';

export default function ClassPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createAssignmentDialogOpen, setCreateAssignmentDialogOpen] =
    useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        // Fetch class details
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', id)
          .single();

        if (classError) throw classError;
        if (!classData) throw new Error('Class not found');

        setClassData(classData);
        console.log('classData', classData);
        // Fetch assignments for this class
        const { data: assignmentsData, error: assignmentsError } =
          await supabase
            .from('assignments')
            .select('*')
            .eq('class_id', id)
            .order('created_at', { ascending: false });

        if (assignmentsError) throw assignmentsError;
        setAssignments(assignmentsData || []);
      } catch (error: any) {
        console.error('Error fetching class data:', error);
        toast.error(error.message || 'Failed to load class data');
        if (error.message === 'Class not found') {
          navigate('/dashboard/classes');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id, navigate]);

  const handleClassUpdate = (updatedClass: ClassData) => {
    setClassData(updatedClass);
    toast.success('Class updated successfully');
  };

  const handleStatusToggle = async () => {
    if (!classData) return;

    try {
      const newStatus = classData.status === 'active' ? 'inactive' : 'active';
      const { data, error } = await supabase
        .from('classes')
        .update({ status: newStatus })
        .eq('id', classData.id)
        .select()
        .single();

      if (error) throw error;
      setClassData(data);
      toast.success(
        `Class ${
          newStatus === 'active' ? 'activated' : 'deactivated'
        } successfully`
      );
    } catch (error: any) {
      console.error('Error updating class status:', error);
      toast.error(error.message || 'Failed to update class status');
    }
  };

  const handleDeleteClass = async () => {
    if (!classData) return;

    try {
      await deleteClass(classData.id);
      toast.success('Class deleted successfully');
      setShowDeleteAlert(false);
      navigate('/dashboard/classes');
    } catch (error: any) {
      console.error('Error deleting class:', error);
      toast.error(error.message || 'Failed to delete class');
    }
  };

  const handleAssignmentCreated = (assignment: Assignment) => {
    setAssignments((prev) => [...prev, assignment]);
    toast.success('Assignment created successfully');
  };

  if (loading) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-muted-foreground">Loading class details...</div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Classes', href: '/dashboard/classes' },
          {
            label: classData.title,
            href: `/dashboard/classes/${id}`,
            isCurrent: true,
          },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCreateAssignmentDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Class
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleStatusToggle}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {classData.status === 'active'
                    ? 'Deactivate'
                    : 'Activate'}{' '}
                  Class
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteAlert(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Class
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <div className="grid gap-6">
        {/* Class Info Card */}
        <ClassHeader classData={classData} />

        {/* Assignments Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assignments</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateAssignmentDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Assignment
            </Button>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first assignment to get started
                </p>
                <Button onClick={() => setCreateAssignmentDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <Card
                    key={assignment.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div
                          className="flex-1"
                          onClick={() =>
                            navigate(
                              `/dashboard/classes/${id}/assignments/${assignment.id}`
                            )
                          }
                        >
                          <CardTitle>{assignment.title}</CardTitle>
                          <CardDescription>
                            {assignment.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{assignment.type}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Points: {assignment.points}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <EditClassDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        classData={classData}
        onClassUpdated={handleClassUpdate}
      />

      <CreateAssignmentDialog
        open={createAssignmentDialogOpen}
        onOpenChange={setCreateAssignmentDialogOpen}
        classId={id!}
        onAssignmentCreated={handleAssignmentCreated}
      />

      {/* Delete Alert Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this class and all its assignments,
              submissions, and results. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteClass}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
