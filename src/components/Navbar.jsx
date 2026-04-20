import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, Code, LogOut, Heart, Folder } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const MotionNav = motion.nav;
  const MotionButton = motion.button;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <MotionNav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 left-0 right-0 bg-white border-b border-gray-100 px-6 py-3 z-50"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gradient-to-br from-orange-400 to-orange-600 p-1.5 rounded-lg">
            <Code className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-800">
            Snippets<span className="text-orange-500">Vault</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          <Link
            to="/search"
            className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors"
          >
            Snippet Search
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-6 border-l border-gray-200 pl-6 ml-2">
              <Link
                to="/dashboard"
                className={`text-sm font-bold transition-colors ${location.pathname === "/dashboard"
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-orange-500"
                  }`}
              >
                Dashboard
              </Link>
              <Link
                to="/favorites"
                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${location.pathname === "/favorites"
                  ? "text-red-500"
                  : "text-gray-600 hover:text-red-500"
                  }`}
              >
                <Heart size={16} fill={location.pathname === "/favorites" ? "currentColor" : "none"} />
                Favorites
              </Link>
              <Link
                to="/collections"
                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${location.pathname === "/collections"
                  ? "text-teal-600"
                  : "text-gray-600 hover:text-teal-600"
                  }`}
              >
                <Folder size={16} />
                Collections
              </Link>
              <div className="flex items-center gap-4">
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-100 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm group"
                >
                  <LogOut
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                  <span>Logout</span>
                </MotionButton>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-600 hover:text-orange-500"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-orange-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle (Simplified for now) */}
        <div className="lg:hidden">
          <button className="p-2 text-gray-600">
            <LayoutGrid size={24} />
          </button>
        </div>
      </div>
    </MotionNav>
  );
};

export default Navbar;
