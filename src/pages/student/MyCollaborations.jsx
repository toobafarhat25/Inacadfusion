import React, { useState, useEffect } from 'react'
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
  Button,
  Breadcrumbs,
  Link
} from '@mui/material'
import { 
  ExpandMore, 
  CheckCircle, 
  RadioButtonUnchecked, 
  HourglassEmpty, 
  Chat as ChatIcon,
  Work,
  Info,
  Warning,
  NavigateNext
} from '@mui/icons-material'
import { ProjectCardSkeleton } from '../../components/shared/SkeletonLoader'
import EmptyState from '../../components/shared/EmptyState'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import ChatBox from '../../components/shared/ChatBox'
import { useNavigate } from 'react-router-dom'

// ─── PURE WHITE MINIMALIST STYLES ──────────────────────────────────────────
const STYLES = `
.vx-root {
  font-family: 'Inter', system-ui, sans-serif;
  background: #FFFFFF;
  min-height: 100vh;
  padding-top: 140px;
  padding-bottom: 100px;
}

/* ── HEADER & BREADCRUMBS ── */
.pd-header-area {
  text-align: center;
  margin-bottom: 60px;
}
.pd-header-area h1 {
  font-weight: 800;
  font-size: 2.2rem;
  color: #111827;
  margin-bottom: 12px;
}
.pd-breadcrumb {
  display: flex;
  justify-content: center;
}
.pd-breadcrumb-text {
  color: #6B7280;
  font-size: 0.95rem;
  font-weight: 500;
}

/* ── CARDS ── */
.vx-card {
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #F3F4F6;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  transition: all 0.3s ease;
}
.vx-card:hover {
  border-color: #E5E7EB;
  box-shadow: 0 10px 25px rgba(0,0,0,0.04);
}

.vx-card-header {
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #F9FAFB;
  background: #FAFAFA;
}

.vx-card-body {
  padding: 32px;
}

.vx-icon-box {
  width: 56px; height: 56px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: #FFF9DB !important;
  border: 1px solid #FFF3BF;
}

.vx-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.vx-progress-wrap {
  background: #FFFFFF;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px solid #F3F4F6;
}

.vx-milestone-item {
  display: flex;
  align-items: flex-start;
  padding: 24px;
  border-radius: 16px;
  background: #FFFFFF;
  border: 1px solid #F3F4F6;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}
.vx-milestone-item:hover {
  background: #FAFAFA;
  border-color: #E5E7EB;
  transform: translateX(4px);
}

.vx-btn-mustard {
  background: #FFC107 !important;
  color: #111827 !important;
  font-weight: 700 !important;
  border-radius: 12px !important;
  padding: 10px 24px !important;
  text-transform: none !important;
  box-shadow: 0 4px 12px rgba(255,193,7,0.2) !important;
  transition: all 0.2s ease !important;
}
.vx-btn-mustard:hover {
  background: #FFD43B !important;
  transform: translateY(-1px);
}

.vx-dialog-clean {
  background: #FFFFFF !important;
  color: #111827 !important;
  border-radius: 24px !important;
}

.vx-input-clean .MuiOutlinedInput-root {
  background: #FAFAFA;
  border-radius: 12px;
  color: #111827;
}
.vx-input-clean .MuiOutlinedInput-notchedOutline {
  border-color: #E5E7EB;
}
.vx-input-clean .Mui-focused .MuiOutlinedInput-notchedOutline {
  border-color: #FFC107 !important;
}

.pd-accordion {
  background: transparent !important;
  border: 1px solid #F3F4F6 !important;
  border-radius: 16px !important;
  box-shadow: none !important;
}
.pd-accordion:before {
  display: none;
}
`

const getStatusStyles = (status) => {
  switch (status) {
    case 'completed': return { bg: '#E6F9EE', color: '#10B981' }
    case 'active':    return { bg: 'rgba(115,103,240,0.1)', color: '#7367F0' }
    case 'pending':   return { bg: 'rgba(255,193,7,0.1)', color: '#D9A406' }
    case 'cancelled': return { bg: '#FEE2E2', color: '#EF4444' }
    default:          return { bg: '#F3F4F6', color: '#6B7280' }
  }
}

