"use client";

import { useEffect, useState } from "react";
import { handleFetchUsers, handleUpdateAdminStatus } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader, Minus, Plus } from "lucide-react";
import Searchbar from "@/components/searchbar";
import useInfiniteScroll, { LoadingFooter } from "@/hooks/use-infinite-scroll";

type User = Awaited<ReturnType<typeof handleFetchUsers>>[number];

const MAX_ITEMS_PER_PAGE = 30;
const DELAY = 500; // 0.5 seconds

export default function PromotePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), DELAY);
    return () => clearTimeout(handler);
  }, [search]);

  const {
    data: users,
    isLoading,
    containerRef,
  } = useInfiniteScroll<User>(
    async (offset) =>
      handleFetchUsers(offset, MAX_ITEMS_PER_PAGE, debouncedSearch),
    [debouncedSearch]
  );

  return (
    <main className="flex flex-col h-page">
      <section className="p-4 border-b-2">
        <Searchbar
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>
      <section className="flex-1 p-4 overflow-y-auto" ref={containerRef}>
        <ul>
          {users.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </ul>
        <LoadingFooter isLoading={isLoading} />
      </section>
    </main>
  );
}

type UserItemProps = {
  user: User;
};

function UserItem({ user }: UserItemProps) {
  const [isAdmin, setIsAdmin] = useState(user.admin?.userId ? true : false);
  const [isLoading, setIsLoading] = useState(false);

  async function updateAdminStatus() {
    setIsLoading(true);
    const newIsAdmin = await handleUpdateAdminStatus(user.id, isAdmin);
    setIsAdmin(newIsAdmin);
    setIsLoading(false);
  }

  return (
    <li className="flex justify-between items-center p-2 border-b-2">
      <div>
        <p>
          {user.firstName} {user.lastName}
        </p>
        <p className="text-muted-foreground text-sm">{user.email}</p>
      </div>
      <Button
        variant={isAdmin ? "destructive" : "accent"}
        disabled={isLoading}
        onClick={updateAdminStatus}
      >
        {isLoading ? (
          <>
            <span>Loading</span>
            <Loader className="animate-spin" />
          </>
        ) : (
          <>
            <span>{isAdmin ? "Demote" : "Promote"}</span>
            {isAdmin ? <Minus /> : <Plus />}
          </>
        )}
      </Button>
    </li>
  );
}
