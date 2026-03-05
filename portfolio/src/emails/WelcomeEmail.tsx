import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userEmail: string;
  nickname: string;
}

export default function WelcomeEmail({ userEmail, nickname }: WelcomeEmailProps) {
  // Grab the URL from the environment, or default to the live site
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://brianmaina.de";
  return (
    <Html>
      <Head />
      <Preview>Great connecting with you</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={text}>Hi {nickname},</Text>
          
          <Text style={text}>
            Thanks for reaching out and requesting a quote. I also saw you checked the box to stay in touch, and I really appreciate that.
          </Text>
          
          <Text style={text}>
            I occasionally share updates on my freelance availability, along with some behind the scenes looks at my visual design and UI/UX projects. I like to keep things simple and valuable.
          </Text>

          <Text style={text}>
            If you ever want to chat about design or have questions about a project, feel free to reply directly to this email. I read every response.
          </Text>
          
          <Text style={text}>
            Talk soon,<br />
            Brian
          </Text>

          <Text style={footer}>
            P.S. To make sure you don&apos;t miss my reply to your quote request, please move this email to your Primary inbox.
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

const footer = {
  color: "#1a1a1a",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "32px 0 16px",
  fontStyle: "italic",
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