import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Grid, LinearProgress } from '@mui/material'
import { 
  Users, Briefcase, GraduationCap, BarChart3, 
  ArrowUp, TrendingUp, Code2 
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { DashboardSkeleton } from '../../components/shared/SkeletonLoader'
import api from '../../utils/api'

// ─── MINIMALIST LIGHT THEME STYLES ──────────────────────────────────────────────
const STYLES = `

.vx-root { 
  font-family: 'Inter', 'Inter', system-ui, sans-serif; 
  -webkit-font-smoothing: antialiased; 
  background: #FAFAFA; 
  min-height: 100vh; 
  color: #111827;
  padding-bottom: 40px;
}

/* Minimalist Cards */
.vx-card { 
  background: #FFFFFF; 
  border-radius: 12px; 
  padding: 32px; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.02); 
  border: 1px solid #E5E7EB; 
  height: 100%;
}

.vx-stat-card { 
  background: #FFFFFF; 
  border-radius: 12px; 
  padding: 24px; 
  position: relative; 
  overflow: hidden; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.02); 
  border: 1px solid #E5E7EB; 
  transition: border-color 0.2s ease; 
  height: 100%; 
}
.vx-stat-card:hover { 
  border-color: #D1D5DB;
}

.vx-icon-box { 
  width: 48px; 
  height: 48px; 
  border-radius: 8px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-shrink: 0; 
}

.vx-section-title { 
  font-family: 'Inter', system-ui; 
  font-weight: 600; 
  font-size: 0.85rem; 
  color: #6B7280; 
  text-transform: uppercase;
  letter-spacing: 0.05em; 
}

.vx-greeting { 
  background: transparent;
  padding: 10px 0 30px 0; 
  display: flex; 
  align-items: flex-end; 
  justify-content: space-between; 
}
`

const PIE_COLORS = {
  user:   ['#FFC107', '#7367F0'],
  project:['#10B981', '#FF9F43'],
  status: ['#00CFE8', '#EF4444', '#10B981'],
}

const STAT_CONFIGS = [
  { color: '#FFC107', bg: 'rgba(255,193,7,0.12)', label: 'Total Users',        Icon: Users,        dataKey: 'users.total' },
  { color: '#7367F0', bg: 'rgba(115,103,240,0.12)', label: 'Total Projects',     Icon: Briefcase,    dataKey: 'projects.total' },
  { color: '#10B981', bg: 'rgba(16,185,129,0.12)', label: 'Collaborations',     Icon: GraduationCap,dataKey: 'collaborations.total' },
  { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Total Students',     Icon: BarChart3,    dataKey: 'users.students' },
]

function getNestedProp(obj, path) {
  return path.split('.').reduce((acc, k) => acc?.[k], obj) ?? 0
}

function StatCard({ label, value, Icon, color, bg, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: '100%' }}
    >
      <div className="vx-stat-card">
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <div className="vx-icon-box" style={{ background: bg, width: 36, height: 36, borderRadius: '6px' }}>
              <Icon size={18} color={color} strokeWidth={2} />
            </div>
            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#6B7280' }}>
              {label}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, borderRadius: '4px', background: 'rgba(16,185,129,0.1)' }}>
            <ArrowUp size={12} color="#10B981" />
            <Typography sx={{ fontWeight: 600, fontSize: '0.65rem', color: '#10B981' }}>Live</Typography>
          </Box>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '2rem', lineHeight: 1, color: '#111827', letterSpacing: '-0.02em', mb: 0.5, mt: 'auto' }}>
          {value}
        </Typography>
      </div>
    </motion.div>
  )
}

