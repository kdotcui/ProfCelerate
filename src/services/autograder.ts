import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';
import { AssistantTool } from 'openai/resources/beta/assistants';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

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

// Function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

// Function to get file content based on type
async function getFileContent(
  file: File
): Promise<{ content: string; isBase64: boolean; textContent: string }> {
  if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
    // For PDFs and images, convert to base64 for storage
    const base64Content = await fileToBase64(file);
    return {
      content: base64Content,
      isBase64: true,
      textContent: '', // We'll use assistant API instead of text content
    };
  } else if (file.type.startsWith('audio/')) {
    // For audio files, just convert to base64
    const base64Content = await fileToBase64(file);
    return { content: base64Content, isBase64: true, textContent: '' };
  } else {
    // For text files, read as text
    const textContent = await file.text();
    return { content: textContent, isBase64: false, textContent };
  }
}

async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay);
  }
}

// Helper function to upload file to OpenAI
async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('purpose', 'assistants');

  const response = await fetch('https://api.openai.com/v1/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to OpenAI');
  }

  const data = await response.json();
  return data.id;
}

export async function gradeFile(
  file: File,
  gradingCriteria: string,
  submissionId: string,
  totalPointsAvailable: number
): Promise<FileGradingResult> {
  return retry(async () => {
    try {
      // Get file content based on type
      const {
        content: fileContent,
        isBase64,
        textContent,
      } = await getFileContent(file);

      let assistant;
      let thread;
      let fileId;

      try {
        // For PDFs, upload the file directly
        if (file.type === 'application/pdf') {
          fileId = await uploadFile(file);

          // Create an assistant with file search capability
          assistant = await openai.beta.assistants.create({
            name: 'Grading Assistant',
            instructions:
              'You are an expert grader. Please grade submissions based on the provided grading criteria and return the results in the specified JSON format. Your response must be valid JSON without any Markdown formatting. Do not wrap your response in code blocks or any formatting. Return only a raw JSON object.',
            model: 'gpt-4-turbo-preview',
            tools: [{ type: 'file_search' } as any],
          });

          // Create a thread with the file attached
          const pdfPrompt = `Please grade the following PDF submission based on these grading criteria:

                ${gradingCriteria}

                TOTAL_POINTS_AVAILABLE: ${totalPointsAvailable}

                IMPORTANT: Your response MUST be valid JSON without any Markdown formatting. Do not use code blocks. Return only a raw JSON object.

                Please provide your grading in the following JSON format:
                {
                "results": [
                    {
                    "question": "Question or aspect being graded",
                    "mistakes": ["List of mistakes found"],
                    "score": number,
                    "feedback": "Detailed feedback for this aspect"
                    }
                ],
                "totalScore": number,
                "overallFeedback": "Overall feedback for the entire submission"
                }`;

          thread = await openai.beta.threads.create({
            messages: [
              {
                role: 'user',
                content: pdfPrompt,
                attachments: [
                  {
                    file_id: fileId,
                    tools: [{ type: 'file_search' } as any],
                  },
                ],
              },
            ],
          });
        } else {
          // For non-PDF files, create assistant without attached files
          assistant = await openai.beta.assistants.create({
            name: 'Grading Assistant',
            instructions:
              'You are an expert grader. Please grade submissions based on the provided grading criteria and return the results in the specified JSON format. Your response must be valid JSON without any Markdown formatting. Do not wrap your response in code blocks or any formatting. Return only a raw JSON object.',
            model: 'gpt-4-turbo-preview',
            tools: [{ type: 'file_search' } as any],
          });

          // Create a thread
          thread = await openai.beta.threads.create();

          // Add the grading criteria and text content as separate messages
          const textPrompt = `Please grade the following submission based on these grading criteria:

                ${gradingCriteria}

                IMPORTANT: Your response MUST be valid JSON without any Markdown formatting. Do not use code blocks. Return only a raw JSON object.

                Please provide your grading in the following JSON format:
                {
                "results": [
                    {
                    "question": "Question or aspect being graded",
                    "mistakes": ["List of mistakes found"],
                    "score": number,
                    "feedback": "Detailed feedback for this aspect"
                    }
                ],
                "totalScore": number,
                "overallFeedback": "Overall feedback for the entire submission"
                }`;

          await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: textPrompt,
          });

          // Add file content as a regular message for non-PDFs
          await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: textContent || '[Content could not be extracted]',
          });
        }

        // Run the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: assistant.id,
        });

        // Wait for the run to complete
        let runStatus = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
        while (
          runStatus.status === 'in_progress' ||
          runStatus.status === 'queued'
        ) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          runStatus = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
          );
        }

        if (runStatus.status !== 'completed') {
          throw new Error(
            `Assistant run failed with status: ${runStatus.status}`
          );
        }

        // Get the assistant's response
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0];
        const messageContent = lastMessage.content[0];

        console.log(messageContent);

        if (typeof messageContent === 'string' || !('text' in messageContent)) {
          throw new Error('No text response from assistant');
        }

        // Extract JSON from potential Markdown code blocks
        const responseText = messageContent.text.value;
        let jsonText = responseText;

        // Check if the response is wrapped in Markdown code blocks
        const jsonCodeBlockRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
        const match = responseText.match(jsonCodeBlockRegex);
        if (match && match[1]) {
          jsonText = match[1];
        }

        try {
          const gradingResult = JSON.parse(jsonText);
          console.log(gradingResult);

          // Validate and ensure the grading result has the expected structure
          const validatedResult = {
            results: Array.isArray(gradingResult.results)
              ? gradingResult.results.map((result: any) => ({
                  question: result.question || 'Unnamed aspect',
                  mistakes: Array.isArray(result.mistakes)
                    ? result.mistakes
                    : [],
                  score: typeof result.score === 'number' ? result.score : 0,
                  feedback: result.feedback || 'No feedback provided',
                }))
              : [],
            totalScore:
              typeof gradingResult.totalScore === 'number'
                ? gradingResult.totalScore
                : Array.isArray(gradingResult.results)
                ? gradingResult.results.reduce(
                    (sum: number, r: any) =>
                      sum + (typeof r.score === 'number' ? r.score : 0),
                    0
                  )
                : 0,
            overallFeedback:
              gradingResult.overallFeedback || 'No overall feedback provided',
          };

          // Store the validated result in Supabase
          const { error: storageError } = await supabase
            .from('submission_results')
            .insert({
              submission_id: submissionId,
              file_name: file.name,
              file_content: fileContent,
              file_type: file.type,
              is_base64: isBase64,
              grading_results: validatedResult,
              created_at: new Date().toISOString(),
            });

          if (storageError) throw storageError;

          return {
            fileName: file.name,
            results: validatedResult.results,
            totalScore: validatedResult.totalScore,
            overallFeedback: validatedResult.overallFeedback,
          };
        } catch (error: unknown) {
          const parseError =
            error instanceof Error ? error : new Error(String(error));
          console.error('Error parsing JSON:', parseError);
          console.error('Raw response:', responseText);
          throw new Error(
            `Failed to parse assistant response: ${parseError.message}`
          );
        }
      } finally {
        // Clean up resources
        if (assistant?.id) {
          await openai.beta.assistants
            .del(assistant.id)
            .catch((err) => console.error('Error deleting assistant:', err));
        }
        if (thread?.id) {
          await openai.beta.threads
            .del(thread.id)
            .catch((err) => console.error('Error deleting thread:', err));
        }
        if (fileId && file.type === 'application/pdf') {
          await openai.files
            .del(fileId)
            .catch((err) => console.error('Error deleting file:', err));
        }
      }
    } catch (error) {
      console.error('Error grading file:', error);
      throw error;
    }
  });
}

export async function gradeSubmission(
  files: File[],
  gradingCriteria: string,
  submissionId: string,
  totalPointsAvailable: number
): Promise<FileGradingResult[]> {
  const gradingPromises = files.map(async (file) => {
    try {
      return await gradeFile(
        file,
        gradingCriteria,
        submissionId,
        totalPointsAvailable
      );
    } catch (error) {
      console.error(`Error grading file ${file.name}:`, error);
      return null;
    }
  });

  const results = await Promise.all(gradingPromises);
  return results.filter(
    (result): result is FileGradingResult => result !== null
  );
}
