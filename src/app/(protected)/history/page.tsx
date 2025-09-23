import { getSession } from "@/lib/auth";
import ClientHistoryPage from "./client-history-page";
import { getSessions } from "./actions";

export default async function HistoryPage() {
  const { id } = await getSession();
  const { sessions, stepOneFoundationals, stepTwoFoundationals } =
    await getSessions(id);
  return (
    <ClientHistoryPage
      sessions={sessions}
      stepOneFoundationals={stepOneFoundationals}
      stepTwoFoundationals={stepTwoFoundationals}
    />
  );
}
