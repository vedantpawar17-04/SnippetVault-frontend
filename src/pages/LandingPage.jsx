import { Link } from "react-router-dom";
import {
  Code,
  Zap,
  Shield,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import Card from "../components/Card";
import { motion } from "framer-motion";
import previewImage from "../public/image.png"; // adjust path

const Landing = () => {
  const MotionDiv = motion.div;
  const MotionSpan = motion.span;
  return (
    <div>
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-blue/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-cyan/10 blur-[120px] rounded-full" />
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <MotionSpan
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary-blue/10 text-primary-blue rounded-full border border-primary-blue/20"
          >
            The Future of Code Management
          </MotionSpan>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-dark-base mb-8 leading-[1.1]">
            Your Code Snippets, <br />
            <span className="bg-gradient-to-r from-primary-blue via-deep-blue to-accent-cyan bg-clip-text text-transparent">
              Supercharged.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            SnippetVault is the ultimate workspace for developers to store,
            organize, and share code snippets with lightning speed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-primary-blue to-deep-blue text-white rounded-2xl font-bold shadow-xl shadow-primary-blue/20 hover:shadow-primary-blue/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-dark-base border border-black/5 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
            >
              View Demo
            </Link>
          </div>
        </MotionDiv>
      </section>

      {/* Image Only with Soft Glow */}
      <div className="relative flex justify-center mb-20">
        {/* Soft Glow Background */}
        <div className="absolute w-[80%] h-[80%] bg-primary-blue/20 blur-3xl rounded-full" />

        {/* Image */}
        <img
          src={previewImage}
          alt="Dashboard preview"
          className="relative max-w-5xl w-full rounded-2xl"
        />
      </div>
    </div>
  );
};

export default Landing;
