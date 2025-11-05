import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { generateAuthToken, serializeAuthCookie } from '@/lib/auth';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // 1. Find the user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.hashedPassword) {
      // Return a generic error message to prevent email enumeration
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Generate JWT and set secure HTTP-only cookie
    const token = generateAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
    });
    const cookie = serializeAuthCookie(token);
    
    return NextResponse.json({ 
      message: 'Login successful', 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        plan: user.plan 
      } 
    }, { 
      status: 200,
      headers: { 'Set-Cookie': cookie },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
