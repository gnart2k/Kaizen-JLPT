import type { PracticeStat } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatsCard({ stat }: { stat: PracticeStat }) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        {stat.change && (
          <p className="text-xs text-muted-foreground">
            {stat.change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
