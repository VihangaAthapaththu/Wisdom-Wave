import React from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  Flame, Trophy, Calendar, TrendingUp, BookOpen,
  CheckCircle2, Clock, AlertCircle, ChevronRight, ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgressOverview, useMarkMaterialComplete, useUnmarkMaterialComplete } from '@/hooks';
import { ProgressRing } from '@/components/atoms';
import { PageHeader } from '@/components/molecules';
import { toast } from 'sonner';

// ─── Helper ──────────────────────────────────────────────────────────────────

function statusStyle(status) {
  if (status === 'COMPLETED')   return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-gray-100 text-gray-500 border-gray-200';
}

function statusLabel(status) {
  if (status === 'COMPLETED')   return 'Completed';
  if (status === 'IN_PROGRESS') return 'In Progress';
  return 'Not Started';
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SummaryCard({ label, value, color }) {
  return (
    <div className={`rounded-2xl border p-4 text-center ${color}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-0.5">{label}</p>
    </div>
  );
}

function StreakWidget({ streak }) {
  if (!streak) return null;
  const hasActivity =
    (streak.longest ?? 0) > 0 || (streak.current ?? 0) > 0 || (streak.daysActiveThisWeek ?? 0) > 0;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-1.5">
        <Flame size={15} className="text-orange-500" /> Learning Streaks
      </h3>
      {hasActivity ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center bg-orange-50 border border-orange-100 rounded-xl p-3">
            <p className="text-2xl font-bold text-orange-600">{streak.current}</p>
            <p className="text-xs text-orange-500 font-medium">Current Streak</p>
          </div>
          <div className="text-center bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-2xl font-bold text-amber-600">{streak.longest}</p>
            <p className="text-xs text-amber-500 font-medium">Longest Streak</p>
          </div>
          <div className="text-center bg-blue-50 border border-blue-100 rounded-xl p-3">
            <p className="text-2xl font-bold text-blue-600">{streak.daysActiveThisWeek}</p>
            <p className="text-xs text-blue-500 font-medium">Days This Week</p>
          </div>
          <div className="text-center bg-violet-50 border border-violet-100 rounded-xl p-3">
            <p className="text-2xl font-bold text-violet-600">{streak.consistencyScore}%</p>
            <p className="text-xs text-violet-500 font-medium">Consistency</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center py-5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-3">
            <Flame size={22} className="text-orange-400" />
          </div>
          <p className="text-sm font-bold text-gray-800">Start your learning streak!</p>
          <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
            Complete a lesson to earn your first active day and start building a streak.
          </p>
        </div>
      )}
    </div>
  );
}

function WeeklyChart({ data }) {
  if (!data?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-1.5">
        <Calendar size={15} className="text-blue-500" /> This Week's Activity
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            formatter={(v) => [`${v} completions`, 'Activity']}
          />
          <Bar dataKey="completions" fill="#FFA500" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function InsightsPanel({ insights }) {
  if (!insights) return null;
  const items = [
    insights.mostStudiedCourse && {
      icon: Trophy, color: 'text-amber-500 bg-amber-50',
      label: 'Most Studied', value: insights.mostStudiedCourse.title,
    },
    insights.closestToCompletion && {
      icon: TrendingUp, color: 'text-green-500 bg-green-50',
      label: 'Closest to Completion',
      value: `${insights.closestToCompletion.title} (${insights.closestToCompletion.progressPercentage}%)`,
    },
    insights.mostActiveDayOfWeek && {
      icon: Calendar, color: 'text-blue-500 bg-blue-50',
      label: 'Most Productive Day', value: insights.mostActiveDayOfWeek,
    },
    insights.coursesRequiringAttention?.length && {
      icon: AlertCircle, color: 'text-red-500 bg-red-50',
      label: 'Needs Attention', value: insights.coursesRequiringAttention.map(c => c.title).join(', '),
    },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-700 mb-4">Learning Insights</h3>
      <div className="space-y-3">
        {items.map(({ icon: Icon, color, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={14} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-sm font-semibold text-gray-700 leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseProgressCard({ course }) {
  const mark = useMarkMaterialComplete();
  const unmark = useUnmarkMaterialComplete();

  const handleToggle = (materialId, completed) => {
    const fn = completed ? unmark : mark;
    fn.mutate(
      { courseId: course.courseId, materialId },
      { onError: () => toast.error('Failed to update progress.') }
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 truncate">{course.title}</h3>
          {course.lecturerName && (
            <p className="text-xs text-gray-400 mt-0.5">{course.lecturerName}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle(course.status)}`}>
          {statusLabel(course.status)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span className="font-semibold text-gray-700">{course.progressPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${course.progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex gap-4 text-xs text-gray-500 mb-4">
        <span><span className="font-semibold text-gray-700">{course.completedMaterials}</span>/{course.totalMaterials} materials</span>
        <span><span className="font-semibold text-gray-700">{course.completedAssignments}</span>/{course.totalAssignments} assignments</span>
        {course.estimatedHoursSpent > 0 && (
          <span><Clock size={11} className="inline mr-0.5" />{course.estimatedHoursSpent}h</span>
        )}
      </div>

      {/* Materials list */}
      {course.materials?.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Materials</p>
          {course.materials.map((m) => (
            <button
              key={m.materialId}
              onClick={() => handleToggle(m.materialId, m.completed)}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left cursor-pointer border-none bg-transparent"
            >
              <CheckCircle2
                size={15}
                className={m.completed ? 'text-emerald-500 shrink-0' : 'text-gray-200 shrink-0'}
              />
              <span className={`text-xs flex-1 truncate ${m.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {m.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function ProgressDashboard() {
  const { data: progress, isLoading, isError } = useProgressOverview();

  if (isLoading) {
    return (
      <div className="bg-gray-50/60 min-h-screen p-6 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          {[1, 2, 3].map(n => <div key={n} className="h-40 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (isError || !progress) {
    return (
      <div className="bg-gray-50/60 min-h-screen p-6 lg:p-10 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Failed to load progress data.</p>
        </div>
      </div>
    );
  }

  const { summary, courses, streak, insights } = progress;
  const weeklyData = insights?.weeklyActivityData || [];

  return (
    <div className="bg-gray-50/60 min-h-screen flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/student-dashboard" className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <ArrowLeft size={18} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learning Analytics</h1>
            <p className="text-sm text-gray-500 mt-0.5">Full breakdown of your learning progress</p>
          </div>
        </div>

        {/* Overall summary */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ProgressRing value={summary.overallProgress} size={120} strokeWidth={12} label="Overall" />
            <div className="flex-1 w-full">
              <h2 className="text-base font-bold text-gray-900 mb-3">Progress Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SummaryCard label="Enrolled" value={summary.totalEnrolled} color="bg-gray-50 text-gray-700 border-gray-200" />
                <SummaryCard label="Completed" value={summary.completed} color="bg-emerald-50 text-emerald-700 border-emerald-100" />
                <SummaryCard label="In Progress" value={summary.inProgress} color="bg-blue-50 text-blue-700 border-blue-100" />
                <SummaryCard label="Not Started" value={summary.notStarted} color="bg-gray-50 text-gray-500 border-gray-100" />
              </div>
              {summary.estimatedHoursSpent > 0 && (
                <p className="text-xs text-gray-400 mt-3">
                  <Clock size={11} className="inline mr-1" />
                  Estimated {summary.estimatedHoursSpent}h spent of {summary.totalEstimatedHours}h total course content
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Streak + Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <StreakWidget streak={streak} />
          <WeeklyChart data={weeklyData} />
        </div>

        {/* Insights */}
        {insights && <div className="mb-6"><InsightsPanel insights={insights} /></div>}

        {/* Per-course cards */}
        {courses?.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-primary" /> Course Breakdown
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {courses.map((course) => (
                <CourseProgressCard key={course.courseId} course={course} />
              ))}
            </div>
          </div>
        )}

        {!courses?.length && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">No enrolled courses yet.</p>
            <Link to="/courses" className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary font-semibold hover:gap-2.5 transition-all">
              Browse Courses <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>

      <footer className="bg-black text-center py-5 text-gray-500 text-xs mt-auto">
        <p>&copy; 2026 Wisdom Wave. Keep Learning!</p>
      </footer>
    </div>
  );
}
