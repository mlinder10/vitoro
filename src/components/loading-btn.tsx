import { ReactNode } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingButtonProps = ButtonProps & {
  children: ReactNode;
  loadingText?: string;
  loading?: boolean;
};

export default function LoadingButton({
  children,
  loadingText,
  loading,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={loading}
      className={cn(props.className, "flex items-center gap-2")}
    >
      {!loading && children}
      {loading && (
        <>
          <Loader className="animate-spin" size={16} />
          {loadingText && <span>{loadingText}</span>}
        </>
      )}
    </Button>
  );
}
