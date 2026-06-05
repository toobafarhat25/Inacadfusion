import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box, Container, Typography, Grid, Button, TextField, Chip, IconButton
} from '@mui/material'
import { Search, AutoAwesome, Person, School } from '@mui/icons-material'
import api from '../../utils/api'

const STYLES = `
.ds-root {
  font-family: 'Inter', system-ui, sans-serif;
  background: #FFFFFF;
  min-height: 100vh;
  color: #111111;
  padding-top: 140px;
  padding-bottom: 100px;
  background-size: 80px 80px;
  background-image:
    linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px);
}
.ds-hero { text-align: center; padding-bottom: 48px; }
.ds-title {
  font-size: 3rem !important;
  font-weight: 900 !important;
  letter-spacing: -0.03em !important;
  color: #111;
  margin-bottom: 16px !important;
}
.ds-title span {
  background: linear-gradient(135deg, #FFC107 0%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.ds-subtitle {
  font-size: 1.05rem !important;
  color: #555;
  max-width: 560px;
  margin: 0 auto 36px auto !important;
}
.ds-search-pill {
  background: #fff;
  border-radius: 50px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 8px 32px rgba(0,0,0,0.05);
  max-width: 640px;
  margin: 0 auto 16px auto;
  display: flex;
  align-items: center;
  padding: 6px 6px 6px 20px;
  gap: 8px;
  transition: all 0.3s ease;
}
.ds-search-pill:focus-within {
  border-color: #FFC107;
  box-shadow: 0 8px 32px rgba(255,193,7,0.15);
}
.ds-mode-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 48px;
}
.ds-mode-btn {
  border-radius: 30px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: 0.82rem !important;
  padding: 6px 18px !important;
  border: 1px solid #E5E7EB !important;
  color: #555 !important;
  background: #F9FAFB !important;
  transition: all 0.2s ease !important;
}
.ds-mode-btn.active {
  background: #111 !important;
  color: #fff !important;
  border-color: #111 !important;
}
.ds-search-btn {
  background: #111 !important;
  color: #fff !important;
  font-weight: 700 !important;
  font-size: 0.8rem !important;
  border-radius: 30px !important;
  text-transform: none !important;
  padding: 7px 18px !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}
.ds-search-btn:hover {
  background: #FFC107 !important;
  color: #111 !important;
}
.ds-waking-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,193,7,0.08);
  border: 1px solid rgba(255,193,7,0.3);
  border-radius: 12px;
  padding: 14px 20px;
  margin-bottom: 24px;
}
.ds-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #EBEBEF;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  transition: all 0.25s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.ds-card:hover {
  transform: translateY(-4px);
  border-color: #FFC107;
  box-shadow: 0 16px 40px rgba(0,0,0,0.07);
}
.ds-card-header { padding: 22px 22px 0; }
.ds-card-body { padding: 16px 22px; flex-grow: 1; }
.ds-card-footer { padding: 0 22px 22px; }
.ds-avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFC107, #FF8F00);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 1.1rem; color: #000;
}
.ds-badge {
  background: rgba(255,193,7,0.12);
  color: #D97706;
  font-weight: 700;
  font-size: 0.68rem;
  padding: 3px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.ds-skill-chip {
  background: #F3F4F6 !important;
  color: #374151 !important;
  font-size: 0.72rem !important;
  font-weight: 600 !important;
  height: 22px !important;
}
.ds-btn-view {
  background: #111 !important;
  color: #fff !important;
  font-weight: 700 !important;
  border-radius: 12px !important;
  text-transform: none !important;
  padding: 9px 18px !important;
  width: 100% !important;
}
.ds-btn-view:hover {
  background: #FFC107 !important;
  color: #111 !important;
}
.ds-empty {
  text-align: center;
  padding: 80px 20px;
  color: #9CA3AF;
}
`

