import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Grid,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Divider,
  Stack
} from '@mui/material'
import { 
  ArrowBack,
  Work, 
  Description,
  FolderZip,
  PictureAsPdf,
  Image as ImageIcon,
  Code,
  NavigateNext,
  CheckCircleOutline,
  Close,
  Person,
  Mail,
  CalendarToday,
  Business
} from '@mui/icons-material'
import Snackbar from '../../components/shared/Snackbar'
import api from '../../utils/api'
import { DashboardSkeleton as PageLoader } from '../../components/shared/SkeletonLoader'
import { API_BASE_URL } from '../../utils/api'

const STYLES = `
.pd-root {
  font-family: 'Public Sans', 'Inter', system-ui, sans-serif;
  background: #FFFFFF;
  min-height: 100vh;
  padding-top: 140px;
  padding-bottom: 80px;
  color: #111111;
  position: relative;
  overflow: hidden;
  background-size: 80px 80px;
  background-image: 
    linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
}

.pd-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* ── HERO BANNER CARD ── */
.pd-hero-card {
  background: #111111;
  border-radius: 24px; /* More rounded and cozy */
  padding: 48px;
  color: #FFFFFF;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
.pd-hero-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  mask-image: linear-gradient(to bottom, black 50%, transparent);
  pointer-events: none;
}
.pd-hero-gradient {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 60%);
  filter: blur(80px);
  pointer-events: none;
}

.pd-back-btn {
  color: rgba(255, 255, 255, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(4px);
  text-transform: none !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  padding: 6px 16px !important;
  margin-bottom: 24px !important;
  transition: all 0.2s !important;
}
.pd-back-btn:hover {
  color: #FFC107 !important;
  border-color: #FFC107 !important;
  background: rgba(255, 193, 7, 0.05) !important;
}

.pd-breadcrumb-text {
  color: rgba(255, 255, 255, 0.5) !important;
  font-size: 0.85rem !important;
  font-weight: 500;
  text-decoration: none;
}
.pd-breadcrumb-text:hover {
  color: #FFC107 !important;
}
.pd-breadcrumb-text.active {
  color: #FFC107 !important;
  font-weight: 600;
}

.pd-hero-category {
  color: #FFC107;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 12px;
  display: inline-block;
}
.pd-hero-title {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  margin-bottom: 20px;
}
.pd-hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.pd-hero-chip {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
  border-radius: 6px !important;
  font-size: 0.8rem !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* ── CONTENT CONTAINER ── */
.pd-content-card {
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #EBEBEF;
  padding: 36px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  margin-bottom: 24px;
}

.pd-section-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #111111;
  margin-bottom: 20px;
  letter-spacing: -0.01em;
}

.pd-description-text {
  color: #555555;
  font-size: 0.975rem;
  line-height: 1.75;
  white-space: pre-wrap;
}

/* ── SIDEBAR CARDS ── */
.pd-sidebar-card {
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #EBEBEF;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  margin-bottom: 24px;
}

.pd-price-display {
  font-size: 2rem;
  font-weight: 800;
  color: #111111;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.pd-price-subtitle {
  font-size: 0.85rem;
  color: #555555;
  font-weight: 600;
  margin-bottom: 24px;
}

.pd-action-btn-primary {
  background: #111111 !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
  text-transform: none !important;
  font-size: 0.95rem !important;
  padding: 12px 24px !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.25s ease !important;
  width: 100%;
}
.pd-action-btn-primary:hover {
  background: #FFC107 !important;
  color: #111111 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.3) !important;
}

.pd-action-btn-disabled {
  background: #E2E8F0 !important;
  color: #94A3B8 !important;
  font-weight: 700 !important;
  text-transform: none !important;
  font-size: 0.95rem !important;
  padding: 12px 24px !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  width: 100%;
}

.pd-profile-avatar {
  background: rgba(255, 193, 7, 0.15) !important;
  color: #D97706 !important;
  font-weight: 800 !important;
  font-size: 1.1rem !important;
  width: 48px !important;
  height: 48px !important;
  border-radius: 12px !important;
}

.pd-profile-name {
  font-weight: 800;
  font-size: 0.95rem;
  color: #111111;
  margin-bottom: 2px;
}
.pd-profile-role {
  font-size: 0.8rem;
  color: #555555;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── CHIPS ── */
.pd-tag-chip {
  background: #F9F9F9 !important;
  color: #555555 !important;
  font-weight: 600 !important;
  font-size: 0.825rem !important;
  border-radius: 6px !important;
  border: 1px solid #EBEBEF !important;
}

/* ── FILE ITEM ── */
.pd-file-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #EBEBEF;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  background: #FFF;
  transition: all 0.25s ease;
}
.pd-file-link:hover {
  border-color: #FFC107;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03);
}

/* ── TABS ── */
.pd-tabs-bar {
  border-bottom: 1px solid #EBEBEF;
  margin-bottom: 24px;
}
.pd-tab-item {
  font-size: 0.9rem !important;
  text-transform: none !important;
  font-weight: 700 !important;
  color: #555555 !important;
  min-width: auto !important;
  padding: 12px 24px !important;
}
.pd-tab-item.Mui-selected {
  color: #111111 !important;
}

/* ── ANIMATED BACKGROUND DECORATIONS ── */

/* Keyframes */
@keyframes pd-float-blob {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
  50% { transform: translateY(-30px) scale(1.05); opacity: 1; }
}
@keyframes pd-line-sweep {
  0% { transform: translateX(-100%) rotate(-30deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(200vw) rotate(-30deg); opacity: 0; }
}
@keyframes pd-ring-pulse {
  0%, 100% { transform: scale(1); opacity: 0.06; }
  50% { transform: scale(1.15); opacity: 0.12; }
}
@keyframes pd-drift {
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(20px, -15px) rotate(120deg); }
  66% { transform: translate(-15px, 20px) rotate(240deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
}

/* Glowing blobs - darker and larger */
.pd-bg-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(60px);
}
.pd-bg-blob-1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.08) 0%, transparent 70%);
  top: -150px; right: -200px;
  animation: pd-float-blob 9s ease-in-out infinite;
}
.pd-bg-blob-2 {
  width: 550px; height: 550px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.08) 0%, transparent 70%);
  bottom: 100px; left: -180px;
  animation: pd-float-blob 12s ease-in-out infinite reverse;
}
.pd-bg-blob-3 {
  width: 450px; height: 450px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.06) 0%, transparent 70%);
  top: 45%; left: 35%;
  animation: pd-float-blob 7s ease-in-out infinite 2s;
}
.pd-bg-blob-4 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.06) 0%, transparent 70%);
  top: 20%; left: -100px;
  animation: pd-float-blob 15s ease-in-out infinite 4s;
}
.pd-bg-blob-5 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, transparent 70%);
  bottom: -50px; right: 10%;
  animation: pd-float-blob 10s ease-in-out infinite 1s;
}

/* Sweeping lines - darker and more of them */
.pd-bg-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.pd-bg-line {
  position: absolute;
  width: 2px;
  height: 260px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.18), transparent);
  animation: pd-line-sweep 8s linear infinite;
  top: -50px;
}
.pd-bg-line:nth-child(1)  { left: 5%;  animation-delay: 0s;   animation-duration: 10s; height: 200px; }
.pd-bg-line:nth-child(2)  { left: 15%; animation-delay: 1.5s; animation-duration: 14s; height: 280px; }
.pd-bg-line:nth-child(3)  { left: 25%; animation-delay: 4s;   animation-duration: 9s;  height: 200px; }
.pd-bg-line:nth-child(4)  { left: 35%; animation-delay: 2.5s; animation-duration: 13s; height: 240px; }
.pd-bg-line:nth-child(5)  { left: 45%; animation-delay: 6s;   animation-duration: 11s; height: 180px; }
.pd-bg-line:nth-child(6)  { left: 55%; animation-delay: 3s;   animation-duration: 9s;  height: 260px; }
.pd-bg-line:nth-child(7)  { left: 65%; animation-delay: 0.5s; animation-duration: 12s; height: 220px; }
.pd-bg-line:nth-child(8)  { left: 75%; animation-delay: 5s;   animation-duration: 15s; height: 200px; }
.pd-bg-line:nth-child(9)  { left: 85%; animation-delay: 2s;   animation-duration: 10s; height: 300px; }
.pd-bg-line:nth-child(10) { left: 95%; animation-delay: 7s;   animation-duration: 13s; height: 160px; }

/* Decorative rings - darker and more */
.pd-bg-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  animation: pd-ring-pulse 6s ease-in-out infinite;
}
.pd-bg-ring-1 {
  width: 700px; height: 700px;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  top: -250px; right: -250px;
  animation-delay: 0s;
}
.pd-bg-ring-2 {
  width: 500px; height: 500px;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  top: -150px; right: -150px;
  animation-delay: 1s;
}
.pd-bg-ring-3 {
  width: 350px; height: 350px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  top: -80px; right: -80px;
  animation-delay: 2s;
}
.pd-bg-ring-4 {
  width: 500px; height: 500px;
  border: 1.5px solid rgba(0, 0, 0, 0.07);
  bottom: 0px; left: -200px;
  animation-delay: 3s;
}
.pd-bg-ring-5 {
  width: 300px; height: 300px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  bottom: 80px; left: -100px;
  animation-delay: 4s;
}
.pd-bg-ring-6 {
  width: 400px; height: 400px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  top: 40%; left: 55%;
  animation-delay: 2.5s;
}

/* Small drifting diamond shapes - more and darker */
.pd-bg-diamond {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #111111;
  opacity: 0.12;
  transform: rotate(45deg);
  pointer-events: none;
  z-index: 0;
  animation: pd-drift 15s ease-in-out infinite;
}
.pd-bg-diamond.gold { background: #FFC107; opacity: 0.2; }
.pd-bg-diamond:nth-child(1)  { top: 10%; left: 4%;  animation-duration: 18s; animation-delay: 0s;  width: 12px; height: 12px; }
.pd-bg-diamond:nth-child(2)  { top: 30%; left: 93%; animation-duration: 22s; animation-delay: 3s;  }
.pd-bg-diamond:nth-child(3)  { top: 55%; left: 6%;  animation-duration: 16s; animation-delay: 6s;  width: 8px;  height: 8px;  }
.pd-bg-diamond:nth-child(4)  { top: 80%; left: 82%; animation-duration: 20s; animation-delay: 9s;  }
.pd-bg-diamond:nth-child(5)  { top: 20%; left: 48%; animation-duration: 25s; animation-delay: 2s;  width: 7px;  height: 7px;  }
.pd-bg-diamond:nth-child(6)  { top: 65%; left: 72%; animation-duration: 19s; animation-delay: 5s;  width: 14px; height: 14px; }
.pd-bg-diamond:nth-child(7)  { top: 42%; left: 25%; animation-duration: 23s; animation-delay: 8s;  width: 6px;  height: 6px;  }
.pd-bg-diamond:nth-child(8)  { top: 88%; left: 40%; animation-duration: 17s; animation-delay: 1s;  }
.pd-bg-diamond:nth-child(9)  { top: 15%; left: 78%; animation-duration: 21s; animation-delay: 4s;  width: 9px;  height: 9px;  }
.pd-bg-diamond:nth-child(10) { top: 72%; left: 18%; animation-duration: 24s; animation-delay: 7s;  width: 11px; height: 11px; }
`

