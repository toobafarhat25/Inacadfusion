import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Dashboard,
  Notifications,
  Home,
  Info,
  Mail,
  RocketLaunch
} from '@mui/icons-material'
import Badge from '@mui/material/Badge'
import { useAuth } from '../../context/AuthContext'
import api, { API_BASE_URL } from '../../utils/api'
import TubeLightNavbar from './../ui/TubeLightNavbar'

const AppBar = ({ onMenuClick, drawerOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  React.useEffect(() => {
    // Use IntersectionObserver on the hero sentinel element.
    // When hero-sentinel is NOT visible, we've scrolled past the hero.
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) {
      // Fallback: if no sentinel (other pages), check scroll position
      const handleScroll = () => {
        const scrollY = window.pageYOffset ?? document.documentElement.scrollTop ?? 0
        setScrolled(scrollY > 80)
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      document.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', handleScroll)
        document.removeEventListener('scroll', handleScroll)
      }
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting = hero sentinel IS visible = still in hero
        // !entry.isIntersecting = sentinel left viewport = scrolled past hero
        setScrolled(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '0px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const fetchUnread = async () => {
      try {
        if (user) {
          const res = await api.get('/notifications')
          const unread = res.data.data.filter(n => !n.isRead)
          setUnreadCount(unread.length)
        }
      } catch (err) {
        console.error('Failed to fetch unread notifications', err)
      }
    }
    fetchUnread()

    window.addEventListener('notifications_updated', fetchUnread)

    // Connect to Socket.io
    const socket = io(API_BASE_URL)

    socket.on('notification', (data) => {
      const currentUserId = user?.id || user?._id
      if (data.userId === currentUserId) {
        fetchUnread()
        window.dispatchEvent(new Event('notifications_updated_realtime'))
      }
    })

    return () => {
      window.removeEventListener('notifications_updated', fetchUnread)
      socket.disconnect()
    }
  }, [user])

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    handleClose()
  }

  const handleProfile = () => {
    if (user?.role === 'student') {
      navigate('/student/profile')
    } else if (user?.role === 'startup') {
      navigate('/startup/profile')
    }
    handleClose()
  }

  const isPublicPage = !user || location.pathname.startsWith('/login') || location.pathname.startsWith('/register')
  const isLandingPage = location.pathname === '/'
  const isProjectsPage = location.pathname === '/projects'
  const isDarkHeroPage = isLandingPage || isProjectsPage
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register')

  let appBarStyle = {
    zIndex: (theme) => theme.zIndex.drawer + 1,
    transition: 'all 0.3s ease',
  }

  if (isAuthPage) {
    appBarStyle = {
      ...appBarStyle,
      width: { xs: '90%', md: '80%', lg: '60%' },
      left: '50%',
      transform: 'translateX(-50%)',
      top: { xs: 16, md: 24 },
      borderRadius: '50px',
      backgroundColor: 'rgba(18, 18, 18, 0.85)', // Dark premium pill
      backdropFilter: 'blur(24px) saturate(200%)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      color: '#FFFFFF',
    }
  } else if (isDarkHeroPage) {
    appBarStyle = {
      ...appBarStyle,
      backgroundColor: 'rgba(26, 26, 26, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      color: '#FFFFFF',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 193, 7, 0.2)',
      borderBottom: '1px solid rgba(255, 193, 7, 0.1)',
    }
  } else {
    appBarStyle = {
      ...appBarStyle,
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      color: '#000000',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    }
  }

  const publicItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'About', url: '/about', icon: Info },
    { name: 'Projects', url: '/projects', icon: RocketLaunch },
    { name: 'Contact', url: '/contact', icon: Mail },
  ]

  const loggedInItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Dashboard', url: `/${user?.role}/dashboard`, icon: Dashboard },
    { name: 'About', url: '/about', icon: Info },
    { name: 'Projects', url: '/projects', icon: RocketLaunch },
    { name: 'Contact', url: '/contact', icon: Mail },
  ]

  const navItems = user ? loggedInItems : publicItems;

  return (
    <>
      {/* Absolute Header for Logo and Drawer Toggle — CONSISTENT ON ALL PAGES */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 12, sm: 16 },
          left: { xs: 12, sm: 24 },
          display: 'flex',
          alignItems: 'center',
          zIndex: 1300,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          // Same dark glass pill on ALL pages — matches TubeLightNavbar style
          backgroundColor: 'rgba(18, 18, 18, 0.75)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50px',
          px: 1.5,
          py: 0.75,
        }}
      >
        {user && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onMenuClick}
            edge="start"
            size="small"
            sx={{
              mr: 1.5,
              p: 0.75,
              backgroundColor: 'rgba(255, 193, 7, 0.15)',
              color: '#FFC107',
              '&:hover': {
                backgroundColor: 'rgba(255, 193, 7, 0.28)',
              },
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 900,
            cursor: 'pointer',
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            letterSpacing: '-0.03em',
            fontFamily: '"Inter", system-ui, sans-serif',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              opacity: 0.9,
              transform: 'scale(1.02)',
            },
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onClick={() => navigate('/')}
        >
          <Box
            component="span"
            sx={{
              color: '#FFC107',
              transition: 'color 0.3s ease',
            }}
          >
            InAcad
          </Box>
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #FFC107 0%, #FFD54F 50%, #FFC107 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 12px rgba(255, 193, 7, 0.4))',
              transition: 'filter 0.3s ease',
            }}
          >
            Fusion
          </Box>
        </Typography>
      </Box>


      {/* Floating Tube Light Navbar */}
      <TubeLightNavbar items={navItems}>
        {isPublicPage ? (
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FFC107',
              color: '#000000',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: { xs: '0.8rem', md: '0.9rem' },
              px: { xs: 2 },
              py: { xs: 0.6 },
              borderRadius: '50px',
              boxShadow: '0 4px 12px rgba(255, 193, 7, 0.35)',
              '&:hover': {
                backgroundColor: '#FFA000',
                boxShadow: '0 6px 16px rgba(255, 193, 7, 0.45)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={() => navigate('/login')}
          >
            Get Started
          </Button>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => navigate(`/${user.role}/notifications`)}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFC107',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { backgroundColor: '#FF5252' } }}>
                <Notifications fontSize="small" />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleMenu}
              size="small"
              sx={{
                ml: 0.5,
                '&:hover': { transform: 'scale(1.05)' },
                transition: 'all 0.2s ease',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#FFC107',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  backgroundColor: 'rgba(30, 30, 30, 0.95)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  overflow: 'hidden',
                },
              }}
            >
              <MenuItem
                onClick={handleProfile}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(255, 193, 7, 0.1)' },
                  transition: 'all 0.2s ease',
                }}
              >
                <AccountCircle sx={{ mr: 1.5, color: '#FFC107' }} /> Profile
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(255, 193, 7, 0.1)' },
                  transition: 'all 0.2s ease',
                }}
              >
                <Logout sx={{ mr: 1.5, color: '#FFC107' }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </TubeLightNavbar>
    </>
  )
}

export default AppBar
