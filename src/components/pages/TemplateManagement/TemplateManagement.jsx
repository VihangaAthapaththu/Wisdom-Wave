import React, { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  PageLoader,
  ConfirmationModal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms";
import { PageHeader, RichTextEditor } from "@/components/molecules";
import {
  useTemplates,
  useCategories,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
} from "@/hooks";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const EMPTY_FORM = { title: "", description: "", contentHtml: "", category: "" };

function TemplateModal({ open, onClose, onSave, isSaving, categories, initial }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  React.useEffect(() => {
    setForm(initial || EMPTY_FORM);
  }, [initial, open]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    if (!form.contentHtml.trim()) { toast.error("Content is required."); return; }
    onSave(form);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-strong">
            {initial ? "Edit Template" : "New Template"}
          </h2>
          <Button variant="ghost" size="icon-xs" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Template name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Tutorial Template"
              maxLength={120}
              className="w-full h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description shown to authors"
              maxLength={300}
              className="w-full h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category hint</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full h-11 rounded-xl border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Default content <span className="text-danger">*</span>
            </label>
            <RichTextEditor
              content={form.contentHtml}
              onChange={(html) => setForm((f) => ({ ...f, contentHtml: html }))}
              className="min-h-[200px]"
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-surface/30">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button
            onClick={(e) => {
              if (!form.title.trim()) { toast.error("Title is required."); return; }
              if (!form.contentHtml.trim()) { toast.error("Content is required."); return; }
              onSave(form);
            }}
            disabled={isSaving}
            className="bg-gradient-to-br from-primary to-primary-600 text-white"
          >
            {isSaving ? "Saving…" : initial ? "Save Changes" : "Create Template"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TemplateManagement() {
  const [modal, setModal] = useState({ open: false, editing: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });

  const { data: templates = [], isLoading } = useTemplates();
  const { data: categories = [] } = useCategories();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  async function handleSave(form) {
    try {
      if (modal.editing) {
        await updateTemplate.mutateAsync({ id: modal.editing._id, data: form });
        toast.success("Template updated.");
      } else {
        await createTemplate.mutateAsync(form);
        toast.success("Template created.");
      }
      setModal({ open: false, editing: null });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save template.");
    }
  }

  async function handleDelete() {
    try {
      await deleteTemplate.mutateAsync(deleteModal.id);
      toast.success("Template deleted.");
      setDeleteModal({ open: false, id: null, title: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete template.");
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><PageLoader /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="Blog Templates"
        buttonText="Add Template"
        icon={Plus}
        onButtonClick={() => setModal({ open: true, editing: null })}
      />

      {templates.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="font-medium">No templates yet.</p>
          <button
            onClick={() => setModal({ open: true, editing: null })}
            className="mt-2 text-primary text-sm underline"
          >
            Create your first template
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((tpl) => (
                <TableRow key={tpl._id}>
                  <TableCell className="font-medium">
                    <p>{tpl.title}</p>
                    {tpl.description && (
                      <p className="text-xs text-muted mt-0.5">{tpl.description}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted text-sm">
                    {tpl.category?.name || "—"}
                  </TableCell>
                  <TableCell className="text-muted text-sm">
                    {tpl.createdBy?.name || "—"}
                  </TableCell>
                  <TableCell className="text-muted text-sm">
                    {formatDate(tpl.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setModal({ open: true, editing: tpl })}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-danger hover:text-danger"
                        onClick={() =>
                          setDeleteModal({ open: true, id: tpl._id, title: tpl.title })
                        }
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TemplateModal
        open={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
        onSave={handleSave}
        isSaving={createTemplate.isPending || updateTemplate.isPending}
        categories={categories}
        initial={
          modal.editing
            ? {
                title: modal.editing.title || "",
                description: modal.editing.description || "",
                contentHtml: modal.editing.contentHtml || "",
                category: modal.editing.category?._id || "",
              }
            : null
        }
      />

      <ConfirmationModal
        open={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, id: null, title: "" })}
        onConfirm={handleDelete}
        title="Delete Template"
        description={`Delete "${deleteModal.title}"? This cannot be undone.`}
        confirmText="Delete"
        tone="destructive"
        isConfirming={deleteTemplate.isPending}
      />
    </div>
  );
}
