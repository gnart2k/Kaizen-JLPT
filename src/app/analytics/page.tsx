import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StrengthsWeaknessesChart } from '@/components/analytics/StrengthsWeaknessesChart';
import { HistoricalDataChart } from '@/components/analytics/HistoricalDataChart';

export default function AnalyticsPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card className="rounded-2xl shadow-md">
                    <CardHeader>
                        <CardTitle>Strengths & Weaknesses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StrengthsWeaknessesChart />
                    </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-md">
                    <CardHeader>
                        <CardTitle>Historical Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <HistoricalDataChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
