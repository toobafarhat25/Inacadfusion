import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { WorkOutline, NotificationsNone, FolderOpen } from '@mui/icons-material'

const EmptyState = ({ icon, title, message, actionLabel, onAction }) => {
  const getIcon = () => {
    switch (icon) {
      case 'projects':
        return <WorkOutline sx={{ fontSize: 64, color: '#FFC107', mb: 2 }} />
      case 'notifications':
        return <NotificationsNone sx={{ fontSize: 64, color: '#FFC107', mb: 2 }} />
      case 'folder':
        return <FolderOpen sx={{ fontSize: 64, color: '#FFC107', mb: 2 }} />
      default:
        return <WorkOutline sx={{ fontSize: 64, color: '#FFC107', mb: 2 }} />
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
      }}
    >
      {getIcon()}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 400 }}>
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{
            backgroundColor: '#FFC107',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#FFA000',
            },
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}

export default EmptyState
