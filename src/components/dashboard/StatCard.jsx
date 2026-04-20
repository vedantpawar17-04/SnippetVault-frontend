import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const MotionDiv = motion.div;

  useEffect(() => {
    // Simple count animation
    const duration = 1000; // 1s
    const start = 0;
    const end = parseInt(value);
    const range = end - start;
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * range + start));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
      className="bg-white p-5 rounded-xl border border-gray-100 flex items-start gap-5 shadow-sm transition-all"
    >
      <div className="flex-shrink-0 w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 leading-none">
          {count}
        </span>
      </div>

      <div className="flex flex-col pt-1">
        <h3 className="font-semibold text-gray-700 text-lg leading-tight">
          {title}:
        </h3>
        <a
          href="#"
          className="text-sm text-gray-400 hover:text-orange-500 underline underline-offset-4 transition-colors font-medium mt-1"
        >
          See All
        </a>
      </div>
    </MotionDiv>
  );
};

export default StatCard;
