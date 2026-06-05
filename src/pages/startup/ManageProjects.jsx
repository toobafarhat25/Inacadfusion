import React, { useState, useEffect, useRef } from 'react'
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
  background: #FFFFFF;
  min-height: 100vh;
  color: #111111;
  position: relative;
  overflow: hidden;
  padding-top: 140px;
  padding-bottom: 100px;
  /* Grid lines in background */
  background-size: 80px 80px;
  background-image: 
    linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
}

.vx-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* ── ANIMATED BACKGROUND DECORATIONS ── */
@keyframes vx-float-blob {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
  50% { transform: translateY(-30px) scale(1.05); opacity: 1; }
}
@keyframes vx-line-sweep {
  0% { transform: translateX(-100%) rotate(-30deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(200vw) rotate(-30deg); opacity: 0; }
}

.vx-bg-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(60px);
}
.vx-bg-blob-1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.06) 0%, transparent 70%);
  top: -150px; right: -200px;
  animation: vx-float-blob 9s ease-in-out infinite;
}
.vx-bg-blob-2 {
  width: 550px; height: 550px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.08) 0%, transparent 70%);
  bottom: 100px; left: -180px;
  animation: vx-float-blob 12s ease-in-out infinite reverse;
}

.vx-bg-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.vx-bg-line {
  position: absolute;
  width: 2px;
  height: 260px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.15), transparent);
  animation: vx-line-sweep 8s linear infinite;
  top: -50px;
}
.vx-bg-line:nth-child(1)  { left: 15%; animation-delay: 1.5s; animation-duration: 14s; height: 280px; }
.vx-bg-line:nth-child(2)  { left: 45%; animation-delay: 6s;   animation-duration: 11s; height: 180px; }
.vx-bg-line:nth-child(3)  { left: 85%; animation-delay: 2s;   animation-duration: 10s; height: 300px; }

/* Typography Overrides */
.vx-text-heading {
  color: #111111;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.vx-text-body {
  color: #4B465C;
}
.vx-text-muted {
  color: #6C6A75;
}

/* Base Card Style */
.vx-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 2;
}
.vx-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px 0 rgba(0, 0, 0, 0.08);
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
  font-weight: 700 !important;
  border-radius: 10px !important;
  box-shadow: 0 4px 12px rgba(255,193,7, 0.3) !important;
  text-transform: none !important;
  padding: 10px 24px !important;
  transition: all 0.2s ease-in-out !important;
  z-index: 2;
}
.vx-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255,193,7, 0.4) !important;
}

