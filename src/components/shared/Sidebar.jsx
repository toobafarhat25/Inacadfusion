import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Drawer, Box, Typography, Divider } from '@mui/material'
import {
  Dashboard, Person, Work, Notifications,
  Upload, Add, ManageAccounts, Assessment,
  Description, School, Gavel, ChevronRight, Chat
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
  padding: 10px 16px;
  margin: 2px 10px;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  transition: all 0.18s ease;
  overflow: hidden;
  background: transparent;
}
.vx-nav-item:hover {
  background: #FFF8E1;
}
.vx-nav-item.active {
  background: #FFC107;
  box-shadow: 0 4px 14px rgba(255, 193, 7, 0.35);
}

.vx-nav-icon {
  width: 30px; height: 30px;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.18s ease;
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
}
.vx-nav-item:hover .vx-nav-icon {
  background: #FFF3CD;
  border-color: #FFECB3;
}
.vx-nav-item.active .vx-nav-icon {
  background: rgba(0,0,0,0.08);
  border-color: transparent;
}

.vx-nav-label {
  font-family: 'Inter', system-ui;
  font-weight: 500;
  font-size: 0.84rem;
  color: #4B5563;
  flex: 1;
  transition: color 0.18s ease;
  white-space: nowrap;
}
.vx-nav-item.active .vx-nav-label {
  color: #000000;
  font-weight: 700;
}
.vx-nav-item:hover .vx-nav-label {
  color: #B45309;
}

.vx-nav-arrow {
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.18s ease;
  color: #9CA3AF;
  font-size: 16px !important;
}
.vx-nav-item.active .vx-nav-arrow,
.vx-nav-item:hover .vx-nav-arrow {
  opacity: 1;
  transform: translateX(0);
}
.vx-nav-item.active .vx-nav-arrow {
  color: #000000;
}
.vx-nav-item:hover .vx-nav-arrow {
  color: #B45309;
}

.vx-section-label {
  font-family: 'Inter', system-ui;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #B45309;
  padding: 18px 22px 6px;
}

.vx-user-card {
  margin: 12px 14px;
  padding: 12px;
  border-radius: 12px;
  background: #FFFBEB;
  border: 1px solid #FDE68A;
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
  box-shadow: 0 2px 8px rgba(255,193,7,0.4);
}

.vx-sidebar-divider {
  border-color: #FDE68A !important;
  margin: 8px 14px !important;
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
    { text: 'Messages',          icon: <Chat />,         path: '/student/messages' },
    { text: 'My Letters',        icon: <Description />,  path: '/student/letters' },
    { text: 'Notifications',     icon: <Notifications />, path: '/student/notifications' },
  ]},
]

const startupMenu = [
  { section: 'Main', items: [
    { text: 'Dashboard',              icon: <Dashboard />,   path: '/startup/dashboard' },
    { text: 'Profile',                icon: <Person />,      path: '/startup/profile' },
  ]},
  { section: 'Discovery', items: [
    { text: 'Discover Students',      icon: <Person />,      path: '/startup/discover-students' },
  ]},
  { section: 'Projects', items: [
    { text: 'Post New Project',       icon: <Add />,         path: '/startup/post-project' },
    { text: 'Manage Projects',        icon: <Work />,        path: '/startup/manage-projects' },
  ]},
  { section: 'Collaboration', items: [
    { text: 'Manage Collaborations',  icon: <School />,      path: '/startup/collaborations' },
    { text: 'Messages',               icon: <Chat />,         path: '/startup/messages' },
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
  student: { label: 'Student',  color: '#92400E', bg: 'rgba(255, 193, 7, 0.15)' },
  startup: { label: 'Startup',  color: '#92400E', bg: 'rgba(255, 193, 7, 0.15)' },
  admin:   { label: 'Admin',    color: '#92400E', bg: 'rgba(255, 193, 7, 0.15)' },
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
            sx: { fontSize: 16, color: isActive ? '#000000' : '#6B7280' },
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
