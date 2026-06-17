import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock, Users, BookOpen, CheckCircle, Loader2,
  FileText, Video, Image, Music, File, Trash2,
  Plus, Calendar, Upload, AlertCircle, X, ChevronLeft,
  ClipboardList, Award, Download, Eye, CreditCard, Lock, ExternalLink, Pencil,
} from 'lucide-react';
import { Card, Button } from '@/components';
import { ConfirmationModal, PageLoader } from '@/components';
import { useCourse } from '@/hooks';
import { useAuth } from '@/context';
import { useMyStudent } from '@/hooks';
import { useEnrollInCourse } from '@/hooks';
import { useCreatePayment } from '@/hooks';
import { useCourseMaterials, useAddMaterial, useDeleteMaterial } from '@/hooks';
import { useCourseProgress, useMarkMaterialComplete, useUnmarkMaterialComplete } from '@/hooks';
import {
  useCourseAssignments,
  useCreateAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
  useSubmitAssignment,
  useDeleteMySubmission,
  useMySubmissionsForCourse,
  useAssignmentSubmissions,
  useGradeSubmission,
} from '@/hooks';
import { toast } from 'sonner';

// ─── helpers ───────────────────────────────────────────────────────────────

function getFileIcon(url, mimeType) {
  const lower = (url || '').toLowerCase().split('?')[0];
  const mime = mimeType || '';
  if (lower.match(/\.pdf/) || mime === 'application/pdf')
    return <FileText size={18} className="text-red-500" />;
  if (lower.match(/\.(docx?)/) || mime.includes('wordprocessingml') || mime === 'application/msword')
    return <FileText size={18} className="text-blue-600" />;
  if (lower.match(/\.(xlsx?)/) || mime.includes('spreadsheetml') || mime === 'application/vnd.ms-excel')
    return <FileText size={18} className="text-green-600" />;
  if (lower.match(/\.(mp4|webm|mov|avi|mkv)/) || mime.startsWith('video/'))
    return <Video size={18} className="text-blue-500" />;
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg)/) || mime.startsWith('image/'))
    return <Image size={18} className="text-green-500" />;
  if (lower.match(/\.(mp3|wav|ogg|flac)/) || mime.startsWith('audio/'))
    return <Music size={18} className="text-purple-500" />;
  return <File size={18} className="text-gray-400" />;
}

const MIME_BY_EXT = {
  '.pdf':  'application/pdf',
  '.doc':  'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls':  'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt':  'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.zip':  'application/zip',
  '.mp4':  'video/mp4',
  '.mp3':  'audio/mpeg',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
};

const EXT_BY_MIME = Object.fromEntries(
  Object.entries(MIME_BY_EXT).map(([ext, mime]) => [mime, ext])
);

function getExtFromUrl(url) {
  if (!url) return '';
  const name = url.split('?')[0].split('#')[0].split('/').pop();
  const dot = name.lastIndexOf('.');
  return dot !== -1 ? name.substring(dot).toLowerCase() : '';
}

async function downloadFile(url, title, storedMimeType, fileExt) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('fetch failed');

    // Determine extension: forced ext → URL path → stored DB mimeType → response Content-Type
    const extFromUrl = getExtFromUrl(url);
    const responseMime = (response.headers.get('content-type') || '').split(';')[0].trim();
    const resolvedMime = storedMimeType || responseMime || 'application/octet-stream';
    const ext = fileExt || extFromUrl || EXT_BY_MIME[resolvedMime] || '';

    // Always build the blob with the canonical MIME for that extension so the
    // browser shows the right file type (e.g. "PDF Document" not "File")
    const blobMime = MIME_BY_EXT[ext] || resolvedMime;
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: blobMime });
    const blobUrl = URL.createObjectURL(blob);

    const safe = (title || 'download').replace(/[/\\:*?"<>|]/g, '_');
    const filename = ext && safe.toLowerCase().endsWith(ext) ? safe : safe + ext;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank');
  }
}

function isYouTubeUrl(url) {
  if (!url) return false;
  return /youtube\.com\/watch\?v=|youtu\.be\//.test(url);
}

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\s]+)/);
  return m?.[1] || null;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function dueBadge(dueDate) {
  if (!dueDate) return null;
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  let cls = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  let label = `Due ${fmtDate(dueDate)}`;
  if (diffDays < 0) { cls = 'bg-red-50 text-red-600 border border-red-200'; label = `Overdue — ${fmtDate(dueDate)}`; }
  else if (diffDays <= 3) { cls = 'bg-amber-50 text-amber-700 border border-amber-200'; }
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      <Calendar size={11} /> {label}
    </span>
  );
}

