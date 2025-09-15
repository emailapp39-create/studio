'use client';

import { atom, useAtom } from 'jotai';
import { CATEGORIES, categoryIcons as initialCategoryIcons } from '@/lib/data';
import { LucideIcon, MoreHorizontal } from 'lucide-react';
import { useToast } from './use-toast';

const categoriesAtom = atom(CATEGORIES);
const categoryIconsAtom = atom(initialCategoryIcons);

export function useCategories() {
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [categoryIcons, setCategoryIcons] = useAtom(categoryIconsAtom);
  const { toast } = useToast();

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
      setCategoryIcons((prev) => ({ ...prev, [category]: MoreHorizontal }));
      toast({ title: 'Category Added', description: `"${category}" has been added.` });
    } else {
      toast({
        variant: 'destructive',
        title: 'Category Exists',
        description: `"${category}" already exists.`,
      });
    }
  };

  const deleteCategory = (category: string) => {
    setCategories((prev) => prev.filter((c) => c !== category));
    setCategoryIcons((prev) => {
      const newIcons = { ...prev };
      delete newIcons[category];
      return newIcons;
    });
    toast({ title: 'Category Deleted', description: `"${category}" has been deleted.` });
  };

  return { categories, categoryIcons, addCategory, deleteCategory };
}
