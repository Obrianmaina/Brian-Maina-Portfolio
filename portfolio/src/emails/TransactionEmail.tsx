import { Html, Head, Body, Container, Text, Section, Row, Column, Hr } from '@react-email/components';
import * as React from 'react';

interface TransactionEmailProps {
  clientName: string;
  amount: number;
  description: string;
  type: 'invoice' | 'receipt';
  referenceNumber: string;
}

export default function TransactionEmail({ clientName, amount, description, type, referenceNumber }: TransactionEmailProps) {
  const isInvoice = type === 'invoice';
  
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={companyName}>Brian Maina</Text>
            <Text style={documentType}>{isInvoice ? 'INVOICE' : 'RECEIPT'}</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hello {clientName},</Text>
            <Text style={paragraph}>
              {isInvoice 
                ? 'Thank you for your business. Please find the details of your recent invoice below.' 
                : 'Thank you for your payment. Please keep this receipt for your records.'}
            </Text>

            <Section style={detailsBox}>
              <Row style={detailRow}>
                <Column><Text style={detailLabel}>Reference Number:</Text></Column>
                <Column><Text style={detailValue}>#{referenceNumber}</Text></Column>
              </Row>
              <Row style={detailRow}>
                <Column><Text style={detailLabel}>Date:</Text></Column>
                <Column><Text style={detailValue}>{new Date().toLocaleDateString()}</Text></Column>
              </Row>
              <Row style={detailRow}>
                <Column><Text style={detailLabel}>Description:</Text></Column>
                <Column><Text style={detailValue}>{description}</Text></Column>
              </Row>
              <Hr style={divider} />
              <Row style={totalRow}>
                <Column><Text style={totalLabel}>Total Amount:</Text></Column>
                <Column><Text style={totalValue}>€{amount.toFixed(2)}</Text></Column>
              </Row>
            </Section>

            {isInvoice && (
              <Text style={paymentTerms}>
                Payment is due within 14 days. Please contact me if you need alternative payment arrangements.
              </Text>
            )}
            
            <Text style={signOff}>
              Best regards,<br />
              <strong>Brian Maina</strong>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f9fafb", fontFamily: '-apple-system, sans-serif', padding: "40px 20px" };
const container = { margin: "0 auto", maxWidth: "600px", backgroundColor: "#ffffff", borderRadius: "8px", overflow: "hidden", border: "1px solid #e5e7eb" };
const header = { backgroundColor: "#111827", padding: "32px 40px", textAlign: "center" as const };
const companyName = { color: "#ffffff", fontSize: "24px", fontWeight: "bold", margin: "0 0 4px" };
const documentType = { color: "#9ca3af", fontSize: "14px", letterSpacing: "2px", margin: "0" };
const content = { padding: "40px" };
const greeting = { fontSize: "18px", color: "#111827", margin: "0 0 16px" };
const paragraph = { fontSize: "15px", color: "#4b5563", lineHeight: "24px", margin: "0 0 24px" };
const detailsBox = { backgroundColor: "#f3f4f6", padding: "24px", borderRadius: "8px", marginBottom: "24px" };
const detailRow = { marginBottom: "12px" };
const detailLabel = { fontSize: "14px", color: "#6b7280", margin: "0" };
const detailValue = { fontSize: "14px", color: "#111827", fontWeight: "600", margin: "0", textAlign: "right" as const };
const divider = { borderColor: "#e5e7eb", margin: "16px 0" };
const totalRow = { marginTop: "8px" };
const totalLabel = { fontSize: "16px", color: "#111827", fontWeight: "bold", margin: "0" };
const totalValue = { fontSize: "18px", color: "#0d9488", fontWeight: "bold", margin: "0", textAlign: "right" as const };
const paymentTerms = { fontSize: "14px", color: "#6b7280", fontStyle: "italic", margin: "0 0 24px", padding: "16px", backgroundColor: "#fffbeb", borderRadius: "8px", border: "1px solid #fef3c7" };
const signOff = { fontSize: "15px", color: "#374151", margin: "0" };