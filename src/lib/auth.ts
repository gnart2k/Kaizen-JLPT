import jwt, { JwtPayload } from 'jsonwebtoken';
import { serialize, parse } from 'cookie';
import { userRoleEnum, userPlanEnum } from './db/schema';

// Define the JWT payload structure
export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: typeof userRoleEnum.enumValues[number];
  plan: typeof userPlanEnum.enumValues[number];
  targetLevelId?: string;
}

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_NAME = 'auth_token';
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

/**
 * Generates a JWT for the given user payload.
 */
export function generateAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
}

/**
 * Verifies a JWT and returns the payload, or null if invalid/expired.
 */
export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload & AuthTokenPayload;
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      plan: payload.plan,
      targetLevelId: payload.targetLevelId
    };
  } catch (error) {
    return null;
  }
}

/**
 * Extracts and verifies the JWT from the request headers.
 */
export function getAuthPayloadFromRequest(request: Request): AuthTokenPayload | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  const cookies = parse(cookieHeader);
  const token = cookies[TOKEN_NAME];

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

/**
 * Serializes the JWT into a secure HTTP-only cookie string.
 */
export function serializeAuthCookie(token: string): string {
  return serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  });
}

/**
 * Serializes an empty cookie to clear the token.
 */
export function serializeClearCookie(): string {
  return serialize(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}
