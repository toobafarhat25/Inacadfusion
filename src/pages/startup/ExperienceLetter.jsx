import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Breadcrumbs,
  Link,
  Divider,
} from '@mui/material'
import { Download, Description, NavigateNext } from '@mui/icons-material'
import Snackbar from '../../components/shared/Snackbar'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// ─── PREMIUM STARTUP WORKSPACE STYLES ───────────────────────────────────────
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

.vx-card {
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}
.vx-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px 0 rgba(0, 0, 0, 0.08);
}

.vx-btn-mustard {
  background: #FFC107 !important;
  color: #000000 !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  padding: 12px 28px !important;
  text-transform: none !important;
  font-family: 'Public Sans', 'Inter', sans-serif !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 12px rgba(255,193,7, 0.3) !important;
}
.vx-btn-mustard:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255,193,7, 0.4) !important;
}
.vx-btn-mustard:disabled {
  background: #F1F5F9 !important;
  color: #94A3B8 !important;
  box-shadow: none !important;
  transform: none !important;
}

.vx-input-clean .MuiOutlinedInput-root {
  background: #FFFFFF;
  border-radius: 12px;
  color: #111111;
}
.vx-input-clean .MuiOutlinedInput-notchedOutline {
  border-color: #E2E8F0;
}
.vx-input-clean .Mui-focused .MuiOutlinedInput-notchedOutline {
  border-color: #FFC107 !important;
}
.vx-input-clean .MuiInputLabel-root {
  color: #64748B;
}

/* Beautiful Breadcrumb Styling */
.pd-breadcrumb-text {
  font-family: 'Public Sans', 'Inter', sans-serif !important;
  font-size: 0.9rem !important;
  color: #6B7280 !important;
  font-weight: 500 !important;
}

