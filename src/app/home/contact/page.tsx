import { tryGetSession } from "@/lib/auth";
import ContactClientPage from "./contact-client-page";

export default async function ContactPage() {
  const session = await tryGetSession();
  return <ContactClientPage session={session} />;
}
