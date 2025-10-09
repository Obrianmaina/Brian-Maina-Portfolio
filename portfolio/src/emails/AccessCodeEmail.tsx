import { Html, Head, Preview, Body, Container, Section, Heading, Text } from '@react-email/components';

interface AccessCodeEmailProps {
  validationCode: string;
}

export default function AccessCodeEmail({ validationCode }: AccessCodeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your access code for Brian Maina's Portfolio</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'sans-serif', color: '#333' }}>
        <Container style={{ margin: 'auto', padding: '20px', backgroundColor: 'white', width: '480px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <Heading style={{ fontSize: '24px', color: '#111827' }}>Access to Portfolio References</Heading>
          <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>Hello,</Text>
          <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>Thank you for your interest in my portfolio. I'm providing you with a temporary code to view my references' contact details. This code is valid for 15 minutes.</Text>
          <Section style={{ textAlign: 'center', backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <Text style={{ fontSize: '32px', letterSpacing: '8px', margin: '0', fontWeight: 'bold' }}>
              {validationCode}
            </Text>
          </Section>
          <Text style={{ fontSize: '14px', color: '#6b7280' }}>If you did not request this code, you can safely ignore this email.</Text>
          <Text style={{ fontSize: '16px', lineHeight: '1.5', marginTop: '20px' }}>Best regards,</Text>
          <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>Brian Maina Nyawira</Text>
        </Container>
      </Body>
    </Html>
  );
}
