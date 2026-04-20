import React from "react";
import { ArchiveX } from "lucide-react";
import { motion } from "framer-motion";

const EmptyState = () => {
  const MotionDiv = motion.div;
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <MotionDiv
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4 border border-gray-100 shadow-inner"
      >
        <ArchiveX size={32} />
      </MotionDiv>
      <p className="text-gray-400 font-medium text-lg">No snippets found</p>
    </MotionDiv>
  );
};

export default EmptyState;
