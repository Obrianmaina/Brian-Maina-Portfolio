"use client";

import React from "react";
import Link from "next/link";
import { SiLinkedin, SiGithub, SiWhatsapp } from "react-icons/si";
import Button from "@/components/ui/button"; 

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 dark:bg-gray-950 text-white pt-20 pb-10 px-6 text-center border-t border-transparent dark:border-gray-800 transition-colors duration-300">
      <h2 className="text-3xl font-semibold mb-6 text-gray-50">Get In Touch</h2>
      <p className="mb-6 text-gray-300">
        Feel free to reach out for collaborations or opportunities.
      </p>
      <div className="flex justify-center space-x-6 mb-8">
        <a
          href="https://www.linkedin.com/in/brian-maina-nyawira"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#0077B5] transition-transform transform hover:scale-110"
          aria-label="LinkedIn"
        >
          <SiLinkedin size={20} />
        </a>
        <a
          href="https://github.com/Obrienmaina-Mosbach"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#C06EFF] transition-transform transform hover:scale-110"
          aria-label="GitHub"
        >
          <SiGithub size={20} />
        </a>
        <a
          href="https://wa.me/+254728036420"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#25D366] transition-transform transform hover:scale-110"
          aria-label="WhatsApp"
        >
          <SiWhatsapp size={20} />
        </a>
      </div>
      
      <Button
        className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl border-none dark:text-white mb-12"
        onClick={() => (window.location.href = "mailto:request@brianmaina.de")}
      >
        Contact Me
      </Button>

      {/* Legal & Copyright Section */}
      <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Brian Maina. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link href="/impressum" className="hover:text-white transition-colors">
            Impressum
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}