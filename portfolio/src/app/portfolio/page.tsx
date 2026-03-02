"use client"; 

import { useState, useEffect } from "react";
import { SiLinkedin, SiGithub, SiBehance } from "react-icons/si";
import Image from 'next/image';
import { motion } from "framer-motion";
import { X, Info } from "lucide-react"; 
import { AnimatePresence } from "framer-motion";
import { Showcase, CompanyProject } from "@/types";

import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MediaDisplay from "@/components/MediaDisplay";
import ThumbnailPreview from "@/components/ThumbnailPreview";

// Import your split data files
import { showcases } from "./showcaseData";
import { companyProjects } from "./corporateData";

export default function PortfolioPage() {
  const categories = ["All", "UI/UX", "Presentation", "Branding", "Graphics", "Publication"] as const;
  
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>("All");
  const [lightbox, setLightbox] = useState<Showcase | null>(null);
  const [disclaimerProject, setDisclaimerProject] = useState<CompanyProject | null>(null);
  const [companyProjectsToShow, setCompanyProjectsToShow] = useState<Showcase[] | null>(null);

  const filteredShowcases = activeCategory === "All" ? showcases : showcases.filter((item) => item.category === activeCategory);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
        setDisclaimerProject(null);
        setCompanyProjectsToShow(null); 
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="relative bg-gray-50 text-gray-900 min-h-screen overflow-x-hidden pt-24">
      <section id="portfolio" className="relative max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold mb-10 text-center">Design Showcase</h1>
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((cat) => (
            <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} onClick={() => setActiveCategory(cat)}>
              {cat}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShowcases.map((project, idx) => (
            <motion.div key={project.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card className="w-full shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full" onClick={() => setLightbox(project)}>
                <CardContent>
                  <div className="h-40 flex items-center justify-center relative bg-gray-100 rounded-lg overflow-hidden">
                    <ThumbnailPreview project={project} />
                    <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">{project.tag}</span>
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm mb-2 px-4 text-center">{project.description}</p>
                      <Button className="bg-teal-500 hover:bg-teal-600">View Project</Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-600">Category: {project.category}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="corporate-work" className="relative max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-8 text-center">Corporate Work</h2>
        <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-center">This section contains confidential work created for specific companies. Access is granted for portfolio review purposes only after acknowledging the respective disclaimer.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {companyProjects.map((project, idx) => (
            <motion.div key={project.companyName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card className="w-full shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full flex flex-col items-center justify-center p-8 bg-gray-100 hover:bg-white transition-colors" onClick={() => setDisclaimerProject(project)}>
                <Image src={project.companyLogo} alt={`${project.companyName} logo`} width={128} height={64} className="h-16 w-auto mb-4" unoptimized={true} />
                <h3 className="text-xl font-medium text-gray-800">{project.companyName}</h3>
                <p className="text-sm text-teal-600 font-semibold mt-4">View Projects</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightboxes and Modals */}
      <AnimatePresence>
        {lightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Removed p-4 on mobile so it goes edge-to-edge
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-0 sm:p-8" 
            onClick={() => setLightbox(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="lightbox-title" 
              // Full height/width on mobile (h-[100dvh] and rounded-none), rounded card on sm and up
              className="bg-white rounded-none sm:rounded-3xl p-5 sm:p-8 max-w-7xl w-full relative overflow-hidden flex flex-col h-[100dvh] sm:h-auto sm:max-h-[90vh]" 
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 hover:text-black transition-colors z-10" 
                onClick={() => setLightbox(null)} 
                aria-label="Close dialog"
              >
                <X size={24} />
              </button>
              
              {/* Added mt-8 on mobile to push content below the close button */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 h-full overflow-y-auto pr-2 mt-10 sm:mt-0">
                {/* Left Column: Media Stage */}
                <div className="lg:col-span-8 flex flex-col min-h-[40vh] sm:min-h-[50vh]">
                  <MediaDisplay project={lightbox} />
                </div>

                {/* Right Column: Project Context */}
                <div className="lg:col-span-4 flex flex-col space-y-6 sm:space-y-8 pb-8">
                  <div>
                    <h3 id="lightbox-title" className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">{lightbox.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {lightbox.category && (
                        <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                          {lightbox.category}
                        </span>
                      )}
                      {/* Logic check to prevent duplicate badges */}
                      {lightbox.tag && lightbox.tag !== lightbox.category && (
                        <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                          {lightbox.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {lightbox.challenge && (
                      <div>
                        <h4 className="text-teal-600 uppercase tracking-wider text-sm font-bold mb-2">Challenge</h4>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{lightbox.challenge}</p>
                      </div>
                    )}
                    {lightbox.process && (
                      <div>
                        <h4 className="text-teal-600 uppercase tracking-wider text-sm font-bold mb-2">Process</h4>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{lightbox.process}</p>
                      </div>
                    )}
                    {lightbox.outcome && (
                      <div>
                        <h4 className="text-teal-600 uppercase tracking-wider text-sm font-bold mb-2">Outcome</h4>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{lightbox.outcome}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    
    <footer className="relative bg-gray-900 text-white py-20 px-6 text-center">
            <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
            <p className="mb-6">Feel free to reach out for collaborations or opportunities.</p>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="https://www.linkedin.com/in/brian-maina-nyawira" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077B5] transition-transform transform hover:scale-110" aria-label="LinkedIn"><SiLinkedin size={20} /></a>
              <a href="https://github.com/Obrienmaina-Mosbach" target="_blank" rel="noopener noreferrer" className="hover:text-[#C06EFF] transition-transform transform hover:scale-110" aria-label="GitHub"><SiGithub size={20} /></a>
              <a href="https://www.behance.net/brianmaina3" target="_blank" rel="noopener noreferrer" className="hover:text-[#1769FF] transition-transform transform hover:scale-110" aria-label="Behance"><SiBehance size={20} /></a>
            </div>
            <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl" onClick={() => (window.location.href = "mailto:brianmaina.nyawira@gmail.com")}>Contact Me</Button>
          </footer>
    </main>
  );
}