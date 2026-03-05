import { Body, Container, Head, Html, Preview, Text, Link } from "@react-email/components";
import * as React from "react";

// Changed interface name
interface VerificationEmailProps {
  userEmail: string;
  nickname: string;
  token: string; 
}

export default function VerificationEmail({ userEmail, nickname, token }: VerificationEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://brianmaina.de";

  return (
    <Html>
      <Head />
      <Preview>Please verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={text}>Hi {nickname},</Text>
          
          <Text style={text}>
            Thanks for reaching out and requesting a quote! I have received your details and will review them shortly.
          </Text>
          
          <Text style={text}>
            You also checked the box to join my design newsletter. To ensure no one else used your email address, please click the link below to confirm your subscription:
          </Text>

          <Text style={text}>
            <Link href={`${baseUrl}/verify?token=${token}`} style={button}>
              Verify My Email
            </Link>
          </Text>

          <Text style={text}>
            If you did not request this, you can safely ignore this email and you will not be subscribed.
          </Text>
          
          <Text style={text}>
            Talk soon,<br />
            Brian
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Minimal styles
const main = { backgroundColor: "#ffffff", fontFamily: '-apple-system, sans-serif' };
const container = { margin: "0", padding: "20px 0", maxWidth: "600px" };
const text = { color: "#1a1a1a", fontSize: "15px", lineHeight: "24px", margin: "0 0 16px" };
const button = { backgroundColor: "#0d9488", color: "#ffffff", padding: "12px 20px", borderRadius: "6px", textDecoration: "none", display: "inline-block", fontWeight: "500" };