"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader } from "lucide-react";
import { useActionState } from "react";
import { handleRegister } from "../actions";

export default function RegisterPage() {
  const [error, action, isPending] = useActionState(handleRegister, {});

  return (
    <main className="place-items-center grid h-page">
      <form action={action} className="flex flex-col items-center gap-6 w-1/4">
        <div className="relative">
          <h1 className="font-bold text-4xl">Register</h1>
          <div className="top-[110%] absolute bg-gradient-to-r from-custom-accent w-full h-[2px] to-custom-accent-secondary" />
        </div>
        <p className="text-muted-foreground">Welcome to Vitoro!</p>
        <div className="space-y-2 w-full">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@email.com"
          />
          {error?.email && (
            <p className="text-destructive text-sm">{error.email}</p>
          )}
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="firstname">First Name</Label>
          <Input
            id="firstname"
            name="firstName"
            type="text"
            placeholder="First"
          />
          {error?.firstName && (
            <p className="text-destructive text-sm">{error.firstName}</p>
          )}
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="lastname">Last Name</Label>
          <Input id="lastname" name="lastName" type="text" placeholder="Name" />
          {error?.lastName && (
            <p className="text-destructive text-sm">{error.lastName}</p>
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
          {error?.password && (
            <p className="text-destructive text-sm">{error.password}</p>
          )}
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="confirmpassword">Confirm Password</Label>
          <Input
            id="confirmpassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
          />
          {error?.confirmPassword && (
            <p className="text-destructive text-sm">{error.confirmPassword}</p>
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
                <span>Registering...</span>
                <Loader className="animate-spin" />
              </>
            ) : (
              <>
                <span>Register</span>
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </form>
    </main>
  );
}
