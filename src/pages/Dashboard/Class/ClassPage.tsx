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

export default function ClassPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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
    if (
      !classData ||
      !window.confirm('Are you sure you want to delete this class?')
    )
      return;

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classData.id);

      if (error) throw error;
      toast.success('Class deleted successfully');
      navigate('/dashboard/classes');
    } catch (error: any) {
      console.error('Error deleting class:', error);
      toast.error(error.message || 'Failed to delete class');
    }
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
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink to="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to="/dashboard/classes">Classes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to={`/dashboard/classes/${id}`}>
              {classData.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate(`/dashboard/classes/${id}/assignments/new`)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Assignment
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
                {classData.status === 'active' ? 'Deactivate' : 'Activate'}{' '}
                Class
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleDeleteClass}
              >
                Delete Class
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Class Info Card */}
        <ClassHeader classData={classData} />

        {/* Assignments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first assignment to get started
                </p>
                <Button
                  onClick={() =>
                    navigate(`/dashboard/classes/${id}/assignments/new`)
                  }
                >
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
                        <div>
                          <CardTitle>{assignment.title}</CardTitle>
                          <CardDescription>
                            {assignment.description}
                          </CardDescription>
                        </div>
                        <Badge>{assignment.type}</Badge>
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
    </div>
  );
}
