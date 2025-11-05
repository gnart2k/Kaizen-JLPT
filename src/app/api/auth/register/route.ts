import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { generateAuthToken, serializeAuthCookie } from '@/lib/auth';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

// Define the salt rounds for bcrypt
const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Insert the new user into the database
    const [newUser] = await db.insert(users).values({
      email,
      hashedPassword,
      // Default role and plan are set in the schema
    }).returning({ id: users.id, email: users.email, role: users.role, plan: users.plan });

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    // 4. Generate JWT and set secure HTTP-only cookie
    const token = generateAuthToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      plan: newUser.plan,
    });
    const cookie = serializeAuthCookie(token);
    
    return NextResponse.json({ 
      message: 'Registration successful', 
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role, 
        plan: newUser.plan 
      } 
    }, { 
      status: 201,
      headers: { 'Set-Cookie': cookie },
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
