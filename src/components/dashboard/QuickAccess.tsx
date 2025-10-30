import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ListChecks, BarChart3 } from 'lucide-react';

const links = [
    { href: '/practice', text: 'Start New Practice', icon: GraduationCap },
    { href: '/mock-test', text: 'Take a Mock Test', icon: ListChecks },
    { href: '/analytics', text: 'View My Analytics', icon: BarChart3 },
];

export function QuickAccess() {
  return (
    <div className="space-y-4">
      {links.map((link) => (
        <Button key={link.href} asChild variant="outline" className="w-full justify-start text-base py-6 rounded-lg">
          <Link href={link.href}>
            <link.icon className="mr-4 h-5 w-5 text-primary" />
            {link.text}
          </Link>
        </Button>
      ))}
    </div>
  );
}
