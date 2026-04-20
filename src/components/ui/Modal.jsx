import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ open, title, onClose, children, maxWidthClassName = "max-w-lg" }) => {
  const MotionDiv = motion.div;
  return (
    <AnimatePresence>
      {open && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/40"
            onClick={onClose}
          />
          <MotionDiv
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className={`fixed left-1/2 top-1/2 z-[1001] w-[92vw] ${maxWidthClassName} -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl border border-gray-100`}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
