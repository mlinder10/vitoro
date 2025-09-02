import { sendContactPageEmail } from "@/email/contact-page-email";
import { Session } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";

type SendStatus = "pending" | "error" | "success" | "idle";

export default function useContact(session: Session | null) {
  const [email, setEmail] = useState(session?.email ?? "");
  const [firstName, setFirstName] = useState(session?.firstName ?? "");
  const [lastName, setLastName] = useState(session?.lastName ?? "");
  const [message, setMessage] = useState("");
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const isDisabled =
    !email || !firstName || !lastName || !message || sendStatus !== "idle";

  async function handleSendEmail() {
    if (isDisabled) {
      toast.error("Please fill out all fields", { richColors: true });
      return;
    }
    setSendStatus("pending");
    try {
      await sendContactPageEmail(email, firstName, lastName, message);
      setSendStatus("success");
    } catch (err) {
      console.error(err);
      setSendStatus("error");
    }
  }

  function formatSendButton() {
    switch (sendStatus) {
      case "pending":
        return "Sending...";
      case "success":
        return "Message Sent!";
      case "error":
        return "Failed to send message";
      default:
        return "Send Message";
    }
  }

  return {
    email,
    setEmail,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    message,
    setMessage,
    setSendStatus,
    isDisabled,
    handleSendEmail,
    formatSendButton,
  };
}
