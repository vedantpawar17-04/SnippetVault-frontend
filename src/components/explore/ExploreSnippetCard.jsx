import { ThumbsUp, Eye, User, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ExploreSnippetCard = ({ snippet, index }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const {
    _id,
    title,
    language,
    likes = 0,
    description,
    user: snippetUser,
  } = snippet;

  const authorName = snippetUser?.username || "Unknown";
  const isOwner = currentUser?._id === (snippetUser?._id || snippetUser);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group overflow-hidden"
    >
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h3
            onClick={() => navigate(`/snippet/${_id}`)}
            className="text-[17px] font-bold text-gray-800 hover:text-teal-600 cursor-pointer transition-colors leading-snug"
          >
            {title}
          </h3>
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                language.toUpperCase() === "HTML"
                  ? "bg-orange-100 text-orange-600"
                  : language.toUpperCase() === "PHP"
                    ? "bg-sky-100 text-sky-600"
                    : language.toUpperCase() === "JS" ||
                        language.toUpperCase() === "JAVASCRIPT"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
              }`}
            >
              {language}
            </span>
            <div className="flex items-center gap-1 text-gray-400">
              <ThumbsUp size={14} className="text-teal-500" />
              <span className="text-xs font-bold text-gray-700">{likes}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-2 min-h-[40px]">
          {description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-100">
            <User size={14} className="text-gray-400" />
          </div>
          <span className="text-[12px] text-gray-400">
            by <span className="text-gray-800 font-bold">{authorName}</span>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50/50 border-t border-gray-50 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={() => navigate(`/edit-snippet/${_id}`)}
              className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <Edit size={16} />
            </button>
          )}
          <button
            onClick={() => navigate(`/snippet/${_id}`)}
            className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExploreSnippetCard;
