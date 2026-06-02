import React, { useState } from 'react';
import { FileText, ExternalLink, X, Loader2, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { PageHeader, PageLoader } from '@/components';
import { ConfirmationModal } from '@/components';
import { useCourseMaterials, useAddMaterial, useDeleteMaterial } from '@/hooks';
import { toast } from 'sonner';

export function CourseMaterialManagement() {
  const { id: courseId } = useParams();
  const { data: materials = [], isLoading } = useCourseMaterials(courseId);
  const addMaterial = useAddMaterial();
  const deleteMaterial = useDeleteMaterial();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', fileUrl: '' });
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || (!form.fileUrl.trim() && !file)) {
      setFormError('Title and URL or file are required.');
      return;
    }
    try {
      setIsSubmitting(true);

      let dataToSend;
      if (file) {
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('file', file);
        dataToSend = fd;
      } else {
        dataToSend = { title: form.title, fileUrl: form.fileUrl };
      }

      await addMaterial.mutateAsync({ courseId, data: dataToSend });
      toast.success('Material added.');
      setForm({ title: '', fileUrl: '' });
      setFile(null);
      setShowModal(false);
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to add material.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteMaterial.mutateAsync({ courseId, materialId: deleteTarget._id });
      toast.success('Material deleted.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete material.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader
        title="Course Materials"
        buttonText="Add Material"
        onButtonClick={() => { setShowModal(true); setFormError(''); }}
      />

      {isLoading ? (
        <PageLoader text="Loading materials..." size={280} fullScreen={true} />
      ) : (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-bg-surface border-b-2 border-primary">
              <TableRow>
                <TableHead className="font-bold text-text-strong p-4">Title</TableHead>
                <TableHead className="font-bold text-text-strong p-4">URL</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Added</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted py-12">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-border" />
                    <p className="font-medium">No materials uploaded yet.</p>
                    <p className="text-sm mt-1">Click "Add Material" to upload the first resource.</p>
                  </TableCell>
                </TableRow>
              ) : (
                materials.map((material) => (
                  <TableRow key={material._id} className="hover:bg-bg-surface border-b border-border">
                    <TableCell className="text-text-strong p-4 font-medium">
                      <FileText size={16} className="inline mr-2 text-primary" />
                      {material.title}
                    </TableCell>
                    <TableCell className="text-muted p-4 max-w-xs truncate">
                      <a
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink size={14} />
                        View
                      </a>
                    </TableCell>
                    <TableCell className="text-muted p-4 text-sm">
                      {material.createdAt ? new Date(material.createdAt).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="p-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteTarget(material)}
                        aria-label="Delete material"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Material Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-lg font-bold text-text-strong">Add Material</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-bg-surface hover:text-text-strong transition-colors cursor-pointer border-none bg-transparent"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 flex flex-col gap-4">
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  {formError}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-strong">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Lecture 1 – Introduction"
                  className="w-full px-3.5 py-2.5 border-2 border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-strong">Upload file (optional)</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                />
                <p className="text-xs text-muted">Or provide a publicly accessible URL below.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-strong">File URL</label>
                <input
                  value={form.fileUrl}
                  onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3.5 py-2.5 border-2 border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Adding...</> : 'Add Material'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        open={!!deleteTarget}
        title="Delete material?"
        description={`This will permanently delete "${deleteTarget?.title}".`}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />
    </div>
  );
}
