'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating commit messages based on code changes.
 *
 * - generateCommitMessage - A function that takes code changes as input and returns a suggested commit message.
 * - GenerateCommitMessageInput - The input type for the generateCommitMessage function.
 * - GenerateCommitMessageOutput - The return type for the generateCommitMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCommitMessageInputSchema = z.object({
  codeChanges: z
    .string()
    .describe('The code changes to generate a commit message for.'),
});
export type GenerateCommitMessageInput = z.infer<typeof GenerateCommitMessageInputSchema>;

const GenerateCommitMessageOutputSchema = z.object({
  commitMessage: z
    .string()
    .describe('The suggested commit message based on the code changes.'),
});
export type GenerateCommitMessageOutput = z.infer<typeof GenerateCommitMessageOutputSchema>;

export async function generateCommitMessage(
  input: GenerateCommitMessageInput
): Promise<GenerateCommitMessageOutput> {
  return generateCommitMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCommitMessagePrompt',
  input: {schema: GenerateCommitMessageInputSchema},
  output: {schema: GenerateCommitMessageOutputSchema},
  prompt: `You are an AI assistant that generates commit messages based on the provided code changes.

  Code Changes:
  {{codeChanges}}

  Please provide a concise and informative commit message that summarizes the changes.`,
});

const generateCommitMessageFlow = ai.defineFlow(
  {
    name: 'generateCommitMessageFlow',
    inputSchema: GenerateCommitMessageInputSchema,
    outputSchema: GenerateCommitMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
