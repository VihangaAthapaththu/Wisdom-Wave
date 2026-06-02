import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Loader2, BookOpen } from 'lucide-react';
import { useAuth } from '@/context';
import { paymentService } from '@/lib/api';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const sessionId = searchParams.get('session_id');

  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();
  const [status, setStatus] = useState('verifying'); // verifying | paid | failed | error

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setStatus('error'); return; }
    if (!paymentId || !sessionId) { setStatus('error'); return; }

    paymentService
      .verifySession(paymentId, sessionId)
      .then((res) => {
        if (res?.confirmed) {
          setStatus('paid');
          qc.invalidateQueries({ queryKey: ['student', 'me'] });
          qc.invalidateQueries({ queryKey: ['enrollments', 'me'] });
          qc.invalidateQueries({ queryKey: ['payments', 'mine'] });
        } else {
          setStatus('pending');
        }
      })
      .catch(() => setStatus('error'));
  }, [user, authLoading, paymentId, sessionId, qc]);

  if (authLoading || status === 'verifying') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-gray-500 text-sm font-medium">Confirming your payment…</p>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-4">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Payment successful!</h1>
        <p className="text-gray-500 max-w-sm">
          Your payment was confirmed and you are now enrolled in the course.
        </p>
        <div className="flex gap-3 mt-2">
          <Link
            to="/student-dashboard"
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/courses"
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-4">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
          <Loader2 size={40} className="text-amber-500 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Payment processing</h1>
        <p className="text-gray-500 max-w-sm">
          Stripe is still processing your payment. This usually takes a few seconds — refresh this page or check your dashboard shortly.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Refresh
          </button>
          <Link
            to="/student-dashboard"
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // failed or error
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-4">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
        <XCircle size={40} className="text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="text-gray-500 max-w-sm">
        We could not confirm your payment. If you were charged, please contact support with your payment details.
      </p>
      <div className="flex gap-3 mt-2">
        <Link
          to="/courses"
          className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          <BookOpen size={15} className="inline mr-1.5" />
          Browse Courses
        </Link>
      </div>
    </div>
  );
}

export default null;