// ─── Tab ──────────────────────────────────────────────────────────────────

function Tab({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
      }`}
    >
      <Icon size={15} />
      {children}
    </button>
  );
}

// ─── Materials Tab ────────────────────────────────────────────────────────

function MaterialsTab({ courseId, canManage, isStudent }) {
  const { data: materials = [], isLoading } = useCourseMaterials(courseId);
  const { data: courseProgress } = useCourseProgress(isStudent ? courseId : null);
  const markComplete = useMarkMaterialComplete();
  const unmarkComplete = useUnmarkMaterialComplete();
  const addMaterial = useAddMaterial();
  const deleteMaterial = useDeleteMaterial();

  const completedIds = new Set(
    (courseProgress?.materials || []).filter((m) => m.completed).map((m) => m.materialId)
  );

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', fileUrl: '' });
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sorted = [...materials].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const openModal = () => {
    setForm({ title: '', fileUrl: '' });
    setFile(null);
    setFormError('');
    setShowModal(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || (!form.fileUrl.trim() && !file)) {
      setFormError('Title and a file or URL are required.');
      return;
    }
    try {
      setIsSubmitting(true);
      let dataToSend;
      if (file) {
        const fd = new FormData();
        fd.append('title', form.title.trim());
        fd.append('file', file);
        dataToSend = fd;
      } else {
        dataToSend = { title: form.title.trim(), fileUrl: form.fileUrl.trim() };
      }
      await addMaterial.mutateAsync({ courseId, data: dataToSend });
      toast.success('Material added successfully.');
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

  const handleToggleComplete = (material) => {
    const done = completedIds.has(material._id);
    if (done) {
      unmarkComplete.mutate({ courseId, materialId: material._id });
    } else {
      markComplete.mutate({ courseId, materialId: material._id });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>;
  }

  const progressPct = courseProgress?.progressPercentage ?? 0;
  const completedCount = completedIds.size;
  const totalCount = materials.length;

  return (
    <div>
      {isStudent && courseProgress && (
        <div className="mb-5 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Course Progress</span>
            <span className="text-sm font-bold text-primary">{progressPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {completedCount}/{totalCount} materials completed
          </p>
        </div>
      )}

      {canManage && (
        <div className="flex justify-end mb-4">
          <Button onClick={openModal} className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all">
            <Upload size={15} /> Upload Material
          </Button>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">No materials yet.</p>
          {canManage && <p className="text-sm text-gray-400 mt-1">Upload the first resource to get started.</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((m) => {
            const isYT = isYouTubeUrl(m.fileUrl);
            const ytId  = isYT ? getYouTubeId(m.fileUrl) : null;

            return (
              <div
                key={m._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all overflow-hidden"
              >
                {/* YouTube embed */}
                {isYT && ytId && (
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 w-full h-full rounded-t-2xl"
                      src={`https://www.youtube.com/embed/${ytId}`}
                      title={m.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Row: icon + title + date + actions */}
                <div className="flex items-center gap-4 p-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary-600/5 flex items-center justify-center shrink-0">
                    {isYT
                      ? <Video size={16} className="text-red-500" />
                      : getFileIcon(m.fileUrl, m.mimeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{m.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{fmtDate(m.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isYT ? (
                      <a
                        href={m.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <ExternalLink size={12} /> Open in YouTube
                      </a>
                    ) : (
                      <button
                        onClick={() => downloadFile(m.fileUrl, m.title, m.mimeType)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-600 border border-primary/30 hover:border-primary px-3 py-1.5 rounded-lg transition-colors bg-transparent cursor-pointer"
                      >
                        <Download size={13} /> Download
                      </button>
                    )}
                    {isStudent && (
                      <button
                        onClick={() => handleToggleComplete(m)}
                        disabled={markComplete.isPending || unmarkComplete.isPending}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border bg-transparent cursor-pointer disabled:opacity-50 ${
                          completedIds.has(m._id)
                            ? 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-gray-500 border-gray-200 hover:border-primary/40 hover:text-primary'
                        }`}
                      >
                        <CheckCircle size={13} className={completedIds.has(m._id) ? 'text-emerald-600' : 'text-gray-300'} />
                        {completedIds.has(m._id) ? 'Done' : 'Mark done'}
                      </button>
                    )}
                    {canManage && (
                      <button
                        onClick={() => setDeleteTarget(m)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Material Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Upload Material</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer">
                <X size={17} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 flex flex-col gap-4">
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 px-3 py-2.5 rounded-lg text-sm">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" /> {formError}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Lecture 1 – Introduction to React"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Upload File</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    onChange={(e) => { setFile(e.target.files?.[0] || null); setForm((f) => ({ ...f, fileUrl: '' })); }}
                    className="hidden"
                    id="mat-file-upload"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.webm,.mov,.mp3,.jpg,.jpeg,.png,.gif,.zip"
                  />
                  <label htmlFor="mat-file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload size={22} className="text-gray-300" />
                    {file ? (
                      <span className="text-sm text-primary font-medium">{file.name}</span>
                    ) : (
                      <span className="text-sm text-gray-400">Click to select a file, or drag & drop</span>
                    )}
                  </label>
                </div>
                <p className="text-xs text-gray-400">Supports PDF, DOC, PPT, MP4, MP3, images and more.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">External URL</label>
                <input
                  value={form.fileUrl}
                  onChange={(e) => { setForm((f) => ({ ...f, fileUrl: e.target.value })); if (e.target.value) setFile(null); }}
                  placeholder="https://drive.google.com/... or YouTube link"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                  disabled={!!file}
                />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-primary to-primary-600 text-white px-5">
                  {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : 'Upload'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        open={!!deleteTarget}
        title="Delete material?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />
    </div>
  );
}

// ─── Assignment Submissions Modal ─────────────────────────────────────────

function SubmissionsModal({ assignment, onClose }) {
  const { data: submissions = [], isLoading } = useAssignmentSubmissions(assignment._id);
  const gradeSubmission = useGradeSubmission();
  const [grading, setGrading] = useState(null);
  const [gradeForm, setGradeForm] = useState({ marks: '', feedback: '' });
  const [saving, setSaving] = useState(false);

  const handleGrade = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await gradeSubmission.mutateAsync({
        assignmentId: assignment._id,
        studentId: grading.student?._id || grading.student,
        data: { marks: Number(gradeForm.marks), feedback: gradeForm.feedback },
      });
      toast.success('Submission graded.');
      setGrading(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to grade submission.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Submissions</h2>
            <p className="text-xs text-gray-400 mt-0.5">{assignment.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer">
            <X size={17} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={24} /></div>
          ) : submissions.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div key={sub._id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {sub.student?.user?.name || 'Student'}
                      </p>
                      <p className="text-xs text-gray-400">{sub.student?.user?.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Submitted: {fmtDate(sub.submittedAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {sub.marks != null && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          {sub.marks} marks
                        </span>
                      )}
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        sub.status === 'SUBMITTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        sub.status === 'LATE SUBMISSION' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>{sub.status}</span>
                    </div>
                  </div>
                  {sub.submissionFileUrl && (
                    <button
                      onClick={() => downloadFile(
                        sub.submissionFileUrl,
                        `${sub.student?.user?.name || 'submission'} - ${assignment.title}`,
                        null,
                        sub.submissionFileExt
                      )}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline border-none bg-transparent cursor-pointer p-0"
                    >
                      <Download size={12} /> Download Submission
                    </button>
                  )}
                  {sub.feedback && (
                    <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Feedback: {sub.feedback}</p>
                  )}
                  <button
                    onClick={() => { setGrading(sub); setGradeForm({ marks: sub.marks ?? '', feedback: sub.feedback ?? '' }); }}
                    className="mt-2 text-xs font-medium text-primary border border-primary/30 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border-solid bg-transparent cursor-pointer"
                  >
                    {sub.marks != null ? 'Edit Grade' : 'Grade'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {grading && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Grade Submission</h3>
              <button onClick={() => setGrading(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer">
                <X size={17} />
              </button>
            </div>
            <form onSubmit={handleGrade} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Marks</label>
                <input
                  type="number"
                  min="0"
                  value={gradeForm.marks}
                  onChange={(e) => setGradeForm((f) => ({ ...f, marks: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="e.g. 85"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Feedback</label>
                <textarea
                  rows={3}
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm((f) => ({ ...f, feedback: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                  placeholder="Optional feedback for the student..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setGrading(null)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-gradient-to-r from-primary to-primary-600 text-white px-5">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Grade'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Assignments Tab ──────────────────────────────────────────────────────

function AssignmentsTab({ courseId, canManage, isStudent }) {
  const { data: assignments = [], isLoading } = useCourseAssignments(courseId);
  const { data: mySubmissionsMap = {} } = useMySubmissionsForCourse(isStudent ? courseId : null);
  const createAssignment = useCreateAssignment();
  const updateAssignment = useUpdateAssignment();
  const deleteAssignment = useDeleteAssignment();
  const submitAssignment = useSubmitAssignment();
  const deleteMySubmission = useDeleteMySubmission();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', description: '', dueDate: '' });
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', dueDate: '' });
  const [editError, setEditError] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [submitTarget, setSubmitTarget] = useState(null);
  const [submitFile, setSubmitFile] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [viewSubmissions, setViewSubmissions] = useState(null);

  const sorted = [...assignments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      setCreateError('Title is required.');
      return;
    }
    try {
      setIsCreating(true);
      await createAssignment.mutateAsync({
        courseId,
        data: {
          title: createForm.title.trim(),
          description: createForm.description.trim(),
          dueDate: createForm.dueDate || undefined,
        },
      });
      toast.success('Assignment created.');
      setShowCreateModal(false);
      setCreateForm({ title: '', description: '', dueDate: '' });
    } catch (err) {
      setCreateError(err?.response?.data?.message || 'Failed to create assignment.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAssignment.mutateAsync(deleteTarget._id);
      toast.success('Assignment deleted.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete assignment.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (a) => {
    setEditTarget(a);
    setEditForm({
      title: a.title,
      description: a.description || '',
      dueDate: a.dueDate ? new Date(a.dueDate).toISOString().split('T')[0] : '',
    });
    setEditError('');
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) { setEditError('Title is required.'); return; }
    try {
      setIsSavingEdit(true);
      await updateAssignment.mutateAsync({
        id: editTarget._id,
        data: {
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          dueDate: editForm.dueDate || undefined,
        },
      });
      toast.success('Assignment updated.');
      setEditTarget(null);
    } catch (err) {
      setEditError(err?.response?.data?.message || 'Failed to update assignment.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitFile) {
      setSubmitError('Please select a file to submit.');
      return;
    }
    try {
      setIsSubmittingAssignment(true);
      const fd = new FormData();
      fd.append('file', submitFile);
      await submitAssignment.mutateAsync({ id: submitTarget._id, data: fd, courseId });
      toast.success('Assignment submitted successfully!');
      setSubmitTarget(null);
      setSubmitFile(null);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Failed to submit assignment.');
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  const handleRemoveSubmission = async (assignmentId) => {
    try {
      setRemovingId(assignmentId);
      await deleteMySubmission.mutateAsync({ id: assignmentId, courseId });
      toast.success('Submission removed.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove submission.');
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>;
  }

  return (
    <div>
      {canManage && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => { setCreateForm({ title: '', description: '', dueDate: '' }); setCreateError(''); setShowCreateModal(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={15} /> Create Assignment
          </Button>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">No assignments yet.</p>
          {canManage && <p className="text-sm text-gray-400 mt-1">Create the first assignment for this course.</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((a) => {
            const mySubmission = mySubmissionsMap[String(a._id)];
            const isSubmitted = !!mySubmission;
            const isRemoving = removingId === a._id;
            return (
              <div key={a._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-900 text-sm">{a.title}</h3>
                      {dueBadge(a.dueDate)}
                      {isStudent && isSubmitted && (
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          mySubmission.status === 'LATE SUBMISSION'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          <CheckCircle size={10} />
                          {mySubmission.status === 'LATE SUBMISSION' ? 'Late Submission' : 'Submitted'}
                        </span>
                      )}
                    </div>
                    {a.description && (
                      <p className="text-sm text-gray-500 leading-relaxed mt-1">{a.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1.5">Posted {fmtDate(a.createdAt)}</p>
                    {isStudent && isSubmitted && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Submitted {fmtDate(mySubmission.submittedAt)}
                        {mySubmission.marks != null && (
                          <span className="ml-2 font-semibold text-emerald-600">{mySubmission.marks} marks</span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {canManage && (
                      <>
                        <button
                          onClick={() => setViewSubmissions(a)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border-solid bg-transparent cursor-pointer"
                        >
                          <Eye size={13} /> Submissions
                        </button>
                        <button
                          onClick={() => openEditModal(a)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors border-none bg-transparent cursor-pointer"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(a)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                    {isStudent && (
                      <div className="flex items-center gap-2">
                        {isSubmitted && (
                          <button
                            onClick={() => handleRemoveSubmission(a._id)}
                            disabled={isRemoving}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border-solid bg-transparent cursor-pointer disabled:opacity-50"
                          >
                            {isRemoving ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                            Remove
                          </button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => { setSubmitTarget(a); setSubmitFile(null); setSubmitError(''); }}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                            isSubmitted
                              ? 'bg-white text-primary border border-primary/30 hover:bg-primary/5'
                              : 'bg-gradient-to-r from-primary to-primary-600 text-white'
                          }`}
                        >
                          <Upload size={13} className="mr-1" />
                          {isSubmitted ? 'Resubmit' : 'Submit'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Create Assignment</h2>
              <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer">
                <X size={17} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">
              {createError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 px-3 py-2.5 rounded-lg text-sm">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" /> {createError}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Title *</label>
                <input
                  value={createForm.title}
                  onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Week 3 – Data Structures Exercise"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the assignment requirements..."
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={createForm.dueDate}
                  onChange={(e) => setCreateForm((f) => ({ ...f, dueDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isCreating} className="bg-gradient-to-r from-primary to-primary-600 text-white px-5">
                  {isCreating ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Assignment Modal */}
      {submitTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Submit Assignment</h2>
                <p className="text-xs text-gray-400 mt-0.5">{submitTarget.title}</p>
              </div>
              <button onClick={() => setSubmitTarget(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer">
                <X size={17} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {submitError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 px-3 py-2.5 rounded-lg text-sm">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" /> {submitError}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Upload your work *</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="submit-file"
                    className="hidden"
                    onChange={(e) => setSubmitFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="submit-file" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload size={22} className="text-gray-300" />
                    {submitFile ? (
                      <span className="text-sm text-primary font-medium">{submitFile.name}</span>
                    ) : (
                      <span className="text-sm text-gray-400">Click to select your submission file</span>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setSubmitTarget(null)}>Cancel</Button>
                <Button type="submit" disabled={isSubmittingAssignment} className="bg-gradient-to-r from-primary to-primary-600 text-white px-5">
                  {isSubmittingAssignment ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Edit Assignment</h2>
              <button onClick={() => setEditTarget(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer">
                <X size={17} />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 flex flex-col gap-4">
              {editError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 px-3 py-2.5 rounded-lg text-sm">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" /> {editError}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Title *</label>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm((f) => ({ ...f, dueDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
                <Button type="submit" disabled={isSavingEdit} className="bg-gradient-to-r from-primary to-primary-600 text-white px-5">
                  {isSavingEdit ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewSubmissions && (
        <SubmissionsModal assignment={viewSubmissions} onClose={() => setViewSubmissions(null)} />
      )}

      <ConfirmationModal
        open={!!deleteTarget}
        title="Delete assignment?"
        description={`"${deleteTarget?.title}" will be permanently removed along with all submissions.`}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />
    </div>
  );
}

// ─── Main CoursePage ───────────────────────────────────────────────────────

export function CoursePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: course, isLoading } = useCourse(id);
  const { data: student } = useMyStudent();
  const enrollInCourse = useEnrollInCourse();
  const createPayment = useCreatePayment();
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const isAdmin = user?.role === 'ADMIN';
  const isLecturer = user?.role === 'LECTURER';
  const isStudent = user?.role === 'STUDENT';

  const isAlreadyEnrolled = student?.enrolledCourses?.some(
    (c) => String(c._id || c) === String(id),
  );

  const isOwnCourse =
    isLecturer &&
    (String(course?.lecturer?.user?._id) === String(user?._id) ||
      String(course?.lecturer?.user) === String(user?._id));

  const canManage = isAdmin || isOwnCourse;
  const canAccessContent = isAdmin || isLecturer || isAlreadyEnrolled;

  const isFree = !course?.fee || course.fee === 0;

  const handleEnroll = async () => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }
    try {
      setEnrolling(true);
      if (isFree) {
        await enrollInCourse.mutateAsync(id);
        toast.success('Enrolled successfully!');
      } else {
        toast.info('Opening Stripe checkout…', { duration: 2500 });
        const result = await createPayment.mutateAsync({ courseId: id, method: 'CARD' });
        const sessionUrl = result?.data?.sessionUrl;
        if (sessionUrl) {
          window.location.href = sessionUrl;
          return; // page navigates away — no finally reset needed
        }
        // sessionUrl missing means Stripe is not configured on the server
        toast.error('Payment gateway is not available. Please contact support.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Enrollment failed. Please try again.';
      toast.error(msg);
    } finally {
      setEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <PageLoader size={280} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <BookOpen size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Course not found.</p>
          <Link to="/courses" className="text-sm text-primary hover:underline mt-2 block">Back to courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero / Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary mb-5 transition-colors">
            <ChevronLeft size={16} /> Back to Courses
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
            {/* Left: info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  course.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
                {isFree ? (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">Free</span>
                ) : (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">${course.fee}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{course.title}</h1>

              {course.lecturer?.user?.name && (
                <p className="text-sm text-gray-500 mt-3">
                  Instructor: <span className="font-semibold text-gray-700">{course.lecturer.user.name}</span>
                </p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap gap-5 mt-4">
                {[
                  { icon: Clock, label: course.duration ? `${course.duration}h` : 'N/A' },
                  { icon: Users, label: `${course.enrollmentCount ?? 0} students` },
                  { icon: BookOpen, label: course.category || 'General' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-sm text-gray-500">
                    <s.icon size={15} className="text-gray-400" />
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: enrollment card */}
            <div className="lg:w-72 xl:w-80 shrink-0">
              <Card className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
                {isAdmin && (
                  <div className="flex items-center gap-2 text-sm text-primary font-semibold bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-4">
                    <Award size={16} /> You are viewing as Admin
                  </div>
                )}
                {isOwnCourse && !isAdmin && (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4">
                    <CheckCircle size={16} /> You are the Instructor
                  </div>
                )}
                {isLecturer && !isOwnCourse && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                    <BookOpen size={16} /> Viewing another course
                  </div>
                )}
                {isAlreadyEnrolled && !isAdmin && !isLecturer && (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4">
                    <CheckCircle size={16} /> You are enrolled
                  </div>
                )}

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Price</span>
                    <span className="font-bold text-gray-900">{isFree ? 'Free' : `$${course.fee}`}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Duration</span>
                    <span className="font-semibold text-gray-700">{course.duration ? `${course.duration} hours` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Students</span>
                    <span className="font-semibold text-gray-700">{course.enrollmentCount ?? 0}</span>
                  </div>
                </div>

                {(isStudent || !user) && !isAlreadyEnrolled && (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleEnroll}
                      disabled={enrolling || !course.isPublished}
                      className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary text-white py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all h-auto active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {enrolling ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          {isFree ? 'Enrolling…' : 'Opening Stripe…'}
                        </span>
                      ) : isFree ? (
                        'Enroll Now — Free'
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <CreditCard size={15} />
                          Pay & Enroll — ${course.fee}
                        </span>
                      )}
                    </Button>
                    {!isFree && !enrolling && (
                      <p className="flex items-center justify-center gap-1 text-xs text-gray-400">
                        <Lock size={11} />
                        Secure payment via Stripe
                        <ExternalLink size={11} />
                      </p>
                    )}
                  </div>
                )}
                {!course.isPublished && !isAdmin && (
                  <p className="text-xs text-center text-gray-400 mt-2">This course is not yet published.</p>
                )}
              </Card>
            </div>
          </div>

          {/* Tabs (only if user can access content) */}
          {canAccessContent && (
            <div className="flex gap-0 mt-6 border-b border-gray-100 -mb-px overflow-x-auto">
              <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={BookOpen}>Overview</Tab>
              <Tab active={activeTab === 'materials'} onClick={() => setActiveTab('materials')} icon={FileText}>Materials</Tab>
              <Tab active={activeTab === 'assignments'} onClick={() => setActiveTab('assignments')} icon={ClipboardList}>Assignments</Tab>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(!canAccessContent || activeTab === 'overview') && (
          <div className="max-w-3xl">
            <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Course Overview</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {course.description || 'No detailed overview provided for this course.'}
              </p>
            </Card>

            {!canAccessContent && (
              <div className="bg-gradient-to-br from-primary/5 to-primary-600/3 border border-primary/15 rounded-2xl p-6 text-center">
                <BookOpen size={32} className="text-primary/40 mx-auto mb-3" />
                <p className="font-semibold text-gray-700">Enroll to access course materials & assignments</p>
                <p className="text-sm text-gray-400 mt-1">
                  {isFree ? 'This course is free — enroll now to start learning.' : `Complete payment to unlock all content.`}
                </p>
              </div>
            )}
          </div>
        )}

        {canAccessContent && activeTab === 'materials' && (
          <MaterialsTab courseId={id} canManage={canManage} isStudent={isStudent} />
        )}

        {canAccessContent && activeTab === 'assignments' && (
          <AssignmentsTab courseId={id} canManage={canManage} isStudent={isStudent} />
        )}
      </div>
    </div>
  );
}