/* Premium Certificate Preview Frame */
.cert-frame {
  background: #FCFBF7;
  border: 2px solid #E6D2B5;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}
.cert-frame::before {
  content: '';
  position: absolute;
  top: 8px; left: 8px; right: 8px; bottom: 8px;
  border: 1px dashed #D4AF37;
  border-radius: 8px;
  pointer-events: none;
}
`

const ExperienceLetter = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  
  const [completedCollaborations, setCompletedCollaborations] = useState([])
  const [selectedCollaboration, setSelectedCollaboration] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
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
    const fetchCollabs = async () => {
      try {
        const res = await api.get('/collaborations')
        setCompletedCollaborations(res.data.data.filter(c => c.status === 'completed'))
      } catch (err) {
        console.error('Failed to fetch collaborations', err)
      }
    }
    if (user) fetchCollabs()
  }, [user])

  const handleDownload = async () => {
    if (!selectedCollaboration) {
      setSnackbar({
        open: true,
        message: 'Please select a collaboration',
        severity: 'warning',
      })
      return
    }

    setLoading(true)
    try {
      const collab = completedCollaborations.find(c => c._id === selectedCollaboration)
      const res = await api.post('/experience-letters/generate', {
        collaborationId: collab._id,
        performanceRating: 10,
        remarks: summary || `Outstanding technical contribution on the project: ${collab.projectId?.title}`
      })
      setSnackbar({
        open: true,
        message: 'Experience letter created successfully! Hash: ' + res.data.data.verificationHash,
        severity: 'success',
      })
      // Clear selected collaboration
      setSelectedCollaboration('')
      setSummary('')
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to generate experience letter.',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const currentCollab = completedCollaborations.find(c => c._id === selectedCollaboration)

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

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header & Breadcrumbs */}
            <Box sx={{ mb: 4 }}>
              <Typography className="vx-text-heading" sx={{ fontWeight: 800, fontSize: '2.5rem', color: '#111111', letterSpacing: '-0.02em', mb: 1 }}>
                Issue Experience Letter
              </Typography>
              <Breadcrumbs 
                separator={<NavigateNext fontSize="small" sx={{ color: '#94A3B8' }} />} 
                sx={{ mb: 3 }}
              >
                <Link 
                  underline="hover" 
                  color="inherit" 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); navigate('/startup/dashboard'); }}
                  className="pd-breadcrumb-text"
                >
                  Dashboard
                </Link>
                <Typography className="pd-breadcrumb-text" sx={{ color: '#111111 !important', fontWeight: 700 }}>
                  Experience Letters
                </Typography>
              </Breadcrumbs>
              <Typography sx={{ color: '#64748B', fontWeight: 500, fontSize: '1.05rem' }}>
                Create and issue cryptographically-secured experience credentials for student partners who have completed all project milestones.
              </Typography>
            </Box>

            <Card className="vx-card">
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <FormControl fullWidth sx={{ mb: 4 }} className="vx-input-clean">
                  <InputLabel>Select Student Partner</InputLabel>
                  <Select
                    value={selectedCollaboration}
                    label="Select Student Partner"
                    onChange={(e) => setSelectedCollaboration(e.target.value)}
                    sx={{ borderRadius: '10px' }}
                  >
                    {completedCollaborations.length === 0 ? (
                      <MenuItem disabled value="">
                        No completed collaborations available
                      </MenuItem>
                    ) : (
                      completedCollaborations.map((collab) => (
                        <MenuItem key={collab._id} value={collab._id}>
                          {collab.studentId?.name || 'Student'} — {collab.projectId?.title || 'Project'}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Project Testimonial & Achievements"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  multiline
                  rows={4}
                  placeholder="Summarize the student's responsibilities, achievements, and unique value contributed during this collaboration..."
                  className="vx-input-clean"
                  sx={{ mb: 4 }}
                />

                {/* Premium Live Certificate Preview */}
                {selectedCollaboration && currentCollab && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Box className="cert-frame" sx={{ mb: 4, p: { xs: 4, md: 6 } }}>
                      <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        {/* Premium Logo Header */}
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <Typography 
                            sx={{ 
                              fontFamily: '"Inter", sans-serif', 
                              fontWeight: 900, 
                              fontSize: '1.8rem', 
                              color: '#111111', 
                              letterSpacing: '-0.04em' 
                            }}
                          >
                            InAcad
                          </Typography>
                          <Typography 
                            sx={{ 
                              fontFamily: '"Inter", sans-serif', 
                              fontWeight: 900, 
                              fontSize: '1.8rem', 
                              background: 'linear-gradient(135deg, #FFC107 0%, #F59E0B 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              letterSpacing: '-0.04em'
                            }}
                          >
                            Fusion
                          </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: '"Cinzel", "Playfair Display", serif', fontWeight: 800, fontSize: '1.75rem', color: '#111111', mb: 1, letterSpacing: '0.05em' }}>
                          LETTER OF EXPERIENCE
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.15em', mb: 4, textTransform: 'uppercase' }}>
                          InAcadFusion Verified Credential
                        </Typography>
                        
                        <Typography sx={{ fontSize: '1rem', color: '#64748B', fontStyle: 'italic', mb: 1.5 }}>
                          This is proudly presented to
                        </Typography>
                        
                        <Typography sx={{ fontWeight: 850, fontSize: '1.8rem', color: '#FFC107', mb: 2, fontFamily: 'Inter, sans-serif' }}>
                          {currentCollab.studentId?.name || 'Student Partner'}
                        </Typography>
                        
                        <Typography sx={{ fontSize: '1rem', color: '#64748B', maxWidth: '550px', mx: 'auto', lineHeight: 1.6, mb: 3 }}>
                          for successfully completing a high-impact collaboration on the project
                          <span style={{ display: 'block', fontWeight: 800, color: '#111111', marginTop: '8px', fontSize: '1.15rem', fontStyle: 'normal' }}>
                            "{currentCollab.projectId?.title || 'Project title'}"
                          </span>
                        </Typography>

                        <Divider sx={{ my: 3, borderColor: '#E6D2B5', maxWidth: '300px', mx: 'auto' }} />

                        {summary && (
                          <Typography sx={{ fontSize: '0.9rem', color: '#475569', maxWidth: '600px', mx: 'auto', lineHeight: 1.7, fontStyle: 'italic', mb: 3 }}>
                            "{summary}"
                          </Typography>
                        )}
                        
                        <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                          Authorized by: {user?.name || 'Startup organization'}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleDownload}
                  disabled={loading || !selectedCollaboration}
                  className="vx-btn-mustard"
                >
                  {loading ? 'Issuing Certificate...' : 'Generate & Issue Experience Letter'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
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

export default ExperienceLetter
