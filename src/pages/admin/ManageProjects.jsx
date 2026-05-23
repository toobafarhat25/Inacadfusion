import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import { CheckCircle, Delete, ManageAccounts, Search, FilterList } from '@mui/icons-material'
import api from '../../utils/api'
import Snackbar from '../../components/shared/Snackbar'
import { ProjectCardSkeleton } from '../../components/shared/SkeletonLoader'

const STYLES = `

.vx-root {
  font-family: 'Inter', system-ui, sans-serif;
  background: #F4F5FA;
  min-height: 100vh;
  color: #2D3748;
}

.vx-card {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.04);
  overflow: hidden;
}

.vx-table-head {
  background: #F8F9FA;
}

.vx-table-head .MuiTableCell-root {
  font-weight: 800;
  color: rgba(0,0,0,0.4);
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  border-bottom: 2px solid rgba(0,0,0,0.05);
}

.vx-table-row {
  transition: background 0.2s;
}
.vx-table-row:hover {
  background: #FDFDFD;
}

.vx-table-cell {
  padding: 16px 24px !important;
  border-bottom: 1px solid rgba(0,0,0,0.03) !important;
}

.vx-badge {
  font-weight: 700;
  border-radius: 8px;
  font-size: 0.7rem;
  padding: 4px 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
`

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return { bg: '#E6F9EE', color: '#28C76F' }
    case 'pending': return { bg: '#FFF8E1', color: '#FF9F43' }
    default: return { bg: '#F1F1F1', color: '#82868B' }
  }
}

const ManageProjects = () => {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await api.get('/projects')
        setProjects(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this project?")) return;
      await api.delete(`/projects/${id}`)
      setProjects(projects.filter(p => p._id !== id))
      setSnackbar({ open: true, message: 'Project deleted successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete project', severity: 'error' })
    }
  }

  if (loading) return <Box className="vx-root" sx={{ pt: 12, px: 3 }}><Container maxWidth="lg"><ProjectCardSkeleton /></Container></Box>

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="vx-root" sx={{ pt: 12, px: { xs: 2, md: 3 }, pb: 8 }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '2rem', color: '#1A202C', letterSpacing: '-0.02em', mb: 1 }}>
                  Global Project Oversight
                </Typography>
                <Typography sx={{ color: 'rgba(0,0,0,0.5)', fontWeight: 500 }}>
                  Monitor and manage all activities across the InAcadFusion platform.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton sx={{ background: '#FFF', borderRadius: '12px' }}><Search /></IconButton>
                <IconButton sx={{ background: '#FFF', borderRadius: '12px' }}><FilterList /></IconButton>
              </Box>
            </Box>
          </motion.div>

          <div className="vx-card">
            <TableContainer>
              <Table>
                <TableHead className="vx-table-head">
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
                  {projects.map((project) => {
                    const statusSty = getStatusColor(project.status)
                    return (
                      <TableRow key={project._id} className="vx-table-row">
                        <TableCell className="vx-table-cell">
                          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A202C' }}>
                            {project.title}
                          </Typography>
                        </TableCell>
                        <TableCell className="vx-table-cell">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ManageAccounts sx={{ fontSize: 16, color: '#FFC107' }} />
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                              {project.uploadedBy?.name || 'InAcad User'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell className="vx-table-cell">
                          <Typography sx={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.6)' }}>{project.domain}</Typography>
                        </TableCell>
                        <TableCell className="vx-table-cell">
                          <Chip
                            label={project.type === 'student_fyp' ? 'Student FYP' : 'Startup Idea'}
                            size="small"
                            sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: '6px' }}
                          />
                        </TableCell>
                        <TableCell className="vx-table-cell">
                          <span className="vx-badge" style={{ backgroundColor: statusSty.bg, color: statusSty.color }}>
                            {project.status}
                          </span>
                        </TableCell>
                        <TableCell className="vx-table-cell" align="right">
                          <Tooltip title="Delete Project">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(project._id)}
                              sx={{ background: '#FFF5F5', color: '#E53E3E', '&:hover': { background: '#E53E3E', color: '#FFF' } }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Container>
      </Box>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  )
}

export default ManageProjects
