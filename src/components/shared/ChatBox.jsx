import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Divider,
  Avatar
} from '@mui/material'
import { Send, Close, SmartToy } from '@mui/icons-material'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { API_BASE_URL } from '../../utils/api'
import { io } from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'

const ChatBox = ({ collaborationId, onClose }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const socketRef = useRef()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Connect to Socket.io namespace
    socketRef.current = io(API_BASE_URL)

    socketRef.current.emit('joinCollab', collaborationId)

    // Listen for incoming messages
    socketRef.current.on(`message-${collaborationId}`, (message) => {
      setMessages((prev) => [...prev, message])
    })

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${collaborationId}`)
        setMessages(res.data.data)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }
    fetchMessages()

    return () => {
      socketRef.current.disconnect()
    }
  }, [collaborationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const res = await api.post('/messages', {
        collaborationId,
        text: newMessage,
      })
      // Reset input
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <Paper 
      elevation={4}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '75vh', 
        maxHeight: '800px',
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        background: '#fff'
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2.5, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        zIndex: 10
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <span role="img" aria-label="chat">💬</span> Live Chat
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.2)' } }}>
          <Close />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3,
        backgroundColor: '#f0f2f5',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffc107' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '120px',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
      }}>
        <AnimatePresence>
        {messages.map((msg, idx) => {
          const currentUserId = user?.id || user?._id;
          const senderObj = msg.senderId || {};
          const isMe = senderObj._id === currentUserId || senderObj === currentUserId;
          const senderName = senderObj.name || 'User';
          
          return (
            <motion.div
              key={msg._id || idx}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end'
              }}
            >
              {!isMe && (
                <Avatar sx={{ width: 32, height: 32, bgcolor: senderName === 'admin' ? '#f44336' : '#2196f3', fontSize: '0.875rem' }}>
                  {senderName.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                {!isMe && (
                  <Typography variant="caption" sx={{ ml: 0.5, mb: 0.5, color: '#555', fontWeight: 600, letterSpacing: '0.3px' }}>
                    {senderName}
                  </Typography>
                )}
                <Box
                  sx={{
                    background: isMe 
                      ? 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)' 
                      : '#ffffff',
                    color: isMe ? '#000' : '#2b2b2b',
                    p: 2,
                    borderRadius: 3,
                    borderBottomRightRadius: isMe ? 4 : 16,
                    borderBottomLeftRadius: !isMe ? 4 : 16,
                    boxShadow: isMe ? '0 4px 12px rgba(255,193,7,0.3)' : '0 4px 12px rgba(0,0,0,0.06)'
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.5, fontSize: '0.95rem', wordBreak: 'break-word' }}>
                    {msg.text}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )
        })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box component="form" onSubmit={handleSendMessage} sx={{ 
        p: 2.5, 
        display: 'flex', 
        gap: 2,
        backgroundColor: '#fff',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
        zIndex: 10
      }}>
        <TextField
          fullWidth
          size="medium"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              backgroundColor: '#f5f7fb',
              '& fieldset': {
                borderColor: 'rgba(0,0,0,0.05)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0,0,0,0.1)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FFC107',
                borderWidth: '2px'
              }
            }
          }}
        />
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton 
            type="submit" 
            sx={{ 
              backgroundColor: newMessage.trim() ? '#FFC107' : '#f0f0f0',
              color: newMessage.trim() ? '#000' : '#9e9e9e',
              width: 56,
              height: 56,
              boxShadow: newMessage.trim() ? '0 4px 15px rgba(255, 193, 7, 0.4)' : 'none',
              '&:hover': {
                backgroundColor: newMessage.trim() ? '#FF9800' : '#f0f0f0'
              }
            }} 
            disabled={!newMessage.trim()}
          >
            <Send />
          </IconButton>
        </motion.div>
      </Box>
    </Paper>
  )
}

export default ChatBox
