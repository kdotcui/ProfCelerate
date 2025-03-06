import React, { useState, FormEvent, ChangeEvent, use } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  PlusCircle,
  Pencil,
  Trash2,
  Users,
  Calendar,
  BookOpen,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import CreateClassDialog from './CreateClassDialog';
import EditClassDialog from './EditClassDialog';
import { ClassData, ClassStatus } from '@/types/class';
// Define types

type Department =
  | 'Language'
  | 'Computer Science'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Engineering'
  | string;

interface ClassFormData {
  title: string;
  description: string;
  department: Department | string;
  code: string;
  schedule: string;
  status: ClassStatus;
  term: string;
}

// Mock data for classes
const mockClasses: ClassData[] = [
  {
    id: 1,
    title: 'Advanced Intermediate Chinese',
    description: 'Advanced Chinese language course for intermediate learners',
    department: 'Language',
    code: 'CHIN40B',
    students: 32,
    schedule: 'Mon, Wed, Fri 10:00 AM - 11:30 AM',
    term: 'Spring 2025',
    status: 'active',
  },
  {
    id: 2,
    title: 'Advanced Data Structures',
    description: 'In-depth study of data structures and algorithms',
    department: 'Computer Science',
    code: 'CS301',
    students: 24,
    schedule: 'Tue, Thu 1:00 PM - 3:00 PM',
    term: 'Spring 2025',
    status: 'active',
  },
  {
    id: 3,
    title: 'Organic Chemistry',
    description:
      'Study of structure, properties, and reactions of organic compounds',
    department: 'Chemistry',
    code: 'CHEM240',
    students: 45,
    schedule: 'Mon, Wed 9:00 AM - 10:30 AM',
    term: 'Spring 2025',
    status: 'active',
  },
  {
    id: 4,
    title: 'Calculus II',
    description: 'Integration techniques, sequences, and series',
    department: 'Mathematics',
    code: 'MATH172',
    students: 36,
    schedule: 'Mon, Wed, Fri 1:00 PM - 2:00 PM',
    term: 'Spring 2025',
    status: 'active',
  },
];

const departmentOptions: Department[] = [
  'Language',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
];

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>(mockClasses);
  const [open, setOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [formData, setFormData] = useState<ClassFormData>({
    title: '',
    description: '',
    department: '',
    code: '',
    schedule: '',
    status: 'active',
    term: 'Spring 2025',
  });

  const handleEditClass = (updatedClass: ClassData) => {
    setClasses(
      classes.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
  };

  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink to="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to="/dashboard/classes">Classes</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <CreateClassDialog
          open={open}
          setOpen={setOpen}
          classes={classes}
          setClasses={setClasses}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card
            key={classItem.id}
            className="overflow-hidden flex flex-col h-full cursor-pointer"
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
            <CardFooter className="border-t p-4 bg-gray-50 flex justify-end space-x-2 mt-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToClass(classItem.id);
                      }}
                    >
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Class</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClass(classItem);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Class</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedClass && (
        <EditClassDialog
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          classData={selectedClass as ClassData}
          onSave={handleEditClass}
        />
      )}
    </div>
  );
};

export default Classes;
