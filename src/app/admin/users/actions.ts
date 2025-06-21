"use server";

import db from "@/db/db";

export async function handleFetchUsers(
  offset: number,
  limit: number,
  search?: string
) {
  return await db.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      admin: { select: { userId: true } },
    },
    where: search
      ? {
          OR: [
            { email: { contains: search } },
            { firstName: { contains: search } },
            { lastName: { contains: search } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
  });
}

export async function handleUpdateAdminStatus(
  userId: string,
  isAdmin: boolean
) {
  if (isAdmin) {
    await db.admin.delete({ where: { userId } });
    return false;
  } else {
    await db.admin.create({ data: { userId } });
    return true;
  }
}
