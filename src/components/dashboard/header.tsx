import Link from 'next/link';
import { Settings, ArrowRightLeft } from 'lucide-react';
import AddTransactionSheet from './add-transaction-sheet';
import type { Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function DashboardHeader({
  addTransaction,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="flex w-full flex-row items-center gap-5 text-sm font-medium">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m10 15.5 4-4" />
            <path d="m14 15.5-4-4" />
          </svg>
          <span className="font-headline text-xl">ProfitView</span>
        </Link>
        <Link
          href="/converter"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Converter
        </Link>
        <Link
          href="/settings"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Settings
        </Link>
      </nav>
      <div className="flex items-center justify-end gap-2">
        <AddTransactionSheet addTransaction={addTransaction} />
        <Link href="/settings" className="md:hidden">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
