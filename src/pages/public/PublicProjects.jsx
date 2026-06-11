import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Box, Container, Typography, Grid } from '@mui/material'
import {
  Search, Business, School, AttachMoney,
  RocketLaunch, Code, Cloud, Security,
  DataObject, TrendingUp, ArrowForward, FilterList,
} from '@mui/icons-material'
import CinematicFooter from '../../components/ui/MotionFooter'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { createSlug } from '../../utils/slugify'

const STYLES = `
.pp-root {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: #FFFFFF;
  color: #0A0A0A;
  overflow-x: hidden;
  min-height: 100vh;
}

/* ── HERO DARK ── */
.pp-hero {
  position: relative;
  background: #000000;
  overflow: hidden;
}
.pp-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: linear-gradient(to bottom, black 30%, transparent 90%);
  -webkit-mask-image: linear-gradient(to bottom, black 30%, transparent 90%);
  pointer-events: none;
  z-index: 1;
}

/* ── GRADIENT TEXT ── */
.pp-gradient-text {
  background: linear-gradient(90deg, #FFFFFF 0%, #FFC107 50%, #FF9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── SEARCH ── */
.pp-search-wrap { position: relative; flex: 1 1 280px; }
.pp-search-input {
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 14px 20px 14px 52px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.9rem;
  color: #0A0A0A;
  outline: none;
  transition: all 0.2s ease;
}
.pp-search-input::placeholder { color: #9CA3AF; }
.pp-search-input:focus {
  border-color: #FFC107;
  box-shadow: 0 0 0 3px rgba(255,193,7,0.12);
}
.pp-search-icon {
  position: absolute; left: 16px; top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  pointer-events: none;
  transition: color 0.2s;
}
.pp-search-wrap:focus-within .pp-search-icon { color: #FFC107; }

/* ── FILTER PILLS ── */
.pp-filter-pill {
  padding: 7px 18px;
  border-radius: 6px;
  border: 1px solid #E5E7EB;
  background: #FFFFFF;
  color: #6B7280;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.pp-filter-pill:hover {
  border-color: #FFC107;
  color: #0A0A0A;
  background: #FFFBEB;
}
.pp-filter-pill.active {
  background: #FFC107;
  border-color: #FFC107;
  color: #000;
  box-shadow: 0 2px 8px rgba(255,193,7,0.3);
}

/* ── PROJECT CARD ── */
.pp-card {
  position: relative;
  background: #FFFFFF;
  border: 1px solid #F3F4F6;
  border-radius: 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
}
.pp-card:hover {
  border-color: rgba(255,193,7,0.4);
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,193,7,0.15);
}

.pp-card-top {
  height: 4px;
  background: linear-gradient(90deg, #FFC107, #FF9800);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.pp-card:hover .pp-card-top { transform: scaleX(1); }

.pp-card-body { padding: 16px 18px; flex-grow: 1; display: flex; flex-direction: column; }
.pp-card-footer {
  padding: 12px 18px;
  border-top: 1px solid #F3F4F6;
  display: flex; align-items: center; justify-content: space-between;
}

/* ── CHIPS ── */
.pp-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 4px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.72rem; font-weight: 600;
}
.pp-chip-startup { background: rgba(255,193,7,0.12); color: #92400E; }
.pp-chip-student { background: rgba(59,130,246,0.1); color: #1E40AF; }
.pp-chip-domain  { background: #F3F4F6; color: #6B7280; }
.pp-chip-skill   { background: #F9FAFB; color: #9CA3AF; border: 1px solid #F3F4F6; }

/* ── VIEW BTN ── */
.pp-view-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.82rem; font-weight: 600;
  color: #FFC107;
  background: transparent; border: none; cursor: pointer; padding: 0;
  transition: all 0.2s ease;
}
.pp-view-btn:hover { color: #D97706; gap: 10px; }

/* ── SKELETON ── */
.pp-skeleton {
  border-radius: 12px;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: pp-shimmer 1.6s infinite;
}
@keyframes pp-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── STAT PILL ── */
.pp-stat-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 18px; border-radius: 100px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  font-family: 'Inter', system-ui, sans-serif;
}

/* ── CTA BUTTON ── */
.pp-cta-btn {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 600; font-size: 0.95rem;
  padding: 14px 32px; border-radius: 8px;
  cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
  transition: all 0.2s ease; border: none;
}
.pp-cta-primary {
  background: #FFFFFF; color: #000;
  box-shadow: 0 4px 14px rgba(255,255,255,0.15);
}
.pp-cta-primary:hover { background: #F0F0F0; transform: translateY(-2px); }
.pp-cta-secondary {
  background: rgba(255,255,255,0.04); color: #FFF;
  border: 1px solid rgba(255,255,255,0.1);
}
.pp-cta-secondary:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.08); transform: translateY(-2px); }
`

