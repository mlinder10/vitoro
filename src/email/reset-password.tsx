import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import getResend from "./resend";

type ResetPasswordCodeEmailProps = {
  code: string;
};

export default function ResetPasswordCodeEmail({
  code,
}: ResetPasswordCodeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Vitoro password reset code</Preview>
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
            Reset Your Password
          </Heading>
          <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>
            Use the code below to reset your Vitoro password. It will expire in
            10 minutes.
          </Text>

          <div
            style={{
              textAlign: "center",
              margin: "24px 0",
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "6px",
              fontSize: "20px",
              letterSpacing: "2px",
              fontWeight: "bold",
            }}
          >
            {code}
          </div>

          <Text style={{ fontSize: "14px", lineHeight: "1.6" }}>
            Enter this code on the Vitoro website to continue resetting your
            password.
          </Text>

          <Hr />
          <Text style={{ fontSize: "12px", color: "#888" }}>
            Didn’t request this? You can ignore this message or contact us at{" "}
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

export async function sendResetPasswordEmail(email: string, code: string) {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: process.env.VITORO_EMAIL!,
      to: email,
      subject: "Your Vitoro Password Reset Code",
      react: <ResetPasswordCodeEmail code={code} />,
      text: `Your Vitoro password reset code is: ${code}`,
    });
  } catch {
    return { error: "Failed to send reset code email" };
  }
}
