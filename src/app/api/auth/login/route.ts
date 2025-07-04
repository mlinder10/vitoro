import { db, users } from "@/db";
import { authenticate, verifyPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password)
    return new Response("Missing email or password", { status: 400 });

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return new Response("Invalid email or password", { status: 401 });

  if (!(await verifyPassword(password, user.password)))
    return new Response("Invalid email or password", { status: 401 });

  const token = await authenticate(user);

  return new Response(token, { status: 200 });
}
