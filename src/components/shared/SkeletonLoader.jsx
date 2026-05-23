import React from 'react'
import { Skeleton, Box, Card, CardContent } from '@mui/material'

export const ProjectCardSkeleton = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
      <Skeleton variant="rectangular" height={100} sx={{ mt: 2, borderRadius: 1 }} />
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
      </Box>
    </CardContent>
  </Card>
)

export const DashboardSkeleton = () => (
  <Box>
    <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 3, borderRadius: 2 }} />
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Skeleton variant="rectangular" width="33%" height={150} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" width="33%" height={150} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" width="33%" height={150} sx={{ borderRadius: 2 }} />
    </Box>
  </Box>
)
