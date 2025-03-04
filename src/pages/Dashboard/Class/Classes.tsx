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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Define types
type ClassStatus = 'active' | 'pending' | 'inactive';
type Department =
  | 'Computer Science'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Engineering'
  | 'Language'
  | string;

interface ClassData {
  id: number;
  title: string;
  description: string;
  department: Department | string;
  code: string;
  students: number;
  schedule: string;
  status: ClassStatus;
}

interface ClassFormData {
  title: string;
  description: string;
  department: Department | string;
  code: string;
  schedule: string;
  status: ClassStatus;
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
    status: 'pending',
  },
];

const departmentOptions: Department[] = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Language',
];

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>(mockClasses);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<ClassFormData>({
    title: '',
    description: '',
    department: '',
    code: '',
    schedule: '',
    status: 'pending',
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newClass: ClassData = {
      id: classes.length + 1,
      ...formData,
      students: 0,
    };
    setClasses([...classes, newClass]);
    setFormData({
      title: '',
      description: '',
      department: '',
      code: '',
      schedule: '',
      status: 'pending',
    });
    setOpen(false);
  };

  const navigate = useNavigate();

  const navigateToClass = (id: number) => {
    navigate(`/dashboard/classes/${id}`);
  };

  const getStatusBadge = (status: ClassStatus) => {
    if (status === 'active') {
      return <Badge className="bg-green-500">Active</Badge>;
    } else if (status === 'pending') {
      return <Badge className="bg-yellow-500">Pending</Badge>;
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new class.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="title">Class Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Introduction to..."
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="code">Class Code</Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="CS101"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a brief description of the class..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange('department', value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="schedule">Schedule</Label>
                    <Input
                      id="schedule"
                      name="schedule"
                      value={formData.schedule}
                      onChange={handleInputChange}
                      placeholder="Mon, Wed, Fri 10:00 AM"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    defaultValue="pending"
                    onValueChange={(value) =>
                      handleSelectChange('status', value as ClassStatus)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Class</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card
            key={classItem.id}
            className="overflow-hidden flex flex-col h-full"
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
                  <Users className="h-4 w-4" />
                  <span>{classItem.students} students enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{classItem.schedule}</span>
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
                      onClick={() => navigateToClass(classItem.id)}
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
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Class</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <AlertDialog>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Class</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the class and remove all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Classes;
