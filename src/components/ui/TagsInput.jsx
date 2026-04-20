import React, { useMemo, useState } from "react";
import { X } from "lucide-react";

const normalizeTags = (raw) => {
  if (!raw) return [];
  return [...new Set(
    raw
      .map((t) => String(t).trim().toLowerCase())
      .filter(Boolean)
  )];
};

const TagsInput = ({ value = [], onChange, placeholder = "Add tags (comma or Enter)" }) => {
  const [input, setInput] = useState("");
  const tags = useMemo(() => normalizeTags(value), [value]);

  const commit = (next) => {
    const normalized = normalizeTags(next);
    onChange?.(normalized);
  };

  const addFromInput = () => {
    const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return;
    commit([...tags, ...parts]);
    setInput("");
  };

  const removeTag = (tag) => {
    commit(tags.filter((t) => t !== tag));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-gray-100 px-3 py-1 text-xs font-extrabold text-gray-700"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-gray-400 hover:text-gray-700"
              aria-label={`Remove tag ${tag}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFromInput();
            }
          }}
          onBlur={addFromInput}
          placeholder={placeholder}
          className="flex-1 min-w-[180px] outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400"
        />
      </div>
      <p className="mt-2 text-xs text-gray-400 font-semibold">
        Tip: press Enter or type commas to add multiple tags.
      </p>
    </div>
  );
};

export default TagsInput;

