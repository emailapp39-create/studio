import type { Transaction } from '@/lib/types';
import DashboardHeader from './header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  addTransaction?: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function DashboardLayout({
  children,
  addTransaction = () => {},
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader addTransaction={addTransaction} />
      {children}
    </div>
  );
}
