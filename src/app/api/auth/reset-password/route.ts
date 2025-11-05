import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, passwordResetTokens } from '@/lib/db/schema';
import bcrypt from 'bcrypt';
import { eq, and, gt } from 'drizzle-orm';

// Define the salt rounds for bcrypt
const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ message: 'Token and new password are required' }, { status: 400 });
    }

    // 1. Find the valid token
    const resetToken = await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.token, token),
        gt(passwordResetTokens.expiresAt, new Date()), // Check if token is not expired
      ),
      with: {
        user: {
          columns: { id: true, email: true },
        },
      },
    });

    if (!resetToken || !resetToken.user) {
      return NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 });
    }

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // 3. Update the user's password and delete the token in a transaction
    await db.transaction(async (tx) => {
      // Update user password
      await tx.update(users)
        .set({ hashedPassword, updatedAt: new Date() })
        .where(eq(users.id, resetToken.userId));

      // Delete the used token
      await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
    });

    return NextResponse.json({ message: 'Password successfully reset. You can now log in.' }, { status: 200 });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
