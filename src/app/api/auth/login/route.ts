import db from "@/db/db";
import { signToken, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password)
    return new Response("Missing email or password", { status: 400 });
  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      color: true,
      password: true,
      admin: { select: { userId: true } },
    },
  });

  if (!user) return new Response("Invalid email or password", { status: 401 });

  if (!(await verifyPassword(password, user.password)))
    return new Response("Invalid email or password", { status: 401 });

  const token = await signToken({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    color: user.color,
    isAdmin: user.admin?.userId ? true : false,
  });

  return new Response(token, { status: 200 });
}
