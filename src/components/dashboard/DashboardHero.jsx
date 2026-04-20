import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const DashboardHero = ({ title = "My Snippets" }) => {
  const MotionH1 = motion.h1;
  const MotionDiv = motion.div;

  return (
    <div className="w-full bg-slate-50/50 pt-16 pb-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <MotionH1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-extrabold text-gray-800 tracking-tight"
        >
          {title}
        </MotionH1>

        <div className="flex items-center gap-4">
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              to="/create-snippet"
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all w-full md:w-auto overflow-hidden relative group"
            >
              <Plus size={22} className="stroke-[3px]" />
              <span>Create Snippet</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
