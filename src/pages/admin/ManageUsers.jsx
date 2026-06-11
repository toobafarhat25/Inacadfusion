import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip,
  IconButton, Tabs, Tab, CircularProgress, Avatar
} from '@mui/material'
import { Delete, Person, Business } from '@mui/icons-material'
import Snackbar from '../../components/shared/Snackbar'
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

const ManageUsers = () => {
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [students, setStudents] = useState([])
  const [startups, setStartups] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  useEffect(() => {
    api.get('/admin/users')
      .then(res => {
        const allUsers = res.data.data
        setStudents(allUsers.filter(u => u.role === 'student'))
        setStartups(allUsers.filter(u => u.role === 'startup'))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      if (type === 'student') setStudents(s => s.filter(u => u._id !== id))
      else setStartups(s => s.filter(u => u._id !== id))
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' })
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' })
    }
  }

  const renderTable = (users, type) => (
    <div className="adm-card">
      <TableContainer>
        <Table>
          <TableHead className="adm-table-head">
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>{type === 'student' ? 'Academic Background' : 'Industry Domain'}</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#9CA3AF', fontSize: '0.9rem' }}>
                  No {type}s found.
                </TableCell>
              </TableRow>
            ) : users.map((user, i) => (
              <motion.tr
                key={user._id}
                className="adm-table-row"
                component={TableRow}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#FFC107', color: '#000', fontSize: '0.8rem', fontWeight: 700 }}>
                      {user.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{type === 'student' ? (user.profileDetails?.academicBackground || '—') : (user.profileDetails?.industryDomain || '—')}</TableCell>
                <TableCell>
                  <Chip label="Active" size="small" sx={{ background: '#ECFDF5', color: '#065F46', fontWeight: 700, fontSize: '0.68rem', borderRadius: '6px' }} />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleDelete(user._id, type)}
                    sx={{ background: '#FFF1F2', color: '#E11D48', borderRadius: '8px', '&:hover': { background: '#E11D48', color: '#fff' } }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="adm-root" sx={{ pt: { xs: 9, md: 10 }, px: { xs: 2, md: 3 }, pb: 6 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
              Administration
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.8rem', md: '2.2rem' }, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Manage Users
            </Typography>
            <Typography sx={{ color: '#6B7280', fontSize: '0.95rem', mt: 1 }}>
              View and manage all registered students and startups on the platform.
            </Typography>
          </Box>
        </motion.div>

        {/* Stats Row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Students', value: students.length, icon: <Person sx={{ fontSize: 18, color: '#FFC107' }} />, bg: '#FFFBEB', border: '#FDE68A' },
            { label: 'Total Startups', value: startups.length, icon: <Business sx={{ fontSize: 18, color: '#FFC107' }} />, bg: '#FFFBEB', border: '#FDE68A' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Box sx={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '12px', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 160 }}>
                {s.icon}
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#111827', lineHeight: 1 }}>{s.value}</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.75rem', color: '#6B7280', mt: 0.3 }}>{s.label}</Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab} onChange={(_, v) => setTab(v)}
          sx={{
            mb: 2.5,
            '& .MuiTab-root': { fontFamily: '"Inter", system-ui', fontWeight: 600, fontSize: '0.85rem', textTransform: 'none', color: '#6B7280' },
            '& .Mui-selected': { color: '#B45309' },
            '& .MuiTabs-indicator': { backgroundColor: '#FFC107', height: 3, borderRadius: '2px' },
          }}
        >
          <Tab label={`Students (${students.length})`} />
          <Tab label={`Startups (${startups.length})`} />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#FFC107' }} />
          </Box>
        ) : (
          <>
            {tab === 0 && renderTable(students, 'student')}
            {tab === 1 && renderTable(startups, 'startup')}
          </>
        )}
      </Box>
      <Snackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </>
  )
}

export default ManageUsers
