import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Card from "../components/Card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  void motion;

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    const result = await login(email, password);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 800);
    } else {
      setError(true);
      setErrorMessage(result.message);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-6 bg-gray-50 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-blue/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-cyan/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto"
      >
        {/* Heading */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-dark-base">Welcome Back</h1>
          <p className="text-gray-500">Log in to access your snippets</p>
        </div>

        {/* Card */}
        <Card className="p-3 shadow-xl border-black/5 relative overflow-hidden">
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle2 size={32} />
                </motion.div>
                <h2 className="text-xl font-bold text-dark-base">
                  Login Successful!
                </h2>
                <p className="text-gray-500">Redirecting to dashboard...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <motion.div
              animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.35 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-blue transition-colors">
                  <Mail size={18} />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                    error ? "border-red-300" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-primary-blue transition-all`}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleShowPassword}
                  className="text-xs font-bold text-primary-blue hover:underline"
                >
                  Show
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-blue transition-colors">
                  <Lock size={18} />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                    error ? "border-red-300" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-primary-blue transition-all`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </motion.div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100"
              >
                <AlertCircle size={16} />
                {errorMessage || "Invalid email or password."}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-2">
              <button
                type="submit"
                className="text-sm text-primary-blue hover:text-red-700 cursor-pointer"
              >
                Log In
              </button>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary-blue hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </form>

          {/* Signup */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-primary-blue hover:underline"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
