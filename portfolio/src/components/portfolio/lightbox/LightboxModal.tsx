import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { Showcase } from "@/types";
import MediaDisplay from "@/components/MediaDisplay";
import DynamicImageGallery from "@/components/portfolio/DynamicImageGallery";
import MockupCarousel from "@/components/portfolio/MockupCarousel";

interface LightboxModalProps {
  lightbox: Showcase | null;
  onClose: () => void;
  setExpandedMockup: (m: string) => void;
}

// ─── UI/UX Case Study Layout ──────────────────────────────────────────────────
const UXCaseStudyLayout = ({ lightbox }: { lightbox: Showcase }) => (
  <div className="max-w-4xl mx-auto py-8 space-y-12">
    <div className="text-center space-y-4">
      <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">{lightbox.title}</h3>
      <p className="text-xl text-gray-600">{lightbox.description}</p>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 pt-4">
        <span><strong>Role:</strong> {lightbox.caseStudy!.role}</span>
        <span><strong>Timeline:</strong> {lightbox.caseStudy!.duration}</span>
        <span><strong>Tools:</strong> {lightbox.caseStudy!.tools.join(", ")}</span>
      </div>
    </div>

    <div>
      <h4 className="text-2xl font-semibold mb-3">The Problem</h4>
      <p className="text-gray-700 leading-relaxed">{lightbox.caseStudy!.problemStatement}</p>
      <DynamicImageGallery images={lightbox.caseStudy!.problemImages} />
    </div>

    {lightbox.caseStudy!.userResearch && (
      <div>
        <h4 className="text-2xl font-semibold mb-3">Research & Discovery</h4>
        <p className="text-gray-700 leading-relaxed mb-4">{lightbox.caseStudy!.userResearch}</p>
        <DynamicImageGallery images={lightbox.caseStudy!.researchImages} />
      </div>
    )}

    {lightbox.caseStudy!.wireframesText && (
      <div>
        <h4 className="text-2xl font-semibold mb-3">Wireframes & Flow</h4>
        <p className="text-gray-700 leading-relaxed mb-4">{lightbox.caseStudy!.wireframesText}</p>
        <DynamicImageGallery images={lightbox.caseStudy!.wireframesImages} />
      </div>
    )}

    <div>
      <h4 className="text-2xl font-semibold mb-4">Final Prototype</h4>
      <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-sm">
        <MediaDisplay project={lightbox} />
      </div>
    </div>

    {lightbox.caseStudy!.learnings && (
      <div className="bg-teal-50 p-6 rounded-2xl">
        <h4 className="text-2xl font-semibold text-teal-800 mb-3">Key Takeaways</h4>
        <p className="text-teal-900 leading-relaxed">{lightbox.caseStudy!.learnings}</p>
      </div>
    )}
  </div>
);

// ─── Logo / Brand Book Layout ─────────────────────────────────────────────────
const LogoLayout = ({ lightbox, setExpandedMockup }: { lightbox: Showcase; setExpandedMockup: (m: string) => void }) => {
  const concepts = lightbox.logoConcepts?.length
    ? lightbox.logoConcepts
    : lightbox.brandDetails
      ? [{ title: "Primary Concept", description: "", primaryImage: "", colors: lightbox.brandDetails.colors, fonts: [], mockups: lightbox.brandDetails.mockups }]
      : [];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 space-y-12 sm:space-y-16">
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

      {/* Brand Strategy Grid */}
      {(lightbox.challenge || lightbox.process || lightbox.outcome) && (
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
      )}

      {/* Concepts */}
      {concepts.map((concept, idx) => (
        <div key={idx} className={`space-y-12 sm:space-y-16 ${idx > 0 ? "pt-16 border-t border-gray-200" : ""}`}>
          <div className="text-center space-y-4">
            <h4 className="text-3xl font-bold text-gray-800">{concept.title || `Concept ${idx + 1}`}</h4>
            {concept.description && <p className="text-lg text-gray-500 max-w-3xl mx-auto">{concept.description}</p>}
          </div>

          {concept.primaryImage && (
            <div className="w-full bg-gray-50 rounded-3xl p-4 sm:p-12 shadow-inner border border-gray-200">
              <div className="w-full aspect-square sm:aspect-video relative rounded-2xl overflow-hidden flex items-center justify-center bg-white shadow-sm">
                <Image src={concept.primaryImage} alt={concept.title || "Concept logo"} fill className="object-contain p-8" unoptimized={true} />
              </div>
            </div>
          )}

          {((concept.colors && concept.colors.length > 0) || (concept.fonts && concept.fonts.length > 0)) && (
            <div className={`grid grid-cols-1 ${concept.colors?.length && concept.fonts?.length ? "md:grid-cols-2" : ""} gap-8`}>
              {concept.colors && concept.colors.length > 0 && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Brand Colors</h4>
                  <div className="flex flex-wrap justify-center gap-6">
                    {concept.colors.map((color, cIdx) => (
                      <div key={cIdx} className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-inner border border-gray-200" style={{ backgroundColor: color }} />
                        <span className="text-sm font-mono text-gray-600 uppercase">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {concept.fonts && concept.fonts.length > 0 && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-full">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Typography</h4>
                  <div className="flex flex-wrap justify-center gap-4">
                    {concept.fonts.map((font, fIdx) => (
                      <span key={fIdx} className="text-xl sm:text-2xl font-medium text-gray-800 bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 shadow-inner">
                        Aa {font}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {concept.mockups && concept.mockups.length > 0 && (
            <MockupCarousel mockups={concept.mockups} setExpandedMockup={setExpandedMockup} />
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Standard Layout ──────────────────────────────────────────────────────────
const StandardLayout = ({ lightbox }: { lightbox: Showcase }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 h-full">
    <div className="lg:col-span-8 flex flex-col min-h-[40vh] sm:min-h-[50vh]">
      <MediaDisplay project={lightbox} />
    </div>
    <div className="lg:col-span-4 flex flex-col space-y-6 sm:space-y-8 pb-8">
      <div>
        <h3 id="lightbox-title" className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">{lightbox.title}</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {lightbox.category && (
            <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{lightbox.category}</span>
          )}
          {lightbox.tag && lightbox.tag !== lightbox.category && (
            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{lightbox.tag}</span>
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
);

// ─── Main Lightbox Modal ──────────────────────────────────────────────────────
const LightboxModal = ({ lightbox, onClose, setExpandedMockup }: LightboxModalProps) => {
  const isUXCaseStudy = lightbox?.category === "UI/UX" && lightbox?.caseStudy;
  const isLogo = lightbox?.category === "Logo" || lightbox?.title?.toLowerCase().includes("logo");

  return (
    <AnimatePresence>
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-0 sm:p-8"
          onClick={onClose}
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
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={24} />
            </button>

            <div className="h-full overflow-y-auto pr-2 mt-10 sm:mt-0">
              {isUXCaseStudy ? (
                <UXCaseStudyLayout lightbox={lightbox} />
              ) : isLogo ? (
                <LogoLayout lightbox={lightbox} setExpandedMockup={setExpandedMockup} />
              ) : (
                <StandardLayout lightbox={lightbox} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LightboxModal;