import { Body, Container, Head, Html, Preview, Text } from "@react-email/components";
import * as React from "react";

interface GoodbyeEmailProps {
  nickname: string;
}

export default function GoodbyeEmail({ nickname }: GoodbyeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You have been unsubscribed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={text}>Hi {nickname},</Text>
          
          <Text style={text}>
            This is just a quick note to confirm that you have been successfully unsubscribed from my updates. 
          </Text>
          
          <Text style={text}>
            I appreciate the time you spent on my list. If you ever need design help or want to work together in the future, you can always reach out to me directly or through my website.
          </Text>

          <Text style={text}>
            Wishing you all the best,<br />
            Brian
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

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