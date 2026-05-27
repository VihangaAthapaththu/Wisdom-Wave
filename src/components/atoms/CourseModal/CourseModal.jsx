import React from 'react';
import { X } from 'lucide-react';
import { Card } from '@/components';
import { CourseForm } from '@/components';

export function CourseModal({ open, title = 'Add Course', initialValues = {}, onClose, onSave, isSubmitting }) {
  if (!open) return null;
  const formKey = initialValues._id || initialValues.id || 'new-course';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-none p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFA500] to-[#ff8c00] flex items-center justify-center">
              {/* decorative */}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1a] m-0">{title}</h2>
              <p className="text-xs text-[#666666] m-0">Create or edit a course</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666666] hover:bg-[#f5f5f5] hover:text-[#1a1a1a] transition-colors cursor-pointer border-none bg-transparent">
            <X size={18} />
          </button>
        </div>

        <CourseForm
          key={formKey}
          initialValues={initialValues}
          onSubmit={onSave}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}

export default CourseModal;
