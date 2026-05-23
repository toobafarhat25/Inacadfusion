import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Chip,
  IconButton,
  Button,
  Grid,
} from '@mui/material'
import { 
  Delete, 
  Visibility, 
  Upload,
  Work,
  Code,
  Domain
} from '@mui/icons-material'
import api from '../../utils/api'
import Snackbar from '../../components/shared/Snackbar'
import { useAuth } from '../../context/AuthContext'
import { ProjectCardSkeleton } from '../../components/shared/SkeletonLoader'
import EmptyState from '../../components/shared/EmptyState'

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
  padding: 24px;
  margin-bottom: 16px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 20px;
}
.vx-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  border-color: #FFC107;
}

.vx-icon-box {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: #FFF8E1;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.vx-btn-mustard {
  background: #FFC107 !important;
  color: #000 !important;
  font-weight: 800 !important;
  border-radius: 12px !important;
  text-transform: none !important;
  padding: 10px 24px !important;
}

.vx-status-badge {
  font-weight: 700;
  border-radius: 8px;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
`

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return { bg: '#E6F9EE', color: '#28C76F' }
    case 'pending': return { bg: '#FFF8E1', color: '#FF9F43' }
    default: return { bg: '#F1F1F1', color: '#82868B' }
  }
}

const StudentManageProjects = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await api.get('/projects/my-projects')
        setProjects(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (user) loadProjects()
  }, [user])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      setProjects(projects.filter((p) => p._id !== id))
      setSnackbar({ open: true, message: 'Project deleted successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to delete project', severity: 'error' })
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
                  My Portfolio
                </Typography>
                <Typography sx={{ color: 'rgba(0,0,0,0.5)', fontWeight: 500 }}>
                  Manage your uploaded projects and track their visibility.
                </Typography>
              </Box>
              <Button
                variant="contained" startIcon={<Upload />}
                onClick={() => navigate('/student/upload-project')}
                className="vx-btn-mustard"
              >
                Upload New Project
              </Button>
            </Box>
          </motion.div>

          <AnimatePresence>
            {projects.length === 0 ? (
              <EmptyState
                icon="folder"
                title="Your portfolio is empty"
                message="Showcase your talent by uploading your first project!"
              />
            ) : (
              projects.map((project, index) => {
                const statusStyle = getStatusColor(project.status)
                return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="vx-card">
                      <div className="vx-icon-box">
                        <Work sx={{ color: '#FFC107' }} />
                      </div>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A202C' }}>
                            {project.title}
                          </Typography>
                          <Chip 
                            label={project.status} size="small" 
                            className="vx-status-badge"
                            sx={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Domain sx={{ fontSize: 14, color: 'rgba(0,0,0,0.3)' }} />
                            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>{project.domain}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Code sx={{ fontSize: 14, color: 'rgba(0,0,0,0.3)' }} />
                            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>
                              {project.technologies?.slice(0, 3).join(' · ')}
                              {project.technologies?.length > 3 && ` +${project.technologies.length-3}`}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          sx={{ background: '#F8F9FA', color: '#1A202C', '&:hover': { background: '#FFF8E1', color: '#FFC107' } }} 
                          onClick={() => navigate(`/student/project/${project._id}`)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton 
                          sx={{ background: '#FFF5F5', color: '#E53E3E', '&:hover': { background: '#FED7D7' } }}
                          onClick={() => handleDelete(project._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
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

export default StudentManageProjects
