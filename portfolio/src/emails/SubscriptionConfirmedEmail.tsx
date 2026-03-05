import { Body, Container, Head, Html, Preview, Text, Link } from "@react-email/components";
import * as React from "react";

interface SubscriptionConfirmedEmailProps {
  nickname: string;
  userEmail: string;
}

export default function SubscriptionConfirmedEmail({ nickname, userEmail }: SubscriptionConfirmedEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://brianmaina.de";

  return (
    <Html>
      <Head />
      <Preview>Welcome! Your subscription is confirmed.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={text}>Hi {nickname},</Text>
          
          <Text style={text}>
            Your email is verified and your subscription is officially confirmed! 
          </Text>
          
          <Text style={text}>
            As promised, you will now receive occasional updates on my freelance availability, along with some behind the scenes looks at my visual design and UI/UX projects. I like to keep things simple and valuable.
          </Text>

          <Text style={text}>
            If you ever want to chat about design or have questions about a project, feel free to reply directly to this email. I read every response.
          </Text>
          
          <Text style={text}>
            Talk soon,<br />
            Brian
          </Text>

          <Text style={finePrint}>
            You are receiving this because you opted in at brianmaina.de. If you prefer not to get these updates, you can reply &quot;Unsubscribe&quot; or <Link href={`${baseUrl}/unsubscribe?email=${userEmail}`} style={link}>click here to unsubscribe</Link> at any time. (Sent to: {userEmail})
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Minimal, plain text mimicking styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  margin: "0",
  padding: "20px 0",
  maxWidth: "600px",
};

const text = {
  color: "#1a1a1a",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const finePrint = {
  color: "#888888",
  fontSize: "12px",
  lineHeight: "18px",
  marginTop: "48px",
};

const link = {
  color: "#888888",
  textDecoration: "underline",
};