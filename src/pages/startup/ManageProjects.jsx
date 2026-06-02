import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button
} from '@mui/material'
import { 
  Edit, 
  Delete, 
  People, 
  Add,
  ArrowForward,
  Info,
  RocketLaunch
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../../components/shared/EmptyState'
import Snackbar from '../../components/shared/Snackbar'
import api from '../../utils/api'
import { createSlug } from '../../utils/slugify'
import { useAuth } from '../../context/AuthContext'
import { ProjectCardSkeleton } from '../../components/shared/SkeletonLoader'

const STYLES = `
.vx-root {
  font-family: 'Public Sans', 'Inter', system-ui, sans-serif;
  background: #F8F8F9;
  min-height: 100vh;
  color: #4B465C;
}

/* Typography Overrides */
.vx-text-heading {
  color: #2F2B3D;
  font-weight: 600;
}
.vx-text-body {
  color: #4B465C;
}
.vx-text-muted {
  color: #A5A3AE;
}

/* Base Card Style */
.vx-card {
  background: #FFFFFF;
  border-radius: 6px;
  box-shadow: 0 2px 6px 0 rgba(47, 43, 61, 0.12);
  transition: all 0.25s ease-in-out;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.vx-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 18px 0 rgba(47, 43, 61, 0.15);
}

.vx-card-header {
  padding: 24px 24px 0 24px;
}
.vx-card-body {
  padding: 24px;
  flex-grow: 1;
}
.vx-card-footer {
  padding: 16px 24px;
  border-top: 1px solid #EBEBEF;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Badges */
.vx-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
}

/* Buttons */
.vx-btn-primary {
  background-color: #FFC107 !important;
  color: #000000 !important;
  font-weight: 600 !important;
  border-radius: 6px !important;
  box-shadow: 0 2px 4px 0 rgba(255,193,7, 0.4) !important;
  text-transform: none !important;
  padding: 8px 20px !important;
  transition: all 0.2s ease-in-out !important;
}
.vx-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px 0 rgba(255,193,7, 0.45) !important;
}

.vx-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 193, 7, 0.16);
  color: #FFC107;
}

/* Action Icons */
.vx-action-btn {
  background: transparent !important;
  color: #4B465C !important;
  border-radius: 6px !important;
  padding: 6px !important;
  transition: all 0.2s ease-in-out !important;
}
.vx-action-btn:hover {
  background: rgba(47, 43, 61, 0.06) !important;
}
.vx-action-btn.delete:hover {
  background: rgba(234, 84, 85, 0.16) !important;
  color: #EA5455 !important;
}
`

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return { bg: 'rgba(40, 199, 111, 0.16)', color: '#28C76F' }
    case 'pending': return { bg: 'rgba(255, 159, 67, 0.16)', color: '#FF9F43' }
    default: return { bg: 'rgba(75, 70, 92, 0.16)', color: '#4B465C' }
  }
}

