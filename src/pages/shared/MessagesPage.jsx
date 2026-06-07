import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  CircularProgress,
  Chip
} from '@mui/material';
import { Send, ArrowBack, Chat as ChatIcon, Search } from '@mui/icons-material';
import api, { API_BASE_URL } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.msg-page {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 88px);
  background: #F8FAFC;
  font-family: 'Inter', system-ui;
  padding: 88px 32px 32px 32px;
  gap: 20px;
  box-sizing: border-box;
}

.msg-title {
  font-family: 'Inter', system-ui;
  font-weight: 800;
  font-size: 1.75rem;
  color: #0F172A;
  letter-spacing: -0.5px;
}

.msg-layout {
  display: flex;
  flex: 1;
  height: calc(100vh - 88px - 80px - 40px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 40px rgba(0,0,0,0.06);
  background: #fff;
  border: 1px solid #E2E8F0;
}

/* ── SIDEBAR ── */
.msg-sidebar {
  width: 310px;
  flex-shrink: 0;
  border-right: 1px solid #F1F5F9;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.msg-sidebar-header {
  padding: 20px 20px 14px;
  border-bottom: 1px solid #F1F5F9;
}

.msg-search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 8px 12px;
}

.msg-search-wrap input {
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Inter', system-ui;
  font-size: 0.85rem;
  color: #334155;
  width: 100%;
}

.msg-search-wrap input::placeholder { color: #94A3B8; }

.msg-conv-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.msg-conv-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.18s;
  position: relative;
  border-left: 3px solid transparent;
}

