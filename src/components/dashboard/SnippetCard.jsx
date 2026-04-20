import React from "react";
import { ThumbsUp, Edit, Trash2, Eye, Heart, Globe, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSnippets } from "../../context/SnippetContext";

const SnippetCard = ({ snippet, index }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteSnippet, likeSnippet, toggleFavoriteSnippet } = useSnippets();
  const MotionDiv = motion.div;
  const MotionButton = motion.button;

  const {
    _id,
    title,
    language,
    likes = 0,
    description,
    user: snippetUser,
    isFavorite = false,
    status = "public",
    tags = [],
    hasLiked = false,
    likedBy = [],
  } = snippet;

  const authorName = snippetUser?.username || "Unknown";
  const isOwner = user?._id === (snippetUser?._id || snippetUser);

  // True if this user's ID is in likedBy (from DB) OR they just liked it this session
  const hasUserLiked =
    hasLiked ||
    likedBy.some((id) => id?.toString() === user?._id?.toString());

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      await deleteSnippet(_id);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    await likeSnippet(_id);
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    await toggleFavoriteSnippet(_id);
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full group hover:shadow-md transition-all border-b-4 border-b-gray-100 hover:border-b-orange-200"
    >
      <div className="p-6 flex flex-col gap-5 flex-grow">
        {/* Top Section */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800 leading-tight">
              {title}
            </h3>
            <button
              onClick={handleFavorite}
              className={`transition-colors ${isFavorite ? "text-red-500" : "text-gray-300 hover:text-red-400"}`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                language.toUpperCase() === "HTML"
                  ? "bg-orange-100 text-orange-600"
                  : language.toUpperCase() === "JAVASCRIPT" ||
                      language.toUpperCase() === "JS"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {language}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                status === "private"
                  ? "bg-rose-50 text-rose-600 border border-rose-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}
              title={status === "private" ? "Private snippet" : "Public snippet"}
            >
              {status === "private" ? <Lock size={12} /> : <Globe size={12} />}
              {status}
            </span>
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col gap-5">
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>

          {Array.isArray(tags) && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-extrabold text-gray-600 bg-slate-50 border border-gray-100 px-2.5 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-200 overflow-hidden border border-gray-100">
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-cyan-600 uppercase">
                {authorName.charAt(0)}
              </div>
            </div>
            <span className="text-sm text-gray-400 font-medium">
              by <span className="text-gray-800 font-bold">{authorName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
        <button
          onClick={handleLike}
          disabled={hasUserLiked}
          title={hasUserLiked ? "You already liked this" : "Like this snippet"}
          className={`flex items-center gap-2 transition-colors ${
            hasUserLiked
              ? "text-blue-500 cursor-not-allowed"
              : "text-gray-400 hover:text-blue-500"
          }`}
        >
          <ThumbsUp size={16} fill={hasUserLiked ? "currentColor" : "none"} />
          <span className="text-xs font-bold">{likes}</span>
        </button>

        <div className="flex items-center gap-4">
          {isOwner && (
            <>
              <button
                onClick={() => navigate(`/edit-snippet/${_id}`)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
          <MotionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/snippet/${_id}`)}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            <Eye size={16} />
            View
          </MotionButton>
        </div>
      </div>
    </MotionDiv>
  );
};

export default SnippetCard;
