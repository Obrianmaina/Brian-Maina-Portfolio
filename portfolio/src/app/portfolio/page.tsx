"use client"; 

import { useState, useEffect } from "react";
import { SiLinkedin, SiGithub, SiBehance } from "react-icons/si";
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import { X, Info } from "lucide-react"; 
import { Showcase, CompanyProject } from "@/types";

import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MediaDisplay from "@/components/MediaDisplay";
import ThumbnailPreview from "@/components/ThumbnailPreview";

import { showcases } from "./showcaseData";
import { companyProjects } from "./corporateData";

// NEW COMPONENT: Dynamic Image Gallery
const DynamicImageGallery = ({ images }: { images?: string[] }) => {
  if (!images || images.length === 0) return null;

  // 1 Image: Full width
  if (images.length === 1) {
    return (
      <div className="mt-6 w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100">
        <Image src={images[0]} alt="Case Study Media" width={1200} height={800} className="w-full h-auto object-cover" unoptimized={true} />
      </div>
    );
  }

  // 2 Images: 2 Columns sharing width
  if (images.length === 2) {
    return (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-video">
            <Image src={img} alt={`Case Study Media ${i+1}`} width={600} height={400} className="w-full h-full object-cover" unoptimized={true} />
          </div>
        ))}
      </div>
    );
  }

  // 3 Images: 3 Columns sharing width
  if (images.length === 3) {
    return (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-video sm:aspect-square md:aspect-video">
            <Image src={img} alt={`Case Study Media ${i+1}`} width={400} height={300} className="w-full h-full object-cover" unoptimized={true} />
          </div>
        ))}
      </div>
    );
  }

  // 4 or more Images: Horizontal Scrolling Carousel
  return (
    <div className="mt-6 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4" style={{ scrollbarWidth: "none" }}>
      {images.map((img, i) => (
        <div key={i} className="flex-shrink-0 w-[85%] sm:w-[60%] md:w-[45%] snap-center rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-video">
          <Image src={img} alt={`Case Study Media ${i+1}`} width={600} height={400} className="w-full h-full object-cover" unoptimized={true} />
        </div>
      ))}
    </div>
  );
};

