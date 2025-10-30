import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { PracticeSession } from '@/components/practice/PracticeSession';

const practiceTypes = [
    { title: 'Vocabulary', description: 'Test your knowledge of words and kanji.'},
    { title: 'Grammar', description: 'Practice sentence structure and particles.'},
    { title: 'Listening', description: 'Sharpen your comprehension of spoken Japanese.'},
];

export default function PracticePage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            <h2 className="text-3xl font-bold tracking-tight">Practice Mode</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {practiceTypes.map(type => (
                    <Card key={type.title} className="rounded-2xl shadow-md flex flex-col">
                        <CardHeader>
                            <CardTitle>{type.title}</CardTitle>
                            <CardDescription>{type.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-end">
                            <Button className="w-full rounded-lg">
                                Start Practicing <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="pt-8">
                 <h3 className="text-2xl font-bold tracking-tight mb-4">Sample Session</h3>
                 <Card className="rounded-2xl shadow-md">
                    <CardContent className="p-6">
                        <PracticeSession />
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
