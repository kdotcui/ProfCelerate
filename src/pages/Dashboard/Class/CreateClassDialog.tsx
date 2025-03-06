import { FC } from 'react';
import { PlusCircle } from 'lucide-react';
import { ClassData, ClassStatus } from '@/types/class';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormEvent, useState } from 'react';

interface CreateClassDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classes: ClassData[];
  setClasses: (classes: ClassData[]) => void;
}

const departmentOptions = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
];

const CreateClassDialog: FC<CreateClassDialogProps> = ({
  open,
  setOpen,
  classes,
  setClasses,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    code: '',
    schedule: '',
    status: 'active' as ClassStatus,
    term: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      status: 'active',
      term: '',
    });
    setOpen(false);
  };

  return (
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
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  defaultValue="active"
                  onValueChange={(value) =>
                    handleSelectChange('status', value as ClassStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="term">Term</Label>
                <Input
                  id="term"
                  name="term"
                  value={formData.term}
                  onChange={handleInputChange}
                  placeholder="Spring 2025"
                />
              </div>
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
  );
};

export default CreateClassDialog;
