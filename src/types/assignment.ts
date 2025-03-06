export type AssignmentType = 'voice' | 'pdf';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  points: number;
  type: AssignmentType;
  classId: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  gradingCriteria: string;
}
