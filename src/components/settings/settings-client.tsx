'use client';

import { useCategories } from '@/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import DashboardLayout from '../dashboard/dashboard-layout';

export default function SettingsClient() {
  const { categories, addCategory, deleteCategory } = useCategories();
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
              />
              <Button onClick={handleAddCategory}>Add Category</Button>
            </div>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <span>{category}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCategory(category)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </DashboardLayout>
  );
}
