import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material'
import api from '../../utils/api'

const DisputeManagement = () => {
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [resolveDialog, setResolveDialog] = useState(null)
  const [adminResponse, setAdminResponse] = useState('')
  const [loadingAction, setLoadingAction] = useState(false)

  const fetchDisputes = async () => {
    try {
      const res = await api.get('/admin/disputes')
      setDisputes(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDisputes()
  }, [])

  const handleResolveOpen = (dispute) => {
    setResolveDialog(dispute)
    setAdminResponse(dispute.adminResponse || '')
  }

  const handleResolveSubmit = async () => {
    if (!adminResponse) return
    setLoadingAction(true)
    try {
      await api.put(`/admin/disputes/${resolveDialog._id}`, {
        adminResponse,
        status: 'resolved'
      })
      fetchDisputes()
      setResolveDialog(null)
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Failed to resolve dispute')
    } finally {
      setLoadingAction(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ pt: 10, px: 3, pb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#FFC107' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ pt: 10, px: 3, pb: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Manage Disputes
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Review and resolve collaboration disputes between students and startups.
        </Typography>

        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Raised By</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Admin Response</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {disputes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No disputes found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  disputes.map((dispute) => (
                    <TableRow key={dispute._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{dispute.raisedBy?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{dispute.raisedBy?.role}</Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography variant="body2" sx={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden' 
                        }}>
                          {dispute.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={dispute.status}
                          size="small"
                          sx={{
                            backgroundColor: dispute.status === 'resolved' ? '#E8F5E9' : '#FFF3E0',
                            color: dispute.status === 'resolved' ? '#2E7D32' : '#E65100',
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {dispute.adminResponse || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          color={dispute.status === 'resolved' ? 'inherit' : 'primary'}
                          onClick={() => handleResolveOpen(dispute)}
                        >
                          {dispute.status === 'resolved' ? 'View' : 'Resolve'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Resolve Dialog */}
        <Dialog open={!!resolveDialog} onClose={() => !loadingAction && setResolveDialog(null)} maxWidth="sm" fullWidth>
          <DialogTitle>{resolveDialog?.status === 'resolved' ? 'Dispute Details' : 'Resolve Dispute'}</DialogTitle>
          <DialogContent>
            {resolveDialog && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>Reason</Typography>
                  <Typography variant="body1">{resolveDialog.reason}</Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Admin Response/Resolution"
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  disabled={resolveDialog.status === 'resolved' || loadingAction}
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResolveDialog(null)} disabled={loadingAction} color="inherit">
              {resolveDialog?.status === 'resolved' ? 'Close' : 'Cancel'}
            </Button>
            {resolveDialog?.status === 'open' && (
              <Button onClick={handleResolveSubmit} disabled={loadingAction || !adminResponse} variant="contained" sx={{ bgcolor: '#FFC107', color: '#000' }}>
                Mark Resolved
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default DisputeManagement
