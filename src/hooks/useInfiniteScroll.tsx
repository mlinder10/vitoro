import { Loader } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

export default function useInfiniteScroll<T>(
  fetchMore: (offset: number) => Promise<T[]>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLElement>(null);
  const isFetchingRef = useRef(false); // lock to prevent duplicate fetches

  const fetchMoreData = useCallback(async () => {
    if (!hasMore || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    const offset = data.length;
    const response = await fetchMore(offset);

    setIsLoading(false);
    isFetchingRef.current = false;

    if (response.length === 0) {
      setHasMore(false);
    } else {
      setData((prev) => [...prev, ...response]);
    }
  }, [data.length, fetchMore, hasMore]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;

      if (hasMore && nearBottom && !isFetchingRef.current) {
        fetchMoreData();
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [fetchMoreData, hasMore]);

  const fetchFreshData = useCallback(async () => {
    isFetchingRef.current = true;
    setIsLoading(true);
    const freshData = await fetchMore(0);
    setIsLoading(false);
    isFetchingRef.current = false;
    setData(freshData);
    setHasMore(true);
  }, [fetchMore]);

  useEffect(() => {
    fetchFreshData();
  }, deps);

  return { data, isLoading, containerRef };
}

export function LoadingFooter({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">Loading...</span>
        <Loader
          className="text-muted-foreground text-sm animate-spin"
          size={16}
        />
      </div>
    </div>
  );
}
