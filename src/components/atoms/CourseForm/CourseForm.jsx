import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components';
import { useLecturers } from '@/hooks';

export function CourseForm({
  initialValues = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const { data: lecturers = [], isLoading: isLecturersLoading } = useLecturers();
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [duration, setDuration] = useState(initialValues.duration ?? '');
  const [fee, setFee] = useState(initialValues.fee ?? '');
  const [lecturerId, setLecturerId] = useState(
    initialValues.lecturer?._id || initialValues.lecturer?.id || initialValues.lecturer || ''
  );
  const [isPublished, setIsPublished] = useState(!!initialValues.isPublished);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);

  const getFieldError = (field) => {
    const f = fieldErrors.find((fe) => fe.field === field);
    return f ? f.message : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors([]);

    // Basic client-side validation
    if (!title || title.trim().length < 3) {
      setFieldErrors([{ field: 'title', message: 'Title is required and must be at least 3 characters' }]);
      return;
    }

    if (duration !== '' && Number(duration) < 0) {
      setFieldErrors([{ field: 'duration', message: 'Duration must be a positive number' }]);
      return;
    }

    if (fee !== '' && Number(fee) < 0) {
      setFieldErrors([{ field: 'fee', message: 'Fee must be a positive number' }]);
      return;
    }

    if (lecturerId && !String(lecturerId).trim()) {
      setFieldErrors([{ field: 'lecturer', message: 'Lecturer must be selected' }]);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      duration: duration === '' ? undefined : Number(duration),
      fee: fee === '' ? undefined : Number(fee),
      lecturer: lecturerId || undefined,
      isPublished,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      const response = err?.response?.data;
      if (response?.errors) {
        setFieldErrors(response.errors);
      } else {
        setFormError(response?.message || 'Failed to save course');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
      {formError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {formError}
        </div>
      )}

      {fieldErrors.length > 0 && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <ul className="m-0 pl-4 list-disc">
            {fieldErrors.map((fe, i) => (
              <li key={i}>{fe.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-text-strong">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course title"
          className="w-full px-3.5 py-2.5 border-2 border-border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10"
        />
        {getFieldError('title') && <p className="text-xs text-danger mt-1">{getFieldError('title')}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-text-strong">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short summary of the course"
          rows={4}
          className="w-full px-3.5 py-2.5 border-2 border-border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10"
        />
        {getFieldError('description') && <p className="text-xs text-danger mt-1">{getFieldError('description')}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-strong">Duration (hours)</label>
          <input
            type="number"
            min="0"
            step="any"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 12"
            className="w-full px-3.5 py-2.5 border-2 border-border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10"
          />
          {getFieldError('duration') && <p className="text-xs text-danger mt-1">{getFieldError('duration')}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-strong">Fee (USD)</label>
          <input
            type="number"
            min="0"
            step="any"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            placeholder="e.g. 49.99"
            className="w-full px-3.5 py-2.5 border-2 border-border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10"
          />
          {getFieldError('fee') && <p className="text-xs text-danger mt-1">{getFieldError('fee')}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-text-strong">Assigned Lecturer</label>
        <select
          value={lecturerId}
          onChange={(e) => setLecturerId(e.target.value)}
          className="w-full px-3.5 py-2.5 border-2 border-border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 bg-white"
          disabled={isLecturersLoading}
        >
          <option value="">Unassigned</option>
          {lecturers.map((lecturer) => {
            const lecturerLabel = lecturer?.user?.name || lecturer?.name || lecturer?.user?.email || lecturer?.specialization || 'Lecturer';
            const lecturerValue = lecturer?._id || lecturer?.id;
            return (
              <option key={lecturerValue} value={lecturerValue}>
                {lecturerLabel}
              </option>
            );
          })}
        </select>
        <p className="text-xs text-muted">Admin can assign or reassign a lecturer later from the course form.</p>
        {getFieldError('lecturer') && <p className="text-xs text-red-600 mt-1">{getFieldError('lecturer')}</p>}
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          <span className="text-sm">Publish immediately</span>
        </label>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel} className="h-11">
            Cancel
          </Button>
          <Button type="submit" className="h-11" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Saving...
              </span>
            ) : (
              'Save Course'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}