.msg-conv-item:hover { background: #F8FAFC; }

.msg-conv-item.active {
  background: #FFFBEB;
  border-left: 3px solid #FFC107;
}

.msg-conv-item-text { flex: 1; min-width: 0; }

.msg-conv-name {
  font-family: 'Inter', system-ui;
  font-weight: 600;
  font-size: 0.9rem;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-conv-item.active .msg-conv-name { color: #92400E; }

.msg-conv-preview {
  font-family: 'Inter', system-ui;
  font-size: 0.78rem;
  color: #94A3B8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

/* ── CHAT AREA ── */
.msg-chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #FAFBFC;
}

.msg-chat-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #F1F5F9;
}

.msg-chat-header-info {}

.msg-chat-header-name {
  font-family: 'Inter', system-ui;
  font-weight: 700;
  font-size: 1rem;
  color: #0F172A;
}

.msg-chat-header-role {
  font-family: 'Inter', system-ui;
  font-size: 0.75rem;
  color: #64748B;
  text-transform: capitalize;
}

.msg-messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.msg-bubble-wrap-me { align-self: flex-end; max-width: 70%; }
.msg-bubble-wrap-other { align-self: flex-start; max-width: 70%; display: flex; gap: 8px; align-items: flex-end; }

.msg-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  font-family: 'Inter', system-ui;
  font-size: 0.9rem;
  line-height: 1.55;
  word-break: break-word;
}

.msg-bubble-me {
  background: #111111;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.msg-bubble-other {
  background: #fff;
  color: #334155;
  border-bottom-left-radius: 4px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.msg-time {
  font-family: 'Inter', system-ui;
  font-size: 0.68rem;
  color: #94A3B8;
  margin-top: 4px;
  text-align: right;
}

.msg-time-other { text-align: left; margin-left: 36px; }

.msg-input-wrap {
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #F1F5F9;
  display: flex;
  gap: 12px;
  align-items: center;
}

.msg-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: #94A3B8;
}

.msg-avatar-student {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8) !important;
}
.msg-avatar-startup {
  background: linear-gradient(135deg, #10B981, #047857) !important;
}

.msg-conv-list::-webkit-scrollbar,
.msg-messages-area::-webkit-scrollbar {
  width: 4px;
}
.msg-conv-list::-webkit-scrollbar-thumb,
.msg-messages-area::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 4px;
}
`;

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [filteredConvs, setFilteredConvs] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(API_BASE_URL);

    const load = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setConversations(res.data.data);
        setFilteredConvs(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();

    return () => socketRef.current.disconnect();
  }, []);

  // search filter
  useEffect(() => {
    if (!searchQ.trim()) { setFilteredConvs(conversations); return; }
    const q = searchQ.toLowerCase();
    setFilteredConvs(conversations.filter(c => {
      const other = getOtherParticipant(c);
      return other.name.toLowerCase().includes(q);
    }));
  }, [searchQ, conversations]);

  useEffect(() => {
    if (!activeConversation) return;

    socketRef.current.emit('joinChat', activeConversation._id);

    const handler = (msg) => {
      setMessages(prev => [...prev, msg]);
      setConversations(prev => prev.map(c =>
        c._id === activeConversation._id ? { ...c, lastMessage: msg } : c
      ));
    };
    socketRef.current.on(`direct-message-${activeConversation._id}`, handler);

    api.get(`/chat/messages/${activeConversation._id}`)
      .then(res => setMessages(res.data.data))
      .catch(e => console.error(e));

    return () => {
      socketRef.current.off(`direct-message-${activeConversation._id}`, handler);
      socketRef.current.emit('leaveChat', activeConversation._id);
    };
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;
    const text = newMessage;
    setNewMessage('');
    try {
      await api.post('/chat/messages', { conversationId: activeConversation._id, text });
    } catch (e) {
      console.error(e);
      setNewMessage(text);
    }
  };

  const getOtherParticipant = (conv) => {
    const myId = user?.id || user?._id;
    return conv.participants?.find(p => (p._id || p) !== myId) || conv.participants?.[0] || {};
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const myId = user?.id || user?._id;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="msg-page">
        <Typography className="msg-title">Messages</Typography>

        <div className="msg-layout">
          {/* ── SIDEBAR ── */}
          <div className="msg-sidebar">
            <div className="msg-sidebar-header">
              <div className="msg-search-wrap">
                <Search sx={{ fontSize: 16, color: '#94A3B8' }} />
                <input
                  placeholder="Search conversations..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                />
              </div>
            </div>

            <div className="msg-conv-list">
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                  <CircularProgress size={24} sx={{ color: '#FFC107' }} />
                </Box>
              ) : filteredConvs.length === 0 ? (
                <Box sx={{ textAlign: 'center', pt: 5, px: 3 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8', fontFamily: 'Inter' }}>
                    No conversations yet.
                  </Typography>
                </Box>
              ) : (
                filteredConvs.map(conv => {
                  const other = getOtherParticipant(conv);
                  const isActive = activeConversation?._id === conv._id;
                  return (
                    <div
                      key={conv._id}
                      className={`msg-conv-item ${isActive ? 'active' : ''}`}
                      onClick={() => { setActiveConversation(conv); setMessages([]); }}
                    >
                      <Avatar
                        className={other.role === 'startup' ? 'msg-avatar-startup' : 'msg-avatar-student'}
                        sx={{ width: 42, height: 42, fontSize: '1rem', fontWeight: 700 }}
                      >
                        {(other.name || 'U').charAt(0).toUpperCase()}
                      </Avatar>
                      <div className="msg-conv-item-text">
                        <div className="msg-conv-name">{other.name || 'Unknown'}</div>
                        <div className="msg-conv-preview">
                          {conv.lastMessage?.text || 'Start a conversation'}
                        </div>
                      </div>
                      {isActive && (
                        <Box sx={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: '#FFC107', flexShrink: 0
                        }} />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── CHAT AREA ── */}
          <div className="msg-chat-area">
            {activeConversation ? (
              <>
                {/* Header */}
                <div className="msg-chat-header">
                  <IconButton
                    size="small"
                    onClick={() => setActiveConversation(null)}
                    sx={{ display: { md: 'none' }, mr: 0.5 }}
                  >
                    <ArrowBack sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Avatar
                    className={getOtherParticipant(activeConversation).role === 'startup' ? 'msg-avatar-startup' : 'msg-avatar-student'}
                    sx={{ width: 44, height: 44, fontWeight: 700 }}
                  >
                    {(getOtherParticipant(activeConversation).name || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="msg-chat-header-info">
                    <div className="msg-chat-header-name">
                      {getOtherParticipant(activeConversation).name}
                    </div>
                    <div className="msg-chat-header-role">
                      {getOtherParticipant(activeConversation).role}
                    </div>
                  </div>
                  <Box sx={{ ml: 'auto' }}>
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        background: 'rgba(16,185,129,0.1)',
                        color: '#059669',
                        fontFamily: 'Inter',
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        height: 22
                      }}
                    />
                  </Box>
                </div>

                {/* Messages */}
                <div className="msg-messages-area">
                  <AnimatePresence>
                    {messages.map((msg, idx) => {
                      const senderObj = msg.senderId || {};
                      const senderId = senderObj._id || senderObj;
                      const isMe = senderId === myId;
                      return (
                        <motion.div
                          key={msg._id || idx}
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className={isMe ? 'msg-bubble-wrap-me' : 'msg-bubble-wrap-other'}
                        >
                          {!isMe && (
                            <Avatar
                              sx={{ width: 28, height: 28, fontSize: '0.75rem', fontWeight: 700, bgcolor: '#3B82F6', flexShrink: 0 }}
                            >
                              {(senderObj.name || 'U').charAt(0).toUpperCase()}
                            </Avatar>
                          )}
                          <div>
                            <div className={`msg-bubble ${isMe ? 'msg-bubble-me' : 'msg-bubble-other'}`}>
                              {msg.text}
                            </div>
                            <div className={`msg-time ${!isMe ? 'msg-time-other' : ''}`}>
                              {formatTime(msg.createdAt)}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="msg-input-wrap" onSubmit={handleSend}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(e); }}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        fontFamily: 'Inter',
                        fontSize: '0.9rem',
                        bgcolor: '#F8FAFC',
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&:hover fieldset': { borderColor: '#CBD5E1' },
                        '&.Mui-focused fieldset': { borderColor: '#FFC107', borderWidth: 2 }
                      }
                    }}
                  />
                  <IconButton
                    type="submit"
                    disabled={!newMessage.trim()}
                    sx={{
                      width: 44, height: 44, borderRadius: '12px',
                      bgcolor: newMessage.trim() ? '#111' : '#F1F5F9',
                      color: newMessage.trim() ? '#fff' : '#94A3B8',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: newMessage.trim() ? '#FFC107' : '#F1F5F9',
                        color: newMessage.trim() ? '#111' : '#94A3B8',
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <Send sx={{ fontSize: 18 }} />
                  </IconButton>
                </form>
              </>
            ) : (
              <div className="msg-empty-state">
                <Box sx={{
                  width: 72, height: 72, borderRadius: '20px',
                  background: '#FFFBEB', border: '2px solid #FEF3C7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ChatIcon sx={{ fontSize: 32, color: '#FFC107' }} />
                </Box>
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>
                  Select a conversation
                </Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#94A3B8', textAlign: 'center', maxWidth: 240 }}>
                  Choose a conversation from the left to start messaging
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagesPage;
