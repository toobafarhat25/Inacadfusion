import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material'
import { 
  Description, 
  Verified, 
  Share, 
  School,
  NavigateNext,
  Star
} from '@mui/icons-material'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import EmptyState from '../../components/shared/EmptyState'
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
  transition: all 0.25s ease;
}
.vx-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px -4px rgba(0, 0, 0, 0.08);
  border-color: #D97706;
}

.vx-btn-mustard {
  background: #D97706 !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  padding: 10px 24px !important;
  text-transform: none !important;
  font-family: 'Inter', sans-serif !important;
  transition: all 0.2s ease !important;
}
.vx-btn-mustard:hover {
  background: #B45309 !important;
}

/* Beautiful Breadcrumb Styling */
.pd-breadcrumb-text {
  font-family: 'Inter', sans-serif !important;
  font-size: 0.9rem !important;
  color: #6B7280 !important;
  font-weight: 500 !important;
}

.badge-verified {
  background: #E6F9EE;
  color: #28C76F;
  font-weight: 800;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid #C3F2D2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
`

const MyLetters = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [letters, setLetters] = useState([])

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const res = await api.get('/experience-letters')
        setLetters(res.data.data)
      } catch (err) {
        console.error("Error fetching letters:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLetters()
  }, [])

  if (loading) {
    return (
      <Box sx={{ pt: 20, textAlign: 'center', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <CircularProgress sx={{ color: '#D97706', mb: 2 }} />
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, color: '#64748B' }}>
          Loading Credentials...
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="vx-root" sx={{ pt: 18, px: { xs: 2, md: 3 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header & Breadcrumbs */}
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontWeight: 850, fontSize: '2.5rem', color: '#1E293B', letterSpacing: '-0.03em', mb: 1 }}>
                My Credentials
              </Typography>
              <Breadcrumbs 
                separator={<NavigateNext fontSize="small" sx={{ color: '#94A3B8' }} />} 
                sx={{ mb: 3 }}
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
                <Typography className="pd-breadcrumb-text" sx={{ color: '#1E293B !important', fontWeight: 700 }}>
                  Experience Letters
                </Typography>
              </Breadcrumbs>
              <Typography sx={{ color: '#64748B', fontWeight: 500, fontSize: '1.05rem' }}>
                View, verify, and share your earned academic and professional experience credentials.
              </Typography>
            </Box>
          </motion.div>

          {letters.length === 0 ? (
            <EmptyState
              icon="description"
              title="No Credentials Issued Yet"
              message="Complete project milestones to earn cryptographically-secured experience letters from startups."
            />
          ) : (
            <Grid container spacing={3.5}>
              {letters.map((letter, index) => (
                <Grid item xs={12} md={6} key={letter._id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <Card className="vx-card">
                      <Box sx={{ 
                        p: 2.5, 
                        borderBottom: '1px solid #F1F5F9',
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#FAFAFA'
                      }}>
                        <span className="badge-verified">
                          <Verified sx={{ fontSize: '12px !important' }} />
                          VERIFIED CREDENTIAL
                        </span>
                        <Description sx={{ color: '#94A3B8' }} />
                      </Box>
                      <CardContent sx={{ p: 4 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#1E293B', mb: 2 }}>
                          {letter.projectId?.title || 'Untitled Project'}
                        </Typography>
                        
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={6}>
                            <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', mb: 0.5 }}>Startup</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#334155' }}>{letter.startupId?.name || 'Startup partner'}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', mb: 0.5 }}>Issued Date</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#334155' }}>{new Date(letter.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</Typography>
                          </Grid>
                        </Grid>

                        <Divider sx={{ mb: 3, borderColor: '#F1F5F9' }} />

                        <Box sx={{ mb: 4 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>Performance Rating</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} sx={{ color: i < letter.performanceRating / 2 ? '#D97706' : '#E2E8F0', fontSize: 20 }} />
                            ))}
                            <Typography sx={{ fontWeight: 850, ml: 1.5, color: '#D97706', fontSize: '1.1rem' }}>
                              {letter.performanceRating}/10
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button 
                            fullWidth 
                            variant="contained" 
                            startIcon={<School />}
                            onClick={() => window.open(`/verify/${letter.verificationHash}`, '_blank')}
                            className="vx-btn-mustard"
                          >
                            View Certificate
                          </Button>
                          <Button 
                            variant="outlined" 
                            sx={{ borderRadius: '10px', minWidth: '50px', borderColor: '#E2E8F0', color: '#475569', '&:hover': { borderColor: '#D97706', color: '#D97706' } }}
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/verify/${letter.verificationHash}`)
                              alert('Verification link copied to clipboard!')
                            }}
                          >
                            <Share sx={{ fontSize: 20 }} />
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  )
}

export default MyLetters