export default function PortfolioPage() {
  const categories = ["All", "UI/UX", "Presentation", "Branding", "Logo", "Graphics", "Publication", "Video"] as const;
  
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>("All");
  const [lightbox, setLightbox] = useState<Showcase | null>(null);
  const [disclaimerProject, setDisclaimerProject] = useState<CompanyProject | null>(null);
  const [companyProjectsToShow, setCompanyProjectsToShow] = useState<Showcase[] | null>(null);

  // NEW STATE: Tracks which mockup is currently clicked/expanded
  const [expandedMockup, setExpandedMockup] = useState<string | null>(null);

  const filteredShowcases = activeCategory === "All" ? showcases : showcases.filter((item) => item.category === activeCategory);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedMockup(null);
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
              
              <div className="h-full overflow-y-auto pr-2 mt-10 sm:mt-0">
                {lightbox.category === "UI/UX" && lightbox.caseStudy ? (
                  <div className="max-w-4xl mx-auto py-8 space-y-12">
                    
                    {/* Header Section */}
                    <div className="text-center space-y-4">
                      <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">{lightbox.title}</h3>
                      <p className="text-xl text-gray-600">{lightbox.description}</p>
                      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 pt-4">
                        <span><strong>Role:</strong> {lightbox.caseStudy.role}</span>
                        <span><strong>Timeline:</strong> {lightbox.caseStudy.duration}</span>
                        <span><strong>Tools:</strong> {lightbox.caseStudy.tools.join(", ")}</span>
                      </div>
                    </div>

                    {/* Problem Statement */}
                    <div>
                      <h4 className="text-2xl font-semibold mb-3">The Problem</h4>
                      <p className="text-gray-700 leading-relaxed">{lightbox.caseStudy.problemStatement}</p>
                      <DynamicImageGallery images={lightbox.caseStudy.problemImages} />
                    </div>

                    {/* User Research */}
                    {lightbox.caseStudy.userResearch && (
                      <div>
                        <h4 className="text-2xl font-semibold mb-3">Research & Discovery</h4>
                        <p className="text-gray-700 leading-relaxed mb-4">{lightbox.caseStudy.userResearch}</p>
                        <DynamicImageGallery images={lightbox.caseStudy.researchImages} />
                      </div>
                    )}

                    {/* Wireframes */}
                    {lightbox.caseStudy.wireframesText && (
                      <div>
                        <h4 className="text-2xl font-semibold mb-3">Wireframes & Flow</h4>
                        <p className="text-gray-700 leading-relaxed mb-4">{lightbox.caseStudy.wireframesText}</p>
                        <DynamicImageGallery images={lightbox.caseStudy.wireframesImages} />
                      </div>
                    )}

                    {/* Final Prototype / Media Stage */}
                    <div>
                      <h4 className="text-2xl font-semibold mb-4">Final Prototype</h4>
                      <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <MediaDisplay project={lightbox} />
                      </div>
                    </div>

                    {/* Learnings */}
                    {lightbox.caseStudy.learnings && (
                      <div className="bg-teal-50 p-6 rounded-2xl">
                        <h4 className="text-2xl font-semibold text-teal-800 mb-3">Key Takeaways</h4>
                        <p className="text-teal-900 leading-relaxed">{lightbox.caseStudy.learnings}</p>
                      </div>
                    )}

                  </div>
                ) : lightbox.title.toLowerCase().includes("logo") ? (
                  
                  <div className="max-w-5xl mx-auto py-8 sm:py-12 space-y-12 sm:space-y-16">
                    {/* BRAND BOOK ONE-PAGER LAYOUT */}
                    
                    {/* Brand Header */}
                    <div className="text-center space-y-6">
                      <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">{lightbox.title}</h3>
                      <p className="text-xl text-gray-500 max-w-2xl mx-auto">{lightbox.description}</p>
                      <div className="flex justify-center gap-3">
                        <span className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">{lightbox.tag}</span>
                      </div>
                    </div>

                    {/* Main Logo Showcase */}
                    <div className="w-full bg-gray-50 rounded-3xl p-4 sm:p-12 shadow-inner border border-gray-200">
                      <div className="w-full aspect-square sm:aspect-video relative rounded-2xl overflow-hidden">
                        <MediaDisplay project={lightbox} />
                      </div>
                    </div>

                    {/* Color Palette Section */}
                    {lightbox.brandDetails?.colors && lightbox.brandDetails.colors.length > 0 && (
                      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Brand Colors</h4>
                        <div className="flex flex-wrap justify-center gap-6">
                          {lightbox.brandDetails.colors.map((color, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3">
                              <div 
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-inner border border-gray-200"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-sm font-mono text-gray-600 uppercase">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Brand Strategy Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      {lightbox.challenge && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">The Challenge</h4>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{lightbox.challenge}</p>
                        </div>
                      )}
                      {lightbox.process && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">The Process</h4>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{lightbox.process}</p>
                        </div>
                      )}
                      {lightbox.outcome && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">The Outcome</h4>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{lightbox.outcome}</p>
                        </div>
                      )}
                    </div>

                    {/* Sliding Mockup Carousel */}
                    {lightbox.brandDetails?.mockups && lightbox.brandDetails.mockups.length > 0 && (
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-center text-gray-900">Logo in Action</h4>
                        <div 
                          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 px-4 sm:px-0"
                          style={{ scrollbarWidth: "none" }}
                        >
                          {lightbox.brandDetails.mockups.map((mockup, idx) => (
                            <div 
                              key={idx} 
                              className="flex-shrink-0 w-[85%] sm:w-[60%] lg:w-[45%] aspect-video relative snap-center rounded-2xl overflow-hidden cursor-zoom-in group shadow-md hover:shadow-xl transition-shadow"
                              onClick={() => setExpandedMockup(mockup)}
                            >
                              <Image 
                                src={mockup} 
                                alt={`Brand mockup ${idx + 1}`} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                unoptimized={true} 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                ) : (
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 h-full">
                    {/* STANDARD LAYOUT */}
                    
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
                )}
              </div>
    
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer Modal */}
      <AnimatePresence>
        {disclaimerProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
            onClick={() => setDisclaimerProject(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="disclaimer-title" 
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-2xl w-full relative" 
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setDisclaimerProject(null)} aria-label="Close dialog">
                <X size={24} />
              </button>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-teal-100 text-teal-600 rounded-full p-3 mt-1">
                  <Info size={24} />
                </div>
                <div>
                  <h3 id="disclaimer-title" className="text-2xl font-semibold mb-2">Notice of Confidentiality</h3>
                  <p className="text-sm text-gray-700 mb-6">{disclaimerProject.disclaimer}</p>
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
                    <Button variant="outline" onClick={() => setDisclaimerProject(null)}>Cancel</Button>
                    <Button onClick={() => {
                      if (!disclaimerProject) return;
                      if (disclaimerProject.projects.length === 1) {
                        setLightbox(disclaimerProject.projects[0]);
                      } else if (disclaimerProject.projects.length > 1) {
                        setCompanyProjectsToShow(disclaimerProject.projects);
                      }
                      setDisclaimerProject(null);
                    }}>Acknowledge & Proceed</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corporate Projects Gallery Modal */}
      <AnimatePresence>
        {companyProjectsToShow && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
            onClick={() => setCompanyProjectsToShow(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="gallery-title" 
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-4xl w-full relative overflow-y-auto max-h-[90vh]" 
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setCompanyProjectsToShow(null)} aria-label="Close dialog">
                <X size={24} />
              </button>

              <h3 id="gallery-title" className="text-2xl font-semibold mb-2">Corporate Projects</h3>
              <p className="text-gray-600 mb-6">Please select a project to view its details.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companyProjectsToShow.map((project, idx) => (
                  <motion.div key={project.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                    <Card className="shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full" onClick={() => {
                      setLightbox(project); 
                      setCompanyProjectsToShow(null); 
                    }}>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Mockup Modal */}
      <AnimatePresence>
        {expandedMockup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
            onClick={() => setExpandedMockup(null)}
          >
            <button
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[110]"
              onClick={(e) => { e.stopPropagation(); setExpandedMockup(null); }}
              aria-label="Close fullscreen mockup"
            >
              <X size={24} />
            </button>
            <div className="relative w-full h-full max-w-7xl max-h-full">
              <Image
                src={expandedMockup}
                alt="Fullscreen mockup"
                fill
                className="object-contain"
                unoptimized={true}
              />
            </div>
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
        <Button className="bg-teal-500 hover:bg-teal-600 text-lg px-6 py-3 rounded-2xl" onClick={() => (window.location.href = "mailto:request@brianmaina.de")}>Contact Me</Button>
      </footer>
    </main>
  );
}