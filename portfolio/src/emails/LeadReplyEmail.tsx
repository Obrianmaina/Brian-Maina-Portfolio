import { Html, Head, Body, Container, Text, Tailwind, Section, Hr, Img, Link } from "@react-email/components";
import * as React from "react";

interface LeadReplyEmailProps {
  body: string;
}

export default function LeadReplyEmail({ body }: LeadReplyEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="my-10 mx-auto p-0 w-full max-w-[600px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            
            <Section className="bg-gray-900 px-8 py-6 text-center">
              <Text className="text-white text-xl font-bold tracking-widest uppercase m-0">
                Brian Maina
              </Text>
              <Text className="text-gray-400 text-xs font-medium tracking-wider m-0 mt-1 uppercase">
                Design & Engineering
              </Text>
            </Section>

            <Section className="px-8 py-8">
              <Text className="text-gray-800 text-[15px] leading-[26px] m-0">
                {/* Fixed: Native React line breaks instead of dangerouslySetInnerHTML */}
                {body.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Text>
            </Section>

            <Hr className="border-gray-100 mx-8 my-0" />

            <Section className="px-8 py-8 bg-gray-50/50">
              <table className="w-full" cellPadding="0" cellSpacing="0" border={0}>
                <tbody>
                  <tr>
                    <td className="w-[64px] pr-4 align-top">
                      <Img
                        src="https://www.brianmaina.de/og-image.png" 
                        alt="Brian Maina"
                        width="64"
                        height="64"
                        className="rounded-full object-cover border border-gray-200 shadow-sm"
                      />
                    </td>
                    <td className="align-top">
                      <Text className="m-0 font-bold text-gray-900 text-[14px]">
                        Brian Maina
                      </Text>
                      <Text className="m-0 text-gray-500 text-[12px] leading-[18px] mt-1">
                        Independent Creative Developer<br />
                        <Link href="mailto:brian@brianmaina.de" className="text-blue-600 underline">brian@brianmaina.de</Link>
                      </Text>
                      <Text className="m-0 mt-2 text-[12px]">
                        <Link href="https://www.brianmaina.de" className="text-gray-500 font-medium hover:text-gray-900 transition-colors">
                          Portfolio
                        </Link>
                        {" • "}
                        <Link href="https://www.linkedin.com/in/obrianmaina" className="text-gray-500 font-medium hover:text-gray-900 transition-colors">
                          LinkedIn
                        </Link>
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

          </Container>
          
          <Text className="text-center text-gray-400 text-[11px] mt-6 mb-10">
            © {new Date().getFullYear()} Brian Maina. All rights reserved.
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}