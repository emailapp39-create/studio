'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface SummaryCardsProps {
  transactions: Transaction[];
}

export default function SummaryCards({ transactions }: SummaryCardsProps) {
  const { totalIncome, totalExpenses, netProfit } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netProfit: income - expenses,
    };
  }, [transactions]);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalIncome)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalExpenses)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              netProfit >= 0 ? 'text-primary' : 'text-destructive'
            }`}
          >
            {formatCurrency(netProfit)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
