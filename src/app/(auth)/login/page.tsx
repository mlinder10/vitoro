"use client";

import AccentLink from "@/components/accent-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader } from "lucide-react";
import { useActionState } from "react";
import { handleLogin } from "../actions";

export default function LoginPage() {
  const [error, action, isPending] = useActionState(handleLogin, {});

  return (
    <main className="place-items-center grid h-page">
      <form action={action} className="flex flex-col items-center gap-6 w-1/4">
        <div className="relative">
          <h1 className="font-bold text-4xl">Login</h1>
          <div className="top-[110%] absolute bg-gradient-to-r from-custom-accent w-full h-[2px] to-custom-accent-secondary" />
        </div>
        <p className="text-muted-foreground">Welcome back to Vitado!</p>
        <div className="space-y-2 w-full">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@email.com"
          />
          {error.email && (
            <p className="text-destructive text-sm">{error.email}</p>
          )}
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
          />
          {error.password && (
            <p className="text-destructive text-sm">{error.password}</p>
          )}
        </div>
        <div className="space-y-2 w-full">
          <Button
            type="submit"
            variant="accent"
            className="w-full font-semibold"
          >
            {isPending ? (
              <>
                <span>Loading...</span>
                <Loader className="animate-spin" />
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight />
              </>
            )}
          </Button>
          <AccentLink
            href="/forgot-password"
            className="mr-auto text-sm"
            accent="tertiary"
          >
            Forgot Password
          </AccentLink>
        </div>
      </form>
    </main>
  );
}
