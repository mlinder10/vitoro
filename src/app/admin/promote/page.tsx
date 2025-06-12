"use client";

import { useEffect, useState } from "react";
import { handleFetchUsers, handleUpdateAdminStatus } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader, Minus, Plus } from "lucide-react";
import Searchbar from "@/components/searchbar";

type User = Awaited<ReturnType<typeof handleFetchUsers>>[number];

export default function PromotePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // use debounce to fetch new users after 1s of inactivity
    async function fetchUsers() {
      if (timer) clearTimeout(timer);
      const timeout = setTimeout(async () => {
        const users = await handleFetchUsers(
          search.length > 0 ? search : undefined
        );
        setUsers(users);
      }, 1000);
      setTimer(timeout);
    }

    fetchUsers();
  }, [search]);

  return (
    <main className="h-page">
      <section>
        <Searchbar
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>
      <section>
        <ul>
          {users.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </ul>
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
