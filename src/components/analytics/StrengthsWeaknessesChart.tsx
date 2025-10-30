'use client';

import { PolarGrid, PolarAngleAxis, Radar, RadarChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { strengthData } from '@/lib/data';

const chartConfig = {
    score: {
        label: 'Score',
        color: 'hsl(var(--primary))',
    },
};

export function StrengthsWeaknessesChart() {
  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
        <RadarChart accessibilityLayer data={strengthData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="subject" />
            <PolarGrid />
            <Radar dataKey="A" fill="var(--color-score)" fillOpacity={0.6} dot={{ r: 4, className: 'fill-primary' }} />
        </RadarChart>
    </ChartContainer>
  );
}
