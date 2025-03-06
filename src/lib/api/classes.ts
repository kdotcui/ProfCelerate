// src/lib/api/classes.ts
import { ClassData } from '@/types/class';

// Mock class data
const mockClasses: ClassData[] = [
  {
    id: 1,
    title: 'Introduction to Computer Science',
    description: 'Fundamentals of programming and computer science concepts',
    department: 'Computer Science',
    code: 'CS101',
    students: 32,
    schedule: 'Mon, Wed, Fri 10:00 AM - 11:30 AM',
    status: 'active',
    term: 'Spring 2025',
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
    term: 'Spring 2025',
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
    term: 'Spring 2025',
  },
  {
    id: 4,
    title: 'Calculus II',
    description: 'Integration techniques, sequences, and series',
    department: 'Mathematics',
    code: 'MATH172',
    students: 36,
    schedule: 'Mon, Wed, Fri 1:00 PM - 2:00 PM',
    status: 'active',
    term: 'Spring 2025',
  },
];

// Simulated API call with artificial delay
export const fetchClasses = (): Promise<ClassData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockClasses);
    }, 800);
  });
};

export const fetchClassById = (id: number): Promise<ClassData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const classData = mockClasses.find((c) => c.id === id);
      if (classData) {
        resolve(classData);
      } else {
        reject(new Error(`Class with ID ${id} not found`));
      }
    }, 500);
  });
};

// src/lib/api/assignments.ts
import { Assignment } from '@/types/class';

// Mock assignments data - mapped by class ID
const mockAssignmentsByClass: Record<string, Assignment[]> = {
  '1': [
    {
      id: '101',
      title: 'Introduction to Variables and Data Types',
      description:
        'Learn about variables, primitive data types, and how to use them in programs.',
      points: 100,
      type: 'pdf',
      submissions: 28,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    },
    {
      id: '102',
      title: 'Control Flow and Loops',
      description:
        'Implement various control flow structures including if/else statements and loops.',
      points: 150,
      type: 'pdf',
      submissions: 24,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    },
    {
      id: '103',
      title: 'Functions and Parameters',
      description:
        'Create reusable functions with different parameter types and return values.',
      points: 120,
      type: 'pdf',
      submissions: 0,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
  ],
  '2': [
    {
      id: '201',
      title: 'Implementing Linked Lists',
      description:
        'Design and implement singly and doubly linked list data structures.',
      points: 200,
      type: 'pdf',
      submissions: 15,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    },
    {
      id: '202',
      title: 'Tree Traversal Algorithms',
      description:
        'Implement and compare different tree traversal algorithms (in-order, pre-order, post-order).',
      points: 180,
      type: 'pdf',
      submissions: 12,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    },
  ],
  '3': [
    {
      id: '301',
      title: 'Organic Nomenclature Quiz',
      description:
        'Test your understanding of organic compound naming conventions.',
      points: 50,
      type: 'pdf',
      submissions: 38,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
  ],
  '4': [], // No assignments yet for class 4
};

// Simulated API call with artificial delay
export const fetchAssignments = (classId: string): Promise<Assignment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAssignmentsByClass[classId] || []);
    }, 600);
  });
};

export const fetchAssignmentById = (
  classId: string,
  assignmentId: string
): Promise<Assignment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const assignments = mockAssignmentsByClass[classId] || [];
      const assignment = assignments.find((a) => a.id === assignmentId);
      if (assignment) {
        resolve(assignment);
      } else {
        reject(
          new Error(
            `Assignment with ID ${assignmentId} not found in class ${classId}`
          )
        );
      }
    }, 400);
  });
};
