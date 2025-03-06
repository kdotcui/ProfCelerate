import { FC } from 'react';
import { ClassData, ClassStatus } from '@/types/class';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { FormEvent, useState, useEffect } from 'react';

interface EditClassDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classData: ClassData;
  onSave: (updatedClass: ClassData) => void;
}

const departmentOptions = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
];

const EditClassDialog: FC<EditClassDialogProps> = ({
  open,
  setOpen,
  classData,
  onSave,
}) => {
  const [formData, setFormData] = useState<Omit<ClassData, 'id' | 'students'>>({
    title: '',
    description: '',
    department: '',
    code: '',
    schedule: '',
    status: 'active' as ClassStatus,
    term: '',
  });

  useEffect(() => {
    if (classData) {
      const { id, students, ...rest } = classData;
      setFormData(rest);
    }
  }, [classData]);

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
    const updatedClass: ClassData = {
      ...classData,
      ...formData,
    };
    onSave(updatedClass);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Update the class details below.
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
                placeholder="Enter class description..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    handleSelectChange('department', value)
                  }
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
                  placeholder="MWF 10:00 AM"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassDialog;
