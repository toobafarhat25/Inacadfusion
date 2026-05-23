import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material'
import { Notifications, CheckCircle, Info, Warning, Error } from '@mui/icons-material'
import EmptyState from '../../components/shared/EmptyState'
import api from '../../utils/api'

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await api.get('/notifications')
        setNotifications(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadNotifications()

    window.addEventListener('notifications_updated_realtime', loadNotifications)
    return () => {
      window.removeEventListener('notifications_updated_realtime', loadNotifications)
    }
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle sx={{ color: '#4CAF50' }} />
      case 'warning':
        return <Warning sx={{ color: '#FF9800' }} />
      case 'error':
        return <Error sx={{ color: '#F44336' }} />
      default:
        return <Info sx={{ color: '#FFC107' }} />
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(
        notifications.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      )
      window.dispatchEvent(new Event('notifications_updated'))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <Box sx={{ pt: 18, px: 3, pb: 4 }}>
        <Container maxWidth="md">
          <Typography>Loading...</Typography>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ pt: 18, px: 3, pb: 10, minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
            Notifications
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280', fontWeight: 500 }}>
            Stay updated with your collaborations and opportunities
          </Typography>
        </motion.div>

        {notifications.length === 0 ? (
          <EmptyState
            icon="notifications"
            title="No Notifications"
            message="You're all caught up! Check back later for updates."
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {notifications.map((notif) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    backgroundColor: notif.isRead ? '#FFFFFF' : 'rgba(255,193,7,0.05)',
                    borderLeft: notif.isRead ? 'none' : '4px solid #FFC107',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                      <Box sx={{ mt: 0.5 }}>{getIcon(notif.type)}</Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {notif.title}
                          </Typography>
                          {!notif.isRead && (
                            <Chip
                              label="New"
                              size="small"
                              sx={{
                                backgroundColor: '#FFC107',
                                color: '#000000',
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notif.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      {!notif.isRead && (
                        <IconButton
                          size="small"
                          onClick={() => markAsRead(notif._id)}
                          sx={{ color: '#FFC107' }}
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default NotificationsPage
