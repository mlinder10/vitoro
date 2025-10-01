"use server";

import { betaApplications, db } from "@/db";
import { eq } from "drizzle-orm";

export async function applyForBeta(email: string) {
  await db.insert(betaApplications).values({ email });
}

export async function approveBetaApplication(email: string) {
  await db
    .update(betaApplications)
    .set({ approved: true })
    .where(eq(betaApplications.email, email));
}
