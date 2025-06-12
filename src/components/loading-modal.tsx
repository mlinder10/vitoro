import { Loader2Icon } from "lucide-react";

type LoadingModalProps = {
  isLoading: boolean;
};

export default function LoadingModal({ isLoading }: LoadingModalProps) {
  if (!isLoading) return null;
  return (
    <div className="absolute inset-0 place-items-center grid backdrop-blur-md">
      <Loader2Icon className="animate-spin" />
    </div>
  );
}
