import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

            <Card className="rounded-2xl shadow-md">
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the app.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                            <span>Dark Mode</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Enable to switch to a darker theme.
                            </span>
                        </Label>
                        <Switch id="dark-mode" disabled />
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md">
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Manage your account settings and data.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-start gap-4">
                    <Button variant="outline" className="w-full sm:w-auto rounded-lg">Export My Data</Button>
                    <Separator />
                     <Button variant="destructive" className="w-full sm:w-auto rounded-lg">Delete My Account</Button>
                </CardContent>
            </Card>
        </div>
    );
}
