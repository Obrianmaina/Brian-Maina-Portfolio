"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, PenTool, Settings, Briefcase, FileText, BookOpen } from "lucide-react";
import { useState } from "react";
import GetQuoteModal from "./GetQuoteModal";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Left: Home */}
          <Link
            href="/"
            className="text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            aria-label="Home"
            title="Home"
          >
            <Home className="w-5 h-5" />
          </Link>

          {/* Right: all other nav items with equal spacing */}
          <div className="flex items-center gap-8">

            <Link
              href="/portfolio"
              className="relative text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center justify-center"
              aria-label="Portfolio"
              title="Portfolio"
            >
              <Briefcase className="w-5 h-5" />
              {pathname.includes("/portfolio") && (
                <motion.div layoutId="underline" className="absolute left-0 top-full mt-2 w-full h-0.5 bg-teal-500 rounded-full" />
              )}
            </Link>

            <Link
              href="/resume"
              className="relative text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center justify-center"
              aria-label="CV / Resume"
              title="CV / Resume"
            >
              <FileText className="w-5 h-5" />
              {pathname.includes("/resume") && (
                <motion.div layoutId="underline" className="absolute left-0 top-full mt-2 w-full h-0.5 bg-teal-500 rounded-full" />
              )}
            </Link>

            <Link
              href="/blog"
              className="relative text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center justify-center"
              aria-label="Blog"
              title="Blog"
            >
              <BookOpen className="w-5 h-5" />
              {pathname.includes("/blog") && (
                <motion.div layoutId="underline" className="absolute left-0 top-full mt-2 w-full h-0.5 bg-teal-500 rounded-full" />
              )}
            </Link>

            <button
              onClick={() => setIsModalOpen(true)}
              className="text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label="Get a Quote"
              title="Get a Quote"
            >
              <PenTool className="w-5 h-5" />
            </button>

            <Link
              href="/admin"
              className="text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label="Admin Portal"
              title="Admin Portal"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* Theme Toggle Button */}
            <ThemeToggle />

          </div>
        </div>
      </nav>

      {isModalOpen && <GetQuoteModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}