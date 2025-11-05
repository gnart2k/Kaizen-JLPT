'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className='grid gap-4'>
      <div className='grid gap-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          placeholder='m@example.com'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='grid gap-2'>
        <div className='flex items-center'>
          <Label htmlFor='password'>Password</Label>
          <Link
            href='/auth/forgot-password'
            className='ml-auto inline-block text-sm underline'
          >
            Forgot your password?
          </Link>
        </div>
        <Input
          id='password'
          type='password'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
      <div className='mt-4 text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link href='/auth/register' className='underline'>
          Sign up
        </Link>
      </div>
    </form>
  );
}
