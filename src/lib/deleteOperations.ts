import { supabase } from './supabase';

export async function deleteClass(classId: string | number) {
  try {
    const { error: classError } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId);

    if (classError) throw classError;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting class:', error);
    throw error;
  }
}

export async function deleteAssignment(assignmentId: string | number) {
  try {
    const { error: assignmentError } = await supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId);

    if (assignmentError) throw assignmentError;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting assignment:', error);
    throw error;
  }
}

export async function deleteSubmission(submissionId: string | number) {
  try {
    // Delete associated submission results first
    const { error: resultsError } = await supabase
      .from('submission_results')
      .delete()
      .eq('submission_id', submissionId);

    if (resultsError) throw resultsError;

    // Delete the submission
    const { error: submissionError } = await supabase
      .from('submissions')
      .delete()
      .eq('id', submissionId);

    if (submissionError) throw submissionError;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting submission:', error);
    throw error;
  }
}

export async function deleteSubmissionBatch(batchId: string | number) {
  try {
    const { error: batchError } = await supabase
      .from('submissions')
      .delete()
      .eq('id', batchId);

    if (batchError) throw batchError;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting submission batch:', error);
    throw error;
  }
}
