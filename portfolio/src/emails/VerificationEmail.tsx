import { Body, Container, Head, Html, Preview, Text, Link, Section } from "@react-email/components";
import * as React from "react";

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
          <Section style={contentSection}>
            <Text style={greeting}>Hi {nickname},</Text>
            
            <Text style={text}>
              Thanks for reaching out and requesting a quote! I have received your details and will review them shortly.
            </Text>
            
            <Text style={text}>
              To ensure your email is valid and to confirm your newsletter subscription, please click the button below:
            </Text>

            <Section style={buttonContainer}>
              <Link href={`${baseUrl}/verify?token=${token}`} style={button}>
                Verify My Email
              </Link>
            </Section>

            <Text style={text}>
              If you did not request this, you can safely ignore this email.
            </Text>
            
            <Text style={signOff}>
              Talk soon,<br />
              <strong>Brian Maina</strong>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f3f4f6", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: "40px 20px" };
const container = { margin: "0 auto", maxWidth: "600px", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" };
const contentSection = { padding: "40px 48px" };
const greeting = { color: "#111827", fontSize: "18px", fontWeight: "600", margin: "0 0 20px" };
const text = { color: "#374151", fontSize: "16px", lineHeight: "26px", margin: "0 0 24px" };
const buttonContainer = { margin: "24px 0" };
const button = { backgroundColor: "#0d9488", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", display: "inline-block", fontWeight: "600" };
const signOff = { color: "#374151", fontSize: "16px", lineHeight: "24px", margin: "32px 0 0" };