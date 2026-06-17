import React from 'react';
import {
  Bell, CheckCheck, BookOpen, Clock, AlertCircle, RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/molecules';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useNotificationSocket,
} from '@/hooks';

const TYPE_META = {
  ASSIGNMENT_PUBLISHED: { label: 'New Assignment', color: 'bg-blue-100 text-blue-700', icon: BookOpen },
  DEADLINE_APPROACHING: { label: 'Deadline',        color: 'bg-red-100 text-red-700',  icon: Clock },
  ASSIGNMENT_UPDATED:   { label: 'Updated',         color: 'bg-amber-100 text-amber-700', icon: RefreshCw },
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function Notification() {
  useNotificationSocket();

  const { data, isLoading, isError } = useNotifications({ limit: 50 });
  const markOne = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const notifications = data?.notifications || [];
  const unread        = data?.unread ?? 0;

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <PageHeader title="Notifications" className="mb-0" />
          {unread > 0 && (
            <button
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer border-none"
            >
              <CheckCheck size={13} />
              Mark all read ({unread})
            </button>
          )}
        </div>

        {isLoading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-xl border border-gray-100 p-4 h-20" />
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <AlertCircle className="w-10 h-10 text-red-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Failed to load notifications.</p>
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">No notifications yet.</p>
            <p className="text-sm text-gray-400 mt-1">You'll see assignment updates and reminders here.</p>
          </div>
        )}

        {!isLoading && notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((n) => {
              const meta = TYPE_META[n.type] || { label: 'Notification', color: 'bg-gray-100 text-gray-600', icon: Bell };
              const Icon = meta.icon;

              return (
                <div
                  key={n._id}
                  className={`bg-white border rounded-xl p-4 flex items-start gap-4 transition-colors ${!n.isRead ? 'border-primary/20 bg-primary/5' : 'border-gray-100'}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
                    <Icon size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold truncate ${!n.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {n.title}
                      </p>
                      <span className="shrink-0 text-[10px] text-gray-400 whitespace-nowrap">{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
                        {meta.label}
                      </span>
                      {n.data?.courseName && (
                        <span className="text-[10px] text-gray-400">{n.data.courseName}</span>
                      )}
                    </div>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={() => markOne.mutate(n._id)}
                      disabled={markOne.isPending}
                      className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer border-none bg-transparent"
                      title="Mark as read"
                    >
                      <CheckCheck size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
