import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '@/lib/api/authService';
import { validateForm } from '@/lib/validation/validateForm';
import { forgotPasswordSchema } from '@/lib/validation/schemas';
import { toastApiError } from '@/lib/api/errorUtils';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { success, errors } = validateForm(forgotPasswordSchema, { email });
    if (!success) {
      setFieldError(errors.email || 'Enter a valid email address.');
      return;
    }
    setFieldError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toastApiError(err, 'Could not send the reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-paper flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
          <Mail size={22} className="text-primary" />
        </div>

        {sent ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <CheckCircle2 size={22} className="text-emerald-500" /> Check your email
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              If an account exists for <strong className="text-gray-700">{email}</strong>, we've sent a
              link to reset your password. The link expires in 30 minutes.
            </p>
            <Link
              to="/signin"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft size={15} /> Back to sign in
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Enter the email linked to your account and we'll send you a link to reset your password.
            </p>

            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fp-email" className="text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (fieldError) setFieldError(''); }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  aria-invalid={!!fieldError}
                  className="w-full px-4 py-3 rounded-xl border-[1.5px] border-border bg-bg-paper text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white"
                />
                {fieldError && <p className="text-xs text-danger mt-1">{fieldError}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-700 text-white font-bold text-[15px] transition-all shadow-[0_4px_16px_rgba(255,165,0,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <Link
              to="/signin"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft size={15} /> Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
