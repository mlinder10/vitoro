"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies, headers } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET!);

export type Session = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  color: string;
  isAdmin?: boolean;
};

async function signToken(payload: Session) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(process.env.NODE_ENV === "development" ? "1y" : "1d")
    .sign(SECRET_KEY);
}

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch {
    return null;
  }
}

export async function authenticate(session: Session) {
  const token = await signToken(session);
  (await cookies()).set({
    name: process.env.JWT_KEY!,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  return token;
}

export async function unauthenticate() {
  (await cookies()).delete(process.env.JWT_KEY!);
}

export async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );
  return Buffer.from(arrayBuffer).toString("hex");
}

export async function verifyPassword(password: string, hash: string) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export async function getSession(): Promise<Session | null> {
  const head = await headers();
  const jwt = head
    .get("cookie")
    ?.split("; ")
    .filter((v) => v.startsWith(process.env.JWT_KEY!));
  if (jwt === undefined || jwt.length === 0) {
    return null;
  }
  const token = jwt[0].split("=")[1];
  if (!token) return null;
  const decoded = await verifyToken(token);
  if (!decoded) return null;
  return decoded;
}
