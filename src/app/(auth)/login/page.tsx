import AccentLink from "@/components/accent-link";
// import Blob from "@/components/blob";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="place-items-center grid h-page">
      {/* <Blob
        color="secondary"
        className={cn("z-[-1] top-[-12%] right-[-12%] absolute w-1/2")}
      />
      <Blob
        color="tertiary"
        className={cn("z-[-1] top-[6%] left-[18%] absolute w-1/4")}
      />
      <Blob
        color="primary"
        className={cn("z-[-1] bottom-[0%] left-[0%] absolute w-1/3")}
      /> */}
      <form action="" className="flex flex-col items-center gap-6 w-1/4">
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
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
          />
        </div>
        <div className="space-y-2 w-full">
          <Button
            type="submit"
            variant="accent"
            className="w-full font-semibold"
          >
            <span>Login</span>
            <ArrowRight />
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
