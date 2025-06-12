"use client";

import { useState } from "react";
import { handleFetchUsers, handleUpdateAdminStatus } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader, Minus, Plus } from "lucide-react";
import Searchbar from "@/components/searchbar";
import useInfiniteScroll, { LoadingFooter } from "@/hooks/useInfiniteScroll";

type User = Awaited<ReturnType<typeof handleFetchUsers>>[number];

const MAX_ITEMS_PER_PAGE = 30;

export default function PromotePage() {
  const [search, setSearch] = useState("");
  const {
    data: users,
    isLoading,
    containerRef,
  } = useInfiniteScroll<User>(
    async (offset) => handleFetchUsers(offset, MAX_ITEMS_PER_PAGE, search),
    [search]
  );

  return (
    <main className="flex flex-col h-page">
      <section>
        <Searchbar
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>
      <section className="flex-1 overflow-y-auto" ref={containerRef}>
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
    <li className="flex justify-between items-center p-2">
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
