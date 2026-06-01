import React, { useState } from 'react';
import { UserPlus, GraduationCap, X, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { PageHeader } from '@/components/molecules';
import { useLecturers, useRegisterLecturer, useDeactivateLecturer } from '@/hooks/lecturers/useLecturers';
import { ConfirmationModal } from '@/components';

export function LecturerManagement() {
  const { data: lecturers = [], isLoading } = useLecturers();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
  });
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const registerLecturer = useRegisterLecturer();
  const deactivateLecturer = useDeactivateLecturer();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
    if (fieldErrors.length) setFieldErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors([]);
    setIsSubmitting(true);

    try {
      await registerLecturer.mutateAsync(formData);
      toast.success('Lecturer registered successfully!');
      setFormData({ name: '', email: '', password: '', specialization: '' });
      setShowModal(false);
    } catch (err) {
      const response = err.response?.data;
      if (response?.errors) {
        setFieldErrors(response.errors);
      } else {
        setFormError(response?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      setIsDeactivating(true);
      await deactivateLecturer.mutateAsync(deactivateTarget);
      toast.success('Lecturer deactivated.');
      setDeactivateTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to deactivate lecturer.');
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader
        title="Lecturer Management"
        buttonText="Register Lecturer"
        onButtonClick={() => setShowModal(true)}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-bg-surface border-b-2 border-primary">
              <TableRow>
                <TableHead className="font-bold text-text-strong p-4">Name</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Email</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Specialization</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Status</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Joined</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lecturers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted py-12">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 text-border" />
                    <p className="text-base font-medium">No lecturers registered yet</p>
                    <p className="text-sm mt-1">Click "Register Lecturer" to add your first lecturer.</p>
                  </TableCell>
                </TableRow>
              ) : (
                lecturers.map((lecturer) => (
                  <TableRow key={lecturer._id} className="hover:bg-bg-surface border-b border-border">
                    <TableCell className="text-text-strong p-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {lecturer.user?.name?.charAt(0)?.toUpperCase() || 'L'}
                        </div>
                        {lecturer.user?.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted p-4">{lecturer.user?.email}</TableCell>
                    <TableCell className="text-muted p-4">{lecturer.specialization || '—'}</TableCell>
                    <TableCell className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        lecturer.user?.isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${lecturer.user?.isActive ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        {lecturer.user?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted p-4 text-sm">
                      {lecturer.user?.createdAt ? new Date(lecturer.user.createdAt).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="p-4">
                      {lecturer.user?.isActive && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeactivateTarget(lecturer._id)}
                          className="text-xs"
                        >
                          Deactivate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-none p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                  <UserPlus size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-strong m-0">Register Lecturer</h2>
                  <p className="text-xs text-muted m-0">Create a new lecturer account</p>
                </div>
              </div>
              <button
                onClick={() => { setShowModal(false); setFormError(''); setFieldErrors([]); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-bg-surface hover:text-text-strong transition-colors cursor-pointer border-none bg-transparent"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {/* Error Messages */}
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  {formError}
                </div>
              )}
              {fieldErrors.length > 0 && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <ul className="m-0 pl-4">
                    {fieldErrors.map((fe, i) => (
                      <li key={i}>{fe.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="lecturer-name" className="text-sm font-semibold text-text-strong">Full Name</label>
                <input
                  type="text"
                  id="lecturer-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full px-3.5 py-2.5 border-2 border-border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-[#999]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="lecturer-email" className="text-sm font-semibold text-text-strong">Email Address</label>
                <input
                  type="email"
                  id="lecturer-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="lecturer@wisdomwave.com"
                  className="w-full px-3.5 py-2.5 border-2 border-border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-[#999]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="lecturer-password" className="text-sm font-semibold text-text-strong">Password</label>
                <input
                  type="password"
                  id="lecturer-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars, 1 uppercase, 1 number"
                  className="w-full px-3.5 py-2.5 border-2 border-border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-[#999]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="lecturer-specialization" className="text-sm font-semibold text-text-strong">Specialization <span className="text-[#999] font-normal">(optional)</span></label>
                <input
                  type="text"
                  id="lecturer-specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Web Development, Data Science"
                  className="w-full px-3.5 py-2.5 border-2 border-border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-[#999]"
                  disabled={isSubmitting}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowModal(false); setFormError(''); setFieldErrors([]); }}
                  className="flex-1 border-2 border-border text-muted hover:bg-bg-surface h-11"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary text-white shadow-[0_4px_12px_rgba(255,165,0,0.3)] hover:shadow-[0_6px_16px_rgba(255,165,0,0.4)] h-11 font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Registering...
                    </span>
                  ) : (
                    'Register Lecturer'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <ConfirmationModal
        open={!!deactivateTarget}
        title="Deactivate lecturer?"
        description="This will mark the lecturer account as inactive. They will no longer be able to access lecturer features until reactivated."
        confirmText="Deactivate"
        cancelText="Keep active"
        onCancel={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        isConfirming={isDeactivating}
      />
    </div>
  );
}
