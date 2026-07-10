import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "mt_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 ngày

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "insecure-dev-secret";
}

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

export function createToken(userId: string): string {
  const payload = b64url(JSON.stringify({ uid: userId, exp: Date.now() + MAX_AGE * 1000 }));
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string | undefined): string | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return data.uid as string;
  } catch {
    return null;
  }
}

export async function setSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE, createToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getAdminId(): Promise<string | null> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}
