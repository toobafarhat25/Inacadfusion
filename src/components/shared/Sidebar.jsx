import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Drawer, Box, Typography, Divider } from '@mui/material'
import {
  Dashboard, Person, Work, Notifications,
  Upload, Add, ManageAccounts, Assessment,
  Description, School, Gavel, ChevronRight,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

const DRAWER_WIDTH = 270

// ─── MINIMAL LIGHT THEME STYLES ──────────────────────────────────────────────
const STYLES = `

.vx-sidebar-paper {
  width: ${DRAWER_WIDTH}px !important;
  background: #FFFFFF !important;
  border-right: 1px solid #E5E7EB !important;
  box-shadow: none !important;
  overflow: hidden;
}

.vx-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px 10px 16px;
  margin: 2px 12px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  transition: all 0.2s ease;
  overflow: hidden;
  background: transparent;
}
.vx-nav-item:hover {
  background: #F3F4F6;
}
.vx-nav-item.active {
  background: #FFFBEB;
}

.vx-nav-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
}

.vx-nav-item.active .vx-nav-icon {
  background: #FFC107;
  border-color: #FFC107;
}

.vx-nav-label {
  font-family: 'Inter', system-ui;
  font-weight: 500;
  font-size: 0.85rem;
  color: #4B5563;
  flex: 1;
  transition: color 0.2s ease;
  white-space: nowrap;
}
.vx-nav-item.active .vx-nav-label {
  color: #D97706;
  font-weight: 600;
}
.vx-nav-item:hover .vx-nav-label {
  color: #111827;
}

.vx-nav-arrow {
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
  color: #9CA3AF;
  font-size: 16px !important;
}
.vx-nav-item.active .vx-nav-arrow,
.vx-nav-item:hover .vx-nav-arrow {
  opacity: 1;
  transform: translateX(0);
}
.vx-nav-item.active .vx-nav-arrow {
  color: #D97706;
}

.vx-section-label {
  font-family: 'Inter', system-ui;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #9CA3AF;
  padding: 20px 24px 8px;
}

.vx-user-card {
  margin: 16px;
  padding: 12px;
  border-radius: 12px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  display: flex; align-items: center; gap: 12px;
}

.vx-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFC107, #FF8F00);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Inter', system-ui;
  font-weight: 700; font-size: 0.85rem; color: #000;
  flex-shrink: 0;
}

.vx-sidebar-divider {
  border-color: #E5E7EB !important;
  margin: 8px 16px !important;
}
`

// ─── MENU ITEMS ──────────────────────────────────────────────────────────────
const studentMenu = [
  { section: 'Main', items: [
    { text: 'Dashboard',        icon: <Dashboard />,   path: '/student/dashboard' },
    { text: 'Profile',          icon: <Person />,      path: '/student/profile' },
  ]},
  { section: 'Projects', items: [
    { text: 'Browse Projects',  icon: <Work />,        path: '/student/browse-projects' },
    { text: 'My Projects',      icon: <Upload />,      path: '/student/manage-projects' },
    { text: 'Upload Project',   icon: <Add />,         path: '/student/upload-project' },
  ]},
  { section: 'Collaboration', items: [
    { text: 'My Collaborations', icon: <School />,      path: '/student/collaborations' },
    { text: 'My Letters',        icon: <Description />, path: '/student/letters' },
    { text: 'Notifications',     icon: <Notifications />, path: '/student/notifications' },
  ]},
]

const startupMenu = [
  { section: 'Main', items: [
    { text: 'Dashboard',              icon: <Dashboard />,   path: '/startup/dashboard' },
    { text: 'Profile',                icon: <Person />,      path: '/startup/profile' },
  ]},
  { section: 'Projects', items: [
    { text: 'Post New Project',       icon: <Add />,         path: '/startup/post-project' },
    { text: 'Manage Projects',        icon: <Work />,        path: '/startup/manage-projects' },
  ]},
  { section: 'Collaboration', items: [
    { text: 'Manage Collaborations',  icon: <School />,      path: '/startup/collaborations' },
    { text: 'Issue Exp. Letter',      icon: <Description />, path: '/startup/experience-letter' },
  ]},
]

const adminMenu = [
  { section: 'Main', items: [
    { text: 'Dashboard',       icon: <Dashboard />,      path: '/admin/dashboard' },
  ]},
  { section: 'Management', items: [
    { text: 'Manage Users',    icon: <ManageAccounts />,  path: '/admin/users' },
    { text: 'Manage Projects', icon: <Work />,            path: '/admin/projects' },
    { text: 'Manage Disputes', icon: <Gavel />,           path: '/admin/disputes' },
    { text: 'Reports & Logs',  icon: <Assessment />,      path: '/admin/reports' },
  ]},
]

// ─── ROLE BADGE COLORS ───────────────────────────────────────────────────────
const ROLE_STYLE = {
  student: { label: 'Student',  color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)' },
  startup: { label: 'Startup',  color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)' },
  admin:   { label: 'Admin',    color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
}

// ─── NAV ITEM ────────────────────────────────────────────────────────────────
function NavItem({ item, isActive, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`vx-nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
        <div className="vx-nav-icon">
          {React.cloneElement(item.icon, {
            sx: { fontSize: 16, color: isActive ? '#000000' : '#4B5563' },
          })}
        </div>
        <span className="vx-nav-label">{item.text}</span>
        <ChevronRight className="vx-nav-arrow" />
      </div>
    </motion.div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const menuGroups =
    user?.role === 'student' ? studentMenu :
    user?.role === 'startup' ? startupMenu :
    user?.role === 'admin'   ? adminMenu   : []

  const roleStyle = ROLE_STYLE[user?.role] || ROLE_STYLE.student
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  let itemIndex = 0

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden',
      '&::-webkit-scrollbar': { width: 4 },
      '&::-webkit-scrollbar-track': { background: 'transparent' },
      '&::-webkit-scrollbar-thumb': { background: '#E5E7EB', borderRadius: 2 },
    }}>

      {/* Spacer — pushes content below fixed AppBar/navbar */}
      <Box sx={{ height: { xs: 80, sm: 88 }, flexShrink: 0 }} />
      {/* ── USER CARD ── */}
      <div className="vx-user-card">
        <div className="vx-avatar">{initials}</div>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontFamily: '"Inter",system-ui', fontWeight: 600, fontSize: '0.85rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'User'}
          </Typography>
          <Box component="span" sx={{
            fontFamily: '"Inter",system-ui',
            fontSize: '0.65rem', fontWeight: 600,
            background: roleStyle.bg, color: roleStyle.color,
            px: 1, py: 0.2, borderRadius: '4px',
            display: 'inline-block',
          }}>
            {roleStyle.label}
          </Box>
        </Box>
      </div>

      {/* ── NAVIGATION GROUPS ── */}
      <Box sx={{ flex: 1, py: 1 }}>
        {menuGroups.map((group) => (
          <Box key={group.section}>
            <div className="vx-section-label">{group.section}</div>
            {group.items.map((item) => {
              const idx = itemIndex++
              return (
                <NavItem
                  key={item.text}
                  item={item}
                  isActive={location.pathname === item.path}
                  index={idx}
                  onClick={() => { navigate(item.path); onClose() }}
                />
              )
            })}
          </Box>
        ))}
      </Box>

      {/* ── FOOTER ── */}
      <Divider className="vx-sidebar-divider" />
      <Box sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontFamily: '"Inter",system-ui', fontWeight: 500, fontSize: '0.7rem', color: '#9CA3AF', textAlign: 'center' }}>
          © 2025 InAcadFusion · v1.0
        </Typography>
      </Box>
    </Box>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            background: '#FFFFFF',
            borderRight: '1px solid #E5E7EB',
          },
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0,0,0,0.4)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

export default Sidebar
