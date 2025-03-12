import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { PlusCircle } from 'lucide-react';
import { ClassData } from '@/types/class';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CreateClassDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClassCreated: (newClass: ClassData) => void;
}

const departmentOptions = [
  'Language',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
] as const;

// Zod schema for form validation
const createClassSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  department: z.enum(departmentOptions, {
    required_error: 'Please select a department',
  }),
  code: z
    .string()
    .min(2, 'Class code must be at least 2 characters')
    .max(10, 'Class code must be less than 10 characters')
    .regex(/^[A-Z0-9]+$/i, 'Class code must be alphanumeric')
    .trim(),
  schedule: z.string().min(1, 'Schedule is required').trim(),
  term: z.string().min(1, 'Term is required').trim(),
});

type FormData = z.infer<typeof createClassSchema>;

export default function CreateClassDialog({
  open,
  setOpen,
  onClassCreated,
}: CreateClassDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      title: '',
      description: '',
      department: undefined,
      code: '',
      schedule: '',
      term: 'Spring 2025',
    },
  });

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('classes')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            department: formData.department,
            code: formData.code.toUpperCase(),
            schedule: formData.schedule,
            term: formData.term,
            user_id: user.id,
            status: 'active',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      onClassCreated(data);
      toast.success('Class created successfully!');
      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.error('Error creating class:', error);
      toast.error(error.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create Class
      </Button>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            form.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogDescription>
              Add a new class to your teaching schedule
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Class Title</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Enter class title"
                className={form.formState.errors.title ? 'border-red-500' : ''}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Enter class description"
                className={
                  form.formState.errors.description ? 'border-red-500' : ''
                }
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={form.watch('department')}
                  onValueChange={(value) =>
                    form.setValue('department', value as any)
                  }
                >
                  <SelectTrigger
                    className={
                      form.formState.errors.department ? 'border-red-500' : ''
                    }
                  >
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
                {form.formState.errors.department && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.department.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Class Code</Label>
                <Input
                  id="code"
                  {...form.register('code')}
                  placeholder="e.g., CS101"
                  className={form.formState.errors.code ? 'border-red-500' : ''}
                />
                {form.formState.errors.code && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.code.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Input
                  id="schedule"
                  {...form.register('schedule')}
                  placeholder="e.g., Mon, Wed 2-3:30 PM"
                  className={
                    form.formState.errors.schedule ? 'border-red-500' : ''
                  }
                />
                {form.formState.errors.schedule && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.schedule.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="term">Term</Label>
                <Input
                  id="term"
                  {...form.register('term')}
                  placeholder="e.g., Spring 2025"
                  className={form.formState.errors.term ? 'border-red-500' : ''}
                />
                {form.formState.errors.term && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.term.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Class'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
