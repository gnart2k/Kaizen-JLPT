'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(email, password);
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
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
      <div className='mt-4 text-center text-sm'>
        Already have an account?{' '}
        <Link href='/auth/login' className='underline'>
          Login
        </Link>
      </div>
    </form>
  );
}
