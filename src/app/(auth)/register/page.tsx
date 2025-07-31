"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { useActionState } from "react";
import { handleRegister } from "../actions";
import FormTextInput from "@/components/form-text-input";
import FormSelect from "@/components/form-select";

export default function RegisterPage() {
  const [error, action, isPending] = useActionState(handleRegister, {});

  return (
    <main className="place-items-center grid py-8 h-page">
      <form action={action} className="flex flex-col items-center gap-6 w-1/4">
        <div className="relative">
          <h1 className="font-bold text-4xl">Register</h1>
          <div className="top-[110%] absolute bg-gradient-to-r from-custom-accent w-full h-[2px] to-custom-accent-secondary" />
        </div>
        <p className="text-muted-foreground">Welcome to Vitoro!</p>
        <FormTextInput
          label="Email"
          name="email"
          placeholder="yourname@email.com"
          type="email"
          error={error?.email}
        />
        <FormTextInput
          label="First Name"
          name="firstName"
          placeholder="First Name"
          error={error?.firstName}
        />
        <FormTextInput
          label="Last Name"
          name="lastName"
          placeholder="Last Name"
          error={error?.lastName}
        />
        <FormTextInput
          label="Anticipated Graduation Year"
          name="gradYear"
          placeholder="2026"
          error={error?.gradYear}
        />
        <FormSelect
          label="Exam"
          name="exam"
          placeholder="Step 1"
          options={["Step 1", "Step 2"]}
          error={error?.exam}
        />
        <FormTextInput
          label="Password"
          name="password"
          placeholder="••••••••"
          type="password"
          error={error?.password}
        />
        <FormTextInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="••••••••"
          type="password"
          error={error?.confirmPassword}
        />

        {/* Create container for optional information */}
        {/* <div>
          <FormTextInput
            label="What school do you attend?"
            name="school"
            placeholder="UofSC"
            error={undefined}
          />
          <FormTextInput
            label="What are your favorite study tools?"
            name="studyTools"
            placeholder="Anki, UWorld, etc."
            error={undefined}
          />
          <FormTextInput
            label="How did you hear about us?"
            name="referral"
            placeholder="Social media, word of mouth, etc."
            error={undefined}
          />
        </div> */}

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
