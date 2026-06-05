import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Button
} from '@mui/material'
import { 
  RadioButtonUnchecked,
  Warning,
  Check,
  Close,
  Add,
  Edit,
  Delete,
  CheckCircle,
  HourglassEmpty,
  Chat as ChatIcon,
  ExpandMore,
  Work,
  Info
} from '@mui/icons-material'
import EmptyState from '../../components/shared/EmptyState'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import ChatBox from '../../components/shared/ChatBox'
import { ProjectCardSkeleton } from '../../components/shared/SkeletonLoader'

// ─── PURE WHITE MINIMALIST STYLES ───────────────────────────────────────
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
  margin-bottom: 24px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}
.vx-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px 0 rgba(0, 0, 0, 0.08);
}

.vx-card-header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #F1F5F9;
  background: #FFFFFF;
}

.vx-card-body {
  padding: 24px;
}

.vx-icon-box {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 193, 7, 0.1) !important;
}

.vx-badge {
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.vx-progress-wrap {
  background: #FAFAFA;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  border: 1px solid #F1F5F9;
}

.vx-milestone-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 12px;
  background: #FFFFFF;
  border: 1px solid #F1F5F9;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}
.vx-milestone-item:hover {
  background: #FAFAFA;
  border-color: #E2E8F0;
  transform: translateX(4px);
}

.vx-btn-mustard {
  background: #FFC107 !important;
  color: #000000 !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  padding: 8px 24px !important;
  text-transform: none !important;
  font-family: 'Inter', sans-serif !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 12px rgba(255,193,7, 0.3) !important;
}
.vx-btn-mustard:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255,193,7, 0.4) !important;
}

