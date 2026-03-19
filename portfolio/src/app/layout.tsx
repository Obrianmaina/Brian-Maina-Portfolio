import CookieBanner from '@/components/CookieBanner'
import Navbar from '@/components/Navbar'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Brian Maina Nyawira | Visual Designer & IT Professional',
  description: 'The professional portfolio of Brian Maina Nyawira, showcasing work in UI/UX, presentation design, branding, and graphics.'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {/* Added top padding to account for the fixed Navbar */}
          <div className="pt-16">
            {children}
          </div>
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}