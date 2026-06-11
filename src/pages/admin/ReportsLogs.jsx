import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button,
  TextField, InputAdornment, CircularProgress
} from '@mui/material'
import { Search } from '@mui/icons-material'
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

const ReportsLogs = () => {
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports')
      setReports(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleResolve = async (id) => {
    try {
      await api.put(`/admin/reports/${id}`, { status: 'resolved', adminAction: 'Reviewed and resolved by admin.' })
      fetchReports()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Failed to resolve report')
    }
  }

  const filteredLogs = reports.filter(report =>
    report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.reportedBy?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                Reports & Logs
              </Typography>
              <Typography sx={{ color: '#6B7280', fontSize: '0.95rem', mt: 1 }}>
                Review content moderation and user reports.
              </Typography>
            </Box>
          </motion.div>

          <TextField
            fullWidth
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#9CA3AF' }} /></InputAdornment>,
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#FFF', borderRadius: '12px',
                '& fieldset': { borderColor: '#E5E7EB' },
                '&:hover fieldset': { borderColor: '#FFC107' },
                '&.Mui-focused fieldset': { borderColor: '#FFC107', borderWidth: 2 }
              }
            }}
          />

          <div className="adm-card">
            <TableContainer>
              <Table>
                <TableHead className="adm-table-head">
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Reported By</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#9CA3AF', fontSize: '0.9rem' }}>
                        No reports found.
                      </TableCell>
                    </TableRow>
                  ) : filteredLogs.map((report, i) => (
                    <motion.tr
                      key={report._id}
                      className="adm-table-row"
                      component={TableRow}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#111827' }}>{report.reportedBy?.name || 'Unknown'}</TableCell>
                      <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {report.reason}
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={report.targetType} sx={{ background: '#F3F4F6', color: '#4B5563', fontWeight: 600, fontSize: '0.65rem', textTransform: 'capitalize' }} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.status}
                          size="small"
                          sx={{
                            background: report.status === 'resolved' ? '#ECFDF5' : '#FFFBEB',
                            color: report.status === 'resolved' ? '#065F46' : '#B45309',
                            fontWeight: 700, fontSize: '0.68rem', borderRadius: '6px', textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {report.status === 'pending' ? (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => handleResolve(report._id)}
                            sx={{ borderColor: '#FFC107', color: '#000', backgroundColor: 'rgba(255,193,7,0.1)', '&:hover': { backgroundColor: '#FFC107', borderColor: '#FFC107' } }}
                          >
                            Resolve
                          </Button>
                        ) : (
                          <Typography sx={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600 }}>Resolved</Typography>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Container>
      </Box>
    </>
  )
}

export default ReportsLogs
