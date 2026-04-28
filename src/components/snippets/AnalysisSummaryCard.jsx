import React from "react";
import { AlertTriangle, CheckCircle2, Sparkles, Wand2 } from "lucide-react";

const statusConfig = {
  completed: {
    wrapper: "border-sky-200 bg-sky-50/70",
    icon: Sparkles,
    iconClassName: "text-sky-600",
    label: "AI analysis complete",
  },
  failed: {
    wrapper: "border-rose-200 bg-rose-50/70",
    icon: AlertTriangle,
    iconClassName: "text-rose-600",
    label: "AI analysis failed",
  },
  skipped: {
    wrapper: "border-amber-200 bg-amber-50/70",
    icon: AlertTriangle,
    iconClassName: "text-amber-600",
    label: "AI analysis skipped",
  },
  pending: {
    wrapper: "border-slate-200 bg-slate-50/70",
    icon: Sparkles,
    iconClassName: "text-slate-500",
    label: "AI analysis pending",
  },
};

const badgeConfig = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const AnalysisSummaryCard = ({
  analysis,
  title = "AI Code Review",
  actionLabel,
  actionLoadingLabel = "Working...",
  onAction,
  actionDisabled = false,
  actionLoading = false,
}) => {
  if (!analysis) {
    return null;
  }

  const config = statusConfig[analysis.status] || statusConfig.pending;
  const Icon = config.icon;
  const issues = Array.isArray(analysis.issues) ? analysis.issues : [];
  const suggestions = Array.isArray(analysis.suggestions) ? analysis.suggestions : [];
  const checkedAt = analysis.checkedAt ? new Date(analysis.checkedAt) : null;

  return (
    <section className={`rounded-2xl border px-5 py-5 ${config.wrapper}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-white/80 p-2 shadow-sm">
            <Icon size={18} className={config.iconClassName} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-700">{config.label}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {analysis.status === "completed" && (
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ${
                analysis.isBugFree
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {analysis.isBugFree ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              {analysis.isBugFree ? "Looks bug-free" : "Issues found"}
            </div>
          )}
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              disabled={actionDisabled || actionLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-300 bg-white px-4 py-2 text-sm font-extrabold text-violet-700 transition-colors hover:border-violet-400 disabled:opacity-60"
            >
              <Wand2 size={16} />
              {actionLoading ? actionLoadingLabel : actionLabel}
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm font-medium leading-6 text-slate-700">
        {analysis.summary || "No analysis summary available."}
      </p>

      {issues.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {issues.map((issue, index) => (
            <div
              key={`${issue.message}-${index}`}
              className="rounded-xl bg-white/80 px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ${
                    badgeConfig[issue.severity] || badgeConfig.low
                  }`}
                >
                  {issue.severity || "low"}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-700">{issue.message}</p>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4 rounded-xl bg-white/80 px-4 py-3 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Suggestions
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {suggestions.map((suggestion, index) => (
              <p key={`${suggestion}-${index}`} className="text-sm font-medium text-slate-700">
                {suggestion}
              </p>
            ))}
          </div>
        </div>
      )}

      {(analysis.error || checkedAt || analysis.model) && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
          {checkedAt && <span>Checked: {checkedAt.toLocaleString()}</span>}
          {analysis.model && <span>Model: {analysis.model}</span>}
          {analysis.error && <span>Error: {analysis.error}</span>}
        </div>
      )}
    </section>
  );
};

export default AnalysisSummaryCard;
