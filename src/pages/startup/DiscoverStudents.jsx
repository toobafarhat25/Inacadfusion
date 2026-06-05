import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material'
import { 
  Search, 
  ArrowForward,
  AutoAwesome,
  Domain,
  PersonOutline,
  LaptopMac,
  SmartToy,
  DeveloperMode,
  BarChart,
  Settings,
  School,
  Layers,
  Code
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { DashboardSkeleton as ProjectCardSkeleton } from '../../components/shared/SkeletonLoader'
import EmptyState from '../../components/shared/EmptyState'
import api from '../../utils/api'

const STYLES = `
.vx-root {
  font-family: 'Inter', system-ui, sans-serif;
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

/* Floating Tech Nodes */
.vx-floating-node {
  position: absolute;
  padding: 10px 18px;
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #EBEBEF;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  font-weight: 700;
  color: #111111;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 2;
  user-select: none;
}
.vx-floating-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FFC107;
}

/* Hero elements */
.vx-hero-section {
  text-align: center;
  padding-top: 40px;
  padding-bottom: 60px;
  position: relative;
  z-index: 2;
}

.vx-hero-title {
  font-size: 3.2rem !important;
  font-weight: 900 !important;
  letter-spacing: -0.03em !important;
  line-height: 1.15 !important;
  color: #111111;
  margin-bottom: 20px !important;
}

.vx-hero-title span {
  background: linear-gradient(135deg, #FFC107 0%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.vx-hero-desc {
  font-size: 1.1rem !important;
  color: #555555;
  max-width: 600px;
  margin: 0 auto 36px auto !important;
  line-height: 1.6 !important;
}

/* Center Search Pill */
.vx-search-pill {
  background: #FFFFFF;
  border-radius: 50px;
  border: 1px solid #EBEBEF;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.05);
  max-width: 650px;
  margin: 0 auto 48px auto;
  display: flex;
  align-items: center;
  padding: 6px 6px 6px 20px;
  gap: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.vx-search-pill:focus-within {
  border-color: #FFC107;
  box-shadow: 0 12px 40px rgba(255, 193, 7, 0.12);
}

/* bottom modern cards */
.vx-filter-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 64px;
  position: relative;
  z-index: 2;
}
@media (max-width: 900px) {
  .vx-filter-row {
    grid-template-columns: 1fr;
  }
}

.vx-filter-card-dark {
  background: #111111;
  border-radius: 20px;
  padding: 24px;
  color: #FFFFFF;
  border: 1px solid #222222;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.vx-filter-card-mustard {
  /* Changed from gradient to a very clean white card with a subtle mustard border accent */
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  color: #111111;
  border: 1px solid #EBEBEF;
  border-top: 4px solid #FFC107;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.vx-card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.vx-card-title-row h3 {
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  color: inherit;
}
.vx-card-link-btn {
  font-size: 0.75rem !important;
  font-weight: 800 !important;
  text-transform: uppercase !important;
  color: #FFC107 !important;
  padding: 0 !important;
  min-width: auto !important;
}
.vx-filter-card-mustard .vx-card-link-btn {
  color: #555555 !important;
}

.vx-filter-buttons-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Button items in the dark card */
.vx-filter-card-dark .vx-filter-btn-item {
  background: #222222 !important;
  border: 1px solid #333333 !important;
  color: #CCCCCC !important;
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  text-transform: none !important;
  padding: 6px 14px !important;
  border-radius: 10px !important;
  transition: all 0.2s ease !important;
}
.vx-filter-card-dark .vx-filter-btn-item:hover {
  background: #333333 !important;
}
.vx-filter-card-dark .vx-filter-btn-item.active {
  background: #FFC107 !important;
  color: #111111 !important;
  border-color: #FFC107 !important;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2) !important;
}

/* Button items in the white/accent card */
.vx-filter-card-mustard .vx-filter-btn-item {
  background: #F9F9F9 !important;
  border: 1px solid #EBEBEF !important;
  color: #555555 !important;
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  text-transform: none !important;
  padding: 6px 14px !important;
  border-radius: 10px !important;
  transition: all 0.2s ease !important;
}
.vx-filter-card-mustard .vx-filter-btn-item:hover {
  background: #F1F1F1 !important;
}
.vx-filter-card-mustard .vx-filter-btn-item.active {
  background: #111111 !important;
  color: #FFFFFF !important;
  border-color: #111111 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Project Cards */
.vx-projects-section {
  position: relative;
  z-index: 2;
  margin-top: 20px;
}

.vx-project-card {
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #EBEBEF;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.vx-project-card:hover {
  transform: translateY(-5px);
  border-color: #FFC107;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
}

.vx-card-header {
  padding: 24px 24px 0 24px;
}
.vx-card-body {
  padding: 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.vx-card-footer {
  padding: 0 24px 24px 24px;
  margin-top: auto;
}

.vx-card-badge {
  background: rgba(255, 193, 7, 0.1);
  color: #D97706;
  font-weight: 700;
  font-size: 0.7rem;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.vx-btn-action {
  background: #111111 !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
  border-radius: 12px !important;
  text-transform: none !important;
  padding: 10px 20px !important;
  transition: all 0.2s ease !important;
}
.vx-btn-action:hover {
  background: #FFC107 !important;
  color: #111111 !important;
  box-shadow: 0 4px 14px rgba(255,193,7,0.3) !important;
}

/* Compact button inside the search pill */
.vx-search-btn {
  background: #111111 !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
  font-size: 0.78rem !important;
  border-radius: 30px !important;
  text-transform: none !important;
  padding: 7px 16px !important;
  min-width: 0 !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  transition: all 0.2s ease !important;
}
.vx-search-btn:hover {
  background: #FFC107 !important;
  color: #111111 !important;
  box-shadow: 0 4px 14px rgba(255,193,7,0.3) !important;
}

.vx-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 193, 7, 0.1);
  color: #FFC107;
}

.ds-skill-chip {
  background: #F3F4F6 !important;
  color: #374151 !important;
  font-size: 0.72rem !important;
  font-weight: 600 !important;
  height: 22px !important;
}
`

const DiscoverStudents = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [isAiMode, setIsAiMode] = useState(false)
  const [domainFilter, setDomainFilter] = useState('All')
  const [bgFilter, setBgFilter] = useState('All')
  const [aiWaking, setAiWaking] = useState(false)
  
  const canvasRef = useRef(null)

  const [availableDomains, setAvailableDomains] = useState(['All', 'AI', 'Website', 'Technology', 'Mobile App', 'Data Science'])

  const floatingNodes = [
    { label: 'React', top: '12%', left: '8%', delay: 0 },
    { label: 'Node.js', top: '48%', left: '4%', delay: 0.5 },
    { label: 'Python', top: '75%', left: '16%', delay: 1 },
    { label: 'TensorFlow', top: '10%', right: '10%', delay: 0.3 },
    { label: 'Design', top: '42%', right: '5%', delay: 0.8 },
    { label: 'UI/UX', top: '70%', right: '14%', delay: 1.2 }
  ]

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
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
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
          : (scrollFactor > 0.3 ? 'rgba(255, 193, 7, 0.4)' : 'rgba(0, 0, 0, 0.12)')
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
              : (scrollFactor > 0.2 ? `rgba(255, 193, 7, ${alpha * 1.5})` : `rgba(0, 0, 0, ${alpha * 1.2})`)
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

  const loadStudents = async (isManual = false) => {
    setLoading(true)
    try {
      if (isAiMode && (search || isManual)) {
        // ── AI RETRY LOOP ──────────────────────────────────────────────────
        setAiWaking(true)
        const MAX_RETRIES = 8        // up to ~72 seconds total
        const RETRY_DELAY_MS = 9000  // 9s between retries — safe under 30s limit

        let lastError = null
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            const res = await api.post('/ai/recommend-students', { query: search, top_n: 9 }, { timeout: 15000 })
            setAiWaking(false)
            setStudents(res.data.data || [])
            setLoading(false)
            return
          } catch (err) {
            lastError = err
            const status = err?.response?.status
            const isWaking = err?.response?.data?.waking === true

            if (status === 503 && isWaking) {
              if (attempt < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
                continue
              }
            }
            break
          }
        }

        console.warn('AI unavailable after retries, falling back to standard search.', lastError?.message)
        setAiWaking(false)
        setIsAiMode(false)
        const params = {}
        if (search) params.search = search
        const fallback = await api.get('/profile/students', { params }).catch(() => ({ data: { data: [] } }))
        setStudents(fallback.data.data || [])
      } else {
        setAiWaking(false)
        const params = {}
        if (search) params.search = search
        // Since backend standard get '/students' might not support domain filter natively, we filter below
        const res = await api.get('/profile/students', { params })
        setStudents(res.data.data || [])
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setAiWaking(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAiMode) loadStudents()
  }, [isAiMode])

  useEffect(() => {
    if (students.length > 0) {
        const uniqueDoms = Array.from(new Set(students.map(s => s.profileDetails?.industryDomain))).filter(Boolean)
        const merged = Array.from(new Set(['AI', 'Website', 'Technology', 'Mobile App', ...uniqueDoms]))
        setAvailableDomains(['All', ...merged])
    }
  }, [students])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadStudents(true)
  }

  const filteredStudents = students.filter(student => {
    let match = true;
    if (domainFilter !== 'All') {
        match = match && student.profileDetails?.industryDomain === domainFilter;
    }
    if (bgFilter !== 'All') {
        const bg = student.profileDetails?.academicBackground || '';
        match = match && bg.includes(bgFilter);
    }
    if (!isAiMode && search) {
        const q = search.toLowerCase();
        const skills = (student.profileDetails?.skills || []).join(' ').toLowerCase();
        const name = (student.name || '').toLowerCase();
        const background = (student.profileDetails?.academicBackground || '').toLowerCase();
        match = match && (name.includes(q) || skills.includes(q) || background.includes(q));
    }
    return match;
  })

  // Icons mapper for filters
  const getDomainIcon = (dom) => {
    switch(dom) {
      case 'Technology': return <LaptopMac sx={{ fontSize: 16 }} />
      case 'AI': return <SmartToy sx={{ fontSize: 16 }} />
      case 'Web Development': return <DeveloperMode sx={{ fontSize: 16 }} />
      case 'Mobile App': return <DeveloperMode sx={{ fontSize: 16 }} />
      case 'Data Science': return <BarChart sx={{ fontSize: 16 }} />
      default: return <Settings sx={{ fontSize: 16 }} />
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="vx-root">
        {/* Background canvas */}
        <canvas ref={canvasRef} className="vx-canvas" />

        {/* Floating tech nodes */}
        {floatingNodes.map((node, i) => {
          const radius = 15;
          // Generating an 8-point circle approximation for x/y keyframes
          const xFrames = [0, radius*0.7, radius, radius*0.7, 0, -radius*0.7, -radius, -radius*0.7, 0];
          const yFrames = [-radius, -radius*0.7, 0, radius*0.7, radius, radius*0.7, 0, -radius*0.7, -radius];

          return (
            <motion.div
              key={i}
              className="vx-floating-node"
              style={{
                top: node.top,
                left: node.left,
                right: node.right,
              }}
              animate={{
                x: xFrames,
                y: yFrames
              }}
              transition={{
                duration: 10 + (i % 3) * 2, // Varies the rotation speed between nodes
                repeat: Infinity,
                ease: "linear",
                delay: node.delay
              }}
            >
              <div className="vx-floating-dot" />
              {node.label}
            </motion.div>
          )
        })}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* ══════ HERO SEARCH SECTION ══════ */}
          <Box className="vx-hero-section">
            <Typography variant="h1" className="vx-hero-title">
              Find the Perfect <span>Talent</span> <br />
              for your Next Startup Project
            </Typography>
            <Typography className="vx-hero-desc">
              InAcadFusion is a search and recommendation platform that connects startups and students. Describe your required skills or roles below to find matching students.
            </Typography>

            <form onSubmit={handleSearchSubmit}>
              <Box className="vx-search-pill">
                {isAiMode ? <AutoAwesome sx={{ color: '#FFC107', mr: 2 }} /> : <Search sx={{ color: '#94A3B8', mr: 2 }} />}
                <TextField
                  fullWidth
                  placeholder={isAiMode ? "Describe required skills & interests (e.g. 'I need a React developer')...." : "Search student name or skills..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{ '& input': { color: '#0F172A', fontSize: '1rem', fontWeight: 500 } }}
                />
                <Button 
                  type="submit" 
                  className="vx-search-btn"
                >
                  {isAiMode ? 'AI Match' : 'Search'}
                </Button>
              </Box>
            </form>
          </Box>

          {/* ══════ FILTER CARDS ROW ══════ */}
          <Box className="vx-filter-row">
            {/* Card 1: Filter by category */}
            <Box className="vx-filter-card-dark">
              <Box>
                <Box className="vx-card-title-row">
                  <h3>Filter By Domain</h3>
                  {domainFilter !== 'All' && (
                    <Button className="vx-card-link-btn" onClick={() => setDomainFilter('All')}>See all</Button>
                  )}
                </Box>
                <Box className="vx-filter-buttons-grid">
                  {availableDomains.map((dom) => (
                    <Button 
                      key={dom} 
                      className={`vx-filter-btn-item ${domainFilter === dom ? 'active' : ''}`}
                      onClick={() => setDomainFilter(dom)}
                      startIcon={dom !== 'All' ? getDomainIcon(dom) : <Layers sx={{ fontSize: 16 }} />}
                    >
                      {dom}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Card 2: Filter by Degree Background */}
            <Box className="vx-filter-card-dark">
              <Box>
                <Box className="vx-card-title-row">
                  <h3>Filter By Background</h3>
                  {bgFilter !== 'All' && (
                    <Button className="vx-card-link-btn" onClick={() => setBgFilter('All')}>See all</Button>
                  )}
                </Box>
                <Box className="vx-filter-buttons-grid">
                  <Button 
                    className={`vx-filter-btn-item ${bgFilter === 'All' ? 'active' : ''}`}
                    onClick={() => setBgFilter('All')}
                    startIcon={<Layers sx={{ fontSize: 16 }} />}
                  >
                    All Degrees
                  </Button>
                  <Button 
                    className={`vx-filter-btn-item ${bgFilter === 'Computer Science' ? 'active' : ''}`}
                    onClick={() => setBgFilter('Computer Science')}
                    startIcon={<Code sx={{ fontSize: 16 }} />}
                  >
                    Computer Science
                  </Button>
                  <Button 
                    className={`vx-filter-btn-item ${bgFilter === 'Engineering' ? 'active' : ''}`}
                    onClick={() => setBgFilter('Engineering')}
                    startIcon={<School sx={{ fontSize: 16 }} />}
                  >
                    Engineering
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Card 3: Match Engine Type */}
            <Box className="vx-filter-card-mustard">
              <Box>
                <Box className="vx-card-title-row">
                  <h3 style={{ color: '#0F172A' }}>Filter By Function</h3>
                </Box>
                <Box className="vx-filter-buttons-grid">
                  <Button 
                    className={`vx-filter-btn-item ${!isAiMode ? 'active' : ''}`}
                    onClick={() => setIsAiMode(false)}
                  >
                    Standard Search
                  </Button>
                  <Button 
                    className={`vx-filter-btn-item ${isAiMode ? 'active' : ''}`}
                    onClick={() => setIsAiMode(true)}
                  >
                    AI Semantic Match
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ══════ STUDENTS SECTION ══════ */}
          <Box className="vx-projects-section">
            {loading ? (
              <Grid container spacing={4}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <ProjectCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : filteredStudents.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Box className="vx-project-card" sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <EmptyState icon="users" title="No students found" message="Try relaxing your filters or modifying the search terms." />
                </Box>
              </motion.div>
            ) : (
              <Grid container spacing={4}>
                <AnimatePresence>
                  {filteredStudents.map((student, index) => (
                    <Grid item xs={12} sm={6} md={4} key={student._id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        style={{ height: '100%' }}
                      >
                        <div className="vx-project-card">
                          <div className="vx-card-header">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div className="vx-icon-box">
                                <PersonOutline sx={{ fontSize: 22 }} />
                              </div>
                              {student.confidence && (
                                <div className="vx-card-badge">
                                  <AutoAwesome sx={{ fontSize: 13, mr: 0.5, verticalAlign: 'middle' }} /> {student.confidence}% Match
                                </div>
                              )}
                            </Box>
                          </div>
                          
                          <div className="vx-card-body">
                            <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#0F172A', mb: 1.5, lineHeight: 1.35 }}>
                              {student.name}
                            </Typography>
                            
                            <Typography sx={{ fontSize: '0.9rem', color: '#64748B', mb: 3, flexGrow: 1, lineHeight: 1.6 }}>
                              {(student.profileDetails?.description || "No description provided.").length > 130 ? (student.profileDetails?.description || "No description provided.").substring(0, 130) + '...' : (student.profileDetails?.description || "No description provided.")}
                            </Typography>

                            {(student.profileDetails?.skills || []).length > 0 && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7, mb: 2 }}>
                                {(student.profileDetails.skills).slice(0, 4).map(skill => (
                                  <Chip key={skill} label={skill} size="small" className="ds-skill-chip" />
                                ))}
                                {(student.profileDetails.skills).length > 4 && (
                                  <Chip label={`+${student.profileDetails.skills.length - 4}`} size="small" className="ds-skill-chip" />
                                )}
                              </Box>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                              <School sx={{ fontSize: 18, color: '#94A3B8' }} />
                              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                                {(student.profileDetails?.academicBackground || "Various Background")}
                              </Typography>
                            </Box>
                          </div>

                          <div className="vx-card-footer">
                            <Button 
                              fullWidth 
                              endIcon={<ArrowForward />} 
                              className="vx-btn-action"
                              onClick={() => {}}
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            )}
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default DiscoverStudents
