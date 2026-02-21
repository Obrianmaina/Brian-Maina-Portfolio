"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">
          Home
        </Link>
        <div className="flex space-x-6">
          <Link href="/" className="relative text-gray-900 hover:text-teal-600 font-medium transition-colors">
            Portfolio
            {pathname === "/" && (
              <motion.div layoutId="underline" className="absolute left-0 top-full mt-1 w-full h-0.5 bg-teal-500 rounded-full" />
            )}
          </Link>
          <Link href="/blog" className="relative text-gray-900 hover:text-teal-600 font-medium transition-colors">
            Blog
            {pathname.includes("/blog") && (
              <motion.div layoutId="underline" className="absolute left-0 top-full mt-1 w-full h-0.5 bg-teal-500 rounded-full" />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}