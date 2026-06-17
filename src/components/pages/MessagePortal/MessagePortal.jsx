import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare, Send, Search, ArrowLeft, Loader2,
  BookOpen,
} from 'lucide-react';
import {
  useContacts,
  useConversations,
  useStartConversation,
  useMessages,
  useSendMessage,
  useMarkRead,
  useChatSocket,
  usePresence,
} from '@/hooks';
import { useAuth } from '@/context';
import { PageHeader } from '@/components/molecules';
import { toast } from 'sonner';
import socket from '@/lib/socket';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeStr(date) {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// ─── Typing Indicator ────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <span className="text-xs text-gray-400">typing…</span>
    </div>
  );
}

// ─── Conversation List Item ───────────────────────────────────────────────────

function ConvItem({ conv, active, onSelect, myRole, isOnline }) {
  const other = myRole === 'STUDENT'
    ? conv.lecturer?.user
    : conv.student?.user;
  const lastMsg = conv.lastMessage;

  return (
    <button
      onClick={() => onSelect(conv)}
      className={`w-full text-left px-3 py-3 flex items-center gap-3 rounded-xl transition-colors cursor-pointer border-none ${active ? 'bg-primary/10' : 'hover:bg-gray-100'}`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center text-white font-bold text-sm">
          {other?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 truncate">{other?.name || '—'}</p>
          {lastMsg && <span className="text-[10px] text-gray-400 shrink-0">{timeStr(lastMsg.createdAt)}</span>}
        </div>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {conv.course?.title || ''}
        </p>
        {lastMsg && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {lastMsg.content}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Start Conversation Modal ─────────────────────────────────────────────────

function StartConvModal({ onClose, onStart }) {
  const { data: contacts = [], isLoading } = useContacts();
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full sm:w-96 rounded-t-3xl sm:rounded-2xl shadow-xl max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-base font-bold text-gray-900 mb-3">Start a Conversation</h3>
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts…"
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
          {isLoading ? (
            <div className="py-8 text-center"><Loader2 className="w-5 h-5 text-gray-300 animate-spin mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              {contacts.length === 0
                ? user?.role === 'STUDENT' ? 'No lecturers found. Enrol in a course first.' : 'No students enrolled in your courses yet.'
                : 'No contacts match your search.'}
            </p>
          ) : filtered.map((c, i) => {
            const name = c.name || '?';
            // A contact can be a lecturer (has lecturerId) or a student (has studentId)
            const courses = c.courses || [];
            return (
              <button
                key={i}
                onClick={() => onStart(c)}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border-none bg-transparent"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{name}</p>
                  {courses.length > 0 && (
                    <p className="text-xs text-gray-400 truncate">
                      {courses.map(c => c.title).join(', ')}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Course Picker (for a contact with multiple shared courses) ───────────────

function CoursePicker({ courses, onPick, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-72 rounded-2xl shadow-xl p-5" onClick={e => e.stopPropagation()}>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Select a Course</h3>
        <div className="space-y-1">
          {courses.map((c, i) => (
            <button
              key={i}
              onClick={() => onPick(c)}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700 cursor-pointer border-none bg-transparent flex items-center gap-2"
            >
              <BookOpen size={14} className="text-primary shrink-0" />
              {c.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Message Thread ───────────────────────────────────────────────────────────

function MessageThread({ conversationId, myUserId, myRole }) {
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false); // remote typing indicator
  const endRef = useRef(null);
  const typingTimer = useRef(null);

  const { data, isLoading } = useMessages(conversationId, 1);
  const send = useSendMessage(conversationId);
  const markRead = useMarkRead(conversationId);

  const messages = data?.messages || [];

  // Cache update is handled inside useChatSocket — just clear typing indicator here.
  const onSocketMessage = useCallback(() => { setTyping(false); }, []);

  useChatSocket(conversationId, onSocketMessage);

  // Socket typing events
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

  // Mark read on open
  useEffect(() => { markRead.mutate(); }, [conversationId]);

  // Auto-scroll
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
    send.mutate(text, {
      onError: () => toast.error('Failed to send message.'),
    });
    setInput('');
    socket.emit('chat:typing:stop', { conversationId });
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No messages yet. Say hello!
          </div>
        )}
        {messages.map((msg) => {
          const mine = msg.sender?._id === myUserId || msg.sender === myUserId;
          return (
            <div key={msg._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  mine
                    ? 'bg-gradient-to-br from-primary to-amber-400 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 text-right ${mine ? 'text-white/70' : 'text-gray-400'}`}>
                  {timeStr(msg.createdAt)}
                  {mine && msg.isRead && <span className="ml-1">✓✓</span>}
                </p>
              </div>
            </div>
          );
        })}
        {typing && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-4 py-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={handleInput}
          onKeyDown={handleKey}
          placeholder="Type a message…"
          rows={1}
          className="flex-1 resize-none bg-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/30 max-h-28"
          style={{ height: 'auto', minHeight: '42px' }}
          onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || send.isPending}
          className="p-2.5 bg-gradient-to-br from-primary to-amber-400 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0 cursor-pointer border-none"
        >
          {send.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function MessagePortal() {
  const { user } = useAuth();
  const isOnline = usePresence();

  const { data: convList = [], isLoading: loadingConvs } = useConversations();
  const startConv = useStartConversation();

  const [activeConv, setActiveConv]       = useState(null);
  const [showNewModal, setShowNewModal]   = useState(false);
  const [pendingContact, setPendingContact] = useState(null); // for course picker
  const [search, setSearch]               = useState('');
  const [mobileViewThread, setMobileViewThread] = useState(false);

  const role = user?.role;

  const filtered = convList.filter(c => {
    const other = role === 'STUDENT' ? c.lecturer?.user : c.student?.user;
    return (other?.name || '').toLowerCase().includes(search.toLowerCase());
  });

  const handleSelectConv = (conv) => {
    setActiveConv(conv);
    setMobileViewThread(true);
  };

  const handleStartContact = (contact) => {
    setShowNewModal(false);
    const courses = contact.courses || [];
    if (courses.length === 1) {
      initiateConversation(contact, courses[0]);
    } else if (courses.length > 1) {
      setPendingContact({ contact, courses });
    } else {
      // No shared courses — shouldn't happen, but guard
      toast.error('No shared courses found.');
    }
  };

  const initiateConversation = (contact, course) => {
    setPendingContact(null);
    const payload = role === 'STUDENT'
      ? { lecturerId: contact.lecturerId, courseId: course._id }
      : { studentId: contact.studentId, courseId: course._id };

    startConv.mutate(payload, {
      onSuccess: (resp) => {
        const conv = resp?.data?.conversation;
        if (conv) { setActiveConv(conv); setMobileViewThread(true); }
      },
      onError: () => toast.error('Could not start conversation.'),
    });
  };

  if (!user || (role !== 'STUDENT' && role !== 'LECTURER')) {
    return (
      <div className="bg-bg-paper min-h-screen p-10 flex items-center justify-center">
        <p className="text-gray-500">Chat is available for students and lecturers.</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-paper min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col px-0 sm:px-4 lg:px-8 py-0 sm:py-6">
        <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 flex-1 min-h-0 sm:h-[calc(100vh-120px)]">

          {/* Sidebar — conversation list */}
          <div className={`w-full sm:w-72 bg-white sm:rounded-2xl border-0 sm:border border-gray-100 sm:shadow-sm flex flex-col ${mobileViewThread ? 'hidden sm:flex' : 'flex'}`}>
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900">Messages</h2>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="text-xs font-semibold text-white bg-gradient-to-br from-primary to-amber-400 px-3 py-1.5 rounded-lg cursor-pointer border-none"
                >
                  + New
                </button>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                <Search size={14} className="text-gray-400 shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {loadingConvs ? (
                <div className="pt-8 text-center"><Loader2 className="w-5 h-5 text-gray-300 animate-spin mx-auto" /></div>
              ) : filtered.length === 0 ? (
                <div className="pt-8 text-center">
                  <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No conversations yet.</p>
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="mt-3 text-xs text-primary font-semibold cursor-pointer bg-transparent border-none"
                  >
                    Start one →
                  </button>
                </div>
              ) : filtered.map(conv => {
                const otherId = role === 'STUDENT'
                  ? conv.lecturer?.user?._id
                  : conv.student?.user?._id;
                return (
                  <ConvItem
                    key={conv._id}
                    conv={conv}
                    active={activeConv?._id === conv._id}
                    onSelect={handleSelectConv}
                    myRole={role}
                    isOnline={isOnline(otherId)}
                  />
                );
              })}
            </div>
          </div>

          {/* Main panel — message thread */}
          <div className={`flex-1 bg-white sm:rounded-2xl border-0 sm:border border-gray-100 sm:shadow-sm flex flex-col min-h-0 ${!mobileViewThread ? 'hidden sm:flex' : 'flex'}`}>
            {!activeConv ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-gray-600 font-semibold">Select a conversation</p>
                <p className="text-sm text-gray-400 mt-1">or start a new one above</p>
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
                  <button
                    onClick={() => { setMobileViewThread(false); }}
                    className="sm:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer border-none bg-transparent"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  {(() => {
                    const other = role === 'STUDENT' ? activeConv.lecturer?.user : activeConv.student?.user;
                    const otherId = other?._id;
                    const online = isOnline(otherId);
                    return (
                      <>
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center text-white font-bold text-sm">
                            {other?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          {online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{other?.name || '—'}</p>
                          <p className="text-xs text-gray-400">{activeConv.course?.title}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <MessageThread
                  key={activeConv._id}
                  conversationId={activeConv._id}
                  myUserId={user._id}
                  myRole={role}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {showNewModal && (
        <StartConvModal
          onClose={() => setShowNewModal(false)}
          onStart={handleStartContact}
        />
      )}

      {pendingContact && (
        <CoursePicker
          courses={pendingContact.courses}
          onPick={(course) => initiateConversation(pendingContact.contact, course)}
          onClose={() => setPendingContact(null)}
        />
      )}
    </div>
  );
}
