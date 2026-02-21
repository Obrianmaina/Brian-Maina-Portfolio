"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminModalProps {
  modal: {
    show: boolean;
    type: "success" | "error" | "confirm";
    title: string;
    message: string;
    onConfirm?: () => void;
  };
  close: () => void;
}

export default function AdminModal({ modal, close }: AdminModalProps) {
  return (
    <AnimatePresence>
      {modal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={modal.type !== "confirm" ? close : undefined}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center overflow-hidden"
          >
            <div className="mb-6 flex justify-center">
              {modal.type === "success" && (
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <CheckCircle2 size={40} />
                </div>
              )}
              {modal.type === "error" && (
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <AlertCircle size={40} />
                </div>
              )}
              {modal.type === "confirm" && (
                <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                  <Info size={40} />
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {modal.title}
            </h3>
            <p className="text-gray-600 mb-8">{modal.message}</p>

            <div className="flex gap-3 justify-center">
              {modal.type === "confirm" ? (
                <>
                  <button
                    onClick={close}
                    className="px-6 py-2 border border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={modal.onConfirm}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={close}
                  className="px-8 py-2 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  OK
                </button>
              )}
            </div>

            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}