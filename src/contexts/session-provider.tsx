"use client";

import { Session } from "@/lib/auth";
import { createContext, ReactNode, useContext } from "react";

const SessionContext = createContext<Session>({
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  color: "",
  exam: "Step 1",
  isAdmin: false,
});

type SessionProvider = {
  session: Session;
  children: ReactNode;
};

export default function SessionProvider({
  children,
  session,
}: SessionProvider) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
