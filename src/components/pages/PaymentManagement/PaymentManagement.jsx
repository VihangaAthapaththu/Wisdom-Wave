import { useState } from 'react';
import {
  CreditCard, Search, RefreshCw, CheckCircle, XCircle,
  Clock, Wallet, TrendingUp, Filter,
} from 'lucide-react';
import {
  Button,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  PageHeader, PageLoader,
} from '@/components';
import { useAllPayments } from '@/hooks';
import { formatLKR } from '@/lib/currency';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  PAID:    { label: 'Paid',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  PENDING: { label: 'Pending', cls: 'bg-amber-50  text-amber-700  border-amber-200'  },
  FAILED:  { label: 'Failed',  cls: 'bg-red-50    text-red-600    border-red-200'    },
};

const METHOD_LABEL = {
  CARD: 'Card',
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank Transfer',
  MOBILE_MONEY: 'Mobile Money',
  STRIPE: 'Stripe',
};

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, cls: 'bg-gray-50 text-gray-500 border-gray-200' };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
      {status === 'PAID' && <CheckCircle size={11} />}
      {status === 'PENDING' && <Clock size={11} />}
      {status === 'FAILED' && <XCircle size={11} />}
      {cfg.label}
    </span>
  );
}

export function PaymentManagement() {
  const { data: payments = [], isLoading, refetch, isFetching } = useAllPayments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = payments.filter((p) => {
    const name = p.student?.user?.name?.toLowerCase() || '';
    const email = p.student?.user?.email?.toLowerCase() || '';
    const course = p.course?.title?.toLowerCase() || '';
    const q = search.toLowerCase();
    const matchesSearch = !q || name.includes(q) || email.includes(q) || course.includes(q);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status === 'PAID').length,
    pending: payments.filter((p) => p.status === 'PENDING').length,
    revenue: payments
      .filter((p) => p.status === 'PAID')
      .reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Payment Management" />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Wallet, label: 'Total Payments', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: CheckCircle, label: 'Successful', value: stats.paid, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: Clock, label: 'Pending', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: TrendingUp, label: 'Total Revenue', value: formatLKR(stats.revenue), color: 'text-primary', bg: 'bg-primary/5' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, email or course..."
            className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          {['ALL', 'PAID', 'PENDING', 'FAILED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-primary/50'
              }`}
            >
              {s === 'ALL' ? 'All' : STATUS_CONFIG[s]?.label || s}
            </button>
          ))}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="w-9 h-9 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary/50 hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <PageLoader text="Loading payments..." size={280} fullScreen={true} />
      ) : (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-bg-surface border-b-2 border-primary">
              <TableRow>
                <TableHead className="font-bold text-text-strong p-4">Student</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Course</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Amount</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Method</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Status</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <CreditCard size={40} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400 font-medium">
                      {search || statusFilter !== 'ALL' ? 'No payments match your filters.' : 'No payments recorded yet.'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p._id} className="hover:bg-bg-surface border-b border-border">
                    <TableCell className="p-4">
                      <p className="font-semibold text-gray-900 text-sm">{p.student?.user?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{p.student?.user?.email || ''}</p>
                    </TableCell>
                    <TableCell className="p-4 text-sm text-gray-600">
                      {p.course?.title || '—'}
                    </TableCell>
                    <TableCell className="p-4">
                      <span className="font-bold text-gray-900 text-sm">{formatLKR(p.amount)}</span>
                    </TableCell>
                    <TableCell className="p-4 text-sm text-gray-500">
                      {METHOD_LABEL[p.method] || p.method || '—'}
                    </TableCell>
                    <TableCell className="p-4">
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell className="p-4 text-sm text-gray-400">
                      {fmtDate(p.date || p.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
