// src/lib/email.ts

/**
 * Mocks sending a password reset email.
 * In a real application, this would integrate with a service like SendGrid or Resend.
 * @param to The recipient's email address.
 * @param resetLink The unique link for password reset.
 */
export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  console.log(`
==================================================
MOCK EMAIL SENT
To: ${to}
Subject: Password Reset Request
Body:
You requested a password reset. Click the link below to reset your password:
${resetLink}
(This link is valid for 1 hour)
==================================================
  `);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
}
