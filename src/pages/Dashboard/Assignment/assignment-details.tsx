import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, FileText, Upload, Pencil } from 'lucide-react';
import { Assignment } from '@/types/assignment';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  transformToSnakeCase,
  transformToCamelCase,
} from '@/lib/caseConversion';

interface AssignmentDetailsProps {
  assignment: Assignment;
  onAssignmentUpdated?: (assignment: Assignment) => void;
}

// Format dates
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) {
    return 'Not available';
  }
  console.log('dateString', dateString);
  try {
    // Parse the ISO date string and handle timezone offset
    const date = new Date(dateString.replace('+00:00', 'Z'));
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Invalid date';
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error, 'Date string:', dateString);
    return 'Invalid date';
  }
};

interface EditGradingCriteriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: Assignment;
  onAssignmentUpdated: (assignment: Assignment) => void;
}

const EditGradingCriteriaDialog: React.FC<EditGradingCriteriaDialogProps> = ({
  open,
  onOpenChange,
  assignment,
  onAssignmentUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [gradingCriteria, setGradingCriteria] = useState(
    assignment.gradingCriteria
  );
  const [activeTab, setActiveTab] = useState<'editor' | 'help'>('editor');
  const [helpSection, setHelpSection] = useState<
    'guidelines' | 'example' | 'practices'
  >('guidelines');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transformedData = transformToSnakeCase({
        grading_criteria: gradingCriteria,
        updated_at: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from('assignments')
        .update(transformedData)
        .eq('id', assignment.id)
        .select()
        .single();

      if (error) throw error;

      const transformedResponse = transformToCamelCase(data) as Assignment;
      onAssignmentUpdated(transformedResponse);
      onOpenChange(false);
      toast.success('Grading criteria updated successfully');
    } catch (error: any) {
      console.error('Error updating grading criteria:', error);
      toast.error(error.message || 'Failed to update grading criteria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] h-[85vh] overflow-hidden p-0">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Edit Grading Criteria</DialogTitle>
            <DialogDescription className="text-sm">
              Define how the assignment will be graded by the AI system.
            </DialogDescription>
          </DialogHeader>

          <div className="flex border-b">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'editor'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('editor')}
            >
              Criteria Editor
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'help'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('help')}
            >
              Guidelines & Examples
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'editor' ? (
              <div className="p-6">
                <Label
                  htmlFor="gradingCriteria"
                  className="text-sm font-medium"
                >
                  Grading Criteria
                </Label>
                <Textarea
                  id="gradingCriteria"
                  value={gradingCriteria}
                  onChange={(e) => setGradingCriteria(e.target.value)}
                  placeholder="Describe how the assignment will be graded..."
                  required
                  className="mt-2 min-h-[350px] resize-none"
                />
              </div>
            ) : (
              <div className="p-6">
                <div className="flex space-x-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setHelpSection('guidelines')}
                    className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
                      helpSection === 'guidelines'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    Guidelines
                  </button>
                  <button
                    type="button"
                    onClick={() => setHelpSection('example')}
                    className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
                      helpSection === 'example'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    Example
                  </button>
                  <button
                    type="button"
                    onClick={() => setHelpSection('practices')}
                    className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
                      helpSection === 'practices'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    Best Practices
                  </button>
                </div>

                {helpSection === 'guidelines' && (
                  <div className="bg-card rounded-lg border shadow-sm p-4 overflow-auto max-h-[400px]">
                    <h3 className="text-base font-medium mb-3 sticky top-0 bg-card pt-1 pb-2 border-b z-10">
                      AI-Based Grading Guidelines
                    </h3>

                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <span className="font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            Structure your rubric with clear point allocations
                          </h4>
                          <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>
                                Format each question with point value in
                                brackets [X points]
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>
                                Define criteria for full, partial, and no credit
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <span className="font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            Specify evaluation standards
                          </h4>
                          <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>Clearly define correct answers</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>Detail mistakes and point deductions</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <span className="font-semibold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            Our AI will provide
                          </h4>
                          <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>Precise identification of errors</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>
                                Transparent point allocation with justification
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {helpSection === 'example' && (
                  <div className="bg-card rounded-lg border shadow-sm p-4 overflow-auto max-h-[420px]">
                    <h3 className="text-base font-medium mb-3 sticky top-0 bg-card pt-1 pb-2 border-b z-10">
                      Example Rubric
                    </h3>

                    <div className="bg-muted/30 rounded-md p-3 border">
                      <div className="font-medium text-sm mb-2">
                        Question 1: Define polymorphism [10 points]
                      </div>
                      <div className="pl-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="min-w-[80px] text-sm font-medium text-green-600">
                            Full [10]:
                          </div>
                          <div className="text-xs">
                            Correct definition with 2+ examples
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="min-w-[80px] text-sm font-medium text-amber-600">
                            Partial [7]:
                          </div>
                          <div className="text-xs">
                            Correct definition, one example
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="min-w-[80px] text-sm font-medium text-amber-600">
                            Partial [5]:
                          </div>
                          <div className="text-xs">
                            Basic understanding shown
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="min-w-[80px] text-sm font-medium text-amber-600">
                            Partial [3]:
                          </div>
                          <div className="text-xs">
                            Attempts with misconceptions
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="min-w-[80px] text-sm font-medium text-red-600">
                            No credit [0]:
                          </div>
                          <div className="text-xs">Incorrect or no answer</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-md p-3 border mt-3">
                      <div className="font-medium text-sm mb-2">
                        Question 2: Write a function to find max value [15
                        points]
                      </div>
                      <div className="pl-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="min-w-[80px] text-sm font-medium text-green-600">
                            Full [15]:
                          </div>
                          <div className="text-xs">
                            Works for all inputs including edge cases
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="min-w-[80px] text-sm font-medium text-amber-600">
                            Deduct [3]:
                          </div>
                          <div className="text-xs">
                            Fails on edge cases but works for standard inputs
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="min-w-[80px] text-sm font-medium text-amber-600">
                            Deduct [5]:
                          </div>
                          <div className="text-xs">Minor logical errors</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {helpSection === 'practices' && (
                  <div className="bg-card rounded-lg border shadow-sm p-4 overflow-auto max-h-[400px]">
                    <h3 className="text-base font-medium mb-3 sticky top-0 bg-card pt-1 pb-2 border-b z-10">
                      Best Practices
                    </h3>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-muted/30 rounded-md p-3 border">
                        <div className="font-medium text-sm mb-1 text-primary">
                          Clear Point Structure
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Break down points for each category with specific
                          allocations for different levels of performance.
                        </p>
                      </div>

                      <div className="bg-muted/30 rounded-md p-3 border">
                        <div className="font-medium text-sm mb-1 text-primary">
                          Specific Requirements
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Define exactly what students need to demonstrate for
                          each score level.
                        </p>
                      </div>

                      <div className="bg-muted/30 rounded-md p-3 border">
                        <div className="font-medium text-sm mb-1 text-primary">
                          Quality Examples
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Include examples of what constitutes quality work to
                          guide the AI grader.
                        </p>
                      </div>

                      <div className="bg-muted/30 rounded-md p-3 border">
                        <div className="font-medium text-sm mb-1 text-primary">
                          Partial Credit
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Consider scenarios where partial credit should be
                          awarded and specify the criteria.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} size="sm">
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AssignmentDetails: React.FC<AssignmentDetailsProps> = ({
  assignment,
  onAssignmentUpdated,
}) => {
  const [showEditGradingCriteria, setShowEditGradingCriteria] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Assignment Details</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditGradingCriteria(true)}
              className="flex items-center gap-2 text-sm"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Criteria
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 p-2 rounded-full">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-gray-500">
                  {formatDate(assignment.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-full">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Points</p>
                <p className="text-sm text-gray-500">
                  {assignment.points} points possible
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-gray-500">
                  {formatDate(assignment.updatedAt)}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Grading Criteria</h3>
            <div className="prose max-w-none">
              <p>{assignment.gradingCriteria}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">File Requirements</h3>
            <div className="flex items-start gap-2">
              <Upload className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">{assignment.type}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {onAssignmentUpdated && (
        <EditGradingCriteriaDialog
          open={showEditGradingCriteria}
          onOpenChange={setShowEditGradingCriteria}
          assignment={assignment}
          onAssignmentUpdated={onAssignmentUpdated}
        />
      )}
    </>
  );
};
