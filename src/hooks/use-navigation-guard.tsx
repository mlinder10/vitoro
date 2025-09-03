import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function sendProgress(questionId: string, completed: number, total: number) {
  if (typeof navigator === "undefined") return;
  const payload = JSON.stringify({ questionId, completed, total });
  navigator.sendBeacon("/api/foundational/progress", payload);
}

export function useNavigationGuard(
  questionId: string,
  completed: number,
  total: number
) {
  const pathname = usePathname();

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (completed < total) {
        e.preventDefault();
        e.returnValue = "";
        sendProgress(questionId, completed, total);
      }
    }

    const handleRouteChange = () => {
      if (completed < total && !confirm("Are you sure you want to leave?")) {
        history.pushState(null, "", pathname);
      } else if (completed > 0) {
        sendProgress(questionId, completed, total);
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [completed, questionId, pathname, total]);
}

