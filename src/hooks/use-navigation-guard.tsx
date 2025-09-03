import { useEffect } from "react";
import { usePathname } from "next/navigation";
import legacyRouter from "next/router";

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
    function confirmNavigation() {
      return completed < total ? confirm("Are you sure you want to leave?") : true;
    }

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (completed < total) {
        e.preventDefault();
        e.returnValue = "";
      }
      if (completed > 0) {
        sendProgress(questionId, completed, total);
      }
    }

    function handlePopState() {
      if (!confirmNavigation()) {
        history.pushState(null, "", pathname);
      } else if (completed > 0) {
        sendProgress(questionId, completed, total);
      }
    }

    function handleRouteChangeStart() {
      if (!confirmNavigation()) {
        legacyRouter.events.emit("routeChangeError");
        throw new Error("Route change aborted by user");
      }
      if (completed > 0) {
        sendProgress(questionId, completed, total);
      }
    }

    legacyRouter.events.on("routeChangeStart", handleRouteChangeStart);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      legacyRouter.events.off("routeChangeStart", handleRouteChangeStart);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [completed, questionId, pathname, total]);
}

