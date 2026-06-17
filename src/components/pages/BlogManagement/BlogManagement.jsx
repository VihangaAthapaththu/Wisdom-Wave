import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Eye, Settings, X, Clock, User } from "lucide-react";
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
import { PageHeader } from "@/components/molecules";
import { useModerationQueue, useAllBlogsAdmin, useApproveBlog, useRejectBlog } from "@/hooks";

const STATUS_STYLES = {
  DRAFT: "bg-gray-100 text-gray-600",
  PENDING: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RejectModal({ open, onCancel, onConfirm, isConfirming }) {
  const [note, setNote] = useState("");

  function handleConfirm() {
    if (!note.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    onConfirm(note.trim());
    setNote("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <h2 className="text-lg font-bold text-text-strong mb-3">Reject Blog Post</h2>
        <p className="text-sm text-muted mb-4">
          Provide a reason so the author can improve their post.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Rejection reason…"
          rows={4}
          className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none mb-4"
        />
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={isConfirming}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isConfirming}>
            {isConfirming ? "Rejecting…" : "Reject Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ blog, onClose }) {
  if (!blog) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {blog.category && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wide shrink-0">
                {blog.category.name}
              </span>
            )}
            <h2 className="text-base font-bold text-text-strong truncate">{blog.title}</h2>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={onClose} className="shrink-0 ml-2">
            <X size={16} />
          </Button>
        </div>

        {/* Meta bar */}
        <div className="flex flex-wrap gap-4 px-6 py-3 bg-surface/40 border-b border-border text-xs text-muted shrink-0">
          <span className="inline-flex items-center gap-1.5">
            <User size={12} />
            {blog.author?.name} · {blog.author?.role}
          </span>
          {blog.readTime && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} />
              {blog.readTime} min read
            </span>
          )}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          {blog.featuredImageUrl && (
            <img
              src={blog.featuredImageUrl}
              alt={blog.title}
              className="w-full max-h-56 object-cover rounded-xl mb-6"
            />
          )}
          {blog.excerpt && (
            <p className="text-gray-500 italic text-sm mb-6 border-l-4 border-primary/30 pl-4">
              {blog.excerpt}
            </p>
          )}
          <div
            className="prose prose-sm prose-gray max-w-none prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-600 prose-a:text-primary prose-blockquote:border-primary prose-code:bg-surface prose-code:px-1 prose-code:rounded prose-img:rounded-xl [&_em]:italic [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-border bg-surface/30 shrink-0">
          <Button variant="outline" onClick={onClose}>Close Preview</Button>
        </div>
      </div>
    </div>
  );
}

export function BlogManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("PENDING");
  const [rejectModal, setRejectModal] = useState({ open: false, blogId: null });
  const [approveModal, setApproveModal] = useState({ open: false, blogId: null, title: "" });
  const [previewBlog, setPreviewBlog] = useState(null);

  const { data: pendingBlogs = [], isLoading: loadingPending } = useModerationQueue();
  const { data: allBlogs = [], isLoading: loadingAll } = useAllBlogsAdmin();
  const approveBlog = useApproveBlog();
  const rejectBlog = useRejectBlog();

  const isLoading = activeTab === "PENDING" ? loadingPending : loadingAll;
  const displayBlogs = activeTab === "PENDING" ? pendingBlogs : allBlogs;

  async function handleApprove() {
    try {
      await approveBlog.mutateAsync(approveModal.blogId);
      toast.success("Blog approved and published.");
      setApproveModal({ open: false, blogId: null, title: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve.");
    }
  }

  async function handleReject(moderationNote) {
    try {
      await rejectBlog.mutateAsync({ id: rejectModal.blogId, moderationNote });
      toast.success("Blog rejected.");
      setRejectModal({ open: false, blogId: null });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-start justify-between mb-2 flex-wrap gap-4">
        <PageHeader title="Blog Moderation" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard/templates")}
        >
          <Settings size={15} /> Manage Templates
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface rounded-xl p-1 w-fit">
        {["PENDING", "ALL"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-white shadow text-text-strong"
                : "text-muted hover:text-text-strong"
            }`}
          >
            {tab === "PENDING" ? `Pending Review (${pendingBlogs.length})` : "All Blogs"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><PageLoader /></div>
      ) : displayBlogs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="font-medium">
            {activeTab === "PENDING" ? "No pending reviews." : "No blog posts found."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                {activeTab === "ALL" && <TableHead>Status</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayBlogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell className="font-medium max-w-xs">
                    <span className="line-clamp-2">{blog.title}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium text-text-strong">{blog.author?.name}</p>
                      <p className="text-muted text-xs">{blog.author?.role}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted text-sm">
                    {blog.category?.name || "—"}
                  </TableCell>
                  {activeTab === "ALL" && (
                    <TableCell>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[blog.status]}`}
                      >
                        {blog.status}
                      </span>
                    </TableCell>
                  )}
                  <TableCell className="text-muted text-sm">
                    {formatDate(blog.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {blog.status === "PUBLISHED" && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          title="View"
                          onClick={() => navigate(`/blog/${blog.slug}`)}
                        >
                          <Eye size={14} />
                        </Button>
                      )}
                      {blog.status === "PENDING" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Preview content"
                            onClick={() => setPreviewBlog(blog)}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Approve"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={() =>
                              setApproveModal({ open: true, blogId: blog._id, title: blog.title })
                            }
                          >
                            <CheckCircle size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Reject"
                            className="text-danger hover:text-red-700 hover:bg-red-50"
                            onClick={() => setRejectModal({ open: true, blogId: blog._id })}
                          >
                            <XCircle size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmationModal
        open={approveModal.open}
        onCancel={() => setApproveModal({ open: false, blogId: null, title: "" })}
        onConfirm={handleApprove}
        title="Approve Blog Post"
        description={`Publish "${approveModal.title}" to the public feed?`}
        confirmText="Approve & Publish"
        tone="default"
        isConfirming={approveBlog.isPending}
      />

      <RejectModal
        open={rejectModal.open}
        onCancel={() => setRejectModal({ open: false, blogId: null })}
        onConfirm={handleReject}
        isConfirming={rejectBlog.isPending}
      />

      <PreviewModal blog={previewBlog} onClose={() => setPreviewBlog(null)} />
    </div>
  );
}
