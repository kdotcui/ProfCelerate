// src/types/class.ts
export type ClassStatus = 'active' | 'inactive';

export interface ClassData {
  id: number;
  title: string;
  description: string;
  department: string;
  code: string;
  schedule: string;
  term: string;
  status: ClassStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// src/types/assignment.ts
export type AssignmentType = 'voice' | 'pdf';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  points: number;
  type: AssignmentType;
  submissions: number;
  createdAt: string;
}