const getFileIcon = (filename) => {
  if (!filename) return <Description />;
  const ext = filename.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return <PictureAsPdf sx={{ color: '#EF4444' }} />;
  if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) return <ImageIcon sx={{ color: '#10B981' }} />;
  if (['zip', 'rar'].includes(ext)) return <FolderZip sx={{ color: '#F59E0B' }} />;
  return <Description sx={{ color: '#6366F1' }} />;
};

const ProjectDetails = () => {
  const { slugId } = useParams()
  // Support both legacy URLs (just ID) and new SEO URLs (slug-id)
  const id = slugId?.includes('-') ? slugId.split('-').pop() : slugId
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const [successModal, setSuccessModal] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [activeThumb, setActiveThumb] = useState(0)
  
  const canvasRef = useRef(null)

  // Particle background logic for cozy ambient feel
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
    
    // Increased particles for a richer, premium feel
    const particleCount = 120
    const particles = []
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4, // slower movement
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
          : (scrollFactor > 0.3 ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.15)')
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
  }, []) // Canvas is always in DOM now, so [] is fine

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`)
        setProject(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  const handleApply = async () => {
    try {
      await api.post('/collaborations', { projectId: id })
      setSuccessModal(true)
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send request. Please try again.',
        severity: 'error',
      })
    }
  }

  if (!loading && !project) return (
    <Box className="pd-root" sx={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>Project not found</Typography>
    </Box>
  )

  const isStartup = project?.uploadedBy?.role === 'startup'
  const uploaderName = project?.uploadedBy?.name || (isStartup ? 'Startup' : 'Student')
  const initials = uploaderName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) || 'U'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="pd-root" sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Canvas particles - always in DOM */}
        <canvas ref={canvasRef} className="pd-canvas" />

        {/* CSS-animated background decorations */}
        {/* Glowing blobs x5 */}
        <div className="pd-bg-blob pd-bg-blob-1" />
        <div className="pd-bg-blob pd-bg-blob-2" />
        <div className="pd-bg-blob pd-bg-blob-3" />
        <div className="pd-bg-blob pd-bg-blob-4" />
        <div className="pd-bg-blob pd-bg-blob-5" />

        {/* Sweeping vertical lines x10 */}
        <div className="pd-bg-lines">
          <div className="pd-bg-line" />
          <div className="pd-bg-line" />
          <div className="pd-bg-line" />
          <div className="pd-bg-line" />
          <div className="pd-bg-line" />
          <div className="pd-bg-line" />
          <div className="pd-bg-line" />
          <div className="pd-bg-line" />
          <div className="pd-bg-line" />
          <div className="pd-bg-line" />
        </div>

        {/* Pulsing rings x6 */}
        <div className="pd-bg-ring pd-bg-ring-1" />
        <div className="pd-bg-ring pd-bg-ring-2" />
        <div className="pd-bg-ring pd-bg-ring-3" />
        <div className="pd-bg-ring pd-bg-ring-4" />
        <div className="pd-bg-ring pd-bg-ring-5" />
        <div className="pd-bg-ring pd-bg-ring-6" />

        {/* Drifting diamonds x10 — alternating dark/gold */}
        <div className="pd-bg-diamond" />
        <div className="pd-bg-diamond gold" />
        <div className="pd-bg-diamond" />
        <div className="pd-bg-diamond gold" />
        <div className="pd-bg-diamond" />
        <div className="pd-bg-diamond gold" />
        <div className="pd-bg-diamond" />
        <div className="pd-bg-diamond gold" />
        <div className="pd-bg-diamond" />
        <div className="pd-bg-diamond gold" />

        {loading ? (
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <PageLoader />
          </Container>
        ) : project && (
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* ══════ HERO BANNER CARD ══════ */}
          <Box className="pd-hero-card">
            <div className="pd-hero-gradient" />
            <Button 
              startIcon={<ArrowBack />} 
              className="pd-back-btn"
              onClick={() => navigate('/student/browse-projects')}
            >
              Back to Projects
            </Button>
            
            <Box>
              <span className="pd-hero-category">{project.domain}</span>
              <Typography variant="h1" className="pd-hero-title">
                {project.title}
              </Typography>
              
              <Box className="pd-hero-meta">
                <Breadcrumbs 
                  separator={<NavigateNext fontSize="small" sx={{ color: 'rgba(255,255,255,0.3)' }} />} 
                >
                  <Link 
                    underline="hover" 
                    onClick={(e) => { e.preventDefault(); navigate('/student/browse-projects'); }}
                    className="pd-breadcrumb-text"
                  >
                    Projects
                  </Link>
                  <Typography className="pd-breadcrumb-text active">
                    Details
                  </Typography>
                </Breadcrumbs>
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.15)', mx: 2 }} />
                <Chip
                  label={isStartup ? 'Startup Project' : 'Student Project'}
                  size="small"
                  className="pd-hero-chip"
                />
              </Box>
            </Box>
          </Box>

          <Grid container spacing={4}>
            
            {/* ══════ LEFT COLUMN (MAIN CONTENT) ══════ */}
            <Grid item xs={12} md={8}>
              <Box className="pd-content-card">
                <Box className="pd-tabs-bar">
                  <Tabs 
                    value={activeTab} 
                    onChange={(e, v) => setActiveTab(v)}
                    TabIndicatorProps={{ style: { backgroundColor: '#FFC107', height: '3px' } }}
                  >
                    <Tab label="Description" className="pd-tab-item" disableRipple />
                    <Tab label="Attached Files" className="pd-tab-item" disableRipple />
                  </Tabs>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {activeTab === 0 && (
                    <Typography className="pd-description-text">
                      {project.description}
                    </Typography>
                  )}
                  {activeTab === 1 && (
                    <Box>
                      {project.files && project.files.length > 0 ? (
                        <Grid container spacing={2}>
                          {project.files.map((file, i) => {
                            const filename = file.split('/').pop() || `Attachment ${i + 1}`
                            return (
                              <Grid item xs={12} sm={6} key={i}>
                                <a 
                                  href={`${API_BASE_URL}${file}`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="pd-file-link"
                                >
                                  <Box sx={{ background: '#F1F5F9', p: 1.5, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {getFileIcon(filename)}
                                  </Box>
                                  <Box sx={{ overflow: 'hidden' }}>
                                    <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                      {filename}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                                      Download File
                                    </Typography>
                                  </Box>
                                </a>
                              </Grid>
                            )
                          })}
                        </Grid>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography sx={{ color: '#64748B', fontWeight: 600 }}>No files attached to this project.</Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Required Skills Section */}
              {project.requiredSkills?.length > 0 && (
                <Box className="pd-content-card">
                  <Typography className="pd-section-title">Required Skills</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {project.requiredSkills.map((skill) => (
                      <Chip key={skill} label={skill} className="pd-tag-chip" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Technologies Section */}
              {project.technologies?.length > 0 && (
                <Box className="pd-content-card">
                  <Typography className="pd-section-title">Technologies</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {project.technologies.map((tech) => (
                      <Chip key={tech} label={tech} className="pd-tag-chip" />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>

            {/* ══════ RIGHT COLUMN (SIDEBAR) ══════ */}
            <Grid item xs={12} md={4}>
              {/* Budget CTA Card */}
              <Box className="pd-sidebar-card">
                <Typography className="pd-price-display">
                  {project.cost || 'Negotiable'}
                </Typography>
                <Typography className="pd-price-subtitle">
                  ESTIMATED BUDGET
                </Typography>
                
                {user?._id !== project.uploadedBy?._id && user?.role !== 'admin' ? (
                  <Button
                    className="pd-action-btn-primary"
                    onClick={handleApply}
                    fullWidth
                  >
                    Request Collaboration
                  </Button>
                ) : user?._id === project.uploadedBy?._id ? (
                  <Button
                    className="pd-action-btn-primary"
                    onClick={() => navigate(`/student/edit-project/${project._id}`)}
                    fullWidth
                  >
                    Edit Project
                  </Button>
                ) : (
                  <Button
                    className="pd-action-btn-disabled"
                    disabled
                    fullWidth
                  >
                    Collaboration Disabled
                  </Button>
                )}
              </Box>

              {/* Uploader Profile Card */}
              <Box className="pd-sidebar-card">
                <Typography className="pd-section-title" sx={{ mb: 3 }}>Posted By</Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar className="pd-profile-avatar">{initials}</Avatar>
                  <Box>
                    <Typography className="pd-profile-name">{uploaderName}</Typography>
                    <Typography className="pd-profile-role">{isStartup ? 'Startup Partner' : 'Student Builder'}</Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Mail sx={{ fontSize: 18, color: '#64748B' }} />
                    <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {project.uploadedBy?.email || 'No email shared'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CalendarToday sx={{ fontSize: 18, color: '#64748B' }} />
                    <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                      Posted {new Date(project.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>

        </Container>
        )} {/* end loading/project conditional */}
      </Box>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />

      <Dialog 
        open={successModal} 
        onClose={() => setSuccessModal(false)}
        PaperProps={{
          style: { 
            borderRadius: '24px', 
            padding: '24px', 
            maxWidth: '420px', 
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            fontFamily: '"Inter", system-ui, sans-serif'
          }
        }}
      >
        <IconButton 
          onClick={() => setSuccessModal(false)} 
          sx={{ position: 'absolute', right: 12, top: 12, color: '#9CA3AF', background: '#F9FAFB', '&:hover': { background: '#F3F4F6' } }}
        >
          <Close />
        </IconButton>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3, pb: 1 }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <CheckCircleOutline sx={{ fontSize: 48, color: '#10B981' }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#111827', mb: 1, letterSpacing: '-0.02em' }}>
            Request Sent!
          </Typography>
          <Typography sx={{ color: '#6B7280', fontSize: '0.95rem', lineHeight: 1.6, mb: 4, px: 2 }}>
            Your collaboration request has been successfully dispatched. We'll notify you via the real-time alert system once it's reviewed.
          </Typography>
          <Button 
            variant="contained" 
            fullWidth
            onClick={() => navigate(user?.role === 'startup' ? '/startup/collaborations' : '/student/collaborations')}
            sx={{ 
              background: '#FFC107', 
              color: '#111827', 
              fontWeight: 800, 
              py: 1.5, 
              borderRadius: '30px',
              textTransform: 'none', 
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(255, 193, 7, 0.3)',
              '&:hover': { background: '#F59E0B' }
            }}
          >
            Manage Collaborations
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProjectDetails
