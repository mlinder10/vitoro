"use server";

import { db, users, admins } from "@/db";
import { eq, ilike, or, sql } from "drizzle-orm";

export async function handleFetchUsers(
  offset: number,
  limit: number,
  search?: string
) {
  const conditions = search
    ? or(
        ilike(users.email, `%${search}%`),
        ilike(users.firstName, `%${search}%`),
        ilike(users.lastName, `%${search}%`)
      )
    : undefined;

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      createdAt: users.createdAt,
      isAdmin: admins.userId,
    })
    .from(users)
    .leftJoin(admins, sql`${admins.userId} = ${users.id}`)
    .where(conditions)
    .orderBy(sql`${users.createdAt} DESC`)
    .offset(offset)
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    createdAt: row.createdAt,
    admin: row.isAdmin ? { userId: row.isAdmin } : null,
  }));
}

export async function handleUpdateAdminStatus(
  userId: string,
  isAdmin: boolean
) {
  if (isAdmin) {
    await db.delete(admins).where(eq(admins.userId, userId));
    return false;
  } else {
    await db.insert(admins).values({ userId });
    return true;
  }
}
