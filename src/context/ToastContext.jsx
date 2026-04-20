import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const TOAST_TIMEOUT_MS = 2600;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((toast) => {
    const id = crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const next = {
      id,
      type: toast?.type || "info",
      message: toast?.message || "",
    };
    setToasts((prev) => [next, ...prev].slice(0, 4));
    setTimeout(() => removeToast(id), TOAST_TIMEOUT_MS);
  }, [removeToast]);

  const value = useMemo(() => ({ pushToast, removeToast }), [pushToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[260px] max-w-[360px] rounded-xl border px-4 py-3 shadow-lg backdrop-blur bg-white/95 ${
              t.type === "success"
                ? "border-emerald-100"
                : t.type === "error"
                  ? "border-rose-100"
                  : "border-gray-100"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                t.type === "success"
                  ? "text-emerald-700"
                  : t.type === "error"
                    ? "text-rose-700"
                    : "text-gray-700"
              }`}
            >
              {t.message}
            </p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
};
