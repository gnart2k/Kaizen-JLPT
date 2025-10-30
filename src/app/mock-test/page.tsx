import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ListChecks } from 'lucide-react';

export default function MockTestPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8 flex items-center justify-center">
            <Card className="w-full max-w-md rounded-2xl shadow-md">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                        <ListChecks className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-headline">JLPT Mock Test</CardTitle>
                    <CardDescription>Simulate the full test experience under timed conditions.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="flex justify-center items-center gap-4 text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>180 minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ListChecks className="h-4 w-4" />
                            <span>120 Questions</span>
                        </div>
                    </div>
                    <Button size="lg" className="w-full rounded-lg">Start Mock Test</Button>
                </CardContent>
            </Card>
        </div>
    );
}
