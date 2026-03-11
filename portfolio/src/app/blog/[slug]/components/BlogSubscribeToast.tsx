import { motion, AnimatePresence } from "framer-motion";
import { Mail, X } from "lucide-react";

interface BlogSubscribeToastProps {
  show: boolean;
  isModalOpen: boolean;
  onSubscribeClick: () => void;
  onDismiss: () => void;
}

export default function BlogSubscribeToast({
  show,
  isModalOpen,
  onSubscribeClick,
  onDismiss,
}: BlogSubscribeToastProps) {
  return (
    <AnimatePresence>
      {show && !isModalOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: 50 }}
          className="fixed bottom-6 right-6 z-40 bg-white border border-gray-100 shadow-2xl rounded-2xl p-5 max-w-[320px] flex gap-4 items-start"
        >
          <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shrink-0">
            <Mail size={20} />
          </div>
          <div className="flex-1 pr-4">
            <h4 className="font-bold text-gray-900 mb-1 text-sm">Enjoying the read?</h4>
            <p className="text-xs text-gray-500 mb-3">Get notified whenever a new article drops.</p>
            <button
              onClick={onSubscribeClick}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full shadow-md shadow-teal-100"
            >
              Subscribe Now
            </button>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-700 absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
