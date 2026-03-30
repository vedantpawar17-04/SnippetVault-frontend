import { motion } from "framer-motion";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-600">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col w-full"
      >
        {children}
      </motion.main>

      {/* Subtle background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-orange-200/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-teal-200/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
};

export default DashboardLayout;
