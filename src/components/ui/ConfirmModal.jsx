import React from "react";
import Modal from "./Modal";

const ConfirmModal = ({
  open,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onClose,
  loading = false,
}) => {
  const confirmClass =
    confirmVariant === "primary"
      ? "bg-teal-500 hover:bg-teal-600 shadow-teal-100"
      : "bg-rose-500 hover:bg-rose-600 shadow-rose-100";

  return (
    <Modal open={open} title={title} onClose={onClose} maxWidthClassName="max-w-md">
      <p className="text-sm font-medium text-gray-600 leading-relaxed">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-60"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white font-bold shadow-md ${confirmClass} disabled:opacity-60`}
        >
          {loading ? "Working..." : confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

