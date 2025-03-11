import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Assignment, AssignmentType } from '@/types/assignment';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  transformToSnakeCase,
  transformToCamelCase,
} from '@/lib/caseConversion';

interface EditAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: Assignment;
  onAssignmentUpdated: (assignment: Assignment) => void;
}

export const EditAssignmentDialog: React.FC<EditAssignmentDialogProps> = ({
  open,
  onOpenChange,
  assignment,
  onAssignmentUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    points: number;
    type: AssignmentType;
    classId: number;
  }>({
    title: '',
    description: '',
    points: 100,
    type: 'pdf',
    classId: 0,
  });

  // Initialize form data when dialog opens
  useEffect(() => {
    if (open && assignment) {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        points: assignment.points,
        type: assignment.type,
        classId: assignment.classId,
      });
    }
  }, [open, assignment]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    }
  };

  const handleSelectChange = (value: AssignmentType) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Transform form data to snake_case before sending to Supabase
      const transformedData = transformToSnakeCase({
        ...formData,
        updated_at: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from('assignments')
        .update(transformedData)
        .eq('id', assignment.id)
        .select()
        .single();

      if (error) throw error;

      // Transform the response to camelCase before passing to parent
      const transformedResponse = transformToCamelCase(data) as Assignment;
      onAssignmentUpdated(transformedResponse);
      onOpenChange(false);
      toast.success('Assignment updated successfully');
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      toast.error(error.message || 'Failed to update assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>Update the assignment details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title of the assignment"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the assignment, objectives, and requirements..."
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  name="points"
                  type="number"
                  min="1"
                  value={formData.points}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Assignment Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    {/* <SelectItem value="voice">Voice</SelectItem> */}
                    <SelectItem value="quiz-json">Quiz JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Assignment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
