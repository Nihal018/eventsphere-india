// lib/auth.ts - JWT utilities and authentication helpers

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// JWT secret - in production, use a strong random secret
const JWT_SECRET =
  process.env.JWT_SECRET || "eventsphere-jwt-secret-change-in-production";
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
  role: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Good balance of security and performance
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a password with its hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateJWT(user: AuthUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: "eventsphere",
    audience: "eventsphere-users",
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "eventsphere",
      audience: "eventsphere-users",
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(
  authHeader: string | null
): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.substring(7); // Remove "Bearer " prefix
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  if (password.length > 100) {
    return {
      valid: false,
      message: "Password must be less than 100 characters",
    };
  }

  // Optional: Add more strict requirements
  // if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
  //   return { valid: false, message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' };
  // }

  return { valid: true };
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): {
  valid: boolean;
  message?: string;
} {
  if (username.length < 3) {
    return {
      valid: false,
      message: "Username must be at least 3 characters long",
    };
  }

  if (username.length > 30) {
    return {
      valid: false,
      message: "Username must be less than 30 characters",
    };
  }

  // Allow letters, numbers, underscores, and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      message:
        "Username can only contain letters, numbers, underscores, and hyphens",
    };
  }

  return { valid: true };
}

/**
 * Remove sensitive data from user object
 */
export function sanitizeUser(user: any): AuthUser {
  const { password, ...sanitized } = user;
  return {
    ...sanitized,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Generate a secure random token (for password reset, etc.)
 */
export function generateSecureToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