const ManageProjects = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, projectId: null })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  useEffect(() => {
    const loadProjects = async () => {
      if (!user) return;
      try {
        const res = await api.get('/projects/my-projects')
        setProjects(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [user])

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${deleteDialog.projectId}`)
      setProjects(projects.filter((p) => p._id !== deleteDialog.projectId))
      setDeleteDialog({ open: false, projectId: null })
      setSnackbar({ open: true, message: 'Project deleted successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete project', severity: 'error' })
    }
  }

  if (loading) return <Box className="vx-root" sx={{ pt: 12, px: 3 }}><Container maxWidth="lg"><ProjectCardSkeleton /></Container></Box>

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="vx-root" sx={{ pt: { xs: 12, md: 14 }, px: { xs: 2, md: 3 }, pb: 8 }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3, mb: 4 }}>
              <Box>
                <Typography variant="h4" className="vx-text-heading" sx={{ mb: 1, fontSize: '1.75rem' }}>
                  Manage Projects
                </Typography>
                <Typography className="vx-text-muted">
                  Review your project opportunities and collaboration requests.
                </Typography>
              </Box>
              <Button
                variant="contained" startIcon={<Add />}
                onClick={() => navigate('/startup/post-project')}
                className="vx-btn-primary"
              >
                Post New Project
              </Button>
            </Box>
          </motion.div>

          {projects.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="vx-card" style={{ padding: '40px', alignItems: 'center', textAlign: 'center' }}>
                <EmptyState
                  icon="projects"
                  title="Your project board is empty"
                  message="Post your first project to start finding talented students."
                  actionLabel="Post Project"
                  onAction={() => navigate('/startup/post-project')}
                />
              </div>
            </motion.div>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {projects.map((project, index) => {
                  const statusSty = getStatusColor(project.status)
                  return (
                    <Grid item xs={12} md={6} key={project._id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        style={{ height: '100%' }}
                      >
                        <div className="vx-card">
                          <div className="vx-card-header">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div className="vx-icon-box">
                                <RocketLaunch sx={{ fontSize: 20 }} />
                              </div>
                              <span className="vx-badge" style={{ backgroundColor: statusSty.bg, color: statusSty.color }}>
                                {project.status}
                              </span>
                            </Box>
                          </div>
                          
                          <div className="vx-card-body">
                            <Typography className="vx-text-heading" sx={{ fontSize: '1.2rem', mb: 1.5, lineHeight: 1.4 }}>
                              {project.title}
                            </Typography>
                            
                            <Typography className="vx-text-body" sx={{ fontSize: '0.9rem', mb: 3, lineHeight: 1.6 }}>
                              {project.description.length > 140 ? project.description.substring(0, 140) + '...' : project.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {project.requiredSkills.slice(0, 3).map((skill) => (
                                <Chip 
                                  key={skill} label={skill} size="small" 
                                  sx={{ 
                                    fontWeight: 600, 
                                    fontSize: '0.75rem', 
                                    color: '#7367F0', 
                                    background: 'rgba(115, 103, 240, 0.16)',
                                    borderRadius: '4px',
                                    border: 'none'
                                  }} 
                                />
                              ))}
                            </Box>
                          </div>
                          
                          <div className="vx-card-footer">
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton 
                                className="vx-action-btn"
                                onClick={() => navigate(`/startup/project/${project._id}/applicants`)}
                                title="View Applicants"
                              >
                                <People fontSize="small" />
                              </IconButton>
                              <IconButton 
                                className="vx-action-btn"
                                onClick={() => navigate('/startup/post-project', { state: { editMode: true, project } })}
                                title="Edit Project"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton 
                                className="vx-action-btn delete"
                                onClick={() => setDeleteDialog({ open: true, projectId: project._id })}
                                title="Delete Project"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                            <Button 
                              endIcon={<ArrowForward sx={{ fontSize: 16 }} />} 
                              sx={{ 
                                fontWeight: 600, 
                                fontSize: '0.85rem', 
                                color: '#FFC107', 
                                textTransform: 'none',
                                '&:hover': { background: 'rgba(255, 193, 7, 0.08)' },
                                borderRadius: '6px'
                              }}
                              onClick={() => navigate(`/student/project/${createSlug(project.title, project._id)}`)}
                            >
                              Explore
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </Grid>
                  )
                })}
              </AnimatePresence>
            </Grid>
          )}
        </Container>
      </Box>

      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, projectId: null })}
        PaperProps={{ 
          sx: { 
            borderRadius: '6px', 
            boxShadow: '0 4px 18px 0 rgba(47, 43, 61, 0.15)',
            background: '#FFFFFF'
          } 
        }}
      >
        <DialogTitle className="vx-text-heading" sx={{ fontSize: '1.25rem' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography className="vx-text-body" sx={{ fontSize: '0.95rem' }}>
            Are you sure you want to delete this project? This will also remove any pending collaboration requests. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDeleteDialog({ open: false, projectId: null })} sx={{ color: '#A5A3AE', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleDelete} sx={{ background: '#EA5455', color: '#FFF', fontWeight: 600, borderRadius: '6px', textTransform: 'none', px: 3, '&:hover': { background: '#DE4436' } }}>Delete Project</Button>
        </DialogActions>
      </Dialog>

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
