// src/types/class.ts
export type ClassStatus = 'active' | 'pending' | 'inactive';

export interface ClassData {
  id: number;
  title: string;
  description: string;
  department: string;
  code: string;
  students: number;
  schedule: string;
  status: ClassStatus;
  term?: string;
}

// src/types/assignment.ts
export type AssignmentStatus = 'draft' | 'published';
export type AssignmentType = 'code' | 'quiz' | 'text';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  points: number;
  dueDate: string;
  status: AssignmentStatus;
  type: AssignmentType;
  submissions: number;
  createdAt: string;
}
