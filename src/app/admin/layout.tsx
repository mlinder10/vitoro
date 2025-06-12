import { ReactNode } from "react";
import AdminHeader from "./_components/admin-header";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  // TODO: check auth status

  return (
    <>
      <AdminHeader />
      {children}
    </>
  );
}
