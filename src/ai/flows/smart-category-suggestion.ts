'use server';

/**
 * @fileOverview AI-powered category suggestion for transaction descriptions.
 *
 * - suggestCategory - A function that suggests a transaction category based on the description.
 * - SuggestCategoryInput - The input type for the suggestCategory function.
 * - SuggestCategoryOutput - The return type for the suggestCategory function.
 */

import {ai} from '@/ai/genkit';
import {CATEGORIES} from '@/lib/data';
import {z} from 'genkit';

const SuggestCategoryInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the transaction for category suggestion.'),
});
export type SuggestCategoryInput = z.infer<typeof SuggestCategoryInputSchema>;

const SuggestCategoryOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The suggested category for the transaction based on the description.'
    ),
  confidence: z
    .number()
    .describe(
      'The confidence level (0-1) of the category suggestion, with 1 being the most confident.'
    ),
});
export type SuggestCategoryOutput = z.infer<typeof SuggestCategoryOutputSchema>;

export async function suggestCategory(input: SuggestCategoryInput): Promise<SuggestCategoryOutput> {
  return suggestCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCategoryPrompt',
  input: {schema: SuggestCategoryInputSchema},
  output: {schema: SuggestCategoryOutputSchema},
  prompt: `You are a personal finance assistant. Your primary task is to categorize user transactions based on their descriptions.  Given the transaction description, suggest the most appropriate category.

Description: {{{description}}}

Respond with only a valid JSON document conforming to the schema.  Be brief and concise.  The confidence should represent your certainty that you have categorized it correctly.

Available categories: ${CATEGORIES.join(', ')}
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestCategoryFlow = ai.defineFlow(
  {
    name: 'suggestCategoryFlow',
    inputSchema: SuggestCategoryInputSchema,
    outputSchema: SuggestCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
