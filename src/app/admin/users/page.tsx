"use client";

import PaginationFooter from "@/components/pagination-footer";
import Searchbar from "@/components/searchbar";
import { useEffect, useState } from "react";
import { handleFetchUsers, handleUpdateAdminStatus } from "./actions";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader, Minus, Plus } from "lucide-react";

type User = Awaited<ReturnType<typeof handleFetchUsers>>[number];

const MAX_ITEMS_PER_PAGE = 30;
const DELAY = 500; // 0.5 seconds

export default function UsersPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageNum = page ? Number(page) : 1;
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      setIsLoading(true);
      const response = await handleFetchUsers(
        (pageNum - 1) * MAX_ITEMS_PER_PAGE,
        MAX_ITEMS_PER_PAGE,
        search
      );
      setUsers(response);
      setIsLoading(false);
    }, DELAY);
    return () => clearTimeout(handler);
  }, [search, pageNum]);

  return (
    <main className="flex flex-col h-full">
      <section className="p-4 border-b-2">
        <Searchbar
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>
      <section className="flex-1 p-4 overflow-y-auto">
        <ul>
          {users.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </ul>
      </section>
      <div className="p-4">
        <PaginationFooter page={pageNum} />
      </div>
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
