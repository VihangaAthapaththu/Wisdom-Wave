import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button, Card } from '@/components';

export function ConfirmationModal({
  open,
  title = 'Confirm action',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isConfirming = false,
  tone = 'destructive',
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-none p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#f0f0f0]">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tone === 'destructive' ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'}`}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-strong m-0">{title}</h2>
              {description && <p className="text-sm text-muted mt-1 mb-0 leading-relaxed">{description}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-bg-surface hover:text-text-strong transition-colors cursor-pointer border-none bg-transparent"
            aria-label="Close confirmation dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-11"
            disabled={isConfirming}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={tone === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            className="h-11"
            disabled={isConfirming}
          >
            {isConfirming ? 'Working...' : confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}