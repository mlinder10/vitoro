"use server";

import db from "@/db/db";
import { jwtVerify, SignJWT } from "jose";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET!);

export type Session = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  color: string;
  isAdmin?: boolean;
};

export async function signToken(payload: Session) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(process.env.NODE_ENV === "development" ? "1y" : "1d")
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch {
    return null;
  }
}

export async function logoutAndRedirect() {
  (await cookies()).set(process.env.JWT_KEY!, "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });

  redirect("/");
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
  const user = await db.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      color: true,
      admin: { select: { userId: true } },
    },
  });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    color: user.color,
    isAdmin: user.admin?.userId ? true : false,
  };
}
