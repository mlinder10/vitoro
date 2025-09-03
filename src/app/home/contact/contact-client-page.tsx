"use client";

import GradientTitle from "@/components/gradient-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Session } from "@/lib/auth";
import useContact from "./use-contact";
import { Header } from "../header";
import { INNER_WIDTH, SECTION_HEIGHT } from "../constants";

type ContactClientPageProps = {
  session: Session | null;
};

export default function ContactClientPage({ session }: ContactClientPageProps) {
  const {
    email,
    setEmail,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    message,
    setMessage,
    isDisabled,
    handleSendEmail,
    formatSendButton,
  } = useContact(session);

  return (
    <>
      <Header session={session} />
      <div
        className="flex flex-col gap-8 mx-auto py-8"
        style={{ minHeight: SECTION_HEIGHT, maxWidth: INNER_WIDTH }}
      >
        <GradientTitle text="Contact" className="font-bold text-4xl" />
        <div className="flex flex-col gap-4 bg-tertiary p-4 border rounded-md">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">Send Us A Message</p>
            <p className="text-muted-foreground text-sm">
              We&apos;d love to hear from you
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-32 resize-none"
            />
          </div>
          <Button
            variant="accent"
            onClick={handleSendEmail}
            disabled={isDisabled}
          >
            <span>{formatSendButton()}</span>
          </Button>
        </div>
      </div>
    </>
  );
}
