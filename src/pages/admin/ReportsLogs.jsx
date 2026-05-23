import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Button
} from '@mui/material'
import { Search } from '@mui/icons-material'
import api from '../../utils/api'

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
    <Box sx={{ pt: 10, px: 3, pb: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Reports & Logs
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Review content moderation and user reports
        </Typography>

        <TextField
          fullWidth
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Reported By</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Target Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>No reports found.</TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((report) => (
                    <TableRow key={report._id} hover>
                      <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{report.reportedBy?.name || 'Unknown'}</TableCell>
                      <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {report.reason}
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={report.targetType} sx={{ textTransform: 'capitalize' }} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.status}
                          size="small"
                          sx={{
                            backgroundColor: report.status === 'resolved' ? '#E8F5E9' : '#FFF3E0',
                            color: report.status === 'resolved' ? '#2E7D32' : '#E65100',
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {report.status === 'pending' ? (
                          <Button size="small" variant="outlined" color="primary" onClick={() => handleResolve(report._id)}>
                            Resolve
                          </Button>
                        ) : (
                          <Typography variant="caption" color="text.secondary">Resolved</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </Box>
  )
}

export default ReportsLogs
