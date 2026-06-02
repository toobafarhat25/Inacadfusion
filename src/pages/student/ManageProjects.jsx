import React, { useState, useEffect, useRef } from 'react'
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
  Domain,
  Edit
} from '@mui/icons-material'
import api from '../../utils/api'
import Snackbar from '../../components/shared/Snackbar'
import { useAuth } from '../../context/AuthContext'
import { ProjectCardSkeleton } from '../../components/shared/SkeletonLoader'
import EmptyState from '../../components/shared/EmptyState'
import { createSlug } from '../../utils/slugify'

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
@keyframes vx-ring-pulse {
  0%, 100% { transform: scale(1); opacity: 0.06; }
  50% { transform: scale(1.15); opacity: 0.12; }
}
@keyframes vx-drift {
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(20px, -15px) rotate(120deg); }
  66% { transform: translate(-15px, 20px) rotate(240deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
}

/* Glowing blobs - darker and larger */
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
.vx-bg-blob-3 {
  width: 450px; height: 450px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, transparent 70%);
  top: 45%; left: 35%;
  animation: vx-float-blob 7s ease-in-out infinite 2s;
}
.vx-bg-blob-4 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.06) 0%, transparent 70%);
  top: 20%; left: -100px;
  animation: vx-float-blob 15s ease-in-out infinite 4s;
}
.vx-bg-blob-5 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.04) 0%, transparent 70%);
  bottom: -50px; right: 10%;
  animation: vx-float-blob 10s ease-in-out infinite 1s;
}

/* Sweeping lines */
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
.vx-bg-line:nth-child(1)  { left: 5%;  animation-delay: 0s;   animation-duration: 10s; height: 200px; }
.vx-bg-line:nth-child(2)  { left: 15%; animation-delay: 1.5s; animation-duration: 14s; height: 280px; }
.vx-bg-line:nth-child(3)  { left: 25%; animation-delay: 4s;   animation-duration: 9s;  height: 200px; }
.vx-bg-line:nth-child(4)  { left: 35%; animation-delay: 2.5s; animation-duration: 13s; height: 240px; }
.vx-bg-line:nth-child(5)  { left: 45%; animation-delay: 6s;   animation-duration: 11s; height: 180px; }
.vx-bg-line:nth-child(6)  { left: 55%; animation-delay: 3s;   animation-duration: 9s;  height: 260px; }
.vx-bg-line:nth-child(7)  { left: 65%; animation-delay: 0.5s; animation-duration: 12s; height: 220px; }
.vx-bg-line:nth-child(8)  { left: 75%; animation-delay: 5s;   animation-duration: 15s; height: 200px; }
.vx-bg-line:nth-child(9)  { left: 85%; animation-delay: 2s;   animation-duration: 10s; height: 300px; }
.vx-bg-line:nth-child(10) { left: 95%; animation-delay: 7s;   animation-duration: 13s; height: 160px; }

/* Decorative rings */
.vx-bg-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  animation: vx-ring-pulse 6s ease-in-out infinite;
}
.vx-bg-ring-1 {
  width: 700px; height: 700px;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  top: -250px; right: -250px;
  animation-delay: 0s;
}
.vx-bg-ring-2 {
  width: 500px; height: 500px;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  top: -150px; right: -150px;
  animation-delay: 1s;
}
.vx-bg-ring-3 {
  width: 350px; height: 350px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  top: -80px; right: -80px;
  animation-delay: 2s;
}
.vx-bg-ring-4 {
  width: 500px; height: 500px;
  border: 1.5px solid rgba(0, 0, 0, 0.07);
  bottom: 0px; left: -200px;
  animation-delay: 3s;
}
.vx-bg-ring-5 {
  width: 300px; height: 300px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  bottom: 80px; left: -100px;
  animation-delay: 4s;
}

/* Small drifting diamond shapes */
.vx-bg-diamond {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #111111;
  opacity: 0.12;
  transform: rotate(45deg);
  pointer-events: none;
  z-index: 0;
  animation: vx-drift 15s ease-in-out infinite;
}
.vx-bg-diamond.gold { background: #FFC107; opacity: 0.2; }
.vx-bg-diamond:nth-child(1)  { top: 10%; left: 4%;  animation-duration: 18s; animation-delay: 0s;  width: 12px; height: 12px; }
.vx-bg-diamond:nth-child(2)  { top: 30%; left: 93%; animation-duration: 22s; animation-delay: 3s;  }
.vx-bg-diamond:nth-child(3)  { top: 55%; left: 6%;  animation-duration: 16s; animation-delay: 6s;  width: 8px;  height: 8px;  }
.vx-bg-diamond:nth-child(4)  { top: 80%; left: 82%; animation-duration: 20s; animation-delay: 9s;  }
.vx-bg-diamond:nth-child(5)  { top: 20%; left: 48%; animation-duration: 25s; animation-delay: 2s;  width: 7px;  height: 7px;  }
.vx-bg-diamond:nth-child(6)  { top: 65%; left: 72%; animation-duration: 19s; animation-delay: 5s;  width: 14px; height: 14px; }
.vx-bg-diamond:nth-child(7)  { top: 42%; left: 25%; animation-duration: 23s; animation-delay: 8s;  width: 6px;  height: 6px;  }

/* ── PORTFOLIO CARDS ── */

.vx-card {
  background: #FFFFFF;
  border-radius: 24px; /* Curved and cozy */
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
  border-left: 6px solid #111111; /* Sleek dark-mode style left accent */
  overflow: hidden;
  padding: 30px;
  margin-bottom: 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
  z-index: 2;
}
.vx-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
  border-left-color: #FFC107; /* Swaps to mustard accent on hover */
}

