import QBankSessionProvider from "@/contexts/qbank-session-provider";

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QBankSessionProvider>{children}</QBankSessionProvider>;
}
