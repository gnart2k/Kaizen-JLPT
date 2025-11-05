import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, passwordResetTokens } from '@/lib/db/schema';
import { sendPasswordResetEmail } from '@/lib/email';
import { eq, and, gt } from 'drizzle-orm';
import { randomBytes } from 'crypto';

// Token expiration time: 1 hour
const TOKEN_EXPIRATION_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // 1. Find the user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // IMPORTANT: Always return a success message even if the user is not found
    // to prevent email enumeration attacks.
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });
    }

    // 2. Generate a unique token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MS);

    // 3. Invalidate any existing tokens for this user and insert the new one
    await db.transaction(async (tx) => {
      await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));
      await tx.insert(passwordResetTokens).values({
        userId: user.id,
        token,
        expiresAt,
      });
    });

    // 4. Send the reset email
    // NOTE: In a real app, NEXT_PUBLIC_BASE_URL would be used
    const resetLink = `http://localhost:9002/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetLink);

    return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
