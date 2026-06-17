import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  MessageSquare, Send, Search, ArrowLeft, Loader2,
  X, Maximize2, BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useConversations,
  useContacts,
  useStartConversation,
  useMessages,
  useSendMessage,
  useMarkRead,
  useChatSocket,
  usePresence,
} from '@/hooks';
import { useAuth } from '@/context';
import socket from '@/lib/socket';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeStr(date) {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function Avatar({ name, online, size = 9 }) {
  return (
    <div className="relative shrink-0">
      <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center text-white font-bold text-sm`}>
        {name?.charAt(0)?.toUpperCase() || '?'}
      </div>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
}

// ─── Conversation List ─────────────────────────────────────────────────────────

function WidgetConvList({ role, onSelectConv, onNewChat }) {
  const [search, setSearch] = useState('');
  const { data: convList = [], isLoading } = useConversations();
  const isOnline = usePresence();

  const filtered = convList.filter(c => {
    const other = role === 'STUDENT' ? c.lecturer?.user : c.student?.user;
    return (other?.name || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Search + new */}
      <div className="px-3 py-2 border-b border-gray-100 flex gap-2">
        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2 py-1.5 flex-1">
          <Search size={12} className="text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="bg-transparent text-xs outline-none text-gray-700 placeholder:text-gray-400 w-full"
          />
        </div>
        <button
          onClick={onNewChat}
          className="text-xs font-semibold text-white bg-gradient-to-br from-primary to-amber-400 px-2.5 py-1.5 rounded-lg border-none cursor-pointer shrink-0"
        >
          + New
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {isLoading ? (
          <div className="pt-8 flex justify-center">
            <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="pt-8 text-center">
            <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-xs text-gray-400">
              {convList.length === 0 ? 'No conversations yet.' : 'No results.'}
            </p>
            {convList.length === 0 && (
              <button
                onClick={onNewChat}
                className="mt-2 text-xs text-primary font-semibold cursor-pointer bg-transparent border-none"
              >
                Start one →
              </button>
            )}
          </div>
        ) : filtered.map(conv => {
          const other = role === 'STUDENT' ? conv.lecturer?.user : conv.student?.user;
          const otherId = other?._id;
          const lastMsg = conv.lastMessage;
          return (
            <button
              key={conv._id}
              onClick={() => onSelectConv(conv)}
              className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
            >
              <Avatar name={other?.name} online={isOnline(otherId)} size={8} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-gray-900 truncate">{other?.name || '—'}</p>
                  {lastMsg && <span className="text-[10px] text-gray-400 shrink-0">{timeStr(lastMsg.createdAt)}</span>}
                </div>
                <p className="text-[11px] text-gray-400 truncate">{conv.course?.title || ''}</p>
                {lastMsg && <p className="text-[11px] text-gray-500 truncate">{lastMsg.content}</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Contact Picker (for new conversation) ────────────────────────────────────

function WidgetContactPicker({ role, onPick, onBack }) {
  const [search, setSearch] = useState('');
  const [pickingCourse, setPickingCourse] = useState(null);
  const { data: contacts = [], isLoading } = useContacts();

  const filtered = contacts.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (pickingCourse) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
          <button onClick={() => setPickingCourse(null)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer border-none bg-transparent">
            <ArrowLeft size={14} />
          </button>
          <p className="text-xs font-semibold text-gray-700 truncate">Select a course</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {pickingCourse.courses.map((c, i) => (
            <button
              key={i}
              onClick={() => onPick(pickingCourse.contact, c)}
              className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-gray-50 transition-colors text-xs text-gray-700 cursor-pointer border-none bg-transparent"
            >
              <BookOpen size={12} className="text-primary shrink-0" />
              {c.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
        <button onClick={onBack} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer border-none bg-transparent">
          <ArrowLeft size={14} />
        </button>
        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2 py-1 flex-1">
          <Search size={12} className="text-gray-400 shrink-0" />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts…"
            className="bg-transparent text-xs outline-none text-gray-700 placeholder:text-gray-400 w-full"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {isLoading ? (
          <div className="pt-8 flex justify-center"><Loader2 className="w-4 h-4 text-gray-300 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-gray-400 text-center pt-8">
            {contacts.length === 0
              ? role === 'STUDENT' ? 'Enrol in a course first.' : 'No enrolled students yet.'
              : 'No contacts match.'}
          </p>
        ) : filtered.map((c, i) => {
          const courses = c.courses || [];
          return (
            <button
              key={i}
              onClick={() => {
                if (courses.length === 1) onPick(c, courses[0]);
                else if (courses.length > 1) setPickingCourse({ contact: c, courses });
                else toast.error('No shared courses found.');
              }}
              className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border-none bg-transparent"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {(c.name || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">{c.name}</p>
                {courses.length > 0 && (
                  <p className="text-[10px] text-gray-400 truncate">{courses.map(x => x.title).join(', ')}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Message Thread ────────────────────────────────────────────────────────────

function WidgetThread({ conversationId, myUserId }) {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const typingTimer = useRef(null);

  const { data, isLoading } = useMessages(conversationId, 1);
  const send = useSendMessage(conversationId);
  const markRead = useMarkRead(conversationId);

  const messages = data?.messages || [];

  // Cache update is handled inside useChatSocket — just clear typing indicator here.
  const onSocketMessage = useCallback(() => { setTyping(false); }, []);

  useChatSocket(conversationId, onSocketMessage);

  useEffect(() => {
    const onTypingStart = () => setTyping(true);
    const onTypingStop  = () => setTyping(false);
    socket.on('chat:typing:start', onTypingStart);
    socket.on('chat:typing:stop',  onTypingStop);
    return () => {
      socket.off('chat:typing:start', onTypingStart);
      socket.off('chat:typing:stop',  onTypingStop);
    };
  }, []);

  useEffect(() => { markRead.mutate(); }, [conversationId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length, typing]);

  const handleInput = (e) => {
    setInput(e.target.value);
    socket.emit('chat:typing:start', { conversationId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socket.emit('chat:typing:stop', { conversationId }), 2000);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    send.mutate(text, { onError: () => toast.error('Failed to send.') });
    setInput('');
    socket.emit('chat:typing:stop', { conversationId });
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-400 pt-8">No messages yet. Say hello!</p>
        )}
        {messages.map(msg => {
          const mine = msg.sender?._id === myUserId || msg.sender === myUserId;
          return (
            <div key={msg._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                mine
                  ? 'bg-gradient-to-br from-primary to-amber-400 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                <p>{msg.content}</p>
                <p className={`text-[9px] mt-0.5 text-right ${mine ? 'text-white/70' : 'text-gray-400'}`}>
                  {timeStr(msg.createdAt)}
                  {mine && msg.isRead && <span className="ml-1">✓✓</span>}
                </p>
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="flex items-center gap-1.5 px-2">
            <div className="flex gap-0.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">typing…</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-3 py-2 flex items-end gap-2">
        <textarea
          value={input}
          onChange={handleInput}
          onKeyDown={handleKey}
          placeholder="Type a message…"
          rows={1}
          className="flex-1 resize-none bg-gray-100 rounded-xl px-2.5 py-2 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/30 max-h-20"
          style={{ height: 'auto', minHeight: '36px' }}
          onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || send.isPending}
          className="p-2 bg-gradient-to-br from-primary to-amber-400 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0 cursor-pointer border-none"
        >
          {send.isPending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main Widget ───────────────────────────────────────────────────────────────

export function ChatWidget() {
  const { user } = useAuth();
  const startConv = useStartConversation();
  const isOnline = usePresence();
  const qc = useQueryClient();
  // Shared with WidgetConvList — React Query deduplicates the fetch.
  const { data: convList = [] } = useConversations();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'thread' | 'new'
  const [activeConv, setActiveConv] = useState(null);
  // ID of a conversation that received a new message while the thread was not open.
  // Used to auto-navigate when the user next clicks the bubble.
  const [pendingConvId, setPendingConvId] = useState(null);

  // Refs so the global socket handler always reads the latest open/activeConv
  // without being included in the dep array (avoids tearing down the listener on
  // every state change).
  const openRef = useRef(open);
  const activeConvRef = useRef(activeConv);
  openRef.current = open;
  activeConvRef.current = activeConv;

  // Join ALL of the user's conversation rooms so real-time messages arrive
  // regardless of which view is currently showing (list, new, or closed).
  useEffect(() => {
    if (!user || convList.length === 0) return;
    const ids = convList.map(c => String(c._id));
    const rejoin = () => ids.forEach(id => socket.emit('chat:join', id));
    rejoin();
    socket.io.on('reconnect', rejoin);
    return () => socket.io.off('reconnect', rejoin);
  }, [user, convList]);

  // Global message:new handler — always active, even when the panel is closed.
  // Writes directly into the messages cache (instant, no refetch round-trip) and
  // records a pending conversation for auto-navigation on next bubble click.
  useEffect(() => {
    if (!user) return;

    const handleGlobalMessage = (data) => {
      const convId = String(data.conversationId);

      // Update messages cache only if it already exists for this conversation.
      // Returning undefined from a v5 setQueryData updater is a no-op.
      qc.setQueryData(['chat', 'messages', convId, 1], (old) => {
        if (!old) return undefined;
        if (old.messages?.some(m => String(m._id) === String(data._id))) return old;
        return { ...old, messages: [...old.messages, data], total: (old.total || 0) + 1 };
      });

      // Refresh conversation list so unread badge and last-message preview update.
      qc.invalidateQueries({ queryKey: ['chat', 'conversations'] });

      // If this message is NOT for the currently-visible thread, mark it pending.
      const isCurrent =
        openRef.current &&
        activeConvRef.current &&
        String(activeConvRef.current._id) === convId;
      if (!isCurrent) setPendingConvId(convId);
    };

    socket.on('message:new', handleGlobalMessage);
    return () => socket.off('message:new', handleGlobalMessage);
  }, [user, qc]);

  const role = user?.role;
  if (role !== 'STUDENT' && role !== 'LECTURER') return null;

  const handleSelectConv = (conv) => {
    setActiveConv(conv);
    setView('thread');
    // Clear pending flag when the user manually navigates to a conversation.
    if (pendingConvId === String(conv._id)) setPendingConvId(null);
  };

  const handlePickContact = (contact, course) => {
    const payload = role === 'STUDENT'
      ? { lecturerId: contact.lecturerId, courseId: course._id }
      : { studentId: contact.studentId, courseId: course._id };

    startConv.mutate(payload, {
      onSuccess: (resp) => {
        const conv = resp?.data?.conversation;
        if (conv) { setActiveConv(conv); setView('thread'); setPendingConvId(null); }
      },
      onError: () => toast.error('Could not start conversation.'),
    });
  };

  // When the bubble is clicked and a message arrived while the widget was closed,
  // open the panel and jump directly to that conversation.
  const handleToggle = useCallback(() => {
    setOpen(o => {
      const nowOpen = !o;
      if (nowOpen && pendingConvId) {
        const conv = convList.find(c => String(c._id) === pendingConvId);
        if (conv) {
          setActiveConv(conv);
          setView('thread');
        }
        setPendingConvId(null);
      }
      return nowOpen;
    });
  }, [pendingConvId, convList]);

  const threadHeader = () => {
    if (!activeConv) return null;
    const other = role === 'STUDENT' ? activeConv.lecturer?.user : activeConv.student?.user;
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
        <button
          onClick={() => setView('list')}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer border-none bg-transparent shrink-0"
        >
          <ArrowLeft size={14} />
        </button>
        <Avatar name={other?.name} online={isOnline(other?._id)} size={7} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-900 truncate">{other?.name || '—'}</p>
          <p className="text-[10px] text-gray-400 truncate">{activeConv.course?.title}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: '500px' }}>
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-amber-400">
            <p className="text-sm font-bold text-white">Messages</p>
            <div className="flex items-center gap-1.5">
              <Link
                to="/messages"
                title="Open full page"
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <Maximize2 size={13} />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white cursor-pointer border-none bg-transparent transition-colors"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Thread sub-header */}
          {view === 'thread' && threadHeader()}

          {/* Body */}
          {view === 'list' && (
            <WidgetConvList
              role={role}
              onSelectConv={handleSelectConv}
              onNewChat={() => setView('new')}
            />
          )}
          {view === 'new' && (
            <WidgetContactPicker
              role={role}
              onPick={handlePickContact}
              onBack={() => setView('list')}
            />
          )}
          {view === 'thread' && activeConv && (
            <WidgetThread
              key={activeConv._id}
              conversationId={activeConv._id}
              myUserId={user._id}
            />
          )}
        </div>
      )}

      {/* Bubble */}
      <UnreadBubble open={open} onToggle={handleToggle} />
    </div>
  );
}

// Separate component so unread count re-renders don't affect the panel
function UnreadBubble({ open, onToggle }) {
  const { data: convList = [] } = useConversations();

  // Count conversations with unread messages (approximated from lastMessage read status)
  const unreadCount = convList.reduce((acc, conv) => {
    return acc + (conv.lastMessage && !conv.lastMessage.isRead ? 1 : 0);
  }, 0);

  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-amber-400 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center cursor-pointer border-none"
      title="Messages"
    >
      <MessageSquare size={22} />
      {!open && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
