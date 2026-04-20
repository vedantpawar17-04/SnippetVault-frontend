import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("snippetvault_token");
      if (token) {
        try {
          const { data } = await api.get("/auth/profile");
          setUser(data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("snippetvault_token");
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setIsAuthenticated(true);
      setUser(data);
      localStorage.setItem("snippetvault_token", data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      setIsAuthenticated(true);
      setUser(data);
      localStorage.setItem("snippetvault_token", data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("snippetvault_token");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, signup, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
