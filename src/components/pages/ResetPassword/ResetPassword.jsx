import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/lib/api/authService';
import { validateForm } from '@/lib/validation/validateForm';
import { resetPasswordSchema } from '@/lib/validation/schemas';
import { getApiError } from '@/lib/api/errorUtils';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: undefined }));
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { success, errors } = validateForm(resetPasswordSchema, form);
    if (!success) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await authService.resetPassword({ token, ...form });
      toast.success(res?.message || 'Password reset successfully. Please sign in.');
      navigate('/signin');
    } catch (err) {
      const { status, message } = getApiError(err, 'Could not reset your password.');
      setError(status ? `${message} (Error ${status})` : message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 rounded-xl border-[1.5px] border-border bg-bg-paper text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white';

  return (
    <div className="min-h-screen bg-bg-paper flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
          <Lock size={22} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set a new password</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Choose a new password for your account.
        </p>

        {!token && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            This reset link is invalid or missing its token. Please request a new one.
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rp-pw" className="text-sm font-semibold text-gray-700">New Password</label>
            <div className="relative">
              <input
                id="rp-pw"
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={onChange}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                autoComplete="new-password"
                disabled={loading || !token}
                aria-invalid={!!fieldErrors.password}
                className={`${inputCls} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                disabled={loading}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-xs text-danger mt-1">{fieldErrors.password}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="rp-cpw" className="text-sm font-semibold text-gray-700">Confirm Password</label>
            <input
              id="rp-cpw"
              name="confirmPassword"
              type={showPw ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              disabled={loading || !token}
              aria-invalid={!!fieldErrors.confirmPassword}
              className={inputCls}
            />
            {fieldErrors.confirmPassword && <p className="text-xs text-danger mt-1">{fieldErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-700 text-white font-bold text-[15px] transition-all shadow-[0_4px_16px_rgba(255,165,0,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <Link
          to="/signin"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={15} /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
