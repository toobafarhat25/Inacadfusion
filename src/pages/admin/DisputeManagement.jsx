import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material'
import api from '../../utils/api'

const STYLES = `
.adm-root {
  font-family: 'Inter', system-ui, sans-serif;
  background: #FAFAFA;
  min-height: 100vh;
  color: #111827;
}
.adm-card {
  background: #FFFFFF;
  border-radius: 14px;
  border: 1px solid #E5E7EB;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.adm-table-head .MuiTableCell-root {
  font-family: 'Inter', system-ui;
  font-weight: 700;
  font-size: 0.68rem;
  color: #B45309;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  background: #FFFBEB;
  border-bottom: 1px solid #FDE68A;
  padding: 14px 20px;
}
.adm-table-row:hover { background: #FFFBEB; }
.adm-table-row .MuiTableCell-root {
  font-family: 'Inter', system-ui;
  font-size: 0.85rem;
  color: #374151;
  padding: 14px 20px;
  border-bottom: 1px solid #F3F4F6;
}
`

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
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="adm-root" sx={{ pt: { xs: 9, md: 10 }, px: { xs: 2, md: 3 }, pb: 6 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                Administration
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.8rem', md: '2.2rem' }, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Manage Disputes
              </Typography>
              <Typography sx={{ color: '#6B7280', fontSize: '0.95rem', mt: 1 }}>
                Review and resolve collaboration disputes between students and startups.
              </Typography>
            </Box>
          </motion.div>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box sx={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', px: 3, py: 2, minWidth: 160 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#111827', lineHeight: 1 }}>{disputes.length}</Typography>
              <Typography sx={{ fontWeight: 500, fontSize: '0.75rem', color: '#6B7280', mt: 0.3 }}>Total Disputes</Typography>
            </Box>
          </Box>

          <div className="adm-card">
            <TableContainer>
              <Table>
                <TableHead className="adm-table-head">
                  <TableRow>
                    <TableCell>Raised By</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Admin Response</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {disputes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#9CA3AF', fontSize: '0.9rem' }}>
                        No disputes found.
                      </TableCell>
                    </TableRow>
                  ) : disputes.map((dispute, i) => (
                    <motion.tr
                      key={dispute._id}
                      className="adm-table-row"
                      component={TableRow}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{dispute.raisedBy?.name}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'capitalize' }}>{dispute.raisedBy?.role}</Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {dispute.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={dispute.status}
                          size="small"
                          sx={{
                            background: dispute.status === 'resolved' ? '#ECFDF5' : '#FFFBEB',
                            color: dispute.status === 'resolved' ? '#065F46' : '#B45309',
                            fontWeight: 700, fontSize: '0.68rem', borderRadius: '6px', textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography sx={{ color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {dispute.adminResponse || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleResolveOpen(dispute)}
                          sx={{
                            borderColor: dispute.status === 'resolved' ? '#D1D5DB' : '#FFC107',
                            color: dispute.status === 'resolved' ? '#6B7280' : '#000',
                            backgroundColor: dispute.status === 'resolved' ? 'transparent' : 'rgba(255,193,7,0.1)',
                            '&:hover': {
                              backgroundColor: dispute.status === 'resolved' ? '#F3F4F6' : '#FFC107',
                              borderColor: dispute.status === 'resolved' ? '#D1D5DB' : '#FFC107'
                            }
                          }}
                        >
                          {dispute.status === 'resolved' ? 'View' : 'Resolve'}
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Resolve Dialog */}
          <Dialog open={!!resolveDialog} onClose={() => !loadingAction && setResolveDialog(null)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, fontFamily: '"Inter", system-ui' }}>
              {resolveDialog?.status === 'resolved' ? 'Dispute Details' : 'Resolve Dispute'}
            </DialogTitle>
            <DialogContent>
              {resolveDialog && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#B45309', textTransform: 'uppercase', mb: 0.5 }}>Reason</Typography>
                    <Typography sx={{ color: '#374151' }}>{resolveDialog.reason}</Typography>
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
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button onClick={() => setResolveDialog(null)} disabled={loadingAction} color="inherit" sx={{ fontWeight: 600 }}>
                {resolveDialog?.status === 'resolved' ? 'Close' : 'Cancel'}
              </Button>
              {resolveDialog?.status === 'open' && (
                <Button onClick={handleResolveSubmit} disabled={loadingAction || !adminResponse} variant="contained" sx={{ bgcolor: '#FFC107', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#FFA000' } }}>
                  Mark Resolved
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  )
}

export default DisputeManagement
