import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  CircularProgress,
  IconButton
} from '@mui/material'
import { 
  CheckCircle, 
  Cancel, 
  School, 
  Business, 
  Work,
  Description,
  ArrowBack,
  Share
} from '@mui/icons-material'
import api from '../../utils/api'

// ─── PREMIUM VERIFICATION & CERTIFICATE STYLES ─────────────────────────────────
const STYLES = `
.vx-root {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #FAFBFC;
  min-height: 100vh;
  color: #1E293B;
  padding-bottom: 80px;
}

.vx-card {
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
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
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.15) !important;
}
.vx-btn-mustard:hover {
  background: #B45309 !important;
  box-shadow: 0 6px 16px rgba(217, 119, 6, 0.25) !important;
}

/* Authentic Premium Certificate Frame */
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

.badge-verified {
  background: #E6F9EE;
  color: #28C76F;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid #C3F2D2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
`

const VerifyLetter = () => {
  const { hash } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const verifyHash = async () => {
      try {
        const res = await api.get(`/experience-letters/verify/${hash}`)
        if (res.data.verified) {
          setData(res.data.data)
        } else {
          setError(true)
        }
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    verifyHash()
  }, [hash])

  if (loading) {
    return (
      <Box sx={{ pt: 20, pb: 10, textAlign: 'center', backgroundColor: '#FAFBFC', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#D97706', mb: 2 }} />
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, color: '#64748B' }}>
          Cryptographically Verifying Credential...
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="vx-root" sx={{ pt: { xs: 12, md: 16 } }}>
        <Container maxWidth="md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="vx-card" sx={{ mb: 4 }}>
              {/* Verification Bar */}
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: error ? '#FFF5F5' : '#F4FBF7',
                  color: error ? '#E53E3E' : '#10B981',
                  borderBottom: '1px solid',
                  borderColor: error ? '#FED7D7' : '#D1FAE5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5
                }}
              >
                {error ? (
                  <>
                    <Cancel sx={{ fontSize: 24, color: '#E53E3E' }} />
                    <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em' }}>
                      Verification Failed: Invalid Document Hash
                    </Typography>
                  </>
                ) : (
                  <>
                    <span className="badge-verified">
                      <CheckCircle sx={{ fontSize: '16px !important' }} />
                      VERIFIED AUTHENTIC
                    </span>
                  </>
                )}
              </Box>

              {error ? (
                <CardContent sx={{ p: 6, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.1rem', color: '#64748B', mb: 4, lineHeight: 1.6 }}>
                    This experience letter hash could not be verified. It might have been altered, revoked, or does not exist in our cryptographically secure records.
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/" 
                    variant="outlined" 
                    startIcon={<ArrowBack />}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 3 }}
                  >
                    Back to InAcadFusion
                  </Button>
                </CardContent>
              ) : (
                data && (
                  <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                    {/* The Certificate Frame */}
                    <Box className="cert-frame" sx={{ p: { xs: 3, md: 6 }, mb: 4 }}>
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
                        <Typography sx={{ fontFamily: '"Cinzel", "Playfair Display", serif', fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#1E293B', mb: 1, letterSpacing: '0.05em' }}>
                          LETTER OF EXPERIENCE
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.15em', mb: 4, textTransform: 'uppercase' }}>
                          InAcadFusion Verified Credential
                        </Typography>
                        
                        <Typography sx={{ fontSize: '0.95rem', color: '#64748B', fontStyle: 'italic', mb: 1.5 }}>
                          This is proudly presented to
                        </Typography>
                        
                        <Typography sx={{ fontWeight: 850, fontSize: { xs: '1.6rem', md: '2.2rem' }, color: '#D97706', mb: 2 }}>
                          {data.studentId?.name || 'Student'}
                        </Typography>
                        
                        <Typography sx={{ fontSize: '0.95rem', color: '#64748B', maxWidth: '500px', mx: 'auto', lineHeight: 1.6, mb: 3 }}>
                          for successfully completing a high-impact collaboration on the project
                          <span style={{ display: 'block', fontWeight: 800, color: '#1E293B', marginTop: '8px', fontSize: '1.15rem', fontStyle: 'normal' }}>
                            "{data.projectId?.title || 'Project title'}"
                          </span>
                        </Typography>

                        <Divider sx={{ my: 3, borderColor: '#E6D2B5', maxWidth: '300px', mx: 'auto' }} />

                        {data.remarks && (
                          <Typography sx={{ fontSize: '0.9rem', color: '#475569', maxWidth: '550px', mx: 'auto', lineHeight: 1.7, fontStyle: 'italic', mb: 4 }}>
                            "{data.remarks}"
                          </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, maxWidth: '600px', mx: 'auto', mt: 4 }}>
                          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Issued By</Typography>
                            <Typography sx={{ fontSize: '0.9rem', color: '#334155', fontWeight: 700 }}>{data.startupId?.name}</Typography>
                          </Box>
                          <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                            <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Issue Date</Typography>
                            <Typography sx={{ fontSize: '0.9rem', color: '#334155', fontWeight: 700 }}>{new Date(data.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Metadata & Actions */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', mb: 0.5 }}>Verification Signature</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {data.verificationHash}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button 
                          variant="outlined" 
                          startIcon={<Share />}
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                            alert('Verification link copied to clipboard!')
                          }}
                          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                        >
                          Share Credential
                        </Button>
                        <Button 
                          component={Link} 
                          to="/" 
                          className="vx-btn-mustard"
                        >
                          Verify Another Letter
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                )
              )}
            </Card>
          </motion.div>
        </Container>
      </Box>
    </>
  )
}

export default VerifyLetter
