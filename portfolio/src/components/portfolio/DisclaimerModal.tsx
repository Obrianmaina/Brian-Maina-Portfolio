import { motion, AnimatePresence } from "framer-motion";
import { X, Info } from "lucide-react";
import { CompanyProject, Showcase } from "@/types";
import Button from "@/components/ui/button";

interface DisclaimerModalProps {
  disclaimerProject: CompanyProject | null;
  onClose: () => void;
  onProceed: (projects: Showcase[]) => void;
}

const DisclaimerModal = ({ disclaimerProject, onClose, onProceed }: DisclaimerModalProps) => (
  <AnimatePresence>
    {disclaimerProject && (
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
          aria-labelledby="disclaimer-title"
          className="bg-white rounded-2xl p-4 sm:p-6 max-w-2xl w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
            onClick={onClose}
            aria-label="Close dialog"
          >
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
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={() => onProceed(disclaimerProject.projects)}>Acknowledge & Proceed</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default DisclaimerModal;