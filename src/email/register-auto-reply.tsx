import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Link,
} from "@react-email/components";
import { ACCENT_COLOR, APP_URL } from "@/lib/constants";
import resend from "./resend";

export default async function RegisterAutoReply() {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Vitoro — your new favorite study space</Preview>
      <Body
        style={{
          backgroundColor: "#f9fafb",
          padding: "40px 0",
          fontFamily: "sans-serif",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "32px",
            borderRadius: "8px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Heading
            style={{
              textAlign: "center",
              fontSize: "24px",
              marginBottom: "12px",
            }}
          >
            Welcome to Vitoro 👋
          </Heading>
          <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>
            We&apos;re so excited you&apos;ve joined us! Vitoro is your
            intelligent study space.
          </Text>
          <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque
            doloribus qui reprehenderit alias assumenda. Voluptates amet est
            illo error cupiditate.
          </Text>

          <div style={{ textAlign: "center", margin: "24px 0" }}>
            <Button
              href={APP_URL}
              style={{
                backgroundColor: ACCENT_COLOR,
                color: "#ffffff",
                fontSize: "16px",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Start Studying Now →
            </Button>
          </div>

          <Hr />
          <Text style={{ fontSize: "12px", color: "#888" }}>
            If you didn&apos;t sign up for Vitoro, you can ignore this message
            or contact us at
            <Link href="mailto:teamvitado@gmail.com">
              {"teamvitado@gmail.com"}
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export async function sendRegisterEmail(email: string) {
  try {
    await resend.emails.send({
      from: process.env.VITORO_EMAIL!,
      to: email,
      subject: "Welcome to Vitoro — Let's study ✍️",
      react: <RegisterAutoReply />,
      text: "Welcome to Vitoro — Let's study ✍️",
    });
  } catch {
    return { error: "Failed to send email" };
  }
}
