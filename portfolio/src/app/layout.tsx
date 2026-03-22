import CookieBanner from '@/components/CookieBanner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50 transition-colors duration-300 flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          
          {/* Main content wrapper set to grow so the footer pushes to the bottom */}
          <div className="pt-16 flex-grow">
            {children}
          </div>

          {/* 2. Add the Footer here */}
          <Footer />
          
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}