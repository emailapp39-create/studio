'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRightLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { convertCurrency } from '@/ai/flows/currency-converter-flow';
import { CURRENCIES } from '@/lib/currencies';
import DashboardLayout from '../dashboard/dashboard-layout';
import { formatCurrency } from '@/lib/utils';

const formSchema = z.object({
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  from: z.string().min(3).max(3),
  to: z.string().min(3).max(3),
});

type FormValues = z.infer<typeof formSchema>;

export default function CurrencyConverterClient() {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<{
    amount: number;
    currency: string;
  } | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1,
      from: 'USD',
      to: 'EUR',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsConverting(true);
    setConversionResult(null);
    try {
      const result = await convertCurrency(values);
      setConversionResult({ amount: result.convertedAmount, currency: values.to });
    } catch (error) {
      console.error('Failed to convert currency:', error);
      toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: 'Could not get a conversion rate at this time.',
      });
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Currency Converter</CardTitle>
              <CardDescription>
                Get the latest exchange rates for major world currencies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] items-end">
                    <FormField
                      control={form.control}
                      name="from"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CURRENCIES.map((currency) => (
                                <SelectItem
                                  key={currency.code}
                                  value={currency.code}
                                >
                                  {currency.code} - {currency.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const from = form.getValues('from');
                        const to = form.getValues('to');
                        form.setValue('from', to);
                        form.setValue('to', from);
                      }}
                    >
                      <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <FormField
                      control={form.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CURRENCIES.map((currency) => (
                                <SelectItem
                                  key={currency.code}
                                  value={currency.code}
                                >
                                  {currency.code} - {currency.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isConverting}>
                    {isConverting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Convert'
                    )}
                  </Button>
                </form>
              </Form>

              {conversionResult && (
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    {formatCurrency(form.getValues('amount'), form.getValues('from'))} is
                  </p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(conversionResult.amount, conversionResult.currency)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </DashboardLayout>
  );
}
