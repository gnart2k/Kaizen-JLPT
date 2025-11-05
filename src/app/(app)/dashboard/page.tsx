'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { practiceStats, jlptLevels } from '@/lib/data';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { QuickAccess } from '@/components/dashboard/QuickAccess';
import { LevelSelector } from '@/components/dashboard/LevelSelector';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect unauthenticated users to login
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    // Show a full-page skeleton loader while checking auth
    return (
      <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
          <Skeleton className="col-span-1 lg:col-span-4 h-96 w-full rounded-2xl" />
          <Skeleton className="col-span-1 lg:col-span-3 h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <LevelSelector levels={jlptLevels} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {practiceStats.map((stat) => (
          <StatsCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ProgressChart />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3 rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickAccess />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}