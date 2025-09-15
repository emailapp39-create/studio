'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Transaction, Category } from '@/lib/types';
import { CATEGORIES, categoryIcons } from '@/lib/data';
import { formatCurrency, cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TransactionsTableProps {
  transactions: Transaction[];
}

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(
        (t) => categoryFilter === 'all' || t.category === categoryFilter
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, categoryFilter]);

  const Icon = ({ category }: { category: Category }) => {
    const IconComponent = categoryIcons[category];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              A list of your recent income and expenses.
            </CardDescription>
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) =>
              setCategoryFilter(value as Category | 'all')
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <Icon category={transaction.category} />
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-mono',
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      )}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
