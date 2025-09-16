'use server';

/**
 * @fileOverview AI-powered currency converter.
 *
 * - convertCurrency - Converts an amount from one currency to another.
 * - ConvertCurrencyInput - Input for the convertCurrency function.
 * - ConvertCurrencyOutput - Output for the convertCurrency function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ConvertCurrencyInputSchema = z.object({
  amount: z.number().describe('The amount to convert.'),
  from: z.string().describe('The currency to convert from (e.g., USD).'),
  to: z.string().describe('The currency to convert to (e.g., EUR).'),
});
export type ConvertCurrencyInput = z.infer<typeof ConvertCurrencyInputSchema>;

const ConvertCurrencyOutputSchema = z.object({
  convertedAmount: z
    .number()
    .describe('The converted amount in the target currency.'),
});
export type ConvertCurrencyOutput = z.infer<typeof ConvertCurrencyOutputSchema>;

export async function convertCurrency(
  input: ConvertCurrencyInput
): Promise<ConvertCurrencyOutput> {
  return convertCurrencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertCurrencyPrompt',
  input: { schema: ConvertCurrencyInputSchema },
  output: { schema: ConvertCurrencyOutputSchema },
  prompt: `You are a currency converter. Convert the given amount from the source currency to the target currency based on the latest available exchange rates.

Amount: {{{amount}}}
From: {{{from}}}
To: {{{to}}}

Respond with only a valid JSON document conforming to the schema.
`,
});

const convertCurrencyFlow = ai.defineFlow(
  {
    name: 'convertCurrencyFlow',
    inputSchema: ConvertCurrencyInputSchema,
    outputSchema: ConvertCurrencyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
