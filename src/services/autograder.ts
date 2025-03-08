import { supabase } from '@/lib/supabase';
import { api } from './api';

interface GradingResult {
  question: string;
  mistakes: string[];
  score: number;
  feedback: string;
}

interface FileGradingResult {
  fileName: string;
  results: GradingResult[];
  totalScore: number;
  overallFeedback: string;
}

export async function gradeSubmission(
  files: File[],
  gradingCriteria: string,
  submissionId: string,
  totalPointsAvailable: number
): Promise<FileGradingResult[]> {
  try {
    // Call our backend API to grade the submission
    const results = await api.gradeSubmission(
      files,
      gradingCriteria,
      submissionId,
      totalPointsAvailable
    );

    return results;
  } catch (error) {
    console.error('Error grading submission:', error);
    throw error;
  }
}
