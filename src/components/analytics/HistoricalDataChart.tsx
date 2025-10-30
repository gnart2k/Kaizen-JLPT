'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { progressData } from '@/lib/data';

const chartConfig = {
    vocabulary: {
        label: "Vocabulary",
        color: "hsl(var(--primary))",
    },
    grammar: {
        label: "Grammar",
        color: "hsl(var(--accent-foreground))",
    },
} as const;

export function HistoricalDataChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
        <BarChart accessibilityLayer data={progressData}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}%`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="vocabulary" fill="var(--color-vocabulary)" radius={4} />
            <Bar dataKey="grammar" fill="var(--color-grammar)" radius={4} />
        </BarChart>
    </ChartContainer>
  );
}
