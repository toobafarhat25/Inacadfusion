import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Grid, LinearProgress, Chip, Container, Button } from '@mui/material'
import { 
  FolderOpen, Users, Shield, ArrowUp, ArrowRight,
  TrendingUp, Calendar, Activity, Sparkles, Building2, CheckCircle2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DashboardSkeleton } from '../../components/shared/SkeletonLoader'
import api from '../../utils/api'
import { createSlug } from '../../utils/slugify'

// ─── SAMPLE MOCKUP THEMED STYLES ──────────────────────────────────────────────
const STYLES = `
.vx-root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #FAFAFA;
  min-height: 100vh;
  color: #1E293B;
  padding-bottom: 60px;
}

/* Mockup Stat Card */
.mockup-stat-card {
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  transition: all 0.2s ease;
  height: 100%;
}
.mockup-stat-card:hover {
  border-color: #D97706;
  box-shadow: 0 4px 20px rgba(217, 119, 6, 0.04);
}

.mockup-icon-box {
  width: 32px; height: 32px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  display: flex; align-items: center; justify-content: center;
  background: #FAFAFA;
}

.mockup-trend-badge {
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 2px;
}
.mockup-trend-badge.up { color: #22C55E; }
.mockup-trend-badge.down { color: #EF4444; }

/* Large Mockup Main Card */
.mockup-card {
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  padding: 24px;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.mockup-header-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #F1F5F9;
  padding-bottom: 14px;
}

.mockup-card-title {
  font-weight: 850;
  font-size: 1.1rem;
  color: #0F172A;
  letter-spacing: -0.02em;
}

/* Category list item style */
.mockup-category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #E2E8F0;
}
.mockup-category-item:last-child {
  border-bottom: none;
}

/* Sales Calendar day badge */
.mockup-cal-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  min-width: 64px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.mockup-cal-day.active {
  background: #D97706;
  border-color: #D97706;
  color: #FFFFFF;
}

/* Custom linear progress indicator */
.mockup-progress-bar {
  height: 8px;
  border-radius: 4px;
  background-color: #F1F5F9;
}
.mockup-progress-bar .bar-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, #D97706, #FFC107);
}
`

// ─── CUSTOM SVG DONUT CHART ──────────────────────────────────────────────────
const DonutChart = ({ data }) => {
  // data = [{ label: 'Web', value: 55, color: '#D97706' }, ...]
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  let currentOffset = 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', my: 2 }}>
      <svg width="130" height="130" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="50" fill="transparent" stroke="#F1F5F9" strokeWidth="14" />
        {data.map((item, index) => {
          const dashArray = 314.16; // 2 * Math.PI * 50
          const dashOffset = dashArray - (item.value / total) * dashArray;
          const angle = (currentOffset / total) * 360 - 90;
          currentOffset += item.value;
          return (
            <circle 
              key={index} cx="70" cy="70" r="50" fill="transparent" 
              stroke={item.color} strokeWidth="14" 
              strokeDasharray={dashArray} strokeDashoffset={dashOffset} 
              strokeLinecap="round" transform={`rotate(${angle} 70 70)`} 
            />
          );
        })}
        <circle cx="70" cy="70" r="42" fill="#FFFFFF" />
        <text x="70" y="66" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '15px', fill: '#1E293B' }}>{total === 1 && data.length === 0 ? '0' : total}</text>
        <text x="70" y="80" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '8px', fill: '#94A3B8' }}>Total Projects</text>
      </svg>
    </Box>
  )
}

const StudentDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ projectsUploaded: 0, activeCollaborations: 0, notifications: 0 })
  const [activeCollabs, setActiveCollabs] = useState([])
  const [upcomingMilestones, setUpcomingMilestones] = useState([])
  const [aiRecommendations, setAiRecommendations] = useState([])
  const [fetchingAi, setFetchingAi] = useState(false)
  
  const [domainData, setDomainData] = useState([])
  const [synergyData, setSynergyData] = useState([])

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projRes, collabRes, notifRes, profileRes] = await Promise.all([
          api.get('/projects/my-projects'),
          api.get('/collaborations'),
          api.get('/notifications'),
          api.get('/profile/me')
        ])
        
        setStats({
          projectsUploaded: projRes.data.data?.length || 0,
          activeCollaborations: collabRes.data.data.filter(c => ['active', 'pending'].includes(c.status)).length || 0,
          notifications: notifRes.data.data.filter(n => !n.isRead).length || 0,
        })

        // Collect all active collaborations
        const active = collabRes.data.data.filter(c => c.status === 'active');
        setActiveCollabs(active)

        // Parse upcoming milestones from active collaborations
        const miles = [];
        collabRes.data.data.forEach(c => {
          if (c.status === 'active' && c.milestones) {
            c.milestones.forEach(m => {
              if (m.status !== 'completed') {
                miles.push({
                  ...m,
                  projectTitle: c.projectId?.title || 'Academic Project',
                  startupName: c.startupId?.name || 'Startup Partner'
                });
              }
            });
          }
        });
        miles.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setUpcomingMilestones(miles);

        // Compute domain distribution from student's projects
        const domains = {};
        projRes.data.data.forEach(p => {
          const d = p.domain || 'Other';
          domains[d] = (domains[d] || 0) + 1;
        });
        
        const palette = ['#D97706', '#FFC107', '#FFEDD5', '#10B981', '#3B82F6'];
        const domainChartData = Object.entries(domains)
          .map(([label, value], idx) => ({ label, value, color: palette[idx % palette.length] }))
          .sort((a, b) => b.value - a.value);
        setDomainData(domainChartData);

        // Compute synergy/category data from active collabs or projects
        const synergyDomains = {};
        collabRes.data.data.forEach(c => {
          if (c.projectId?.domain) {
            synergyDomains[c.projectId.domain] = (synergyDomains[c.projectId.domain] || 0) + 1;
          }
        });
        const totalCollabs = collabRes.data.data.length || 1; // avoid / 0
        const synergyChartData = Object.entries(synergyDomains)
          .map(([name, count], idx) => ({
            name,
            percent: Math.round((count / totalCollabs) * 100),
            color: palette[idx % palette.length]
          }))
          .sort((a, b) => b.percent - a.percent).slice(0, 3);
        setSynergyData(synergyChartData);

        // AI RECOMMENDATION LOGIC
        const studentProfile = profileRes.data.data;
        if (studentProfile) {
          setFetchingAi(true)
          const query = `${studentProfile.bio} ${studentProfile.skills?.join(' ')} ${studentProfile.university}`.trim()
          if (query) {
            try {
              const aiRes = await api.post('/ai/recommend', { query, top_n: 3 })
              setAiRecommendations(aiRes.data.data)
            } catch (err) {
              console.error("AI service error", err)
            } finally {
              setFetchingAi(false)
            }
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <Box sx={{ pt: 12, px: 3 }}><DashboardSkeleton /></Box>

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="vx-root" sx={{ pt: 18, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl" sx={{ px: 0 }}>
          
          {/* ── TOP GREETING HEADER ── */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontWeight: 850, fontSize: { xs: '2rem', md: '2.5rem' }, color: '#0F172A', letterSpacing: '-0.03em', mb: 0.5 }}>
                Academic Portfolio Analytics
              </Typography>
              <Typography sx={{ color: '#64748B', fontWeight: 500, fontSize: '0.95rem' }}>
                Welcome back, {user?.name || 'Student'}. Monitor your project engagement, matching synergy, and active roadmap.
              </Typography>
            </Box>
            <Box sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', px: 2, py: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Activity size={14} color="#D97706" />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>
                Last synced: {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </Typography>
            </Box>
          </Box>

          {/* ── METRICS GRID ROW (Matches Mockup exactly) ── */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            
            {/* Stat Card 1 */}
            <Grid item xs={12} md={4}>
              <div className="mockup-stat-card">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <div className="mockup-icon-box">
                      <FolderOpen size={16} color="#64748B" />
                    </div>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>
                      Portfolio Size
                    </Typography>
                  </Box>
                  <span className="mockup-trend-badge up">
                    <ArrowUp size={12} /> +25% vs last term
                  </span>
                </Box>
                <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', my: 1.5 }}>
                  {stats.projectsUploaded} <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748B' }}>uploaded fyp/projects</span>
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                  Showcased to tech startups
                </Typography>
              </div>
            </Grid>

            {/* Stat Card 2 */}
            <Grid item xs={12} md={4}>
              <div className="mockup-stat-card">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <div className="mockup-icon-box">
                      <Users size={16} color="#64748B" />
                    </div>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>
                      Active Partnerships
                    </Typography>
                  </Box>
                  <span className="mockup-trend-badge up" style={{ color: '#D97706' }}>
                    Active Track
                  </span>
                </Box>
                <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', my: 1.5 }}>
                  {stats.activeCollaborations} <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748B' }}>collaborations</span>
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                  Roadmaps and milestone review
                </Typography>
              </div>
            </Grid>

            {/* Stat Card 3 */}
            <Grid item xs={12} md={4}>
              <div className="mockup-stat-card">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <div className="mockup-icon-box">
                      <Shield size={16} color="#64748B" />
                    </div>
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>
                      Secure Notifications
                    </Typography>
                  </Box>
                  <span className="mockup-trend-badge up">
                    Live WebSockets
                  </span>
                </Box>
                <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', my: 1.5 }}>
                  {stats.notifications} <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748B' }}>unread updates</span>
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                  Real-time sync alert system
                </Typography>
              </div>
            </Grid>

          </Grid>

          {/* ── MIDDLE GRID SECTION (2 Columns) ── */}
          <Grid container spacing={3.5} sx={{ mb: 4 }}>
            
            {/* Left Area: Active roadmaps timeline */}
            <Grid item xs={12} md={8}>
              <div className="mockup-card">
                <div className="mockup-header-area">
                  <Typography className="mockup-card-title">
                    Active Roadmaps & Partnerships
                  </Typography>
                  <Chip label="Real-time Milestones" size="small" sx={{ background: '#FFFBEB', color: '#D97706', fontWeight: 700, fontSize: '0.7rem' }} />
                </div>

                {activeCollabs.length === 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                    <Activity size={32} color="#94A3B8" style={{ marginBottom: '12px' }} />
                    <Typography sx={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
                      No active milestones currently. Start a collaboration to view live roadmaps.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {activeCollabs.map((collab) => {
                      const verified = collab.milestones?.filter(m => m.isVerified).length || 0;
                      const total = collab.milestones?.length || 0;
                      const percentage = total > 0 ? (verified / total) * 100 : 0;

                      return (
                        <Box key={collab._id} sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                                {collab.projectId?.title || 'Academic Project'}
                              </Typography>
                              <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mt: 0.5 }}>
                                Partnered Startup: <span style={{ fontWeight: 700, color: '#D97706' }}>{collab.startupId?.name}</span>
                              </Typography>
                            </Box>
                            <Button 
                              variant="outlined" size="small" 
                              onClick={() => navigate('/student/collaborations')}
                              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', borderColor: '#E2E8F0', color: '#64748B' }}
                            >
                              Manage Roadmap
                            </Button>
                          </Box>

                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
                                Verified Milestones
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#22C55E' }}>
                                {verified}/{total} Verified ({Math.round(percentage)}%)
                              </Typography>
                            </Box>
                            <div className="mockup-progress-bar">
                              <div className="bar-fill" style={{ width: `${percentage}%` }} />
                            </div>
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </div>
            </Grid>

            {/* Right Area: Domain synergy breakdown (Matches "Revenue by Product Category" list!) */}
            <Grid item xs={12} md={4}>
              <div className="mockup-card">
                <div className="mockup-header-area">
                  <Typography className="mockup-card-title">
                    Synergy by Domain Category
                  </Typography>
                </div>
                
                <Box>
                  <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: '#D97706', mb: 1, letterSpacing: '-0.02em' }}>
                    InAcad Synergy
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', mb: 3 }}>
                    Matching profile skills with target industry sectors
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {synergyData.length > 0 ? synergyData.map((cat) => (
                      <Box key={cat.name}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 750, color: '#334155' }}>{cat.name}</Typography>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: cat.color }}>{cat.percent}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" value={cat.percent} 
                          sx={{ 
                            height: 6, borderRadius: 3, 
                            backgroundColor: '#F1F5F9',
                            '& .MuiLinearProgress-bar': { backgroundColor: cat.color, borderRadius: 3 }
                          }} 
                        />
                      </Box>
                    )) : (
                      <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>No collaboration synergy data yet.</Typography>
                    )}
                  </Box>
                </Box>
              </div>
            </Grid>

          </Grid>

          {/* ── BOTTOM GRID ROW (3 Columns like Mockup) ── */}
          <Grid container spacing={3.5}>
            
            {/* Donut Distribution */}
            <Grid item xs={12} md={4}>
              <div className="mockup-card">
                <div className="mockup-header-area">
                  <Typography className="mockup-card-title">
                    Domain Distribution
                  </Typography>
                </div>
                {domainData.length > 0 ? (
                  <>
                    <DonutChart data={domainData} />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, mt: 1 }}>
                      {domainData.map((d, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>{d.label} ({d.value})</Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                ) : (
                  <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>No projects uploaded yet.</Typography>
                  </Box>
                )}
              </div>
            </Grid>

            {/* Sales Calendar Tasks */}
            <Grid item xs={12} md={4}>
              <div className="mockup-card">
                <div className="mockup-header-area">
                  <Typography className="mockup-card-title">
                    Upcoming Deliverables
                  </Typography>
                </div>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  {[...Array(4)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    return (
                      <div key={i} className={`mockup-cal-day ${i === 1 ? 'active' : ''}`}>
                        <Typography sx={{ fontSize: '0.7rem', color: i === 1 ? 'rgba(255,255,255,0.7)' : '#94A3B8', fontWeight: 700 }}>
                          {d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: i === 1 ? 850 : 800 }}>
                          {d.getDate()}
                        </Typography>
                      </div>
                    )
                  })}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {upcomingMilestones.length > 0 ? (
                    upcomingMilestones.slice(0, 3).map((mile, idx) => (
                      <Box key={mile._id || idx} sx={{ p: 1.5, borderLeft: `3px solid ${idx % 2 === 0 ? '#D97706' : '#FFC107'}`, background: '#FAFAFA', borderRadius: '0 8px 8px 0' }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 750, color: '#1E293B', mb: 0.5 }}>{mile.title}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                          Due: {new Date(mile.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {mile.projectTitle}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <Calendar size={24} color="#94A3B8" style={{ marginBottom: '8px' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                        No upcoming deliverables
                      </Typography>
                    </Box>
                  )}
                </Box>
              </div>
            </Grid>

            {/* AI Recommended Talent / Match Synergy */}
            <Grid item xs={12} md={4}>
              <div className="mockup-card">
                <div className="mockup-header-area">
                  <Typography className="mockup-card-title">
                    AI Recommended Synergy
                  </Typography>
                  <Chip label="AI Match" size="small" icon={<Sparkles size={10} />} sx={{ background: '#EEF2FF', color: '#4F46E5', fontWeight: 700, fontSize: '0.65rem' }} />
                </div>

                {fetchingAi ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                    <Activity size={24} color="#94A3B8" className="animate-spin" />
                    <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mt: 1 }}>Analyzing synergy vectors...</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {aiRecommendations && aiRecommendations.length > 0 ? aiRecommendations.slice(0, 3).map((proj) => (
                      <Box
                        key={proj.id}
                        onClick={() => navigate(`/student/project/${createSlug(proj.title, proj.id)}`)}
                        sx={{
                          p: 1.5, border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer',
                          '&:hover': { borderColor: '#D97706', background: '#FFFDF9' },
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#1E293B', mb: 0.5 }}>{proj.title}</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Building2 size={12} /> {proj.domain}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 850, color: '#10B981' }}>{proj.confidence}%</Typography>
                      </Box>
                    )) : (
                      <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                          No AI matches found. Update your profile to get recommendations.
                        </Typography>
                      </Box>
                    )}
                  </Box>

                )}
              </div>
            </Grid>

          </Grid>

        </Container>
      </Box>
    </>
  )
}

export default StudentDashboard
