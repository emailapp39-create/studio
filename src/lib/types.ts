import type { CATEGORIES } from './data';

export type TransactionType = 'income' | 'expense';

export type Category = (typeof CATEGORIES)[number];

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}
