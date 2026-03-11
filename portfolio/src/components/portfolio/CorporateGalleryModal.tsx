import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Showcase } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import Button from "@/components/ui/button";

interface CorporateGalleryModalProps {
  projects: Showcase[] | null;
  onClose: () => void;
  onSelect: (project: Showcase) => void;
}

const CorporateGalleryModal = ({ projects, onClose, onSelect }: CorporateGalleryModalProps) => (
  <AnimatePresence>
    {projects && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
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
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>

          <h3 id="gallery-title" className="text-2xl font-semibold mb-2">Corporate Projects</h3>
          <p className="text-gray-600 mb-6">Please select a project to view its details.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card
                  className="shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full"
                  onClick={() => onSelect(project)}
                >
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
);

export default CorporateGalleryModal;