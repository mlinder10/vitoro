"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCheck, Loader, LogIn } from "lucide-react";
import { handlePasswordReset } from "@/app/(auth)/actions";
import AccentLink from "@/components/accent-link";

export default function PageContent({ id }: { id: string }) {
  const [error, action, isPending] = useActionState(
    handlePasswordReset.bind(null, id),
    {}
  );

  return (
    <main className="place-items-center grid bg-secondary h-screen">
      <form
        action={action}
        className="flex flex-col gap-4 bg-background p-6 rounded-md w-3/4 md:w-2/5"
      >
        <h1 className="mx-auto font-bold text-2xl">
          {error.success ? "Password Reset" : "Reset Your Password"}
        </h1>
        {!error.success ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCheck size={64} className="my-4 text-muted-foreground" />
            <div className="flex gap-1">
              <p>Your password has been reset.</p>
              <AccentLink href="/login">Login</AccentLink>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Enter new password"
              />
              {error?.password && (
                <p className="text-destructive text-sm">{error.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
              />
              {error?.confirmPassword && (
                <p className="text-destructive text-sm">
                  {error.confirmPassword}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isPending} variant="accent">
              {isPending ? (
                <>
                  <span>Resetting...</span>
                  <Loader className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <LogIn />
                </>
              )}
            </Button>
          </>
        )}
      </form>
    </main>
  );
}
