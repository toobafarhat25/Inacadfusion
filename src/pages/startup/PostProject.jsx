import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  Divider,
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  RocketLaunch, 
  Code, 
  Psychology, 
  Description, 
  Business,
  ArrowForward
} from '@mui/icons-material'
import Snackbar from '../../components/shared/Snackbar'
import api from '../../utils/api'

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
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.04);
  overflow: hidden;
  padding: 40px;
  position: relative;
  z-index: 2;
}

.vx-section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-size: 1.25rem;
  color: #111111;
  margin-bottom: 24px;
}

.vx-field-label {
  font-weight: 700;
  font-size: 0.85rem;
  color: #4B465C;
  margin-bottom: 8px;
  display: block;
}

.vx-input .MuiOutlinedInput-root {
  border-radius: 12px;
  background: #F8F9FA;
  transition: all 0.2s;
}
.vx-input .MuiOutlinedInput-root:hover,
.vx-input .MuiOutlinedInput-root.Mui-focused {
  background: #FFFFFF;
}

.vx-btn-mustard {
  background: #FFC107 !important;
  color: #000 !important;
  font-weight: 800 !important;
  border-radius: 12px !important;
  text-transform: none !important;
  padding: 14px !important;
  box-shadow: 0 4px 12px rgba(255,193,7,0.3) !important;
  transition: all 0.2s ease !important;
}
.vx-btn-mustard:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255,193,7,0.4) !important;
}

.vx-chip-skill {
  background: rgba(115, 103, 240, 0.1) !important;
  color: #7367F0 !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
}

.vx-chip-tech {
  background: rgba(40, 199, 111, 0.1) !important;
  color: #28C76F !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
}
`

const PostProject = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isEdit = location.state?.editMode || false
  const pData = location.state?.project || null
  const canvasRef = useRef(null)

  const [formData, setFormData] = useState({
    title: pData?.title || '',
    description: pData?.description || '',
    domain: pData?.domain || '',
    requiredSkills: pData?.requiredSkills || [],
    technologies: pData?.technologies || [],
  })
  const [newSkill, setNewSkill] = useState('')
  const [newTech, setNewTech] = useState('')
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

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleAddSkill = () => {
    if (newSkill && !formData.requiredSkills.includes(newSkill)) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, newSkill],
      })
      setNewSkill('')
    }
  }

  const handleAddTech = () => {
    if (newTech && !formData.technologies.includes(newTech)) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTech],
      })
      setNewTech('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('domain', formData.domain)
      formData.requiredSkills.forEach(s => data.append('requiredSkills[]', s))
      formData.technologies.forEach(t => data.append('technologies[]', t))

      if (isEdit) {
        await api.put(`/projects/${pData._id}`, data)
        setSnackbar({ open: true, message: 'Project updated successfully!', severity: 'success' })
      } else {
        await api.post('/projects', data)
        // Refresh AI worker if needed
        try { await api.post('/ai/refresh'); } catch(e) {}
        setSnackbar({ open: true, message: 'Project posted successfully!', severity: 'success' })
      }
      setTimeout(() => navigate('/startup/manage-projects'), 1000)
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to post project.', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '2.5rem', color: '#111111', letterSpacing: '-0.02em', mb: 1 }}>
                {isEdit ? 'Edit Project' : 'Post New Project'}
              </Typography>
              <Typography sx={{ color: '#4B465C', fontWeight: 500, fontSize: '1.1rem' }}>
                {isEdit ? 'Update your project specifications.' : 'Define your vision and discover the perfect student partners.'}
              </Typography>
            </Box>

            <div className="vx-card">
              <Box component="form" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="vx-section-title">
                  <Description sx={{ color: '#FFC107', fontSize: 28 }} /> Project Vision
                </div>
                <Grid container spacing={3} sx={{ mb: 5 }}>
                  <Grid item xs={12}>
                    <span className="vx-field-label">Project Title</span>
                    <TextField
                      fullWidth variant="outlined" className="vx-input"
                      placeholder="e.g. Next-Gen Decentralized Marketplace"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <span className="vx-field-label">Domain</span>
                    <TextField
                      fullWidth variant="outlined" className="vx-input"
                      placeholder="e.g. Artificial Intelligence, Fintech"
                      value={formData.domain}
                      onChange={(e) => handleChange('domain', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <span className="vx-field-label">Project Description</span>
                    <TextField
                      fullWidth variant="outlined" className="vx-input" multiline rows={6}
                      placeholder="Describe the opportunity, goals, and what you expect from student collaborators..."
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>

                {/* Talent Requirements */}
                <div className="vx-section-title">
                  <Psychology sx={{ color: '#FFC107', fontSize: 28 }} /> Talent Requirements
                </div>
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {formData.requiredSkills.map((skill) => (
                      <Chip
                        key={skill} label={skill} className="vx-chip-skill"
                        onDelete={() => setFormData({...formData, requiredSkills: formData.requiredSkills.filter(s => s !== skill)})}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      variant="outlined" className="vx-input" size="small" sx={{ flexGrow: 1 }}
                      placeholder="Add required skill (e.g. Problem Solving)"
                      value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button variant="contained" onClick={handleAddSkill} sx={{ background: '#111111', color: '#FFF', borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>Add</Button>
                  </Box>
                </Box>

                {/* Tech Stack */}
                <div className="vx-section-title">
                  <Code sx={{ color: '#FFC107', fontSize: 28 }} /> Desired Technologies
                </div>
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {formData.technologies.map((tech) => (
                      <Chip
                        key={tech} label={tech} className="vx-chip-tech"
                        onDelete={() => setFormData({...formData, technologies: formData.technologies.filter(t => t !== tech)})}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      variant="outlined" className="vx-input" size="small" sx={{ flexGrow: 1 }}
                      placeholder="Add tech stack (e.g. Python, AWS)"
                      value={newTech} onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    />
                    <Button variant="contained" onClick={handleAddTech} sx={{ background: '#111111', color: '#FFF', borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>Add</Button>
                  </Box>
                </Box>

                <Button
                  type="submit" fullWidth variant="contained" disabled={loading}
                  className="vx-btn-mustard" endIcon={!loading && <RocketLaunch />}
                  sx={{ mt: 2 }}
                >
                  {loading ? (isEdit ? 'Updating...' : 'Publishing...') : (isEdit ? 'Save Changes' : 'Launch Project Idea')}
                </Button>
              </Box>
            </div>
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

export default PostProject

