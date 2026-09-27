// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SITE } from "@/config/site";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "default-ultra-secure-admin-secret-key-32-chars-long!"
);

const SESSION_COOKIE_NAME = "niche_admin_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface AdminSessionPayload {
  email: string;
  role: "admin";
  iat?: number;
  exp?: number;
}

export function isAllowedAdminEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return SITE.adminEmails.includes(normalized);
}

/**
 * Creates a signed JWT for the admin session lasting 7 days
 */
export async function createAdminSessionToken(email: string): Promise<string> {
  return await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(SECRET);
}

/**
 * Creates a short-lived magic link token (15 minutes)
 */
export async function createMagicLinkToken(email: string): Promise<string> {
  return await new SignJWT({ email, type: "magic_link" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(SECRET);
}

/**
 * Verifies a magic link token
 */
export async function verifyMagicLinkToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.type === "magic_link" && typeof payload.email === "string") {
      return payload.email;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Sets the admin session cookie in Next.js response headers/cookies
 */
export async function setAdminSessionCookie(email: string) {
  const token = await createAdminSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/"
  });
  return token;
}

/**
 * Reads and verifies the admin session cookie from request cookies
 */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    if (payload.role === "admin" && typeof payload.email === "string") {
      if (isAllowedAdminEmail(payload.email)) {
        return {
          email: payload.email,
          role: "admin"
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Clears the admin session cookie (logout)
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// ==========================================
// EMPLOYER AUTHENTICATION & SESSIONS
// ==========================================

export const EMPLOYER_SESSION_COOKIE = "niche_employer_session";

export interface EmployerSessionPayload {
  email: string;
  companySlug: string;
  role: "employer";
  iat?: number;
  exp?: number;
}

/**
 * Creates a signed JWT for an employer session lasting 30 days
 */
export async function createEmployerSessionToken(email: string, companySlug: string): Promise<string> {
  return await new SignJWT({ email, companySlug, role: "employer" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

/**
 * Sets the employer session cookie
 */
export async function setEmployerSessionCookie(email: string, companySlug: string) {
  const token = await createEmployerSessionToken(email, companySlug);
  const cookieStore = await cookies();
  cookieStore.set(EMPLOYER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });
  return token;
}

/**
 * Reads and verifies the employer session cookie from request cookies
 */
export async function getEmployerSession(): Promise<EmployerSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(EMPLOYER_SESSION_COOKIE)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    if (payload.role === "employer" && typeof payload.email === "string" && typeof payload.companySlug === "string") {
      return {
        email: payload.email,
        companySlug: payload.companySlug,
        role: "employer",
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Clears the employer session cookie (logout)
 */
export async function clearEmployerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(EMPLOYER_SESSION_COOKIE);
}

