import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, Send, PenLine } from "lucide-react";
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
import { useMyBlogs, useDeleteBlog, useSubmitBlog } from "@/hooks";

const STATUS_STYLES = {
  DRAFT: "bg-gray-100 text-gray-600",
  PENDING: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

const TABS = ["ALL", "DRAFT", "PENDING", "PUBLISHED", "REJECTED"];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ALL");
  const [deleteModal, setDeleteModal] = useState({ open: false, blogId: null, title: "" });

  const { data: blogs = [], isLoading } = useMyBlogs();
  const deleteBlog = useDeleteBlog();
  const submitBlog = useSubmitBlog();

  const filtered =
    activeTab === "ALL" ? blogs : blogs.filter((b) => b.status === activeTab);

  async function handleDelete() {
    try {
      await deleteBlog.mutateAsync(deleteModal.blogId);
      toast.success("Blog deleted.");
      setDeleteModal({ open: false, blogId: null, title: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete.");
    }
  }

  async function handleSubmit(id) {
    try {
      await submitBlog.mutateAsync(id);
      toast.success("Blog submitted for review.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit.");
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><PageLoader /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="My Blog Posts"
        buttonText="Write New Post"
        icon={PenLine}
        onButtonClick={() => navigate("/blog/new")}
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-white shadow text-text-strong"
                : "text-muted hover:text-text-strong"
            }`}
          >
            {tab}
            {tab !== "ALL" && (
              <span className="ml-1.5 text-xs text-muted">
                ({blogs.filter((b) => b.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="font-medium">No posts yet.</p>
          <button
            onClick={() => navigate("/blog/new")}
            className="mt-2 text-primary text-sm underline"
          >
            Write your first blog post
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((blog) => (
                <React.Fragment key={blog._id}>
                  <TableRow>
                    <TableCell className="font-medium max-w-xs">
                      <span className="line-clamp-2">{blog.title}</span>
                    </TableCell>
                    <TableCell className="text-muted text-sm">
                      {blog.category?.name || "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[blog.status]}`}
                      >
                        {blog.status}
                      </span>
                    </TableCell>
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
                        {(blog.status === "DRAFT" || blog.status === "REJECTED" || blog.status === "PUBLISHED") && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Edit"
                            onClick={() => navigate(`/blog/${blog._id}/edit`)}
                          >
                            <Pencil size={14} />
                          </Button>
                        )}
                        {(blog.status === "DRAFT" || blog.status === "REJECTED") && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Submit for review"
                            onClick={() => handleSubmit(blog._id)}
                            disabled={submitBlog.isPending}
                          >
                            <Send size={14} />
                          </Button>
                        )}
                        {(blog.status === "DRAFT" || blog.status === "REJECTED") && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Delete"
                            className="text-danger hover:text-danger"
                            onClick={() =>
                              setDeleteModal({ open: true, blogId: blog._id, title: blog.title })
                            }
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Show rejection note inline */}
                  {blog.status === "REJECTED" && blog.moderationNote && (
                    <TableRow>
                      <TableCell colSpan={5} className="pt-0 pb-3">
                        <div className="mx-1 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700">
                          <span className="font-semibold">Rejection reason: </span>
                          {blog.moderationNote}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmationModal
        open={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, blogId: null, title: "" })}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${deleteModal.title}"? This cannot be undone.`}
        confirmText="Delete"
        tone="destructive"
        isConfirming={deleteBlog.isPending}
      />
    </div>
  );
}
