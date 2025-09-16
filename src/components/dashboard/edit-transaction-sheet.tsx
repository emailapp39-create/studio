'use client';

import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, ArrowUp, ArrowDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/lib/types';
import { suggestCategory } from '@/ai/flows/smart-category-suggestion';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/use-categories';

const formSchema = z.object({
  date: z.date({
    required_error: 'A date is required.',
  }),
  description: z.string().min(2, 'Description must be at least 2 characters.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  type: z.enum(['income', 'expense'], {
    required_error: 'You need to select a transaction type.',
  }),
  category: z.string({
    required_error: 'Please select a category.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTransactionSheetProps {
  transaction: Transaction;
  onUpdate: (transaction: Transaction) => void;
  onClose: () => void;
}

export default function EditTransactionSheet({
  transaction,
  onUpdate,
  onClose,
}: EditTransactionSheetProps) {
  const [open, setOpen] = useState(true);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  const { categories } = useCategories();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...transaction,
      date: new Date(transaction.date),
    },
  });

  useEffect(() => {
    if (!open) {
      onClose();
    }
  }, [open, onClose]);

  const scroll = (direction: 'up' | 'down') => {
    if (scrollViewportRef.current) {
      const { scrollTop } = scrollViewportRef.current;
      const scrollAmount = direction === 'up' ? -100 : 100;
      scrollViewportRef.current.scrollTo({
        top: scrollTop + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  async function handleSuggestion() {
    const description = form.getValues('description');
    if (!description) {
      toast({
        variant: 'destructive',
        title: 'Suggestion Error',
        description: 'Please enter a description first.',
      });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestCategory({ description });
      if (result && result.category) {
        form.setValue('category', result.category as any, { shouldValidate: true });
        toast({
          title: 'Suggestion Applied',
          description: `Category set to "${result.category}".`,
        });
      }
    } catch (error) {
      console.error('Failed to get category suggestion:', error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'Could not get a category suggestion at this time.',
      });
    } finally {
      setIsSuggesting(false);
    }
  }

  function onSubmit(values: FormValues) {
    onUpdate({
      ...values,
      id: transaction.id,
      date: values.date.toISOString(),
      category: values.category as any,
    });
    form.reset();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>
            Update the details of your transaction below.
          </SheetDescription>
        </SheetHeader>
        <div className="relative h-[calc(100vh-8rem)]">
          <div className="absolute top-2 right-12 z-10 flex flex-col gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll('up')}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll('down')}>
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-full" viewportRef={scrollViewportRef}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Coffee with a friend" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <div className="flex items-center gap-2">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                         <Button type="button" variant="outline" size="sm" onClick={handleSuggestion} disabled={isSuggesting}>
                          {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Suggest'}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Transaction Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="income" />
                            </FormControl>
                            <FormLabel className="font-normal">Income</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="expense" />
                            </FormControl>
                            <FormLabel className="font-normal">Expense</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SheetFooter className="pt-4">
                  <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </SheetClose>
                  <Button type="submit">Save Changes</Button>
                </SheetFooter>
              </form>
            </Form>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
