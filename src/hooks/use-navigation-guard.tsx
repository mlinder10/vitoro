import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();

  const confirmNavigation = useCallback(() => {
    return completed < total ? confirm("Are you sure you want to leave?") : true;
  }, [completed, total]);

  function navigate(action: () => void) {
    if (!confirmNavigation()) return;
    if (completed > 0) {
      sendProgress(questionId, completed, total);
    }
    action();
  }

  function push(url: string) {
    navigate(() => router.push(url));
  }

  function replace(url: string) {
    navigate(() => router.replace(url));
  }

  function refresh() {
    if (completed > 0) {
      sendProgress(questionId, completed, total);
    }
    router.refresh();
  }

  useEffect(() => {
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

    function handleLinkClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      if (!confirmNavigation()) {
        e.preventDefault();
      } else if (completed > 0) {
        sendProgress(questionId, completed, total);
      }
    }

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleLinkClick);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleLinkClick);
    };
  }, [completed, questionId, pathname, total, confirmNavigation]);

  return { push, replace, refresh };
}

