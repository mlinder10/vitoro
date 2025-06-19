"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, LogIn } from "lucide-react";
import { useActionState } from "react";
import { handleEmailSending } from "../actions";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [error, action, isPending] = useActionState(onSubmit, {});
  const router = useRouter();

  async function onSubmit(_: unknown, data: FormData) {
    const res = await handleEmailSending(data);
    if (res.success) router.push(res.redirectTo);
    else if (res.success === false) return res;
  }

  return (
    <main className="place-items-center grid h-page">
      <form action={action} className="flex flex-col gap-4 w-3/4 md:w-1/4">
        <h1 className="mx-auto font-bold text-2xl">Reset Password</h1>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="name@email.com"
          />
          {error?.email && (
            <p className="text-destructive text-sm">{error.email}</p>
          )}
        </div>
        <Button type="submit" disabled={isPending} variant="accent">
          {isPending ? (
            <>
              <span>Sending...</span>
              <Loader className="animate-spin" />
            </>
          ) : (
            <>
              <span>Reset Password</span>
              <LogIn />
            </>
          )}
        </Button>
      </form>
    </main>
  );
}
