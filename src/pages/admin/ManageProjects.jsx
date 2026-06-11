import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip,
  IconButton, Tooltip, CircularProgress, Container
} from '@mui/material'
import { Delete, ManageAccounts } from '@mui/icons-material'
import api from '../../utils/api'
import Snackbar from '../../components/shared/Snackbar'

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
.adm-badge {
  font-weight: 700;
  border-radius: 6px;
  font-size: 0.65rem;
  padding: 4px 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
`

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return { bg: '#ECFDF5', color: '#065F46' }
    case 'pending': return { bg: '#FFFBEB', color: '#B45309' }
    default: return { bg: '#F3F4F6', color: '#4B5563' }
  }
}

const ManageProjects = () => {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`)
      setProjects(projects.filter(p => p._id !== id))
      setSnackbar({ open: true, message: 'Project deleted successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete project', severity: 'error' })
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
                Manage Projects
              </Typography>
              <Typography sx={{ color: '#6B7280', fontSize: '0.95rem', mt: 1 }}>
                Monitor and manage all activities across the platform.
              </Typography>
            </Box>
          </motion.div>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box sx={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', px: 3, py: 2, minWidth: 160 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#111827', lineHeight: 1 }}>{projects.length}</Typography>
              <Typography sx={{ fontWeight: 500, fontSize: '0.75rem', color: '#6B7280', mt: 0.3 }}>Total Projects</Typography>
            </Box>
          </Box>

          <div className="adm-card">
            <TableContainer>
              <Table>
                <TableHead className="adm-table-head">
                  <TableRow>
                    <TableCell>Project Identity</TableCell>
                    <TableCell>Uploader</TableCell>
                    <TableCell>Domain</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Controls</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#9CA3AF', fontSize: '0.9rem' }}>
                        No projects found.
                      </TableCell>
                    </TableRow>
                  ) : projects.map((project, i) => {
                    const statusSty = getStatusColor(project.status)
                    return (
                      <motion.tr
                        key={project._id}
                        className="adm-table-row"
                        component={TableRow}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <TableCell>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>
                            {project.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ManageAccounts sx={{ fontSize: 16, color: '#FFC107' }} />
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                              {project.uploadedBy?.name || 'InAcad User'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{project.domain || '—'}</TableCell>
                        <TableCell>
                          <Chip
                            label={project.type === 'student_fyp' ? 'Student FYP' : 'Startup Idea'}
                            size="small"
                            sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: '6px', background: '#F3F4F6' }}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="adm-badge" style={{ backgroundColor: statusSty.bg, color: statusSty.color }}>
                            {project.status}
                          </span>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete Project">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(project._id)}
                              sx={{ background: '#FFF1F2', color: '#E11D48', borderRadius: '8px', '&:hover': { background: '#E11D48', color: '#fff' } }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </motion.tr>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Container>
      </Box>
      <Snackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </>
  )
}

export default ManageProjects