.vx-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
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
  border-radius: 8px !important;
  padding: 8px !important;
  transition: all 0.2s ease-in-out !important;
}
.vx-action-btn:hover {
  background: rgba(47, 43, 61, 0.08) !important;
  color: #111111 !important;
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
  const canvasRef = useRef(null)
  
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, projectId: null })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  // ─── INTERACTIVE PARTICLES HOOK ───
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    
    const mouse = { x: null, y: null, active: false }
    const handleMouseMove = (e) => {
      mouse.x = e.pageX
      mouse.y = e.pageY
      mouse.active = true
    }
    const handleMouseLeave = () => {
      mouse.active = false
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    
    const particleCount = 100
    const particles = []
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      })
    }
    
    let scrollY = window.scrollY
    const handleScroll = () => {
      scrollY = window.scrollY
    }
    window.addEventListener('scroll', handleScroll)
    
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      
      const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const scrollFactor = scrollY / scrollMax
      
      particles.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy
        
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
        
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 400) {
            const force = (400 - dist) * 0.0018
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
            
            if (dist < 40) {
              p.vx *= 0.85
              p.vy *= 0.85
            } else {
              p.vx *= 0.94
              p.vy *= 0.94
            }
          }
        }
        
        if (scrollFactor > 0.1) {
          particles.forEach((other, oIdx) => {
            if (idx === oIdx) return
            const dx = other.x - p.x
            const dy = other.y - p.y
            const dist = Math.sqrt(dx*dx + dy*dy)
            
            if (dist < 200 && dist > 20) {
              const force = (200 - dist) * 0.00002 * scrollFactor
              p.vx += (dx / dist) * force
              p.vy += (dy / dist) * force
              
              const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy)
              if (speed > 1.5) {
                p.vx = (p.vx / speed) * 1.5
                p.vy = (p.vy / speed) * 1.5
              }
            }
          })
        }
        
        const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy)
        const maxSpeed = mouse.active ? 4.5 : 1.5
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed
          p.vy = (p.vy / speed) * maxSpeed
        }
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = mouse.active && Math.sqrt((mouse.x - p.x)**2 + (mouse.y - p.y)**2) < 250
          ? 'rgba(255, 193, 7, 0.8)'
          : (scrollFactor > 0.3 ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.12)')
        ctx.fill()
      })
      
      const lineMaxDist = 100 + scrollFactor * 100
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const p1 = particles[i]
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          
          if (dist < lineMaxDist) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            
            const isNearMouse = mouse.active && 
              Math.sqrt((mouse.x - p1.x)**2 + (mouse.y - p1.y)**2) < 200 &&
              Math.sqrt((mouse.x - p2.x)**2 + (mouse.y - p2.y)**2) < 200
            
            const alpha = (1 - dist / lineMaxDist) * 0.3
            ctx.strokeStyle = isNearMouse
              ? `rgba(255, 193, 7, ${alpha * 2.5})`
              : `rgba(0, 0, 0, ${alpha * 1.2})`
            ctx.lineWidth = isNearMouse 
              ? 1.2 + (scrollFactor * 0.5)
              : 0.8 + (scrollFactor * 0.5)
            ctx.stroke()
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

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
      <Box className="vx-root">
        {/* Background Effects */}
        <div className="vx-bg-blob vx-bg-blob-1" />
        <div className="vx-bg-blob vx-bg-blob-2" />
        <div className="vx-bg-lines">
          <div className="vx-bg-line" />
          <div className="vx-bg-line" />
          <div className="vx-bg-line" />
        </div>
        
        {/* Canvas for Particles */}
        <canvas ref={canvasRef} className="vx-canvas" />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3, mb: 6 }}>
              <Box>
                <Typography variant="h3" className="vx-text-heading" sx={{ mb: 1.5, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  Manage Projects
                </Typography>
                <Typography className="vx-text-muted" sx={{ fontSize: '1.1rem' }}>
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
              <div className="vx-card" style={{ padding: '60px 40px', alignItems: 'center', textAlign: 'center' }}>
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
                    <Grid item xs={12} md={6} lg={4} key={project._id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        style={{ height: '100%' }}
                      >
                        <div className="vx-card">
                          <div className="vx-card-header">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div className="vx-icon-box">
                                <RocketLaunch sx={{ fontSize: 24 }} />
                              </div>
                              <span className="vx-badge" style={{ backgroundColor: statusSty.bg, color: statusSty.color }}>
                                {project.status}
                              </span>
                            </Box>
                          </div>
                          
                          <div className="vx-card-body">
                            <Typography className="vx-text-heading" sx={{ fontSize: '1.25rem', mb: 1.5, lineHeight: 1.4 }}>
                              {project.title}
                            </Typography>
                            
                            <Typography className="vx-text-body" sx={{ fontSize: '0.95rem', mb: 3, lineHeight: 1.6 }}>
                              {project.description.length > 120 ? project.description.substring(0, 120) + '...' : project.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {project.requiredSkills.slice(0, 3).map((skill) => (
                                <Chip 
                                  key={skill} label={skill} size="small" 
                                  sx={{ 
                                    fontWeight: 700, 
                                    fontSize: '0.75rem', 
                                    color: '#7367F0', 
                                    background: 'rgba(115, 103, 240, 0.1)',
                                    borderRadius: '6px',
                                    border: 'none'
                                  }} 
                                />
                              ))}
                              {project.requiredSkills.length > 3 && (
                                <Chip 
                                  label={`+${project.requiredSkills.length - 3}`} size="small" 
                                  sx={{ 
                                    fontWeight: 700, 
                                    fontSize: '0.75rem', 
                                    color: '#A5A3AE', 
                                    background: 'rgba(165, 163, 174, 0.1)',
                                    borderRadius: '6px',
                                    border: 'none'
                                  }} 
                                />
                              )}
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
                              endIcon={<ArrowForward sx={{ fontSize: 18 }} />} 
                              sx={{ 
                                fontWeight: 700, 
                                fontSize: '0.9rem', 
                                color: '#111111', 
                                textTransform: 'none',
                                '&:hover': { background: 'transparent', color: '#FFC107' },
                                padding: 0
                              }}
                              onClick={() => navigate(`/student/project/${createSlug(project.title, project._id)}`)}
                              disableRipple
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
            borderRadius: '12px', 
            boxShadow: '0 8px 30px 0 rgba(0, 0, 0, 0.15)',
            background: '#FFFFFF',
            maxWidth: '400px'
          } 
        }}
      >
        <DialogTitle className="vx-text-heading" sx={{ fontSize: '1.25rem', pt: 3, px: 3 }}>Confirm Deletion</DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Typography className="vx-text-body" sx={{ fontSize: '0.95rem' }}>
            Are you sure you want to delete this project? This will also remove any pending collaboration requests. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDeleteDialog({ open: false, projectId: null })} sx={{ color: '#6C6A75', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleDelete} sx={{ background: '#EA5455', color: '#FFF', fontWeight: 600, borderRadius: '8px', textTransform: 'none', px: 3, '&:hover': { background: '#DE4436' } }}>Delete Project</Button>
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