// Custom Tooltip for recharts
const VxTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, padding: '12px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: '"Inter", system-ui' }}>
      {label && <p style={{ margin: 0, color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>{label}</p>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || '#111827' }} />
          <p style={{ margin: 0, color: '#111827', fontWeight: 600, fontSize: '0.9rem' }}>
            {p.name ? `${p.name}: ` : ''}{p.value}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) return <Box sx={{ pt: 10, px: 3 }}><DashboardSkeleton /></Box>

  const userPieData    = [{ name: 'Students', value: stats.users.students }, { name: 'Startups', value: stats.users.startups }]
  const projectPieData = [{ name: 'Student FYP', value: stats.projects.fyp }, { name: 'Startup Ideas', value: stats.projects.ideas }]
  const statusPieData  = [{ name: 'Active', value: stats.collaborations.active }, { name: 'Pending', value: stats.collaborations.pending }, { name: 'Completed', value: stats.collaborations.completed }]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="vx-root" sx={{ pt: { xs: 9, md: 10 }, px: { xs: 2, md: 3 }, pb: 6 }}>

        {/* ── GREETING BANNER ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="vx-greeting" style={{ marginBottom: 32 }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                Overview
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '2.5rem' }, color: '#111827', letterSpacing: '-0.03em', mb: 0.5, lineHeight: 1.1 }}>
                Admin Dashboard
              </Typography>
              <Typography sx={{ fontWeight: 400, fontSize: '1rem', color: '#6B7280', mt: 1.5 }}>
                Welcome back! Here's an overview of the platform's vital stats.
              </Typography>
            </Box>
            {/* Live indicator */}
            <Box sx={{ position: 'relative', zIndex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5, background: '#FFFFFF', border: '1px solid #E5E7EB', px: 3, py: 1.5, borderRadius: '6px' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 12px rgba(16,185,129,0.4)', animation: 'pulse 2s ease-in-out infinite', '@keyframes pulse': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.3)' } } }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#111827' }}>
                System Online
              </Typography>
            </Box>
          </div>
        </motion.div>

        {/* ── 4 STAT CARDS ── */}
        <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
          {STAT_CONFIGS.map((cfg, i) => (
            <Grid item xs={12} sm={6} md={3} key={cfg.label}>
              <StatCard
                label={cfg.label}
                value={getNestedProp(stats, cfg.dataKey)}
                Icon={cfg.Icon}
                color={cfg.color}
                bg={cfg.bg}
                index={i}
              />
            </Grid>
          ))}
        </Grid>

        {/* ── PIE CHARTS ROW ── */}
        <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
          {[
            { title: 'User Distribution',      data: userPieData,    colors: PIE_COLORS.user },
            { title: 'Project Types',           data: projectPieData, colors: PIE_COLORS.project },
            { title: 'Collaboration Status',    data: statusPieData,  colors: PIE_COLORS.status },
          ].map(({ title, data, colors }, i) => {
            const hasData = data.some(d => d.value > 0);
            const chartData = hasData ? data : [{ name: 'No Data Yet', value: 1, color: '#F1F5F9' }];

            return (
              <Grid item xs={12} md={4} key={title}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.3 + i * 0.1 }} style={{ height: '100%' }}>
                  <div className="vx-card">
                    <Typography className="vx-section-title" sx={{ mb: 3 }}>{title}</Typography>
                    {hasData ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1, height: 220, justifyContent: 'center' }}>
                        {data.map((item, idx) => {
                          const total = data.reduce((acc, curr) => acc + curr.value, 0)
                          const percentage = total === 0 ? 0 : Math.round((item.value / total) * 100)
                          const barColor = colors[idx % colors.length]
                          
                          return (
                            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + (idx * 0.1) }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#4B5563' }}>
                                  {item.name}
                                </Typography>
                                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#111827' }}>
                                  {item.value} <span style={{ color: barColor, fontSize: '0.75rem', marginLeft: 6 }}>{percentage}%</span>
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={percentage} 
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 4, 
                                  backgroundColor: '#F3F4F6',
                                  '& .MuiLinearProgress-bar': {
                                    background: barColor,
                                    borderRadius: 4
                                  }
                                }} 
                              />
                            </motion.div>
                          )
                        })}
                      </Box>
                    ) : (
                      <Box sx={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                        <Box sx={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '8px solid #F1F5F9' }} />
                          <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Empty
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          {data.map((d, dIdx) => (
                            <Box key={dIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#E2E8F0' }} />
                              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#94A3B8' }}>{d.name}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </div>
                </motion.div>
              </Grid>
            )
          })}
        </Grid>

        {/* ── BAR CHART ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}>
          <div className="vx-card">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Box>
                <Typography className="vx-section-title" sx={{ color: '#111827', mb: 0.5 }}>Most Common Skills</Typography>
                <Typography sx={{ fontFamily: '"Inter",system-ui', fontWeight: 400, fontSize: '0.85rem', color: '#6B7280', mt: 0.3 }}>
                  Top skills across all uploaded projects
                </Typography>
              </Box>
              <div className="vx-icon-box" style={{ background: '#F3F4F6', width: 40, height: 40, borderRadius: '8px' }}>
                <Code2 size={20} color="#4B5563" />
              </div>
            </Box>
            {stats.mostCommonSkills && stats.mostCommonSkills.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.mostCommonSkills} barSize={40}>
                  <XAxis
                    dataKey="skill"
                    tick={{ fontWeight: 600, fontSize: 13, fill: '#A0AEC0' }}
                    axisLine={false} tickLine={false} dy={10}
                  />
                  <YAxis
                    tick={{ fontWeight: 600, fontSize: 12, fill: '#A0AEC0' }}
                    axisLine={false} tickLine={false} dx={-10}
                  />
                  <Tooltip content={<VxTooltip />} cursor={{ fill: 'rgba(255,193,7,0.05)', radius: 12 }} />
                  <Bar dataKey="count" name="Projects" fill="#FFC107" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Code2 size={48} color="#E2E8F0" style={{ marginBottom: 12 }} />
                <Typography sx={{ fontWeight: 600, color: '#94A3B8' }}>No Skill Data Available</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8', mt: 1 }}>Projects have not logged required skills yet.</Typography>
              </Box>
            )}
          </div>
        </motion.div>

      </Box>
    </>
  )
}

export default AdminDashboard
