"use server";

import { admins, db, passwordResets, users } from "@/db";
import { sendResetPasswordEmail } from "@/email/reset-password";
import { authenticate, hashPassword, verifyPassword } from "@/lib/auth";
import { generateColor } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
// import { OAuth2Client } from "google-auth-library";

const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

// ============================
// Login
// ============================

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

type LoginResult = {
  email?: string[];
  password?: string[];
};

export async function handleLogin(
  _: unknown,
  data: FormData
): Promise<LoginResult> {
  const result = LoginSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result.success) return result.error.formErrors.fieldErrors;

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      color: users.color,
      password: users.password,
      isAdmin: admins.userId,
    })
    .from(users)
    .leftJoin(admins, eq(admins.userId, users.id))
    .where(eq(users.email, result.data.email));
  if (!user) return { email: ["Invalid email or password"] };

  if (!(await verifyPassword(result.data.password, user.password)))
    return { email: ["Invalid email or password"] };

  await authenticate({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    color: user.color,
    isAdmin: user.isAdmin !== null,
  });

  redirect("/");
}

// ============================
// Register
// ============================

const RegisterSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

type RegisterResult = {
  email?: string[];
  firstName?: string[];
  lastName?: string[];
  password?: string[];
  confirmPassword?: string[];
  error?: string[];
};

export async function handleRegister(
  _: unknown,
  data: FormData
): Promise<RegisterResult> {
  const result = RegisterSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result.success) return result.error.formErrors.fieldErrors;
  const { email, firstName, lastName, password, confirmPassword } = result.data;

  if (password !== confirmPassword)
    return { confirmPassword: ["Passwords do not match"] };

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) return { email: ["User already exists"] };

  const hashedPassword = await hashPassword(password);
  const color = generateColor();

  const [user] = await db
    .insert(users)
    .values({
      email,
      firstName,
      lastName,
      color,
      password: hashedPassword,
    })
    .returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      color: users.color,
    });
  if (!user) return { error: ["Failed to create user"] };

  await authenticate({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    color: user.color,
    isAdmin: false,
  });
  // await sendRegisterEmail(email)
  redirect("/");
}

// ============================
// Reset Password
// ============================

const ResetPasswordSchemaEmail = z.object({
  email: z.string().email(),
});

export async function handleEmailSending(_: unknown, data: FormData) {
  const result = ResetPasswordSchemaEmail.safeParse(
    Object.fromEntries(data.entries())
  );
  if (!result.success) return result.error.formErrors.fieldErrors;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, result.data.email));
  if (!user) return { email: "User does not exist" };

  const code = generateResetCode();
  await sendResetPasswordEmail(result.data.email, code);

  await db.insert(passwordResets).values({
    code,
    userId: user.id,
    validUntil: new Date(Date.now() + TEN_MINUTES_IN_MS),
  });

  redirect("/");
}

const ResetPasswordSchemaVerification = z.object({
  code: z.string(),
});

export async function handleVerification(_: unknown, data: FormData) {
  const result = ResetPasswordSchemaVerification.safeParse(
    Object.fromEntries(data.entries())
  );
  if (!result.success) return result.error.formErrors.fieldErrors;

  const [reset] = await db
    .select()
    .from(passwordResets)
    .where(eq(passwordResets.code, result.data.code));
  if (!reset) return { code: "Invalid code" };

  if (reset.validUntil < new Date()) return { code: "Code has expired" };

  redirect(`/reset-code/${reset.id}`);
}

const HandlPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

type PasswordResetResult = {
  password?: string[];
  confirmPassword?: string[];
};

export async function handlePasswordReset(
  resetPassId: string,
  _: unknown,
  data: FormData
): Promise<PasswordResetResult> {
  const result = HandlPasswordSchema.safeParse(
    Object.fromEntries(data.entries())
  );
  if (!result.success) return result.error.formErrors.fieldErrors;

  if (result.data.password !== result.data.confirmPassword)
    return { confirmPassword: ["Passwords do not match"] };

  const [reset] = await db
    .select()
    .from(passwordResets)
    .where(eq(passwordResets.id, resetPassId));
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, reset?.userId));

  const hashedPassword = await hashPassword(result.data.password);
  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, user?.id));

  redirect("/");
}

function generateResetCode(): string {
  const min = 10000;
  const max = 99999;
  const code = Math.floor(Math.random() * (max - min + 1)) + min;
  return String(code);
}

// ============================
// Google Auth
// ============================

// const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

// export async function handleGoogleLogin(
//   response: google.accounts.id.CredentialResponse
// ) {
//   const token = response.credential;
//   const ticket = await client.verifyIdToken({
//     idToken: token,
//     audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//   });

//   const payload = ticket.getPayload();
//   if (!payload) throw new Error("Invalid Google token");

//   let user = await db.user.findUnique({
//     where: { email: payload.email },
//   });

//   if (!user) {
//     user = await db.user.create({
//       data: {
//         email: payload.email!,
//         password: "", // No password needed for OAuth users
//       },
//     });
//   }

//   const jwt = await signToken({
//     id: user.id,
//     email: user.email,
//     isAdmin: user.isAdmin,
//   });

//   (await cookies()).set({
//     name: process.env.JWT_KEY!,
//     value: jwt,
//     httpOnly: true,
//     secure: true,
//     path: "/",
//   });

//   redirect("/");
// }