.vx-icon-box {
  width: 56px; height: 56px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0,0,0,0.05);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: #111111;
  transition: all 0.3s ease;
}
.vx-card:hover .vx-icon-box {
  background: rgba(255, 193, 7, 0.1);
  color: #FFC107;
  border-color: rgba(255, 193, 7, 0.2);
}

.vx-btn-mustard {
  background: #111111 !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
  border-radius: 12px !important;
  text-transform: none !important;
  padding: 12px 28px !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05) !important;
  transition: all 0.2s ease !important;
}
.vx-btn-mustard:hover {
  background: #FFC107 !important;
  color: #111111 !important;
  box-shadow: 0 10px 20px rgba(255, 193, 7, 0.25) !important;
}

.vx-status-badge {
  font-weight: 700;
  border-radius: 20px;
  font-size: 0.68rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 4px 12px;
}
`

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return { bg: 'rgba(40, 199, 111, 0.1)', color: '#28C76F' }
    case 'pending': return { bg: 'rgba(255, 159, 67, 0.1)', color: '#FF9F43' }
    default: return { bg: '#F1F1F1', color: '#82868B' }
  }
}

const StudentManageProjects = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const canvasRef = useRef(null)

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

  // Clean Scroll-Reactive & Mouse-Attracted Connection Particles
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
        
        // Mouse Attraction & Merging Logic
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 400) {
            // Accelerate towards mouse position
            const force = (400 - dist) * 0.0018
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
            
            // Slow down and merge beautifully when very close to cursor
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
        
        // Speed cap for general smoothness
        const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy)
        const maxSpeed = mouse.active ? 4.5 : 1.5
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed
          p.vy = (p.vy / speed) * maxSpeed
        }
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = mouse.active && Math.sqrt((mouse.x - p.x)**2 + (mouse.y - p.y)**2) < 250
          ? 'rgba(255, 193, 7, 0.8)' // turns beautiful mustard yellow near cursor
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
            
            // Check if connection is near mouse to glow yellow
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

  if (loading) {
    return (
      <Box className="vx-root" sx={{ pt: 12, px: 3 }}>
        <Container maxWidth="lg">
          <ProjectCardSkeleton />
        </Container>
      </Box>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="vx-root" sx={{ px: { xs: 2, md: 3 }, pb: 8 }}>
        {/* Connection Network Particles */}
        <canvas ref={canvasRef} className="vx-canvas" />

        {/* Decorative elements */}
        <div className="vx-bg-blob vx-bg-blob-1" />
        <div className="vx-bg-blob vx-bg-blob-2" />
        <div className="vx-bg-blob vx-bg-blob-3" />
        <div className="vx-bg-blob vx-bg-blob-4" />
        <div className="vx-bg-blob vx-bg-blob-5" />

        <div className="vx-bg-lines">
          <div className="vx-bg-line" />
          <div className="vx-bg-line" />
          <div className="vx-bg-line" />
          <div className="vx-bg-line" />
          <div className="vx-bg-line" />
          <div className="vx-bg-line" />
          <div className="vx-bg-line" />
          <div className="vx-bg-line" />
          <div className="vx-bg-line" />
          <div className="vx-bg-line" />
        </div>

        <div className="vx-bg-ring vx-bg-ring-1" />
        <div className="vx-bg-ring vx-bg-ring-2" />
        <div className="vx-bg-ring vx-bg-ring-3" />
        <div className="vx-bg-ring vx-bg-ring-4" />
        <div className="vx-bg-ring vx-bg-ring-5" />

        <div className="vx-bg-diamond" />
        <div className="vx-bg-diamond gold" />
        <div className="vx-bg-diamond" />
        <div className="vx-bg-diamond gold" />
        <div className="vx-bg-diamond" />
        <div className="vx-bg-diamond gold" />
        <div className="vx-bg-diamond" />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3, mb: 6 }}>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '2.5rem', color: '#111111', letterSpacing: '-0.04em', mb: 1, lineHeight: 1.1 }}>
                  My Portfolio
                </Typography>
                <Typography sx={{ color: 'rgba(0,0,0,0.5)', fontWeight: 500, fontSize: '1.05rem' }}>
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
                        <Work />
                      </div>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 0.8 }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#111111', letterSpacing: '-0.02em' }}>
                            {project.title}
                          </Typography>
                          <Chip 
                            label={project.status} size="small" 
                            className="vx-status-badge"
                            sx={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <Domain sx={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }} />
                            <Typography sx={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)', fontWeight: 700 }}>
                              {project.domain}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <Code sx={{ fontSize: 16, color: 'rgba(0,0,0,0.4)' }} />
                            <Typography sx={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)', fontWeight: 700 }}>
                              {project.technologies?.slice(0, 4).join(' · ')}
                              {project.technologies?.length > 4 && ` +${project.technologies.length-4}`}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <IconButton 
                          sx={{ background: 'rgba(0,0,0,0.03)', color: '#111111', border: '1px solid rgba(0,0,0,0.05)', '&:hover': { background: '#111111', color: '#FFFFFF' } }} 
                          onClick={() => navigate(`/student/project/${createSlug(project.title, project._id)}`)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton 
                          sx={{ background: 'rgba(25, 118, 210, 0.04)', color: '#1976D2', border: '1px solid rgba(25, 118, 210, 0.08)', '&:hover': { background: '#1976D2', color: '#FFFFFF' } }} 
                          onClick={() => navigate(`/student/edit-project/${project._id}`)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          sx={{ background: 'rgba(211, 47, 47, 0.04)', color: '#D32F2F', border: '1px solid rgba(211, 47, 47, 0.08)', '&:hover': { background: '#D32F2F', color: '#FFFFFF' } }}
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

export default StudentManageProjects;