.vx-dialog-clean {
  background: #FFFFFF !important;
  color: #111111 !important;
  border-radius: 20px !important;
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

/* Aesthetic Light Date Picker */
input[type="date"] {
  position: relative;
  background: transparent;
  color: #111111;
  font-family: "Inter", sans-serif;
  font-weight: 600;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23FFC107' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E") no-repeat;
  background-size: contain;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
`

const getStatusStyles = (status) => {
  switch (status) {
    case 'completed': return { bg: '#E6F9EE', color: '#28C76F' }
    case 'active':    return { bg: '#EDE7FF', color: '#7367F0' }
    case 'pending':   return { bg: '#FFF8E1', color: '#FFC107' }
    case 'cancelled': return { bg: '#FEE2E2', color: '#EF4444' }
    default:          return { bg: '#F1F1F1', color: '#82868B' }
  }
}

const ManageCollaborations = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [collaborations, setCollaborations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [disputeDialog, setDisputeDialog] = useState(null)
  const [disputeReason, setDisputeReason] = useState('')
  const [loadingAction, setLoadingAction] = useState(false)
  
  // Milestone Management State
  const [milestoneDialog, setMilestoneDialog] = useState(null)
  const [milestoneForm, setMilestoneForm] = useState({ title: '', description: '', dueDate: '' })

  // Completion & Experience Letter State
  const [completionDialog, setCompletionDialog] = useState(null) // collaboration object
  const [completionForm, setCompletionForm] = useState({ performanceRating: 5, remarks: '' })

  const canvasRef = useRef(null)

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
    let isMounted = true;
    const loadCollaborations = async () => {
      if (user === undefined) return;
      try {
        const res = await api.get('/collaborations')
        if (isMounted) setCollaborations(res.data.data)
      } catch (error) {
        console.error("Collab fetch error:", error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadCollaborations()
    return () => { isMounted = false };
  }, [user])

  const handleStatusChange = async (collabId, status) => {
    try {
      await api.put(`/collaborations/${collabId}`, { status })
      setCollaborations(collaborations.map(c => c._id === collabId ? { ...c, status } : c))
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  const handleCancelRequest = async (collabId) => {
    if (!window.confirm("Are you sure you want to cancel this collaboration request?")) return;
    setLoadingAction(true)
    try {
      await api.put(`/collaborations/${collabId}`, { status: 'cancelled' })
      setCollaborations(prev => prev.filter(c => c._id !== collabId))
    } catch (err) {
      console.error("Failed to cancel collaboration request", err)
      window.alert(err.response?.data?.message || "Failed to cancel request.")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleDeleteCollaborationCard = (collabId) => {
    if (!window.confirm("Are you sure you want to remove this collaboration from your list?")) return;
    setCollaborations(prev => prev.filter(c => c._id !== collabId))
  }

  const handleRaiseDispute = async () => {
    if (!disputeReason) return
    setLoadingAction(true)
    try {
      await api.post('/disputes', { collaborationId: disputeDialog, reason: disputeReason })
      setDisputeDialog(null)
      setDisputeReason('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAction(false)
    }
  }

  const getMilestoneIcon = (milestone) => {
    if (milestone.isVerified) return <CheckCircle sx={{ color: '#28C76F' }} />
    if (milestone.status === 'completed') return <HourglassEmpty sx={{ color: '#7367F0' }} /> // Awaiting verification
    if (milestone.status === 'in-progress') return <HourglassEmpty sx={{ color: '#FFC107' }} />
    return <RadioButtonUnchecked sx={{ color: '#DCE1E6' }} />
  }

  const handleMilestoneUpdate = async (collabId, milestoneId, data) => {
    try {
      const res = await api.put(`/collaborations/${collabId}/milestones/${milestoneId}`, data)
      const updatedCollab = res.data.data;
      setCollaborations(collaborations.map(c => c._id === collabId ? updatedCollab : c))
      
      // Automatic Experience Letter Trigger Check
      if (data.isVerified) {
        const totalMilestones = updatedCollab.milestones?.length || 0;
        const verifiedMilestones = updatedCollab.milestones?.filter(m => m.isVerified).length || 0;
        
        if (totalMilestones > 0 && verifiedMilestones === totalMilestones) {
          // Add a slight delay so the user sees the green checkmark state first
          setTimeout(() => {
            setCompletionDialog(updatedCollab);
          }, 600);
        }
      }
    } catch (err) {
      console.error("Failed to update milestone", err)
    }
  }

  const handleAddMilestone = async () => {
    if (!milestoneForm.title || !milestoneDialog?.collabId) return
    setLoadingAction(true)
    try {
      const res = await api.post(`/collaborations/${milestoneDialog.collabId}/milestones`, milestoneForm)
      setCollaborations(collaborations.map(c => c._id === milestoneDialog.collabId ? res.data.data : c))
      setMilestoneDialog(null)
      setMilestoneForm({ title: '', description: '', dueDate: '' })
    } catch (err) {
      console.error("Failed to add milestone", err)
      alert(err.response?.data?.message || "Failed to add milestone to roadmap")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleDeleteMilestone = async (collabId, milestoneId) => {
    if (!window.confirm("Delete this milestone?")) return
    try {
      const res = await api.delete(`/collaborations/${collabId}/milestones/${milestoneId}`)
      setCollaborations(collaborations.map(c => c._id === collabId ? res.data.data : c))
    } catch (err) {
      console.error("Failed to delete milestone", err)
    }
  }

  const handleCompleteProject = async () => {
    if (!completionDialog) return
    setLoadingAction(true)
    try {
      // 1. Mark collaboration as completed
      await api.put(`/collaborations/${completionDialog._id}`, { status: 'completed' })
      
      // 2. Generate experience letter
      await api.post('/experience-letters/generate', {
        collaborationId: completionDialog._id,
        performanceRating: completionForm.performanceRating,
        remarks: completionForm.remarks
      })

      setCollaborations(collaborations.map(c => c._id === completionDialog._id ? { ...c, status: 'completed' } : c))
      setCompletionDialog(null)
      alert("Project completed and Experience Letter issued successfully!")
    } catch (err) {
      console.error("Completion error:", err)
      alert(err.response?.data?.message || "Failed to complete project")
    } finally {
      setLoadingAction(false)
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '2.5rem', color: '#1E293B', letterSpacing: '-0.02em', mb: 1 }}>
                Startup Workspace
              </Typography>
              <Typography sx={{ color: '#64748B', fontWeight: 500 }}>
                Manage your student collaborations, verify milestones, and build the future of your product.
              </Typography>
            </Box>
          </motion.div>

          {collaborations.length === 0 ? (
            <EmptyState
              icon="folder"
              title="No Collaborations Yet"
              message="Students will appear here once they request to collaborate on your projects."
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <AnimatePresence>
                {collaborations.map((collab, index) => {
                  const verifiedMilestones = collab.milestones?.filter(m => m.isVerified).length || 0
                  const totalMilestones = collab.milestones?.length || 0
                  const progress = totalMilestones > 0 ? (verifiedMilestones / totalMilestones) * 100 : 0
                  const statusSty = getStatusStyles(collab.status)
                  const canComplete = collab.status === 'active' && totalMilestones > 0 && verifiedMilestones === totalMilestones

                  return (
                    <motion.div
                      key={collab._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="vx-card">
                        <div className="vx-card-header">
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <div className="vx-icon-box" style={{ background: '#FFF8E1' }}>
                              <Work sx={{ color: '#FFC107' }} />
                            </div>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#1E293B', mb: 0.5 }}>
                                {collab.projectId?.title || 'Untitled Project'}
                              </Typography>
                              <Typography sx={{ fontSize: '0.9rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                Partner: <span style={{ fontWeight: 700, color: '#D97706' }}>{collab.studentId?.name || 'Student'}</span>
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {collab.status === 'pending' && (collab.projectId?.uploadedBy === user?._id || collab.projectId?.uploadedBy?._id === user?._id || collab.projectId?.uploadedBy === user?.id || collab.projectId?.uploadedBy?._id === user?.id) && (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button 
                                  size="small" 
                                  startIcon={<Check />}
                                  className="vx-btn-mustard"
                                  onClick={() => handleStatusChange(collab._id, 'active')}
                                >
                                  Accept
                                </Button>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="error"
                                  startIcon={<Close />}
                                  className="vx-btn-outline"
                                  onClick={() => handleStatusChange(collab._id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </Box>
                            )}
                            {collab.status === 'pending' && !(collab.projectId?.uploadedBy === user?._id || collab.projectId?.uploadedBy?._id === user?._id || collab.projectId?.uploadedBy === user?.id || collab.projectId?.uploadedBy?._id === user?.id) && (
                              <Button 
                                size="small" 
                                variant="outlined" 
                                color="error"
                                disabled={loadingAction}
                                onClick={() => handleCancelRequest(collab._id)}
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 2, fontSize: '0.8rem' }}
                              >
                                Cancel Request
                              </Button>
                            )}
                            {['cancelled', 'rejected'].includes(collab.status) && (
                              <Button 
                                size="small" 
                                variant="outlined"
                                color="error"
                                onClick={() => handleDeleteCollaborationCard(collab._id)}
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 2, fontSize: '0.8rem' }}
                              >
                                Delete
                              </Button>
                            )}
                            <span className="vx-badge" style={{ backgroundColor: statusSty.bg, color: statusSty.color }}>
                              {collab.status}
                            </span>
                             {collab.status === 'active' && (
                               <Box sx={{ display: 'flex', gap: 1 }}>
                                 <Button 
                                   size="small" 
                                   variant="outlined"
                                   startIcon={<CheckCircle />}
                                   disabled={!canComplete}
                                   sx={{ 
                                     fontWeight: 800,
                                     fontSize: '0.75rem',
                                     borderRadius: '10px',
                                     textTransform: 'none',
                                     color: canComplete ? '#28C76F' : 'rgba(255,255,255,0.1)', 
                                     borderColor: canComplete ? '#28C76F' : 'rgba(255,255,255,0.1)',
                                     '&:hover': { borderColor: '#28C76F', background: 'rgba(40,199,111,0.05)' } 
                                   }}
                                   onClick={() => setCompletionDialog(collab)}
                                 >
                                   Finalize Project
                                 </Button>
                                 <IconButton 
                                   onClick={() => setActiveChat(collab._id)} 
                                   sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { background: 'rgba(255,193,7,0.1)', borderColor: '#FFC107' } }}
                                 >
                                   <ChatIcon sx={{ color: '#FFC107', fontSize: 20 }} />
                                 </IconButton>
                               </Box>
                             )}
                          </Box>
                        </div>

                        <div className="vx-card-body">
                          <div className="vx-progress-wrap">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>
                                Execution Roadmap
                              </Typography>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#D97706' }}>
                                {verifiedMilestones}/{totalMilestones} Verified
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#E2E8F0',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #D97706, #B45309)',
                                  borderRadius: 4
                                },
                              }}
                            />
                          </div>

                          <Accordion disableGutters elevation={0} sx={{ background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '12px !important', overflow: 'hidden' }}>
                            <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#64748B' }} />}>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>View Milestones</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                              <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
                                <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                  Milestone Timeline
                                </Typography>
                                {['active', 'pending'].includes(collab.status) && (
                                  <Button 
                                    size="small" 
                                    startIcon={<Add />}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setMilestoneDialog({ collabId: collab._id })
                                      setMilestoneForm({ title: '', description: '', dueDate: '' })
                                    }}
                                    className="vx-btn-mustard"
                                    sx={{ fontSize: '0.7rem', py: '6px !important' }}
                                  >
                                    Add Milestone
                                  </Button>
                                )}
                              </Box>
                              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                                {collab.milestones.map((milestone) => (
                                  <div key={milestone._id} className="vx-milestone-item">
                                    <Box sx={{ mr: 2, display: 'flex' }}>
                                      {getMilestoneIcon(milestone)}
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1E293B' }}>
                                        {milestone.title} {milestone.status === 'completed' && !milestone.isVerified && <span style={{ color: '#7367F0', fontSize: '0.75rem', fontWeight: 600 }}> (Review Required)</span>}
                                      </Typography>
                                      <Typography sx={{ fontSize: '0.85rem', color: '#64748B', my: 0.5, lineHeight: 1.6 }}>
                                        {milestone.description}
                                      </Typography>
                                      {milestone.dueDate && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                          <Info sx={{ fontSize: 14, color: '#D97706' }} />
                                          <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                                            Target: {new Date(milestone.dueDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                          </Typography>
                                        </Box>
                                      )}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      {!milestone.isVerified && milestone.status === 'completed' ? (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                          <IconButton 
                                            size="small" 
                                            onClick={() => handleMilestoneUpdate(collab._id, milestone._id, { status: 'completed', isVerified: true })}
                                            sx={{ background: 'rgba(40,199,111,0.1)', '&:hover': { background: 'rgba(40,199,111,0.2)' } }}
                                          >
                                            <Check sx={{ fontSize: 18, color: '#28C76F' }} />
                                          </IconButton>
                                          <IconButton 
                                            size="small" 
                                            onClick={() => handleMilestoneUpdate(collab._id, milestone._id, { status: 'in-progress', isVerified: false })}
                                            sx={{ background: 'rgba(239,68,68,0.1)', '&:hover': { background: 'rgba(239,68,68,0.2)' } }}
                                          >
                                            <Close sx={{ fontSize: 18, color: '#EF4444' }} />
                                          </IconButton>
                                        </Box>
                                      ) : (
                                        <Chip 
                                          label={milestone.isVerified ? 'Verified' : milestone.status} 
                                          size="small" 
                                          sx={{ 
                                            fontWeight: 800, 
                                            fontSize: '0.65rem',
                                            height: 24,
                                            background: milestone.isVerified ? '#E6F9EE' : (milestone.status === 'in-progress' ? '#FFFBEB' : '#F1F5F9'),
                                            color: milestone.isVerified ? '#28C76F' : (milestone.status === 'in-progress' ? '#D97706' : '#64748B'),
                                            border: '1px solid currentColor'
                                          }} 
                                        />
                                      )}
                                      <IconButton 
                                        size="small" 
                                        onClick={() => handleDeleteMilestone(collab._id, milestone._id)}
                                        sx={{ background: 'rgba(255,255,255,0.03)', '&:hover': { background: 'rgba(239,68,68,0.1)' } }}
                                      >
                                        <Delete sx={{ fontSize: 16, color: '#EF4444' }} />
                                      </IconButton>
                                    </Box>
                                  </div>
                                ))}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                          
                          {collab.status === 'active' && (
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                              <Button 
                                variant="outlined" 
                                color="error"
                                disabled={loadingAction}
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to end this collaboration? The student will be notified, and the project will be open for others to apply.")) {
                                    handleStatusChange(collab._id, 'cancelled');
                                  }
                                }}
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 3, py: 1 }}
                              >
                                End Collaboration
                              </Button>
                              <Button 
                                variant="outlined" 
                                startIcon={<Warning />} 
                                color="error"
                                onClick={() => setDisputeDialog(collab._id)}
                                className="vx-btn-outline"
                              >
                                Raise Dispute
                              </Button>
                            </Box>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </Box>
          )}
        </Container>
      </Box>

      {/* Chat Dialog */}
      <Dialog open={!!activeChat} onClose={() => setActiveChat(null)} maxWidth="md" fullWidth>
        {activeChat && <ChatBox collaborationId={activeChat} onClose={() => setActiveChat(null)} />}
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog 
        open={!!disputeDialog} 
        onClose={() => !loadingAction && setDisputeDialog(null)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ className: 'vx-dialog-clean', sx: { p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#EF4444', letterSpacing: '-0.02em' }}>Mediation Request</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3, fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
            Our administration team will review this collaboration. Please provide context for the dispute.
          </Typography>
          <TextField
            fullWidth multiline rows={4} variant="outlined" placeholder="Detailed reason for mediation..."
            value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)}
            className="vx-input-clean"
          />
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <Button onClick={() => setDisputeDialog(null)} disabled={loadingAction} sx={{ fontWeight: 800, color: '#64748B', textTransform: 'none' }}>Discard</Button>
          <Button onClick={handleRaiseDispute} disabled={loadingAction || !disputeReason} variant="contained" color="error" sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 4 }}>Submit Case</Button>
        </DialogActions>
      </Dialog>

      {/* Milestone Dialog */}
      <Dialog open={!!milestoneDialog} onClose={() => setMilestoneDialog(null)} maxWidth="sm" fullWidth PaperProps={{ className: 'vx-dialog-clean' }}>
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#D97706', letterSpacing: '-0.02em' }}>Define Milestone</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth label="Task Title" variant="outlined" 
              className="vx-input-clean"
              value={milestoneForm.title} onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
            />
            <TextField
              fullWidth label="Success Criteria" variant="outlined" multiline rows={3}
              className="vx-input-clean"
              value={milestoneForm.description} onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
            />
            <TextField
              fullWidth label="Target Date" type="date" variant="outlined" InputLabelProps={{ shrink: true }}
              className="vx-input-clean"
              value={milestoneForm.dueDate} onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <Button onClick={() => setMilestoneDialog(null)} sx={{ fontWeight: 800, color: '#64748B', textTransform: 'none' }}>Cancel</Button>
          <Button 
            onClick={handleAddMilestone} 
            disabled={!milestoneForm.title || loadingAction} 
            className="vx-btn-mustard" 
            sx={{ px: 4 }}
          >
            {loadingAction ? 'Adding...' : 'Add to Roadmap'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Completion & Experience Letter Dialog */}
      <Dialog 
        open={!!completionDialog} 
        onClose={() => !loadingAction && setCompletionDialog(null)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ className: 'vx-dialog-clean' }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#059669', letterSpacing: '-0.02em' }}>Finalize Project</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 1 }}>
            <Typography sx={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
              This project is ready for completion. Finalizing will generate a cryptographically-verified experience letter for the partner.
            </Typography>
            
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', mb: 2, color: '#1E293B' }}>Performance Proficiency (1-10)</Typography>
              <TextField
                fullWidth type="number" variant="outlined" 
                className="vx-input-clean"
                inputProps={{ min: 1, max: 10 }}
                value={completionForm.performanceRating} 
                onChange={(e) => setCompletionForm({ ...completionForm, performanceRating: e.target.value })}
              />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', mb: 2, color: '#1E293B' }}>Closing Testimonial</Typography>
              <TextField
                fullWidth multiline rows={3} variant="outlined" placeholder="E.g., Exceptional technical execution..."
                className="vx-input-clean"
                value={completionForm.remarks} 
                onChange={(e) => setCompletionForm({ ...completionForm, remarks: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <Button onClick={() => setCompletionDialog(null)} disabled={loadingAction} sx={{ fontWeight: 800, color: '#64748B', textTransform: 'none' }}>Back</Button>
          <Button 
            onClick={handleCompleteProject} 
            disabled={loadingAction} 
            variant="contained" 
            sx={{ background: '#059669 !important', fontWeight: 800, borderRadius: '12px', textTransform: 'none', px: 4, color: '#FFF' }}
          >
            Issue Certificate
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export default ManageCollaborations
