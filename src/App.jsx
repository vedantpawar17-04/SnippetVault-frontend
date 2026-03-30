import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SnippetProvider } from "./context/SnippetContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import FavoritesPage from "./pages/FavoritesPage";
import CreateSnippetPage from "./pages/CreateSnippetPage";
import EditSnippetPage from "./pages/EditSnippetPage";
import SnippetDetailPage from "./pages/SnippetDetailPage";
import SnippetSearchPage from "./pages/SnippetSearchPage";
import { AnimatePresence} from "framer-motion";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-snippet"
              element={
                <ProtectedRoute>
                  <CreateSnippetPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/snippet/:id"
              element={
                <ProtectedRoute>
                  <SnippetDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-snippet/:id"
              element={
                <ProtectedRoute>
                  <EditSnippetPage />
                </ProtectedRoute>
              }
            />
            <Route path="/search" element={<SnippetSearchPage />} />
            {/* Fallback routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SnippetProvider>
        <Router>
          <AppContent />
        </Router>
      </SnippetProvider>
    </AuthProvider>
  );
}
