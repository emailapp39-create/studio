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

// A tool to get the exchange rate. In a real app, this would call an API.
// For this example, we'll simulate it with a random number.
const getExchangeRate = ai.defineTool(
  {
    name: 'getExchangeRate',
    description:
      'Get the exchange rate between two currencies. This is a fictional API and will return a random number.',
    inputSchema: z.object({
      from: z.string().describe('The currency to convert from (e.g., USD).'),
      to: z.string().describe('The currency to convert to (e.g., EUR).'),
    }),
    outputSchema: z.number(),
  },
  async (input) => {
    console.log(`Getting exchange rate from ${input.from} to ${input.to}`);
    // In a real application, you would call a currency API here.
    // For this example, we'll return a random rate.
    if (input.from === input.to) {
      return 1;
    }
    return Math.random() * 2 + 0.5; // Ensure a more realistic-looking rate
  }
);


export async function convertCurrency(
  input: ConvertCurrencyInput
): Promise<ConvertCurrencyOutput> {
  return convertCurrencyFlow(input);
}

const ratePrompt = ai.definePrompt({
  name: 'getRatePrompt',
  tools: [getExchangeRate],
  prompt: `You are an exchange rate provider. Your only task is to use the getExchangeRate tool to find the exchange rate between the two currencies provided.

From: {{{from}}}
To: {{{to}}}

Do not output anything other than the tool call.
`,
});

const convertCurrencyFlow = ai.defineFlow(
  {
    name: 'convertCurrencyFlow',
    inputSchema: ConvertCurrencyInputSchema,
    outputSchema: ConvertCurrencyOutputSchema,
  },
  async (input) => {
    const response = await ratePrompt(input);

    const rate = response.toolRequest('getExchangeRate')?.output;
    if (rate === undefined) {
      throw new Error('The model did not return an exchange rate.');
    }

    const convertedAmount = input.amount * rate;

    return { convertedAmount };
  }
);
