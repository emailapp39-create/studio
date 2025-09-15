'use client';

import { useState } from 'react';
import type { Transaction } from '@/lib/types';
import { INITIAL_TRANSACTIONS } from '@/lib/data';
import DashboardHeader from '@/components/dashboard/header';
import SummaryCards from '@/components/dashboard/summary-cards';
import SummaryCharts from '@/components/dashboard/summary-charts';
import TransactionsTable from '@/components/dashboard/transactions-table';
import { useToast } from '@/hooks/use-toast';

export default function DashboardClient() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const { toast } = useToast();

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [
      { ...transaction, id: crypto.randomUUID() },
      ...prev,
    ]);
    toast({
      title: 'Transaction Added',
      description: `Successfully added "${transaction.description}".`,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader addTransaction={addTransaction} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <SummaryCards transactions={transactions} />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SummaryCharts transactions={transactions} />
          </div>
          <div className="xl:col-span-1">
            <TransactionsTable transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
}
