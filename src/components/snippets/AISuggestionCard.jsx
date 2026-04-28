import React from "react";
import { CheckCircle2, Sparkles, Wand2 } from "lucide-react";

const AISuggestionCard = ({
  suggestion,
  loading,
  onGenerate,
  onApply,
  disabled,
  lockedMessage = "Run AI Review first. Fix suggestions unlock when issues are found.",
}) => {
  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/60 px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-white/80 p-2 shadow-sm">
            <Sparkles size={18} className="text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">AI Fix Suggestion</h3>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              Generate corrected code and a matching syntax example before saving.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading || disabled}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-300 bg-white px-4 py-2 text-sm font-extrabold text-violet-700 transition-colors hover:border-violet-400 disabled:opacity-60"
          >
            <Wand2 size={16} />
            {loading ? "Generating..." : "Suggest Fix"}
          </button>
          {suggestion && (
            <button
              type="button"
              onClick={onApply}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-extrabold text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
            >
              <CheckCircle2 size={16} />
              Apply Fix
            </button>
          )}
        </div>
      </div>

      {suggestion ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm font-medium leading-6 text-slate-700">{suggestion.summary}</p>

          {Array.isArray(suggestion.changes) && suggestion.changes.length > 0 && (
            <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Changes
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {suggestion.changes.map((change, index) => (
                  <p key={`${change}-${index}`} className="text-sm font-medium text-slate-700">
                    {change}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
            {suggestion.model && <span>Model: {suggestion.model}</span>}
            {typeof suggestion.isBugFree === "boolean" && (
              <span>{suggestion.isBugFree ? "Result: bug-free" : "Result: issues fixed"}</span>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-500">
            The generated fix will update both the main code and the syntax example.
          </p>
          {disabled && (
            <p className="mt-2 text-sm font-semibold text-violet-700">{lockedMessage}</p>
          )}
        </div>
      )}
    </section>
  );
};

export default AISuggestionCard;