// HELPERS
const domainIcon = (domain = '') => {
  const d = domain.toLowerCase()
  if (d.includes('web') || d.includes('frontend') || d.includes('backend')) return <Code sx={{ fontSize: 13 }} />
  if (d.includes('cloud') || d.includes('devops')) return <Cloud sx={{ fontSize: 13 }} />
  if (d.includes('security') || d.includes('cyber')) return <Security sx={{ fontSize: 13 }} />
  if (d.includes('data') || d.includes('ml') || d.includes('ai')) return <DataObject sx={{ fontSize: 13 }} />
  return <RocketLaunch sx={{ fontSize: 13 }} />
}

// PROJECT CARD
function ProjectCard({ project, onView, index }) {
  const isStartup = project.uploadedBy?.role === 'startup'
  const skills = (project.technologies || project.requiredSkills || []).slice(0, 4)
  const extras = (project.technologies || project.requiredSkills || []).length - 4

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: '100%', width: '100%' }}
    >
      <div className="pp-card" onClick={() => onView(project)}>
        <div className="pp-card-top" />
        <div className="pp-card-body">
          {/* Header chips */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {isStartup
                ? <span className="pp-chip pp-chip-startup"><Business sx={{ fontSize: 11 }} />Startup</span>
                : <span className="pp-chip pp-chip-student"><School sx={{ fontSize: 11 }} />Student</span>
              }
              <span className="pp-chip pp-chip-domain">
                {domainIcon(project.domain)}{project.domain}
              </span>
            </Box>
            {project.cost && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AttachMoney sx={{ fontSize: 14, color: '#FFC107' }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#92400E' }}>
                  {project.cost}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Title */}
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3, color: '#111827', mb: 1 }}>
            {project.title}
          </Typography>

          {/* Description */}
          <Typography sx={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#6B7280', flexGrow: 1, mb: 1.5 }}>
            {project.description?.substring(0, 80)}
            {(project.description?.length || 0) > 80 ? '...' : ''}
          </Typography>

          {/* Skills */}
          {skills.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {skills.slice(0, 3).map((s) => <span key={s} className="pp-chip pp-chip-skill">{s}</span>)}
              {(extras + (skills.length > 3 ? skills.length - 3 : 0)) > 0 && <span className="pp-chip pp-chip-skill">+{extras + (skills.length > 3 ? skills.length - 3 : 0)}</span>}
            </Box>
          )}
        </div>

        {/* Footer */}
        <div className="pp-card-footer">
          <Typography sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '55%' }}>
            {project.uploadedBy?.name || 'Anonymous'}
          </Typography>
          <button className="pp-view-btn">
            View <ArrowForward sx={{ fontSize: 12 }} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const SkeletonCard = () => (
  <Box sx={{ height: 200 }}><div className="pp-skeleton" style={{ height: '100%' }} /></Box>
)

