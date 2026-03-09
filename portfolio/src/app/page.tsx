"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiLinkedin, SiGithub, SiBehance } from "react-icons/si";
import Link from "next/link";
import Button from "@/components/ui/button";

export default function HomePage() {
  const actions = [
    { text: "Explore My Work", href: "/portfolio" },
    { text: "Read My Blog", href: "/blog" },
    { text: "View Brian's CV", href: "/resume" }
  ];

  const [actionIndex, setActionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActionIndex((prevIndex) => (prevIndex + 1) % actions.length);
    }, 3500); // Changes the button every 3.5 seconds

    return () => clearInterval(interval);
  }, [actions.length]);

  return (
    <main className="relative text-gray-900 min-h-screen overflow-x-hidden pt-16 bg-gradient-to-br from-gray-50 via-teal-50 to-purple-100 animate-gradient">
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-6">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="text-4xl sm:text-5xl font-bold mb-4"
        >
          Brian Maina
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg mb-6"
        >
          Visual Designer
        </motion.p>

        {/* Dynamic Button Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-12 flex justify-center items-center" // Fixed height prevents layout shift during animations
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={actionIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={actions[actionIndex].href}>
                <Button>{actions[actionIndex].text}</Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      <footer className="relative bg-gray-900/90 text-white py-20 px-6 text-center backdrop-blur-sm">
        <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
        <p className="mb-6">Feel free to reach out for collaborations or opportunities.</p>
        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://www.linkedin.com/in/brian-maina-nyawira" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077B5] transition-transform transform hover:scale-110" aria-label="LinkedIn"><SiLinkedin size={20} /></a>
          <a href="https://github.com/Obrienmaina-Mosbach" target="_blank" rel="noopener noreferrer" className="hover:text-[#C06EFF] transition-transform transform hover:scale-110" aria-label="GitHub"><SiGithub size={20} /></a>
          <a href="https://www.behance.net/brianmaina3" target="_blank" rel="noopener noreferrer" className="hover:text-[#1769FF] transition-transform transform hover:scale-110" aria-label="Behance"><SiBehance size={20} /></a>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl" onClick={() => (window.location.href = "mailto:request@brianmaina.de")}>Contact Me</Button>
      </footer>
    </main>
  );
}