"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import { X, Info } from "lucide-react"; 
import { Showcase, CompanyProject } from "@/types";

import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MediaDisplay from "@/components/MediaDisplay";
import ThumbnailPreview from "@/components/ThumbnailPreview";

// The Dynamic Image Gallery is moved here since it is only used in the Lightbox
const DynamicImageGallery = ({ images }: { images?: string[] }) => {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="mt-6 w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100">
        <Image src={images[0]} alt="Case Study Media" width={1200} height={800} className="w-full h-auto object-cover" unoptimized={true} />
      </div>
    );
  }

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

interface PortfolioModalsProps {
  lightbox: Showcase | null;
  setLightbox: (project: Showcase | null) => void;
  disclaimerProject: CompanyProject | null;
  setDisclaimerProject: (project: CompanyProject | null) => void;
  companyProjectsToShow: Showcase[] | null;
  setCompanyProjectsToShow: (projects: Showcase[] | null) => void;
}

export default function PortfolioModals({
  lightbox,
  setLightbox,
  disclaimerProject,
  setDisclaimerProject,
  companyProjectsToShow,
  setCompanyProjectsToShow
}: PortfolioModalsProps) {
  return (
    <>
      {/* Main Project Lightbox */}
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
                    <div className="text-center space-y-4">
                      <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">{lightbox.title}</h3>
                      <p className="text-xl text-gray-600">{lightbox.description}</p>
                      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 pt-4">
                        <span><strong>Role:</strong> {lightbox.caseStudy.role}</span>
                        <span><strong>Timeline:</strong> {lightbox.caseStudy.duration}</span>
                        <span><strong>Tools:</strong> {lightbox.caseStudy.tools.join(", ")}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-2xl font-semibold mb-3">The Problem</h4>
                      <p className="text-gray-700 leading-relaxed">{lightbox.caseStudy.problemStatement}</p>
                      <DynamicImageGallery images={lightbox.caseStudy.problemImages} />
                    </div>

                    {lightbox.caseStudy.userResearch && (
                      <div>
                        <h4 className="text-2xl font-semibold mb-3">Research & Discovery</h4>
                        <p className="text-gray-700 leading-relaxed mb-4">{lightbox.caseStudy.userResearch}</p>
                        <DynamicImageGallery images={lightbox.caseStudy.researchImages} />
                      </div>
                    )}

                    {lightbox.caseStudy.wireframesText && (
                      <div>
                        <h4 className="text-2xl font-semibold mb-3">Wireframes & Flow</h4>
                        <p className="text-gray-700 leading-relaxed mb-4">{lightbox.caseStudy.wireframesText}</p>
                        <DynamicImageGallery images={lightbox.caseStudy.wireframesImages} />
                      </div>
                    )}

                    <div>
                      <h4 className="text-2xl font-semibold mb-4">Final Prototype</h4>
                      <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <MediaDisplay project={lightbox} />
                      </div>
                    </div>

                    {lightbox.caseStudy.learnings && (
                      <div className="bg-teal-50 p-6 rounded-2xl">
                        <h4 className="text-2xl font-semibold text-teal-800 mb-3">Key Takeaways</h4>
                        <p className="text-teal-900 leading-relaxed">{lightbox.caseStudy.learnings}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 h-full">
                    <div className="lg:col-span-8 flex flex-col min-h-[40vh] sm:min-h-[50vh]">
                      <MediaDisplay project={lightbox} />
                    </div>

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
    </>
  );
}