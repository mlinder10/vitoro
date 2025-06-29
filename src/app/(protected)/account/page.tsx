"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/contexts/session-provider";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowLeftRight } from "lucide-react";

export default function AccountPage() {
  const session = useSession();

  return (
    <div className="space-y-8 mx-auto p-6 max-w-3xl">
      <h1 className="font-bold text-3xl">Account Settings</h1>

      <AccountSection title="Profile">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input type="text" value="Matt Linder" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={session.email} readOnly />
          </div>
          <Button variant="accent">
            <span>Change Password</span>
            <ArrowLeftRight />
          </Button>
        </div>
      </AccountSection>

      <AccountSection title="Subscription">
        <div>
          <p>You are currently on a free plan</p>
        </div>
      </AccountSection>

      <AccountSection
        title="Danger Zone"
        className="border-2 border-destructive"
      >
        <Button variant="destructive">
          <span>Delete Account</span>
          <AlertCircle />
        </Button>
      </AccountSection>
    </div>
  );
}

type AccountSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function AccountSection({ title, children, className }: AccountSectionProps) {
  return (
    <section
      className={cn("bg-card shadow-sm p-6 border rounded-xl", className)}
    >
      <h2 className="mb-4 font-semibold text-xl">{title}</h2>
      {children}
    </section>
  );
}
