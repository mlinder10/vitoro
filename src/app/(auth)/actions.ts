"use server";

import db from "@/db/db";
import { sendRegisterEmail } from "@/email/register-auto-reply";
import { sendResetPasswordEmail } from "@/email/reset-password";
import { hashPassword, signToken, verifyPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
// import { OAuth2Client } from "google-auth-library";

const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

// ============================
// Login
// ============================

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export async function handleLogin(_: unknown, data: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result.success) return result.error.formErrors.fieldErrors;

  const user = await db.user.findUnique({
    where: { email: result.data.email },
    select: {
      id: true,
      email: true,
      password: true,
      admin: { select: { userId: true } },
    },
  });
  if (!user) return { email: ["Invalid email or password"] };

  if (!(await verifyPassword(result.data.password, user.password)))
    return { email: ["Invalid email or password"] };

  const token = await signToken({
    id: user.id,
    email: user.email,
    isAdmin: user.admin?.userId ? true : false,
  });

  (await cookies()).set({
    name: process.env.JWT_KEY!,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: process.env.DOMAIN,
    path: "/",
  });

  redirect("/");
}

// ============================
// Register
// ============================

const registerSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export async function handleRegister(_: unknown, data: FormData) {
  const result = registerSchema.safeParse(Object.fromEntries(data.entries()));
  if (!result.success) return result.error.formErrors.fieldErrors;

  if (result.data.password !== result.data.confirmPassword)
    return { confirmPassword: ["Passwords do not match"] };

  const user = await db.user.findUnique({
    where: { email: result.data.email },
  });
  if (user) return { email: ["User already exists"] };

  const hashedPassword = await hashPassword(result.data.password);
  const newUser = await db.user.create({
    data: {
      email: result.data.email,
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      password: hashedPassword,
    },
  });

  const token = await signToken({
    id: newUser.id,
    email: newUser.email,
    isAdmin: false,
  });

  (await cookies()).set({
    name: process.env.JWT_KEY!,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: process.env.DOMAIN!,
    path: "/",
  });
  sendRegisterEmail(result.data.email);
  redirect("/");
}

// ============================
// Reset Password
// ============================

const resetPasswordSchemaEmail = z.object({
  email: z.string().email(),
});

export type HandleEmailSendingResult = {
  email?: string | string[];
};

export async function handleEmailSending(
  _: unknown,
  data: FormData
): Promise<HandleEmailSendingResult> {
  const result = resetPasswordSchemaEmail.safeParse(
    Object.fromEntries(data.entries())
  );
  if (!result.success) return result.error.formErrors.fieldErrors;

  const user = await db.user.findUnique({
    where: { email: result.data.email },
  });
  if (!user) return { email: "User does not exist" };

  const code = generateResetCode();
  await sendResetPasswordEmail(result.data.email, code);

  await db.resetPassword.upsert({
    where: { userId: user.id },
    update: {
      code: String(code),
      validUntil: new Date(Date.now() + TEN_MINUTES_IN_MS),
    },
    create: {
      code: String(code),
      validUntil: new Date(Date.now() + TEN_MINUTES_IN_MS),
      userId: user.id,
    },
  });

  redirect("/reset-code");
}

const resetPasswordSchemaVerification = z.object({
  code: z.string(),
});
type HandleVerificationProps = {
  code?: string[] | string;
};
export async function handleVerification(
  _: unknown,
  data: FormData
): Promise<HandleVerificationProps> {
  const result = resetPasswordSchemaVerification.safeParse(
    Object.fromEntries(data.entries())
  );
  if (!result.success) return result.error.formErrors.fieldErrors;

  const resetPassword = await db.resetPassword.findUnique({
    where: { code: result.data.code },
  });
  if (!resetPassword) return { code: "Invalid code" };
  if (resetPassword.validUntil < new Date())
    return { code: "Code has expired" };
  redirect(`/reset-code/${resetPassword.id}`);
}

const handlPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

type handlePasswordResetProps = {
  success?: boolean;
  password?: string[] | string;
  confirmPassword?: string[] | string;
};

export async function handlePasswordReset(
  resetPassId: string,
  _: unknown,
  data: FormData
): Promise<handlePasswordResetProps> {
  const result = handlPasswordSchema.safeParse(
    Object.fromEntries(data.entries())
  );
  if (!result.success) return result.error.formErrors.fieldErrors;

  if (result.data.password !== result.data.confirmPassword)
    return { confirmPassword: "Passwords do not match" };

  const resetPassword = await db.resetPassword.findUnique({
    where: { id: resetPassId },
  });
  const user = await db.user.findUnique({
    where: { id: resetPassword?.userId },
  });

  const hashedPassword = await hashPassword(result.data.password);
  await db.user.update({
    where: { id: user?.id },
    data: { password: hashedPassword },
  });

  return { success: true };
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
//     sameSite: "none",
//     domain: process.env.DOMAIN,
//     path: "/",
//   });

//   redirect("/");
// }
