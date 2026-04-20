import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHero from "../components/dashboard/DashboardHero";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ui/ConfirmModal";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CollectionsPage = () => {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const [removeConfirm, setRemoveConfirm] = useState({
    open: false,
    collectionId: null,
    snippetId: null,
  });
  const [removing, setRemoving] = useState(false);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/collections");
      setCollections(Array.isArray(data) ? data : []);
    } catch (err) {
      pushToast({
        type: "error",
        message: err.response?.data?.message || "Failed to load collections",
      });
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createCollection = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCreating(true);
    try {
      const { data } = await api.post("/collections", { name: trimmed });
      setCollections((prev) => [data, ...prev]);
      setName("");
      pushToast({ type: "success", message: "Collection created" });
    } catch (err) {
      pushToast({
        type: "error",
        message: err.response?.data?.message || "Failed to create collection",
      });
    } finally {
      setCreating(false);
    }
  };

  const confirmRemove = (collectionId, snippetId) => {
    setRemoveConfirm({ open: true, collectionId, snippetId });
  };

  const removeSnippet = async () => {
    setRemoving(true);
    try {
      const { collectionId, snippetId } = removeConfirm;
      const { data } = await api.delete(`/collections/${collectionId}/remove/${snippetId}`);
      setCollections((prev) => prev.map((c) => (c._id === data._id ? data : c)));
      pushToast({ type: "success", message: "Removed from collection" });
      setRemoveConfirm({ open: false, collectionId: null, snippetId: null });
    } catch (err) {
      pushToast({
        type: "error",
        message: err.response?.data?.message || "Failed to remove snippet",
      });
    } finally {
      setRemoving(false);
    }
  };

  const totalSnippets = useMemo(() => {
    return collections.reduce((sum, c) => sum + (c?.snippets?.length || 0), 0);
  }, [collections]);

  return (
    <DashboardLayout>
      <DashboardHero title="Collections" />

      <ConfirmModal
        open={removeConfirm.open}
        title="Remove snippet?"
        message="This removes the snippet from this collection (it will not delete the snippet)."
        confirmText="Remove"
        cancelText="Cancel"
        loading={removing}
        onClose={() => setRemoveConfirm({ open: false, collectionId: null, snippetId: null })}
        onConfirm={removeSnippet}
      />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 py-6 pb-24 flex flex-col gap-10">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                Total saved snippets
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">{totalSnippets}</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New collection name"
                className="flex-1 md:w-[280px] px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500"
              />
              <button
                onClick={createCollection}
                disabled={creating}
                className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-extrabold shadow-lg shadow-teal-100 disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 font-semibold">No collections yet.</p>
            <p className="text-gray-400 text-sm font-semibold mt-2">
              Create one to start organizing snippets.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <div
                key={collection._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-gray-900 truncate">
                      {collection.name}
                    </h3>
                    <p className="text-xs font-semibold text-gray-400">
                      {collection.snippets?.length || 0} snippets
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  {(collection.snippets || []).length === 0 ? (
                    <p className="text-sm font-semibold text-gray-500">
                      Empty collection.
                    </p>
                  ) : (
                    (collection.snippets || []).map((s) => (
                      <div
                        key={s._id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-slate-50/40 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-gray-800 truncate">
                            {s.title}
                          </p>
                          <p className="text-xs font-semibold text-gray-500">
                            {s.language} {s.status === "private" ? "• Private" : "• Public"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/snippet/${s._id}`)}
                            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-teal-700 hover:border-teal-200 transition-colors"
                            title="View"
                            type="button"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => confirmRemove(collection._id, s._id)}
                            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-rose-700 hover:border-rose-200 transition-colors"
                            title="Remove from collection"
                            type="button"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CollectionsPage;

