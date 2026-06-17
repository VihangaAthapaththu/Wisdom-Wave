import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImagePlus, Send, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button, PageLoader, Card, CardContent, Spinner } from "@/components/atoms";
import { PageHeader, RichTextEditor } from "@/components/molecules";
import {
  useCategories,
  useTemplates,
  useBlogForEdit,
  useCreateBlog,
  useUpdateBlog,
  useSubmitBlog,
} from "@/hooks";

function buildAutoSaveKey(id) {
  return `blog-draft-${id || "new"}`;
}

// Inner form — existingBlog is already resolved when this mounts, so state is
// initialized directly from props. No useEffect needed for prefilling.
function BlogEditorForm({ existingBlog }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!existingBlog;
  const autoSaveKey = buildAutoSaveKey(id);

  const { data: categories = [] } = useCategories();
  const { data: templates = [] } = useTemplates();

  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const submitBlog = useSubmitBlog();

  const [title, setTitle] = useState(() => {
    if (existingBlog) return existingBlog.title || "";
    try { return JSON.parse(localStorage.getItem(autoSaveKey) || "{}").title || ""; }
    catch { return ""; }
  });
  const [contentHtml, setContentHtml] = useState(() => {
    if (existingBlog) return existingBlog.contentHtml || "";
    try { return JSON.parse(localStorage.getItem(autoSaveKey) || "{}").contentHtml || ""; }
    catch { return ""; }
  });
  const [excerpt, setExcerpt] = useState(() => {
    if (existingBlog) return existingBlog.excerpt || "";
    try { return JSON.parse(localStorage.getItem(autoSaveKey) || "{}").excerpt || ""; }
    catch { return ""; }
  });
  const [categoryId, setCategoryId] = useState(existingBlog?.category?._id || "");
  const [templateId, setTemplateId] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(
    existingBlog?.featuredImageUrl || ""
  );
  const [blogId, setBlogId] = useState(existingBlog?._id || id || null);
  const [editorKey] = useState(() => {
    if (existingBlog) return existingBlog._id;
    try {
      const draft = JSON.parse(localStorage.getItem(autoSaveKey) || "{}");
      return draft.contentHtml ? "restored" : "new";
    } catch { return "new"; }
  });

  const autoSaveTimer = useRef(null);

  // Sync form state to localStorage (syncing to external system — valid use of effect)
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      if (title || contentHtml) {
        localStorage.setItem(autoSaveKey, JSON.stringify({ title, contentHtml, excerpt }));
      }
    }, 2000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [title, contentHtml, excerpt, autoSaveKey]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFeaturedImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFeaturedImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleTemplateChange(e) {
    const tid = e.target.value;
    setTemplateId(tid);
    if (tid) {
      const tpl = templates.find((t) => t._id === tid);
      if (tpl?.contentHtml) setContentHtml(tpl.contentHtml);
    }
  }

  function buildFormData() {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("contentHtml", contentHtml);
    if (excerpt) fd.append("excerpt", excerpt);
    if (categoryId) fd.append("category", categoryId);
    if (templateId) fd.append("templateId", templateId);
    if (featuredImageFile) fd.append("featuredImage", featuredImageFile);
    return fd;
  }

  async function handleSaveDraft() {
    if (!title.trim()) { toast.error("Title is required."); return; }
    if (!contentHtml.trim()) { toast.error("Content is required."); return; }

    try {
      let saved;
      if (blogId && isEditing) {
        saved = await updateBlog.mutateAsync({ id: blogId, formData: buildFormData() });
      } else {
        saved = await createBlog.mutateAsync(buildFormData());
        const newId = saved?.data?.blog?._id;
        if (newId) setBlogId(newId);
      }
      localStorage.removeItem(autoSaveKey);
      toast.success("Draft saved.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save draft.");
    }
  }

  const isPublished = existingBlog?.status?.toLowerCase() === "published";

  async function handleSubmit() {
    if (!title.trim()) { toast.error("Title is required."); return; }
    if (!contentHtml.trim()) { toast.error("Content is required."); return; }

    try {
      let currentId = blogId;
      if (!currentId) {
        const saved = await createBlog.mutateAsync(buildFormData());
        currentId = saved?.data?.blog?._id;
        if (currentId) setBlogId(currentId);
      } else if (isEditing) {
        await updateBlog.mutateAsync({ id: currentId, formData: buildFormData() });
      }
      if (currentId) {
        if (!isPublished) {
          await submitBlog.mutateAsync(currentId);
        }
        localStorage.removeItem(autoSaveKey);
        toast.success(isPublished ? "Post updated." : "Blog submitted for review.");
        navigate("/student-dashboard/blog");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit.");
    }
  }

  const isSaving = createBlog.isPending || updateBlog.isPending;
  const isSubmitting = submitBlog.isPending;
  const isBusy = isSaving || isSubmitting;

  const submitLabel = isPublished ? "Update Post" : "Submit for Review";
  const submitLoadingLabel = isPublished ? "Updating…" : "Submitting…";
  const SubmitIcon = isPublished ? RefreshCw : Send;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader title={isEditing ? "Edit Blog Post" : "Write New Post"} />

      <div className="space-y-6">
        {/* Template selector (only for new posts) */}
        {!isEditing && templates.length > 0 && (
          <Card>
            <CardContent className="pt-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Start from a template (optional)
              </label>
              <select
                value={templateId}
                onChange={handleTemplateChange}
                className="w-full h-11 rounded-xl border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">— Choose a template —</option>
                {templates.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title}
                    {t.category ? ` (${t.category.name})` : ""}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        )}

        {/* Title */}
        <Card>
          <CardContent className="pt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title…"
              className="w-full h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </CardContent>
        </Card>

        {/* Excerpt */}
        <Card>
          <CardContent className="pt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Short excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A one-line summary shown in the blog feed…"
              rows={2}
              maxLength={500}
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <p className="text-xs text-muted text-right mt-1">
              {excerpt.length}/500
            </p>
          </CardContent>
        </Card>

        {/* Category */}
        <Card>
          <CardContent className="pt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Featured image */}
        <Card>
          <CardContent className="pt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Featured image
            </label>
            {featuredImagePreview && (
              <img
                src={featuredImagePreview}
                alt="Featured"
                className="w-full max-h-56 object-cover rounded-xl mb-3"
              />
            )}
            <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border-2 border-dashed border-border text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors">
              <ImagePlus size={16} />
              {featuredImagePreview ? "Change image" : "Upload featured image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>
          </CardContent>
        </Card>

        {/* Content editor */}
        <Card>
          <CardContent className="pt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Content <span className="text-danger">*</span>
            </label>
            <RichTextEditor
              key={editorKey}
              content={contentHtml}
              onChange={setContentHtml}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isBusy}>
            {isSaving ? <Spinner size={16} /> : <Save size={16} />}
            {isSaving ? "Saving…" : "Save Draft"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isBusy}
            className="bg-gradient-to-br from-primary to-primary-600 text-white"
          >
            {isSubmitting ? <Spinner size={16} /> : <SubmitIcon size={16} />}
            {isSubmitting ? submitLoadingLabel : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Outer loader — waits for API data before mounting the form so that state can
// be initialized directly from props (no setState-in-effect pattern needed).
export function BlogEditor() {
  const { id } = useParams();
  const { data: existingBlog, isLoading: loadingBlog } = useBlogForEdit(id);

  if (id && loadingBlog) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <PageLoader />
      </div>
    );
  }

  return <BlogEditorForm key={id || "new"} existingBlog={existingBlog} />;
}
