import React from 'react';
import { motion } from 'framer-motion';

const Card = (props: any) => {
  const {
    children,
    className,
    hoverGlow
  } = props;

  const finalClassName = className || '';
  const finalHoverGlow = hoverGlow !== false;

  return (
    <motion.div
      whileHover={
        finalHoverGlow
          ? { y: -5, boxShadow: '0 10px 30px -10px rgba(0, 221, 255, 0.3)' }
          : {}
      }
      className={`bg-white rounded-2xl p-6 shadow-sm border border-black/5 transition-all duration-300 ${finalClassName} ${
        finalHoverGlow ? 'hover:border-accent-cyan/50' : ''
      }`}
    >
      {children}
    </motion.div>
  );
};

export default Card;