import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronDown, ChevronUp,
  Flame, Trophy, Calendar, Target,
  BookOpen, Clock, TrendingUp, AlertCircle,
  CheckCircle2, Circle, ClipboardList, Zap,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { ProgressRing } from '@/components/atoms';
import { InsightCard } from '@/components/molecules';
import { useProgressOverview } from '@/hooks';
import { PageLoader } from '@/components/atoms';

// ─── Streak Calendar (mini 7-day view) ───────────────────────────────────────

function StreakWeek({ weeklyData }) {
  return (
    <div className="flex items-end gap-1.5 h-14">
      {(weeklyData || []).map(({ day, completions }) => (
        <div key={day} className="flex flex-col items-center gap-1 flex-1">
          <div
            className={`w-full rounded-md transition-all ${
              completions > 0 ? 'bg-primary' : 'bg-gray-100'
            }`}
            style={{ height: completions > 0 ? `${Math.min(100, 30 + completions * 14)}%` : '20%' }}
          />
          <span className="text-[10px] text-gray-400 font-medium">{day.slice(0, 1)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Course Progress Card (expandable) ───────────────────────────────────────

function CourseProgressCard({ cp }) {
  const [expanded, setExpanded] = useState(false);

  const statusStyles = {
    COMPLETED:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
    NOT_STARTED: 'bg-gray-50 text-gray-500 border-gray-200',
  };
  const statusLabels = {
    COMPLETED: 'Completed', IN_PROGRESS: 'In Progress', NOT_STARTED: 'Not Started',
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors cursor-pointer border-none bg-transparent"
      >
        <div className="shrink-0">
          <ProgressRing value={cp.progressPercentage} size={56} strokeWidth={6} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">{cp.title}</h3>
          {cp.lecturerName && (
            <p className="text-xs text-gray-400 mt-0.5">{cp.lecturerName}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[cp.status] || statusStyles.NOT_STARTED}`}>
              {statusLabels[cp.status] || 'Not Started'}
            </span>
            <span className="text-xs text-gray-400">{cp.completedMaterials}/{cp.totalMaterials} lessons</span>
            {cp.estimatedHoursRemaining > 0 && (
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <Clock size={10} /> {cp.estimatedHoursRemaining}h left
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-gray-300">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expandable detail */}
      {expanded && (
        <div className="border-t border-gray-50 px-5 pb-5 pt-4">
          {/* Materials */}
          {cp.materials && cp.materials.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Lessons ({cp.completedMaterials}/{cp.totalMaterials})
              </h4>
              <div className="space-y-1.5">
                {cp.materials.map((m) => (
                  <div key={m.materialId} className="flex items-center gap-2">
                    {m.completed
                      ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      : <Circle size={14} className="text-gray-200 shrink-0" />
                    }
                    <span className={`text-xs leading-snug ${m.completed ? 'text-gray-600 line-through decoration-gray-300' : 'text-gray-700'}`}>
                      {m.title}
                    </span>
                    {m.completed && m.completedAt && (
                      <span className="text-[10px] text-gray-300 ml-auto shrink-0">
                        {new Date(m.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments */}
          {cp.assignments && cp.assignments.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Assignments ({cp.completedAssignments}/{cp.totalAssignments})
              </h4>
              <div className="space-y-1.5">
                {cp.assignments.map((a) => (
                  <div key={a.assignmentId} className="flex items-center gap-2">
                    {a.submitted
                      ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      : <Circle size={14} className="text-gray-200 shrink-0" />
                    }
                    <span className={`text-xs leading-snug ${a.submitted ? 'text-gray-600' : 'text-gray-700'}`}>
                      {a.title}
                    </span>
                    {a.submitted && a.marks != null && (
                      <span className="ml-auto text-[10px] font-semibold text-emerald-600 shrink-0">{a.marks} marks</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Go to course link */}
          <Link
            to={`/courses/${cp.courseId}`}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <BookOpen size={12} /> Open Course
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-gray-700">{label}</p>
      <p className="text-primary font-semibold">{payload[0].value} completion{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function StudentProgress() {
  const { data: progress, isLoading } = useProgressOverview();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader size={280} />
      </div>
    );
  }

  const summary  = progress?.summary  || {};
  const courses  = progress?.courses  || [];
  const streak   = progress?.streak   || {};
  const insights = progress?.insights || {};

  const weeklyData = insights.weeklyActivityData || [];
  const maxCompletions = Math.max(...weeklyData.map((d) => d.completions), 1);

  const noProgress = !courses.length;

  return (
    <div className="bg-gray-50/60 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Back link */}
        <Link
          to="/student-dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Dashboard
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your progress, streaks, and insights across all your courses.</p>
        </div>

        {noProgress ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-gray-200" />
            </div>
            <p className="text-gray-600 font-semibold mb-1">No progress data yet</p>
            <p className="text-sm text-gray-400 mb-4">Enroll in courses and mark materials complete to see your analytics here.</p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-600 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <>
            {/* ── Section 1: Overall Summary ── */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                <ProgressRing
                  value={summary.overallProgress ?? 0}
                  size={130}
                  strokeWidth={12}
                  label="Overall Progress"
                />
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Enrolled', value: summary.totalEnrolled ?? 0, color: 'text-gray-800' },
                    { label: 'Completed', value: summary.completed ?? 0, color: 'text-emerald-700' },
                    { label: 'In Progress', value: summary.inProgress ?? 0, color: 'text-blue-700' },
                    { label: 'Not Started', value: summary.notStarted ?? 0, color: 'text-gray-500' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center">
                      <p className={`text-2xl font-bold ${color}`}>{value}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {summary.estimatedHoursSpent > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} className="text-primary" />
                  <span>
                    Estimated <strong className="text-gray-800">{summary.estimatedHoursSpent}h</strong> of learning time
                    out of <strong className="text-gray-800">{summary.totalEstimatedHours}h</strong> total
                    <span className="text-xs text-gray-300 ml-1">(approximated from course duration)</span>
                  </span>
                </div>
              )}
            </div>

            {/* ── Section 2: Streak + Weekly Activity ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {/* Streak */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" /> Learning Streak
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-100">
                    <p className="text-2xl font-bold text-orange-600">{streak.current ?? 0}</p>
                    <p className="text-xs text-orange-500 font-medium mt-0.5">Current Streak</p>
                    <p className="text-[10px] text-orange-300">days</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                    <p className="text-2xl font-bold text-amber-600">{streak.longest ?? 0}</p>
                    <p className="text-xs text-amber-500 font-medium mt-0.5">Best Streak</p>
                    <p className="text-[10px] text-amber-300">days</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600">{streak.daysActiveThisWeek ?? 0}</p>
                    <p className="text-xs text-blue-500 font-medium mt-0.5">This Week</p>
                    <p className="text-[10px] text-blue-300">active days</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
                    <p className="text-2xl font-bold text-purple-600">{streak.consistencyScore ?? 0}%</p>
                    <p className="text-xs text-purple-500 font-medium mt-0.5">This Month</p>
                    <p className="text-[10px] text-purple-300">consistency</p>
                  </div>
                </div>
                {/* Mini 7-day bar */}
                {weeklyData.length > 0 && <StreakWeek weeklyData={weeklyData} />}
              </div>

              {/* Weekly Activity Chart */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" /> This Week's Activity
                </h2>
                {weeklyData.every((d) => d.completions === 0) ? (
                  <div className="h-40 flex items-center justify-center text-gray-300 text-sm">
                    No completions this week yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={weeklyData} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,165,0,0.06)' }} />
                      <Bar dataKey="completions" radius={[6, 6, 0, 0]}>
                        {weeklyData.map((entry) => (
                          <Cell
                            key={entry.day}
                            fill={entry.completions === maxCompletions && entry.completions > 0 ? '#FFA500' : '#FFD580'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* ── Section 3: Insights ── */}
            <div className="mb-6">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap size={16} className="text-primary" /> Learning Insights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InsightCard
                  icon={Trophy}
                  title="Most Studied Course"
                  subtitle={insights.mostStudiedCourse?.title}
                  empty={!insights.mostStudiedCourse}
                  accentColor="amber"
                />
                <InsightCard
                  icon={Target}
                  title="Closest to Completion"
                  subtitle={
                    insights.closestToCompletion
                      ? `${insights.closestToCompletion.title} — ${insights.closestToCompletion.progressPercentage}%`
                      : null
                  }
                  empty={!insights.closestToCompletion}
                  accentColor="emerald"
                />
                <InsightCard
                  icon={Calendar}
                  title="Most Active Day"
                  subtitle={insights.mostActiveDayOfWeek}
                  empty={!insights.mostActiveDayOfWeek}
                  accentColor="blue"
                />
                <InsightCard
                  icon={AlertCircle}
                  title="Needs Attention"
                  subtitle={
                    insights.coursesRequiringAttention?.length
                      ? `${insights.coursesRequiringAttention.length} course${insights.coursesRequiringAttention.length > 1 ? 's' : ''} not opened in 7+ days`
                      : 'All courses are on track'
                  }
                  empty={false}
                  accentColor={insights.coursesRequiringAttention?.length ? 'rose' : 'emerald'}
                />
              </div>
            </div>

            {/* ── Section 4: Course-by-Course ── */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ClipboardList size={16} className="text-primary" /> Course Breakdown
              </h2>
              <div className="space-y-3">
                {courses
                  .slice()
                  .sort((a, b) => b.progressPercentage - a.progressPercentage)
                  .map((cp) => (
                    <CourseProgressCard key={cp.courseId} cp={cp} />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
