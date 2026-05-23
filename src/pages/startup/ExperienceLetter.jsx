import React, { useState, useEffect } from 'react'
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

// ─── PURE WHITE MINIMALIST STYLES ───────────────────────────────────────
const STYLES = `
.vx-root {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #FFFFFF;
  min-height: 100vh;
  color: #1A202C;
  padding-bottom: 60px;
}

.vx-card {
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.vx-btn-mustard {
  background: #D97706 !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  padding: 12px 28px !important;
  text-transform: none !important;
  font-family: 'Inter', sans-serif !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2) !important;
}
.vx-btn-mustard:hover {
  background: #B45309 !important;
  box-shadow: 0 6px 16px rgba(217, 119, 6, 0.3) !important;
}
.vx-btn-mustard:disabled {
  background: #F1F5F9 !important;
  color: #94A3B8 !important;
  box-shadow: none !important;
}

.vx-input-clean .MuiOutlinedInput-root {
  background: #FFFFFF;
  border-radius: 10px;
  color: #1A202C;
}
.vx-input-clean .MuiOutlinedInput-notchedOutline {
  border-color: #E2E8F0;
}
.vx-input-clean.Mui-focused .MuiOutlinedInput-notchedOutline {
  border-color: #D97706 !important;
}
.vx-input-clean .MuiInputLabel-root {
  color: #64748B;
}

/* Beautiful Breadcrumb Styling */
.pd-breadcrumb-text {
  font-family: 'Inter', sans-serif !important;
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
  const [completedCollaborations, setCompletedCollaborations] = useState([])
  const [selectedCollaboration, setSelectedCollaboration] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

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
      <Box className="vx-root" sx={{ pt: 18, px: { xs: 2, md: 3 } }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header & Breadcrumbs */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: 850, fontSize: '2.5rem', color: '#1E293B', letterSpacing: '-0.03em', mb: 1 }}>
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
                <Typography className="pd-breadcrumb-text" sx={{ color: '#1E293B !important', fontWeight: 700 }}>
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
                              color: '#1E293B', 
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
                              background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              letterSpacing: '-0.04em'
                            }}
                          >
                            Fusion
                          </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: '"Cinzel", "Playfair Display", serif', fontWeight: 800, fontSize: '1.75rem', color: '#1E293B', mb: 1, letterSpacing: '0.05em' }}>
                          LETTER OF EXPERIENCE
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.15em', mb: 4, textTransform: 'uppercase' }}>
                          InAcadFusion Verified Credential
                        </Typography>
                        
                        <Typography sx={{ fontSize: '1rem', color: '#64748B', fontStyle: 'italic', mb: 1.5 }}>
                          This is proudly presented to
                        </Typography>
                        
                        <Typography sx={{ fontWeight: 850, fontSize: '1.8rem', color: '#D97706', mb: 2, fontFamily: 'Inter, sans-serif' }}>
                          {currentCollab.studentId?.name || 'Student Partner'}
                        </Typography>
                        
                        <Typography sx={{ fontSize: '1rem', color: '#64748B', maxWidth: '550px', mx: 'auto', lineHeight: 1.6, mb: 3 }}>
                          for successfully completing a high-impact collaboration on the project
                          <span style={{ display: 'block', fontWeight: 800, color: '#1E293B', marginTop: '8px', fontSize: '1.15rem', fontStyle: 'normal' }}>
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
