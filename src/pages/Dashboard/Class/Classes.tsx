import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PlusCircle, Calendar, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateClassDialog from './CreateClassDialog';
import { ClassData, ClassStatus } from '@/types/class';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import EditClassDialog from './EditClassDialog';
import PageHeader from '@/components/ui/PageHeader';

export default function Classes() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch classes from Supabase
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        console.log('data', data);
        setClasses(data || []);
      } catch (error: any) {
        console.error('Error fetching classes:', error);
        toast.error(error.message || 'Failed to load classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassUpdate = (updatedClass: ClassData) => {
    setClasses((prevClasses) =>
      prevClasses.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
  };

  const navigateToClass = (id: number) => {
    navigate(`/dashboard/classes/${id}`);
  };

  const getStatusBadge = (status: ClassStatus) => {
    if (status === 'active') {
      return <Badge className="bg-green-500">Active</Badge>;
    } else {
      return <Badge className="bg-gray-500">Inactive</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-muted-foreground">Loading classes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Classes', href: '/dashboard/classes', isCurrent: true },
        ]}
        actions={
          <CreateClassDialog
            open={open}
            setOpen={setOpen}
            onClassCreated={(newClass) => setClasses([newClass, ...classes])}
          />
        }
      />

      {classes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No classes yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first class to get started
          </p>
          <Button onClick={() => setOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Class
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card
              key={classItem.id}
              className="overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigateToClass(classItem.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">
                      {classItem.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {classItem.department} • {classItem.code}
                    </CardDescription>
                  </div>
                  {getStatusBadge(classItem.status)}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-gray-600 mb-4">
                  {classItem.description}
                </p>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{classItem.term}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedClass && (
        <EditClassDialog
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          classData={selectedClass}
          onClassUpdated={handleClassUpdate}
        />
      )}
    </div>
  );
}
