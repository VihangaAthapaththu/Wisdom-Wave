import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { notificationService } from "@/lib";
import { useAuth } from "@/context";
import socket from "@/lib/socket";

export function useNotifications({ page = 1, limit = 20 } = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const resp = await notificationService.getNotifications({ page, limit });
      return resp?.data || resp;
    },
    enabled: !!user,
    staleTime: 30_000,
  });
}

export function useUnreadCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const resp = await notificationService.getUnreadCount();
      return resp?.data?.count ?? 0;
    },
    enabled: !!user,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationService.markOneRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Connects socket and listens for real-time notifications; auto-invalidates queries
export function useNotificationSocket() {
  const { user } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const handler = () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    };

    socket.on("notification:new", handler);

    return () => {
      socket.off("notification:new", handler);
    };
  }, [user, qc]);
}
