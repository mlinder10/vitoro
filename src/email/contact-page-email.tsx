"use server";

import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import resend from "./resend";

type ContactPageEmailProps = {
  email: string;
  firstName: string;
  lastName: string;
  message: string;
};

function ContactPageEmail({
  email,
  firstName,
  lastName,
  message,
}: ContactPageEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Message from User</Preview>
      <Body>
        <Container>
          <Text>
            <strong>Name:</strong> {firstName} {lastName}
          </Text>
          <Text>
            <strong>Email:</strong> {email}
          </Text>
          <Text>
            <strong>Message:</strong> {message}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export async function sendContactPageEmail(
  email: string,
  firstName: string,
  lastName: string,
  message: string
) {
  try {
    await resend.emails.send({
      from: process.env.VITORO_EMAIL!,
      to: process.env.VITORO_EMAIL!,
      subject: "Contact Page Email",
      react: (
        <ContactPageEmail
          email={email}
          firstName={firstName}
          lastName={lastName}
          message={message}
        />
      ),
    });
  } catch {
    return { error: "Failed to send email" };
  }
}
