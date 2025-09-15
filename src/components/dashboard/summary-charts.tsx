'use client';

import { useMemo } from 'react';
import { Bar, BarChart, Pie, PieChart, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useCategories } from '@/hooks/use-categories';

interface SummaryChartsProps {
  transactions: Transaction[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088fe',
  '#00c49f',
  '#ffbb28',
];

export default function SummaryCharts({ transactions }: SummaryChartsProps) {
  const { categories } = useCategories();
  const { barChartData, pieChartData } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseByCategory = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      barChartData: [
        { name: 'Income', value: income, fill: 'hsl(var(--chart-1))' },
        { name: 'Expenses', value: expenses, fill: 'hsl(var(--chart-2))' },
      ],
      pieChartData: Object.entries(expenseByCategory).map(([name, value]) => ({
        name,
        value,
      })),
    };
  }, [transactions]);

  const barChartConfig = {
    value: {
      label: 'Amount',
    },
  };

  const pieChartConfig = {
    value: {
      label: 'Amount',
    },
    ...categories.reduce((acc, category) => {
      acc[category] = { label: category };
      return acc;
    }, {} as any),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>A visual overview of your finances</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-center text-sm font-medium text-muted-foreground">
            Income vs. Expenses
          </h3>
          <ChartContainer config={barChartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={barChartData}>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(value as number)}
                  />
                }
              />
              <Bar dataKey="value" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
        <div>
          <h3 className="mb-2 text-center text-sm font-medium text-muted-foreground">
            Expense Breakdown
          </h3>
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="name"
                    formatter={(value, name, item) => (
                      <div className="flex flex-col">
                        <span>{item.payload.name}</span>
                        <span>{formatCurrency(item.payload.value)}</span>
                      </div>
                    )}
                  />
                }
              />
              <Pie data={pieChartData} dataKey="value" nameKey="name">
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