const MyCollaborations = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [collaborations, setCollaborations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [disputeDialog, setDisputeDialog] = useState(null)
  const [disputeReason, setDisputeReason] = useState('')
  const [loadingAction, setLoadingAction] = useState(false)
  const [letters, setLetters] = useState([])

  const handleUpdateCollaborationStatus = async (collabId, status) => {
    setLoadingAction(true)
    try {
      const res = await api.put(`/collaborations/${collabId}`, { status })
      setCollaborations(collaborations.map(c => c._id === collabId ? { ...c, status: res.data.data.status } : c))
    } catch (err) {
      console.error("Failed to update status", err)
      window.alert(err.response?.data?.message || "Failed to update collaboration status.")
    } finally {
      setLoadingAction(false)
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

  useEffect(() => {
    let isMounted = true;
    const loadCollaborations = async () => {
      if (user === undefined) return;
      
      try {
        const [collabRes, lettersRes] = await Promise.all([
          api.get('/collaborations'),
          api.get('/experience-letters')
        ])
        if (isMounted) {
          setCollaborations(collabRes.data.data)
          setLetters(lettersRes.data.data)
        }
      } catch (err) {
        console.error("Data fetch error:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadCollaborations()
    return () => { isMounted = false };
  }, [user])

  const handleMilestoneUpdate = async (collabId, milestoneId, data) => {
    try {
      const res = await api.put(`/collaborations/${collabId}/milestones/${milestoneId}`, data)
      setCollaborations(collaborations.map(c => c._id === collabId ? res.data.data : c))
    } catch (err) {
      console.error("Failed to update milestone", err)
    }
  }

  const handleDeclineMilestone = async (collabId, milestoneId) => {
    setLoadingAction(true)
    try {
      const res = await api.delete(`/collaborations/${collabId}/milestones/${milestoneId}`)
      setCollaborations(collaborations.map(c => c._id === collabId ? res.data.data : c))
    } catch (err) {
      console.error("Failed to decline milestone", err)
      window.alert("An error occurred while declining the milestone. Please try again.")
    } finally {
      setLoadingAction(false)
    }
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
    if (!milestone.isAccepted) return <RadioButtonUnchecked sx={{ color: '#F59E0B' }} />
    if (milestone.isVerified) return <CheckCircle sx={{ color: '#10B981' }} />
    if (milestone.status === 'completed') return <HourglassEmpty sx={{ color: '#7367F0' }} />
    if (milestone.status === 'in-progress') return <HourglassEmpty sx={{ color: '#F59E0B' }} />
    return <RadioButtonUnchecked sx={{ color: '#D1D5DB' }} />
  }

  if (loading) {
    return (
      <Box className="vx-root" sx={{ px: 3 }}>
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
        <Container maxWidth="lg">
          
          {/* ══════ HEADER ══════ */}
          <Box className="pd-header-area">
            <h1>My Collaborations</h1>
            <Breadcrumbs 
              separator={<NavigateNext fontSize="small" />} 
              className="pd-breadcrumb"
            >
              <Link 
                underline="hover" 
                color="inherit" 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigate('/student/dashboard'); }}
                className="pd-breadcrumb-text"
              >
                Dashboard
              </Link>
              <Typography className="pd-breadcrumb-text" sx={{ color: '#111827', fontWeight: 600 }}>
                Collaborations
              </Typography>
            </Breadcrumbs>
          </Box>

          {collaborations.length === 0 ? (
            <EmptyState
              icon="folder"
              title="No Collaborations Yet"
              message="Explore startups and apply for collaborations to see them here."
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <AnimatePresence>
                {collaborations.map((collab, index) => {
                  const verifiedMilestones = collab.milestones?.filter(m => m.isVerified).length || 0
                  const totalMilestones = collab.milestones?.length || 0
                  const progress = totalMilestones > 0 ? (verifiedMilestones / totalMilestones) * 100 : 0
                  const statusSty = getStatusStyles(collab.status)
                  const myLetter = letters.find(l => l.projectId?._id === collab.projectId?._id)

                  return (
                    <motion.div
                      key={collab._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="vx-card">
                        <div className="vx-card-header">
                          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            <div className="vx-icon-box">
                              <Work sx={{ color: '#FFC107', fontSize: 28 }} />
                            </div>
                            <Box>
                              <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#111827', mb: 0.5 }}>
                                {collab.projectId?.title || 'Untitled Project'}
                              </Typography>
                              <Typography sx={{ fontSize: '0.95rem', color: '#6B7280' }}>
                                with <span style={{ fontWeight: 700, color: '#D9A406' }}>{collab.startupId?.name || 'Startup'}</span>
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <span className="vx-badge" style={{ backgroundColor: statusSty.bg, color: statusSty.color }}>
                              {collab.status}
                            </span>
                            {collab.status === 'pending' && (
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
                            {collab.status === 'completed' && myLetter && (
                              <Button 
                                size="small" 
                                variant="contained"
                                startIcon={<CheckCircle />}
                                sx={{ background: '#10B981', borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 2, py: 1 }}
                                onClick={() => window.open(`/verify/${myLetter.verificationHash}`, '_blank')}
                              >
                                View Experience Letter
                              </Button>
                            )}
                            {collab.status === 'active' && (
                              <IconButton 
                                onClick={() => setActiveChat(collab._id)} 
                                sx={{ 
                                  background: '#FFFFFF', border: '1px solid #E5E7EB', 
                                  borderRadius: '12px', padding: '10px',
                                  '&:hover': { background: '#FFFAEB', borderColor: '#FFC107' } 
                                }}
                              >
                                <ChatIcon sx={{ color: '#D9A406', fontSize: 22 }} />
                              </IconButton>
                            )}
                          </Box>
                        </div>

                        <div className="vx-card-body">
                          <div className="vx-progress-wrap">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
                                Project Roadmap
                              </Typography>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#10B981' }}>
                                {verifiedMilestones}/{totalMilestones} Verified
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#F3F4F6',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #10B981, #34D399)',
                                  borderRadius: 5
                                },
                              }}
                            />
                          </div>

                          <Accordion className="pd-accordion" disableGutters elevation={0}>
                            <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#6B7280' }} />} sx={{ p: 2 }}>
                              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>View Milestones</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                              <Box sx={{ px: 4, py: 2, borderBottom: '1px solid #F3F4F6', background: '#FAFAFA' }}>
                                <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#D9A406', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                  Milestone Timeline
                                </Typography>
                              </Box>
                              <Box sx={{ p: 4 }}>
                                {collab.milestones.map((milestone) => (
                                  <div key={milestone._id} className="vx-milestone-item">
                                    <Box sx={{ mr: 2, cursor: 'pointer' }} onClick={() => {
                                      if (milestone.isVerified) return
                                      const statuses = ['pending', 'in-progress', 'completed']
                                      const nextIdx = (statuses.indexOf(milestone.status) + 1) % statuses.length
                                      handleMilestoneUpdate(collab._id, milestone._id, { status: statuses[nextIdx] })
                                    }}>
                                      {getMilestoneIcon(milestone)}
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>
                                        {milestone.title} {milestone.status === 'completed' && !milestone.isVerified && <span style={{ color: '#7367F0', fontSize: '0.85rem', fontWeight: 700 }}> (Review Pending)</span>}
                                      </Typography>
                                      <Typography sx={{ fontSize: '0.95rem', color: '#6B7280', my: 1, lineHeight: 1.7 }}>
                                        {milestone.description}
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                        <Info sx={{ fontSize: 16, color: '#F59E0B' }} />
                                        <Typography sx={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>
                                          Deadline: {new Date(milestone.dueDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      {!milestone.isAccepted ? (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                          <Button 
                                            variant="contained" 
                                            disabled={loadingAction}
                                            onClick={() => handleMilestoneUpdate(collab._id, milestone._id, { isAccepted: true })}
                                            sx={{ 
                                              background: '#10B981', fontSize: '0.8rem', fontWeight: 700,
                                              textTransform: 'none', borderRadius: '8px', px: 2, boxShadow: 'none'
                                            }}
                                          >
                                            {loadingAction ? '...' : 'Accept'}
                                          </Button>
                                          <Button 
                                            variant="outlined" color="error" disabled={loadingAction}
                                            onClick={() => {
                                              if(window.confirm("Are you sure you want to decline this milestone?")) {
                                                handleDeclineMilestone(collab._id, milestone._id);
                                              }
                                            }}
                                            sx={{ 
                                              fontSize: '0.8rem', fontWeight: 700, textTransform: 'none',
                                              borderRadius: '8px', borderWidth: '1px !important', px: 2
                                            }}
                                          >
                                            {loadingAction ? '...' : 'Decline'}
                                          </Button>
                                        </Box>
                                      ) : (
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                          <Chip 
                                            label={milestone.isVerified ? 'Verified' : milestone.status} 
                                            sx={{ 
                                              fontWeight: 700, fontSize: '0.75rem', px: 1,
                                              background: milestone.isVerified ? '#E6F9EE' : (milestone.status === 'completed' ? '#EDE7FF' : (milestone.status === 'in-progress' ? '#FFF9DB' : '#F3F4F6')),
                                              color: milestone.isVerified ? '#10B981' : (milestone.status === 'completed' ? '#7367F0' : (milestone.status === 'in-progress' ? '#D9A406' : '#6B7280')),
                                            }} 
                                          />
                                          {milestone.status === 'in-progress' && (
                                            <Button 
                                              disabled={loadingAction}
                                              onClick={() => handleMilestoneUpdate(collab._id, milestone._id, { status: 'completed' })}
                                              sx={{ 
                                                background: '#7367F0', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700,
                                                textTransform: 'none', borderRadius: '8px', px: 2,
                                                '&:hover': { background: '#5E50EE' }
                                              }}
                                            >
                                              {loadingAction ? '...' : 'Submit Work'}
                                            </Button>
                                          )}
                                        </Box>
                                      )}
                                    </Box>
                                  </div>
                                ))}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                          
                          {collab.status === 'active' && (
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                              <Button 
                                variant="outlined" 
                                color="error"
                                disabled={loadingAction}
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to end this collaboration? The startup will be notified, and the project will be open for others to apply.")) {
                                    handleUpdateCollaborationStatus(collab._id, 'cancelled');
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
                                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 3, py: 1 }}
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
      <Dialog 
        open={!!activeChat} 
        onClose={() => setActiveChat(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}
      >
        {activeChat && <ChatBox collaborationId={activeChat} onClose={() => setActiveChat(null)} />}
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog 
        open={!!disputeDialog} 
        onClose={() => !loadingAction && setDisputeDialog(null)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ className: 'vx-dialog-clean', sx: { p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#EF4444', letterSpacing: '-0.02em' }}>Raise a Dispute</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3, fontSize: '0.95rem', color: '#6B7280', lineHeight: 1.6 }}>
            Our administration team will review the case and mediate the collaboration. Please be precise.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Detailed description of the issue..."
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            className="vx-input-clean"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDisputeDialog(null)} disabled={loadingAction} sx={{ fontWeight: 700, color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
          <Button 
            onClick={handleRaiseDispute} 
            disabled={loadingAction || !disputeReason} 
            variant="contained" 
            color="error"
            sx={{ fontWeight: 700, borderRadius: '12px', textTransform: 'none', px: 4, py: 1 }}
          >
            Submit Case
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MyCollaborations
