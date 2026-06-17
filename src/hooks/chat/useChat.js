import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { chatService } from "@/lib";
import { useAuth } from "@/context";
import socket from "@/lib/socket";

export function useContacts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["chat", "contacts"],
    queryFn: async () => {
      const resp = await chatService.getContacts();
      return resp?.data?.contacts ?? [];
    },
    enabled: !!user && (user.role === "STUDENT" || user.role === "LECTURER"),
    staleTime: 60_000,
  });
}

export function useConversations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: async () => {
      const resp = await chatService.getConversations();
      return resp?.data?.conversations ?? [];
    },
    enabled: !!user && (user.role === "STUDENT" || user.role === "LECTURER"),
    staleTime: 15_000,
  });
}

export function useStartConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => chatService.startConversation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chat", "conversations"] }),
  });
}

export function useMessages(conversationId, page = 1) {
  return useQuery({
    queryKey: ["chat", "messages", conversationId, page],
    queryFn: async () => {
      const resp = await chatService.getMessages(conversationId, page);
      return resp?.data ?? { messages: [], total: 0, totalPages: 1 };
    },
    enabled: !!conversationId,
    staleTime: 5_000,
  });
}

export function useSendMessage(conversationId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content) => chatService.sendMessage(conversationId, content),
    onSuccess: (resp) => {
      const newMsg = resp?.data?.message;
      if (newMsg) {
        // Write directly into the cache so the sender sees their message instantly
        // without waiting for a refetch. The socket event will dedup on arrival.
        qc.setQueryData(["chat", "messages", conversationId, 1], (old) => {
          if (!old) return { messages: [newMsg], total: 1, totalPages: 1 };
          if (old.messages?.some((m) => String(m._id) === String(newMsg._id))) return old;
          return { ...old, messages: [...old.messages, newMsg], total: (old.total || 0) + 1 };
        });
      }
      qc.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
  });
}

export function useMarkRead(conversationId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => chatService.markRead(conversationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chat", "messages", conversationId] }),
  });
}

// Joins a conversation room, writes incoming messages directly into the React
// Query cache (instant update — no refetch round-trip), and re-joins the room
// after any socket reconnection so messages are never missed.
export function useChatSocket(conversationId, onNewMessage) {
  const { user } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user || !conversationId) return;

    const joinRoom = () => socket.emit("chat:join", conversationId);
    joinRoom();

    const handleMessage = (data) => {
      // Write directly into cache — deduplicate by _id so the sender never sees
      // a double entry (they already wrote it via useSendMessage.onSuccess).
      qc.setQueryData(["chat", "messages", conversationId, 1], (old) => {
        if (!old) return { messages: [data], total: 1, totalPages: 1 };
        if (old.messages?.some((m) => String(m._id) === String(data._id))) return old;
        return { ...old, messages: [...old.messages, data], total: (old.total || 0) + 1 };
      });
      // Keep the conversation list (last message preview) fresh.
      qc.invalidateQueries({ queryKey: ["chat", "conversations"] });
      if (onNewMessage) onNewMessage(data);
    };

    const handleRead = (data) => {
      if (String(data.conversationId) === String(conversationId)) {
        qc.invalidateQueries({ queryKey: ["chat", "messages", conversationId] });
      }
    };

    // Re-join the conversation room after any socket reconnection so we never
    // lose our room membership silently.
    socket.io.on("reconnect", joinRoom);
    socket.on("message:new", handleMessage);
    socket.on("message:read", handleRead);

    return () => {
      socket.io.off("reconnect", joinRoom);
      socket.off("message:new", handleMessage);
      socket.off("message:read", handleRead);
    };
  }, [user, conversationId, qc, onNewMessage]);
}

// Tracks online presence
export function usePresence() {
  const { user } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const handler = ({ userId, online }) => {
      qc.setQueryData(["presence", userId], online);
    };

    socket.on("presence:update", handler);
    return () => socket.off("presence:update", handler);
  }, [user, qc]);

  return useCallback((userId) => {
    return qc.getQueryData(["presence", userId]) ?? false;
  }, [qc]);
}
