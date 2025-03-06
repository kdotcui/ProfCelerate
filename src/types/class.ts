// src/types/class.ts
import { Assignment } from './assignment';

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