// MAIN COMPONENT
const PublicProjects = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [domainFilter, setDomainFilter] = useState('all')
  const [uploaderFilter, setUploaderFilter] = useState('all')

  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, -80])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3])

  useEffect(() => {
    api.get('/projects')
      .then((res) => setProjects(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const domains = ['all', ...new Set(projects.map((p) => p.domain).filter(Boolean))]

  const filtered = projects.filter((p) => {
    const q = searchTerm.toLowerCase()
    const matchSearch = p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    const matchDomain = domainFilter === 'all' || p.domain === domainFilter
    const role = p.uploadedBy?.role || 'unknown'
    const matchUploader = uploaderFilter === 'all' ||
      (uploaderFilter === 'startup' && role === 'startup') ||
      (uploaderFilter === 'student' && role === 'student')
    return matchSearch && matchDomain && matchUploader
  })

  const handleView = (project) => {
    if (!isAuthenticated) return navigate('/login', { state: { from: '/projects', projectId: project._id } })
    const u = JSON.parse(localStorage.getItem('user') || '{}')
    navigate(`/${u.role === 'student' ? 'student' : 'student'}/project/${createSlug(project.title, project._id)}`)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="pp-root">

        {/* ═══ DARK HERO ═══ */}
        <Box className="pp-hero">
          {/* Aurora glow 1 */}
          <Box component={motion.div}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            sx={{
              position: 'absolute', top: '10%', left: '30%',
              width: '80vw', height: '80vh',
              background: 'radial-gradient(ellipse, rgba(255,193,7,0.1) 0%, rgba(255,87,34,0.04) 30%, transparent 60%)',
              filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none',
            }}
          />
          {/* Aurora glow 2 */}
          <Box component={motion.div}
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            sx={{
              position: 'absolute', bottom: '-10%', right: '-10%',
              width: '70vw', height: '70vh',
              background: 'radial-gradient(circle, rgba(255,193,7,0.07) 0%, transparent 50%)',
              filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none',
            }}
          />

          {/* Shooting laser lines */}
          <Box component={motion.div}
            animate={{ x: ['-20vw', '120vw'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            sx={{ position: 'absolute', top: '25%', left: 0, width: '250px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,193,7,0.8), transparent)', zIndex: 1, pointerEvents: 'none' }}
          />
          <Box component={motion.div}
            animate={{ x: ['120vw', '-20vw'] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 3 }}
            sx={{ position: 'absolute', top: '75%', right: 0, width: '350px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,87,34,0.6), transparent)', zIndex: 1, pointerEvents: 'none' }}
          />
          <Box component={motion.div}
            animate={{ y: ['-20vh', '120vh'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 1 }}
            sx={{ position: 'absolute', left: '20%', top: 0, width: '1px', height: '250px', background: 'linear-gradient(180deg, transparent, rgba(255,193,7,0.5), transparent)', zIndex: 1, pointerEvents: 'none' }}
          />
          <Box component={motion.div}
            animate={{ y: ['120vh', '-20vh'] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 5 }}
            sx={{ position: 'absolute', right: '25%', bottom: 0, width: '1px', height: '200px', background: 'linear-gradient(180deg, transparent, rgba(255,193,7,0.4), transparent)', zIndex: 1, pointerEvents: 'none' }}
          />

          <Box
            ref={heroRef}
            component={motion.div}
            sx={{
              position: 'relative', zIndex: 2,
              pt: { xs: 16, md: 22 }, pb: { xs: 10, md: 16 },
              px: { xs: 3, md: 6 },
              textAlign: 'center',
            }}
            style={{ y: heroY, opacity: heroOpacity }}
          >



            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.1 }}>
              <Typography variant="h1" sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                lineHeight: 1.05, letterSpacing: '-0.03em',
                color: '#FFFFFF', mb: 3,
              }}>
                Where Ideas Find<br />
                <Box component="span" className="pp-gradient-text">Their Builders.</Box>
              </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <Typography sx={{
                fontWeight: 400, fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.7, color: 'rgba(255,255,255,0.5)',
                maxWidth: 560, mx: 'auto', mb: 5,
              }}>
                Browse real-world projects posted by startups and students. Sign in to collaborate, apply, and start building your portfolio.
              </Typography>
            </motion.div>

            {/* Stat pills */}
            {!loading && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div className="pp-stat-pill">
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#FFC107', boxShadow: '0 0 6px rgba(255,193,7,0.7)' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#FFF' }}>
                      {filtered.length} Projects Live
                    </Typography>
                  </div>
                  <div className="pp-stat-pill">
                    <Business sx={{ fontSize: 15, color: '#FFC107' }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                      {projects.filter(p => p.uploadedBy?.role === 'startup').length} Startups
                    </Typography>
                  </div>
                  <div className="pp-stat-pill">
                    <School sx={{ fontSize: 15, color: '#60A5FA' }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                      {projects.filter(p => p.uploadedBy?.role === 'student').length} Students
                    </Typography>
                  </div>
                </Box>
              </motion.div>
            )}
          </Box>
        </Box>

        {/* ═══ STICKY FILTER BAR ═══ */}
        <Box sx={{
          position: 'sticky', top: { xs: 'auto', sm: 64 }, zIndex: 100,
          borderBottom: '1px solid #F3F4F6',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          py: 2, px: { xs: 2, md: 5 },
        }}>
          <Box sx={{ maxWidth: '1400px', mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { md: 'center' } }}>
            <div className="pp-search-wrap">
              <Search className="pp-search-icon" />
              <input
                className="pp-search-input"
                placeholder="Search projects, skills, domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', mr: 0.5 }}>
                Domain
              </Typography>
              {domains.slice(0, 6).map((d) => (
                <button key={d} className={`pp-filter-pill ${domainFilter === d ? 'active' : ''}`} onClick={() => setDomainFilter(d)}>
                  {d === 'all' ? 'All' : d}
                </button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              {[['all', 'Everyone'], ['startup', 'Startups'], ['student', 'Students']].map(([v, l]) => (
                <button key={v} className={`pp-filter-pill ${uploaderFilter === v ? 'active' : ''}`} onClick={() => setUploaderFilter(v)}>
                  {l}
                </button>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ═══ GRID ═══ */}
        <Box sx={{ py: { xs: 5, md: 8 }, background: '#FAFAFA' }}>
          <Container maxWidth="xl">
            {loading ? (
              <Grid container spacing={2}>
                {[...Array(6)].map((_, i) => <Grid item xs={12} sm={6} md={4} key={i}><SkeletonCard /></Grid>)}
              </Grid>
            ) : filtered.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 12 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#111827', mb: 1.5 }}>No Projects Found</Typography>
                <Typography sx={{ fontSize: '0.95rem', color: '#6B7280', mb: 4 }}>Try adjusting your search or filters.</Typography>
                <button className="pp-filter-pill active" onClick={() => { setSearchTerm(''); setDomainFilter('all'); setUploaderFilter('all') }}>
                  Reset Filters
                </button>
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#9CA3AF' }}>
                    Showing <strong style={{ color: '#111827' }}>{filtered.length}</strong> {filtered.length === 1 ? 'project' : 'projects'}
                    {searchTerm && ` for "${searchTerm}"`}
                  </Typography>
                </Box>

                <AnimatePresence mode="wait">
                  <Grid container spacing={2} key={`${domainFilter}-${uploaderFilter}-${searchTerm}`}>
                    {filtered.map((project, i) => (
                      <Grid item xs={12} sm={6} md={4} key={project._id} sx={{ display: 'flex' }}>
                        <ProjectCard project={project} onView={handleView} index={i} />
                      </Grid>
                    ))}
                  </Grid>
                </AnimatePresence>
              </>
            )}
          </Container>
        </Box>

        {/* ═══ CTA (guests only) ═══ */}
        {!isAuthenticated && (
          <Box sx={{
            py: { xs: 8, md: 12 }, px: { xs: 2, md: 6 },
            background: '#FFFFFF',
            borderTop: '1px solid #F3F4F6',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Subtle dot pattern */}
            <Box sx={{
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4,
              backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <Box sx={{
                  background: '#FAFAFA',
                  borderRadius: '16px',
                  border: '1px solid #F3F4F6',
                  p: { xs: 4, md: 6 },
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Top mustard accent */}
                  <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80px', height: '4px', background: 'linear-gradient(90deg, #FFC107, #FF9800)', borderRadius: '0 0 4px 4px' }} />

                  <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.5rem' }, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#111827', mb: 2 }}>
                    Ready to build something{' '}
                    <Box component="span" sx={{ color: '#FFC107' }}>meaningful?</Box>
                  </Typography>

                  <Typography sx={{ fontWeight: 400, fontSize: '1rem', color: '#6B7280', maxWidth: 480, mx: 'auto', mb: 4, lineHeight: 1.7 }}>
                    Join thousands of students and startups collaborating on real-world projects. Your next opportunity is one click away.
                  </Typography>

                  {/* Stats row */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 3, md: 6 }, mb: 5, flexWrap: 'wrap' }}>
                    {[
                      { value: `${projects.length}+`, label: 'Live Projects' },
                      { value: `${projects.filter(p => p.uploadedBy?.role === 'startup').length}`, label: 'Startups' },
                      { value: `${projects.filter(p => p.uploadedBy?.role === 'student').length}`, label: 'Students' },
                    ].map((s) => (
                      <Box key={s.label} sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#111827' }}>{s.value}</Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Box component="button" onClick={() => navigate('/register')} sx={{
                      background: '#FFC107', color: '#000', border: 'none', cursor: 'pointer',
                      fontFamily: '"Inter", system-ui', fontWeight: 700, fontSize: '0.95rem',
                      px: 4, py: 1.5, borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(255,193,7,0.3)',
                      display: 'flex', alignItems: 'center', gap: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(255,193,7,0.4)' },
                    }}>
                      <RocketLaunch sx={{ fontSize: 18 }} /> Get Started Free
                    </Box>
                    <Box component="button" onClick={() => navigate('/login')} sx={{
                      background: '#FFF', color: '#111827', cursor: 'pointer',
                      border: '1px solid #E5E7EB',
                      fontFamily: '"Inter", system-ui', fontWeight: 600, fontSize: '0.95rem',
                      px: 4, py: 1.5, borderRadius: '8px',
                      display: 'flex', alignItems: 'center', gap: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: '#FFC107', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
                    }}>
                      Sign In
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Container>
          </Box>
        )}

        <CinematicFooter />
      </Box>
    </>
  )
}

export default PublicProjects
