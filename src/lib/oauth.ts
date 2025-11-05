import queryString from 'query-string';
import { db } from '@/lib/db';
import { users, accounts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateAuthToken, serializeAuthCookie } from './auth';

// Ensure OAuth environment variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.NEXT_PUBLIC_BASE_URL) {
  console.warn('OAuth environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_BASE_URL) are not fully set.');
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'MOCK_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'MOCK_CLIENT_SECRET';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

const GOOGLE_REDIRECT_URI = `${BASE_URL}/api/auth/oauth/callback`;

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
}

/**
 * Generates the Google OAuth authorization URL.
 */
export function getGoogleAuthUrl(): string {
  const params = {
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'consent',
  };

  return `https://accounts.google.com/o/oauth2/v2/auth?${queryString.stringify(params)}`;
}

/**
 * Exchanges the authorization code for an access token and ID token.
 */
export async function exchangeCodeForTokens(code: string): Promise<{ accessToken: string; idToken: string }> {
  const url = 'https://oauth2.googleapis.com/token';
  
  const body = queryString.stringify({
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to exchange code for tokens: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    idToken: data.id_token,
  };
}

/**
 * Fetches the user's profile information from Google using the access token.
 */
export async function fetchGoogleUserProfile(accessToken: string): Promise<GoogleUserInfo> {
  const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch user profile: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    id: data.sub, // Google user ID
    email: data.email,
    name: data.name,
  };
}

/**
 * Finds or creates a user and their associated OAuth account in the database.
 * @returns The user object and the serialized auth cookie.
 */
export async function findOrCreateOAuthUser(provider: 'google', profile: GoogleUserInfo): Promise<{ cookie: string; user: { id: string; email: string; role: typeof users.role.enumValues[number]; plan: typeof users.plan.enumValues[number] } }> {
  const providerAccountId = profile.id;
  const email = profile.email;

  // 1. Try to find the account by provider and providerAccountId
  const existingAccount = await db.query.accounts.findFirst({
    where: and(eq(accounts.provider, provider), eq(accounts.providerAccountId, providerAccountId)),
    with: {
      user: true,
    },
  });

  if (existingAccount) {
    // User found via OAuth account
    const user = existingAccount.user;
    const token = generateAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
    });
    const cookie = serializeAuthCookie(token);
    return { cookie, user };
  }

  // 2. Try to find the user by email (for linking existing accounts)
  let user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    // 3. User does not exist, create a new user
    [user] = await db.insert(users).values({
      email,
      // No hashedPassword for OAuth users
    }).returning();

    if (!user) {
      throw new Error('Failed to create user during OAuth provisioning');
    }
  }

  // 4. Create the new OAuth account link
  await db.insert(accounts).values({
    userId: user.id,
    provider,
    providerAccountId,
  });

  // 5. Generate JWT and cookie for the newly created/linked user
  const token = generateAuthToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
  });
  const cookie = serializeAuthCookie(token);

  return { cookie, user };
}

/**
 * Main handler for the Google OAuth callback.
 */
export async function handleGoogleCallback(code: string) {
  const { accessToken } = await exchangeCodeForTokens(code);
  const userInfo = await fetchGoogleUserProfile(accessToken);

  if (!userInfo.email) {
    throw new Error('Google profile did not return an email address');
  }

  return findOrCreateOAuthUser('google', userInfo);
}
