"use client";
import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, LogIn } from "lucide-react";
import { handleVerification } from "../actions";
import { useRouter } from "next/navigation";

export default function ResetCodePage() {
  const [error, action, isPending] = useActionState(onSubmit, {});
  const router = useRouter();

  async function onSubmit(_: unknown, data: FormData) {
    const res = await handleVerification(data);
    if (res.success) router.push(res.redirectTo);
    else if (res.success === false) return res;
  }

  return (
    <main className="place-items-center grid bg-secondary h-screen">
      <form
        action={action}
        className="flex flex-col gap-4 bg-background p-6 rounded-md w-3/4 md:w-2/5"
      >
        <h1 className="mx-auto font-bold text-2xl">Verify Code</h1>

        <div className="flex flex-col gap-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input type="text" name="code" id="code" placeholder="123456" />
          {error?.code && (
            <p className="text-destructive text-sm">{error.code}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending} variant="accent">
          {isPending ? (
            <>
              <span>Verifying...</span>
              <Loader className="animate-spin" />
            </>
          ) : (
            <>
              <span>Verify</span>
              <LogIn />
            </>
          )}
        </Button>
      </form>
    </main>
  );
}
