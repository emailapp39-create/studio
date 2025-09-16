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
    return Math.random() * 2;
  }
);


export async function convertCurrency(
  input: ConvertCurrencyInput
): Promise<ConvertCurrencyOutput> {
  return convertCurrencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertCurrencyPrompt',
  input: { schema: ConvertCurrencyInputSchema },
  output: { schema: ConvertCurrencyOutputSchema },
  tools: [getExchangeRate],
  prompt: `You are a currency converter. Your task is to convert the given amount from the source currency to the target currency.

You MUST use the 'getExchangeRate' tool to obtain the exchange rate. Do not try to guess or use your own knowledge.

1. Call the 'getExchangeRate' tool with the 'from' and 'to' currencies.
2. Take the returned exchange rate and multiply it by the 'amount' to get the converted amount.
3. Return the result in the 'convertedAmount' field.

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