const DiscoverStudents = () => {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [isAiMode, setIsAiMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [aiWaking, setAiWaking] = useState(false)

  // Load all students on mount (standard mode)
  const loadStudents = async () => {
    setLoading(true)
    try {
      const res = await api.get('/profile/students')
      setStudents(res.data.data || [])
    } catch (err) {
      console.error('Failed to load students:', err)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  // Filter in standard mode
  const filteredStudents = students.filter(s => {
    if (!search || isAiMode) return true
    const q = search.toLowerCase()
    const skills = (s.profileDetails?.skills || []).join(' ').toLowerCase()
    const name = (s.name || '').toLowerCase()
    const bg = (s.profileDetails?.academicBackground || '').toLowerCase()
    const domain = (s.profileDetails?.industryDomain || '').toLowerCase()
    return name.includes(q) || skills.includes(q) || bg.includes(q) || domain.includes(q)
  })

  // AI search with frontend retry loop (avoids Render's 30s timeout)
  const runAiSearch = async () => {
    if (!search.trim()) return
    setLoading(true)
    setAiWaking(true)

    const MAX_RETRIES = 8
    const RETRY_DELAY_MS = 9000

    let lastErr = null
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const res = await api.post(
          '/ai/recommend-students',
          { query: search, top_n: 9 },
          { timeout: 15000 }
        )
        setAiWaking(false)
        setStudents(res.data.data || [])
        setLoading(false)
        return
      } catch (err) {
        lastErr = err
        const status = err?.response?.status
        const isWaking = err?.response?.data?.waking === true
        if (status === 503 && isWaking && attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, RETRY_DELAY_MS))
          continue
        }
        break
      }
    }

    // All retries failed — fall back to standard filtered list
    console.warn('AI unavailable, falling back.', lastErr?.message)
    setAiWaking(false)
    setIsAiMode(false)
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isAiMode) {
      runAiSearch()
    }
    // standard mode filters are reactive — no action needed
  }

  const getInitials = (name) => (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="ds-root">
        <Container maxWidth="lg">
          {/* ── HERO ── */}
          <Box className="ds-hero">
            <Typography variant="h1" className="ds-title">
              Discover <span>Student Talent</span>
            </Typography>
            <Typography className="ds-subtitle">
              Use AI semantic search or keyword filters to find the perfect student match for your startup project.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box className="ds-search-pill">
                {isAiMode
                  ? <AutoAwesome sx={{ color: '#FFC107', flexShrink: 0 }} />
                  : <Search sx={{ color: '#94A3B8', flexShrink: 0 }} />
                }
                <TextField
                  fullWidth
                  placeholder={isAiMode
                    ? "Describe what you need (e.g. 'React developer with ML skills')…"
                    : "Search by name, skill, or background…"
                  }
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{ '& input': { color: '#111', fontSize: '0.95rem', fontWeight: 500 } }}
                />
                <Button type="submit" className="ds-search-btn">
                  {isAiMode ? '🤖 AI Match' : 'Search'}
                </Button>
              </Box>
            </form>

            {/* Mode toggle */}
            <Box className="ds-mode-row">
              <Button
                className={`ds-mode-btn ${!isAiMode ? 'active' : ''}`}
                onClick={() => setIsAiMode(false)}
              >
                🔍 Keyword Search
              </Button>
              <Button
                className={`ds-mode-btn ${isAiMode ? 'active' : ''}`}
                onClick={() => setIsAiMode(true)}
              >
                ✨ AI Semantic Match
              </Button>
            </Box>
          </Box>

          {/* ── AI WAKING BANNER ── */}
          {aiWaking && (
            <Box className="ds-waking-banner">
              <Box sx={{
                width: 10, height: 10, borderRadius: '50%', background: '#FFC107', flexShrink: 0,
                animation: 'pulse 1.4s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%,100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.4, transform: 'scale(0.6)' }
                }
              }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>
                🧠 AI engine is waking up on Render's free tier — usually takes 30–60 seconds. Retrying automatically…
              </Typography>
            </Box>
          )}

          {/* ── STUDENT CARDS ── */}
          {loading ? (
            <Grid container spacing={3}>
              {[1,2,3,4,5,6].map(i => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Box sx={{
                    height: 220, borderRadius: '20px',
                    background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    '@keyframes shimmer': {
                      '0%': { backgroundPosition: '200% 0' },
                      '100%': { backgroundPosition: '-200% 0' }
                    }
                  }} />
                </Grid>
              ))}
            </Grid>
          ) : filteredStudents.length === 0 ? (
            <Box className="ds-empty">
              <Person sx={{ fontSize: 64, color: '#E5E7EB', mb: 2 }} />
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#374151' }}>
                No students found
              </Typography>
              <Typography sx={{ color: '#9CA3AF', mt: 1 }}>
                Try different keywords or switch to AI Semantic Match
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredStudents.map((student, idx) => {
                  const pd = student.profileDetails || {}
                  const skills = pd.skills || []
                  const initials = getInitials(student.name)
                  return (
                    <Grid item xs={12} sm={6} md={4} key={student._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        style={{ height: '100%' }}
                      >
                        <div className="ds-card">
                          <div className="ds-card-header">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div className="ds-avatar">{initials}</div>
                              {student.confidence && (
                                <div className="ds-badge">
                                  <AutoAwesome sx={{ fontSize: 11, mr: 0.4, verticalAlign: 'middle' }} />
                                  {student.confidence}% Match
                                </div>
                              )}
                            </Box>
                          </div>

                          <div className="ds-card-body">
                            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111', mb: 0.5 }}>
                              {student.name || 'Student'}
                            </Typography>
                            <Typography sx={{ fontSize: '0.82rem', color: '#6B7280', mb: 1, fontWeight: 600 }}>
                              {pd.academicBackground || 'Academic Background N/A'}
                              {pd.industryDomain ? ` · ${pd.industryDomain}` : ''}
                            </Typography>
                            <Typography sx={{ fontSize: '0.85rem', color: '#4B5563', mb: 2, lineHeight: 1.55 }}>
                              {(pd.description || 'No bio provided.').length > 100
                                ? (pd.description || 'No bio provided.').substring(0, 100) + '…'
                                : (pd.description || 'No bio provided.')}
                            </Typography>
                            {skills.length > 0 && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
                                {skills.slice(0, 4).map(skill => (
                                  <Chip key={skill} label={skill} size="small" className="ds-skill-chip" />
                                ))}
                                {skills.length > 4 && (
                                  <Chip label={`+${skills.length - 4}`} size="small" className="ds-skill-chip" />
                                )}
                              </Box>
                            )}
                          </div>

                          <div className="ds-card-footer">
                            <Button className="ds-btn-view">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </Grid>
                  )
                })}
              </AnimatePresence>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  )
}

export default DiscoverStudents
