import React, { useState } from "react";
import { ChevronDown, Save, X, AlertCircle, Globe, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MockEditor from "../components/snippets/MockEditor";
import TagsInput from "../components/ui/TagsInput";
import { useSnippets } from "../context/SnippetContext";
import { useToast } from "../context/ToastContext";
import { LANGUAGES } from "../constants/languages";

const CreateSnippetPage = () => {
  const navigate = useNavigate();
  const { createSnippet } = useSnippets();
  const { pushToast } = useToast();
  const MotionH1 = motion.h1;
  const MotionMain = motion.main;
  const MotionButton = motion.button;

  const [title, setTitle] = useState("");
  const [selectedLangId, setSelectedLangId] = useState("");
  const [code, setCode] = useState("");
  const [syntaxCode, setSyntaxCode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("public");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !code || !selectedLangId) {
      setError("Title, Code, and Language are required.");
      return;
    }

    setLoading(true);
    setError("");

    const selectedLang = LANGUAGES.find((l) => l.id === selectedLangId);

    const result = await createSnippet({
      title,
      language: selectedLang?.name || "Plain Text",
      syntax: null,
      code,
      syntaxCode: syntaxCode || "",
      description,
      status,
      tags,
    });

    if (result.success) {
      pushToast({ type: "success", message: "Snippet created" });
      navigate("/dashboard");
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="w-full bg-slate-50/50 pt-16 pb-12 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div />
          <MotionH1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-gray-800 tracking-tight text-center flex-1"
          >
            Create New Snippet
          </MotionH1>
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>
      </div>

      <MotionMain
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-5xl mx-auto px-6 py-10 pb-24"
      >
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-800 ml-1">
                Snippet Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Custom Post Type Snippet"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-800 ml-1">
                Language <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <select
                  value={selectedLangId}
                  onChange={(e) => setSelectedLangId(e.target.value)}
                  className="w-full h-[50px] pl-4 pr-10 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-700"
                >
                  <option value="">Select language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors"
                  size={18}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-sm font-bold text-gray-800 ml-1">
              Code Snippet <span className="text-rose-500">*</span>
            </label>
            <MockEditor
              value={code}
              onChange={setCode}
              language={
                LANGUAGES.find((l) => l.id === selectedLangId)?.name ||
                "Editor"
              }
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-gray-800 ml-1">
                Syntax Code
              </label>
              <span className="text-xs text-gray-400 font-medium">
                (Optional - only shown if needed)
              </span>
            </div>
            <MockEditor
              value={syntaxCode}
              onChange={setSyntaxCode}
              placeholder="// Enter call syntax or usage example here..."
            />
          </div>

          <section className="flex flex-col gap-8">
            <h2 className="text-xl font-bold text-gray-800">Snippet Details</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-800 ml-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[140px] px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-700 resize-y"
                placeholder="Describe what this snippet does..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-800 ml-1">
                Tags
              </label>
              <TagsInput value={tags} onChange={setTags} />
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold text-gray-800 ml-1">
                Visibility
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStatus("public")}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    status === "public"
                      ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                      : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
                  }`}
                >
                  <Globe size={20} />
                  <div className="text-left">
                    <p className="text-sm font-bold">Public</p>
                    <p className="text-[10px] opacity-70">
                      Visible to everyone
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("private")}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    status === "private"
                      ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                      : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
                  }`}
                >
                  <Lock size={20} />
                  <div className="text-left">
                    <p className="text-sm font-bold">Private</p>
                    <p className="text-[10px] opacity-70">
                      Only you can see this
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </section>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 p-4 rounded-lg border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <MotionButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              <Save size={20} />
              {loading ? "Saving..." : "Save Snippet"}
            </MotionButton>
          </div>
        </div>
      </MotionMain>
    </div>
  );
};

export default CreateSnippetPage;
