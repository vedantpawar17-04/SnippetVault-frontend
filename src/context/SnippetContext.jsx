import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../services/api";

const SnippetContext = createContext(null);

export const SnippetProvider = ({ children }) => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSnippets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/snippets");
      setSnippets(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch snippets");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMySnippets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/snippets/my");
      setSnippets(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch snippets");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFavoriteSnippets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/snippets/favorites");
      setSnippets(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch favorite snippets");
    } finally {
      setLoading(false);
    }
  }, []);

  const createSnippet = async (snippetData) => {
    try {
      const { data } = await api.post("/snippets", snippetData);
      setSnippets((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create snippet",
      };
    }
  };

  const updateSnippet = async (id, snippetData) => {
    try {
      const { data } = await api.put(`/snippets/${id}`, snippetData);
      setSnippets((prev) => prev.map((s) => (s._id === id ? data : s)));
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update snippet",
      };
    }
  };

  const deleteSnippet = async (id) => {
    try {
      await api.delete(`/snippets/${id}`);
      setSnippets((prev) => prev.filter((s) => s._id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete snippet",
      };
    }
  };

  const likeSnippet = async (id) => {
    try {
      const { data } = await api.post(`/snippets/${id}/like`);
      setSnippets((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, likes: data.likes, hasLiked: true } : s
        ),
      );
      return { success: true, likes: data.likes };
    } catch (err) {
      // 400 = already liked — mark it in UI but don't show an error
      if (err.response?.status === 400) {
        setSnippets((prev) =>
          prev.map((s) => (s._id === id ? { ...s, hasLiked: true } : s))
        );
      }
      return { success: false, message: err.response?.data?.message };
    }
  };

  const toggleFavoriteSnippet = async (id) => {
    try {
      const { data } = await api.post(`/snippets/${id}/favorite`);
      setSnippets((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, isFavorite: data.isFavorite } : s,
        ),
      );
      
      // If we're on the favorites page and the snippet is no longer favorited, remove it from the list
      if (!data.isFavorite && window.location.pathname === '/favorites') {
        setSnippets((prev) => prev.filter((s) => s._id !== id));
      }
      
      return { success: true, isFavorite: data.isFavorite };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  return (
    <SnippetContext.Provider
      value={{
        snippets,
        loading,
        error,
        fetchSnippets,
        fetchMySnippets,
        fetchFavoriteSnippets,
        createSnippet,
        updateSnippet,
        deleteSnippet,
        likeSnippet,
        toggleFavoriteSnippet,
      }}
    >
      {children}
    </SnippetContext.Provider>
  );
};

export const useSnippets = () => useContext(SnippetContext);
