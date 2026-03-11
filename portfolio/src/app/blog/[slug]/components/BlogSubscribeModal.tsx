import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import BlogSubscribe from "@/components/BlogSubscribe";

interface BlogSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BlogSubscribeModal({ isOpen, onClose }: BlogSubscribeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-2">
              <BlogSubscribe />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
