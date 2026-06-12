import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Users2, ShieldCheck, Zap, Activity, MessageCircle } from 'lucide-react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Stack,
} from '@mui/material'
import {
  School,
  Business,
  TrendingUp,
  CheckCircle,
  RocketLaunch,
  Groups,
  Verified,
  Speed,
  Star,
  EmojiEvents,
  Handshake,
  Analytics,
  Code,
  Cloud,
  Security,
  DataObject,
  ArrowForward,
  Work,
  Person,
  Assignment,
  ArrowRight,
} from '@mui/icons-material'
import CinematicFooter from '../../components/ui/MotionFooter'
import ParticleBackground from '../../components/shared/ParticleBackground'
import api from '../../utils/api'

const LandingPage = () => {
  const navigate = useNavigate()
  const [featuredProjects, setFeaturedProjects] = useState([])
  
  // Orbital Component States
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-cycle orbital features
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects?limit=3')
        setFeaturedProjects(res.data.data)
      } catch (err) {
        console.error("Failed to fetch featured projects", err)
      }
    }
    fetchProjects()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  // Floating icons - fewer and better positioned
  const floatingIcons = [
    { icon: <Code />, x: '10%', y: '25%', delay: 0 },
    { icon: <Cloud />, x: '85%', y: '20%', delay: 0.5 },
    { icon: <Security />, x: '12%', y: '70%', delay: 1 },
    { icon: <DataObject />, x: '82%', y: '75%', delay: 0.8 },
  ]

  const trustBadges = [
    { 
      type: 'circular', 
      title: 'TOP 20', 
      subtitle: 'CUSTOMER EXPERIENCE', 
      color: '#FF6D00', 
      rating: 5,
      label: 'Customer Experience' 
    },
    { 
      type: 'shield', 
      title: 'High Performer', 
      subtitle: 'SPRING 2026', 
      score: '9.8', 
      color: '#E53935',
      label: 'Quality of Support' 
    },
    { 
      type: 'logo',
      name: 'Trustpilot', 
      rating: 5, 
      color: '#00B67A'
    },
    { 
      type: 'gauge', 
      title: 'TOP 20', 
      subtitle: 'USER EXPERIENCE', 
      percent: 98, 
      color: '#00C853',
      label: 'User Recommendation' 
    },
    { 
      type: 'logo',
      name: 'Capterra', 
      rating: 4.5, 
      color: '#0070F3'
    },
    { 
      type: 'seal', 
      title: 'BEST PLATFORM', 
      subtitle: 'FINALIST 2026', 
      color: '#212121',
      label: 'Industry Recognition' 
    },
    { 
      type: 'logo',
      name: 'G2 Crowd', 
      rating: 4.8, 
      color: '#FF492C'
    }
  ]

  // Create two copies for seamless loop
  const marqueeItems = [...trustBadges, ...trustBadges]

  const features = [
    {
      icon: <Sparkles size={28} color="#F59E0B" strokeWidth={2.5} />,
      title: 'AI-Powered Matching',
      description: 'Smart algorithms connect students with projects that match their skills and interests perfectly.',
    },
    {
      icon: <Users2 size={28} color="#F59E0B" strokeWidth={2.5} />,
      title: 'Collaborative Environment',
      description: 'Work in teams, share knowledge, and build meaningful professional relationships.',
    },
    {
      icon: <ShieldCheck size={28} color="#F59E0B" strokeWidth={2.5} />,
      title: 'Verified Certificates',
      description: 'Earn industry-recognized experience letters upon project completion.',
    },
    {
      icon: <Zap size={28} color="#F59E0B" strokeWidth={2.5} />,
      title: 'Fast Onboarding',
      description: 'Get started in minutes. Simple registration and immediate project access.',
    },
    {
      icon: <Activity size={28} color="#F59E0B" strokeWidth={2.5} />,
      title: 'Progress Tracking',
      description: 'Monitor milestones, track progress, and manage collaborations efficiently.',
    },
    {
      icon: <MessageCircle size={28} color="#F59E0B" strokeWidth={2.5} />,
      title: 'Direct Communication',
      description: 'Connect directly with startups and students for seamless collaboration.',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      text: 'InAcadFusion helped me land my first real-world project. The experience letter I received opened doors to amazing opportunities!',
      avatar: <Person />,
    },
    {
      name: 'TechStart Inc.',
      role: 'Startup Founder',
      text: 'We found incredible talent through this platform. The students are motivated, skilled, and bring fresh perspectives to our projects.',
      avatar: <Business />,
    },
    {
      name: 'Michael Chen',
      role: 'Graduate Student',
      text: 'The milestone tracking system kept everything organized. I could focus on coding while the platform handled project management.',
      avatar: <Person />,
    },
  ]

  const steps = [
    {
      step: '1',
      title: 'Students Upload Projects',
      description: 'Showcase your portfolio and academic projects. Build your professional profile and attract opportunities from innovative startups.',
      icon: <School sx={{ fontSize: 56, color: '#FFC107' }} />,
      details: ['Create Profile', 'Upload Projects', 'Showcase Skills'],
    },
    {
      step: '2',
      title: 'Startups Explore & Collaborate',
      description: 'Discover talented students and initiate meaningful collaborations. Post projects and find the perfect match for your needs.',
      icon: <Business sx={{ fontSize: 56, color: '#FFC107' }} />,
      details: ['Browse Talent', 'Post Projects', 'Connect & Collaborate'],
    },
    {
      step: '3',
      title: 'Milestones & Experience Letters',
      description: 'Track progress through structured milestones. Earn verified experience certificates upon successful project completion.',
      icon: <TrendingUp sx={{ fontSize: 56, color: '#FFC107' }} />,
      details: ['Track Progress', 'Complete Milestones', 'Get Verified'],
    },
  ]

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      {/* ========================================================
          PREMIUM DARK HERO SECTION
      ======================================================== */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#000000',
          overflow: 'hidden',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          px: { xs: 3, md: 6 },
          fontFamily: '"Inter", system-ui, sans-serif',
        }}
      >
        {/* Subtle Tech Grid Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)',
          }}
        />

        {/* Animated Aurora Glows */}
        <Box
          component={motion.div}
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute',
            top: '10%',
            left: '30%',
            width: { xs: '150vw', md: '80vw' },
            height: { xs: '150vh', md: '80vh' },
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse at center, rgba(255, 193, 7, 0.12) 0%, rgba(255, 87, 34, 0.05) 30%, transparent 60%)',
            filter: 'blur(80px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        <Box
          component={motion.div}
          animate={{
            rotate: [360, 0],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: { xs: '120vw', md: '70vw' },
            height: { xs: '120vh', md: '70vh' },
            background: 'radial-gradient(circle at center, rgba(255, 193, 7, 0.08) 0%, transparent 50%)',
            filter: 'blur(100px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Animated Laser / Shooting Lines */}
        <Box
          component={motion.div}
          animate={{ x: ['-20vw', '120vw'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          sx={{ position: 'absolute', top: '25%', left: 0, width: '250px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,193,7,0.8), transparent)', zIndex: 1, pointerEvents: 'none' }}
        />
        <Box
          component={motion.div}
          animate={{ x: ['120vw', '-20vw'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 3 }}
          sx={{ position: 'absolute', top: '75%', right: 0, width: '350px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,87,34,0.6), transparent)', zIndex: 1, pointerEvents: 'none' }}
        />
        <Box
          component={motion.div}
          animate={{ y: ['-20vh', '120vh'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 1 }}
          sx={{ position: 'absolute', left: '20%', top: 0, width: '1px', height: '250px', background: 'linear-gradient(180deg, transparent, rgba(255,193,7,0.6), transparent)', zIndex: 1, pointerEvents: 'none' }}
        />
        <Box
          component={motion.div}
          animate={{ y: ['120vh', '-20vh'] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 5 }}
          sx={{ position: 'absolute', right: '25%', bottom: 0, width: '1px', height: '200px', background: 'linear-gradient(180deg, transparent, rgba(255,193,7,0.4), transparent)', zIndex: 1, pointerEvents: 'none' }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          


          {/* Premium Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.8rem', md: '4.8rem', lg: '5.5rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                mb: 3,
              }}
            >
              Bridge Academia to <br />
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #FFC107 50%, #FF9800 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Real-World Impact.
              </Box>
            </Typography>
          </motion.div>

          {/* Elegant Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          >
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.6)',
                maxWidth: 650,
                mx: 'auto',
                mb: 6,
              }}
            >
              The definitive pipeline connecting driven university students with high-growth startups to build ambitious projects and verified experience.
            </Typography>
          </motion.div>

          {/* Sleek Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
          >
            <Box
              component="button"
              onClick={() => navigate('/register')}
              sx={{
                background: '#FFFFFF',
                color: '#000000',
                border: '1px solid #FFFFFF',
                cursor: 'pointer',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 600,
                fontSize: '0.95rem',
                px: 4,
                py: 1.5,
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                boxShadow: '0 4px 14px 0 rgba(255,255,255,0.2)',
                '&:hover': {
                  background: '#f0f0f0',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Start Building
            </Box>
            <Box
              component="button"
              onClick={() => navigate('/projects')}
              sx={{
                background: 'rgba(255,255,255,0.03)',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '0.95rem',
                px: 4,
                py: 1.5,
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Explore Projects
            </Box>
          </motion.div>
        </Container>

        {/* Cinematic Scroll Indicator */}
        <Box sx={{ position: 'absolute', bottom: { xs: 20, md: 40 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, zIndex: 2 }}>
          <Typography sx={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: '"Inter", system-ui, sans-serif' }}>
            Scroll
          </Typography>
          <Box
            component={motion.div}
            animate={{ height: [80, 50, 80], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            sx={{ width: 1, height: 80, background: 'linear-gradient(to bottom, rgba(255,193,7,0.8), transparent)' }}
          />
        </Box>
      </Box>

      {/* Sentinel: AppBar watches this to know when hero is scrolled past */}
      <div id="hero-sentinel" style={{ position: 'absolute', top: '100vh', height: 0, width: 0, pointerEvents: 'none' }} />

      {/* Premium Trust Marquee Section */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 6, md: 8 },
          backgroundColor: '#FAFAFA',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden',
          // Edge Fading Gradients
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            width: { xs: 50, md: 150 },
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
          },
          '&::before': {
            left: 0,
            background: 'linear-gradient(to right, #FAFAFA, transparent)',
          },
          '&::after': {
            right: 0,
            background: 'linear-gradient(to left, #FAFAFA, transparent)',
          },
        }}
      >
        <Box
          component={motion.div}
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            display: 'flex',
            width: 'max-content',
            gap: { xs: 4, lg: 12 },
            alignItems: 'center',
          }}
        >
          {marqueeItems.map((badge, index) => (
            <Box key={index} sx={{ flexShrink: 0 }}>
              {badge.type === 'circular' && (
                <Box sx={{ textAlign: 'center', minWidth: 140 }}>
                  <Box sx={{ 
                    width: 100, height: 100, borderRadius: '50%', border: `4px solid ${badge.color}`, 
                    mx: 'auto', mb: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    justifyContent: 'center', position: 'relative',
                    background: '#fff', boxShadow: `0 8px 16px ${badge.color}20`
                  }}>
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, color: badge.color, lineHeight: 1 }}>{badge.title}</Typography>
                    <Box sx={{ width: 28, height: 28, my: 0.5, backgroundColor: badge.color, borderRadius: '50%', color: '#fff', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>IAF</Box>
                    <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: '#333', maxWidth: 60, lineHeight: 1 }}>{badge.subtitle}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', color: '#FFC107', mb: 0.5 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} sx={{ fontSize: 12 }} />)}
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>{badge.label}</Typography>
                </Box>
              )}

              {badge.type === 'shield' && (
                <Box sx={{ textAlign: 'center', minWidth: 140 }}>
                  <Box sx={{ 
                    width: 85, height: 105, position: 'relative', mx: 'auto', mb: 1.5,
                    background: '#fff', border: '1px solid #ddd', borderRadius: '4px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 1.5,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}>
                    <Box sx={{ backgroundColor: badge.color, color: '#fff', px: 1, py: 0.2, fontSize: '0.5rem', fontWeight: 900, mb: 1 }}>{badge.title.toUpperCase()}</Box>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: '#333' }}>{badge.score}</Typography>
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#999' }}>{badge.subtitle}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>{badge.label}</Typography>
                </Box>
              )}

              {badge.type === 'gauge' && (
                <Box sx={{ textAlign: 'center', minWidth: 140 }}>
                  <Box sx={{ 
                    width: 100, height: 100, borderRadius: '50%', border: `4px solid ${badge.color}30`, 
                    mx: 'auto', mb: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    justifyContent: 'center', position: 'relative', background: '#fff'
                  }}>
                    <Box sx={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `4px solid ${badge.color}`, clipPath: `inset(0 0 0 0)` }} />
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: '#333' }}>{badge.percent}%</Typography>
                    <Typography sx={{ fontSize: '0.5rem', fontWeight: 800, color: badge.color }}>RECOMMENDED</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>{badge.label}</Typography>
                </Box>
              )}

              {badge.type === 'seal' && (
                <Box sx={{ textAlign: 'center', minWidth: 140 }}>
                  <Box sx={{ 
                    width: 100, height: 100, borderRadius: '50%', border: `2px dashed ${badge.color}`, 
                    mx: 'auto', mb: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    justifyContent: 'center', background: '#fff', p: 1
                  }}>
                    <Box sx={{ border: `1px solid ${badge.color}`, borderRadius: '50%', p: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: '0.55rem', fontWeight: 900, color: badge.color }}>{badge.title}</Typography>
                      <Box sx={{ height: 1.5, width: 20, backgroundColor: badge.color, my: 0.5 }} />
                      <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: badge.color }}>{badge.subtitle}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>{badge.label}</Typography>
                </Box>
              )}

              {badge.type === 'logo' && (
                <Box sx={{ minWidth: 160, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box sx={{ width: 28, height: 28, backgroundColor: badge.color, borderRadius: '6px', flexShrink: 0, boxShadow: `0 4px 10px ${badge.color}40` }} />
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#333', letterSpacing: '-0.02em' }}>{badge.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.3, color: '#FFC107' }}>
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} sx={{ fontSize: 16 }} />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Enhanced How It Works Section with Advanced Animations */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 6, md: 10, lg: 12 },
          backgroundColor: '#FAFAFA',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Multiple Animated Background Elements */}
        <Box
          component={motion.div}
          animate={{
            x: [0, -100, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '120%',
            height: '100%',
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,193,7,0.02) 50%, transparent 70%)',
            zIndex: 0,
          }}
        />

        {/* Animated Connecting Lines Background */}
        <Box
          component="svg"
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            opacity: 0.1,
            display: { xs: 'none', md: 'block' },
          }}
          viewBox="0 0 1200 400"
        >
          <motion.path
            d="M 100 200 Q 400 150 700 200 T 1100 200"
            fill="none"
            stroke="#FFC107"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.path
            d="M 100 200 Q 400 250 700 200 T 1100 200"
            fill="none"
            stroke="#FFC107"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
          />
        </Box>

        <Container
          maxWidth={false}
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: { xs: '100%', sm: '600px', md: '960px', lg: '1280px', xl: '1600px' },
            px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
              >
                How It Works
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.1rem' } }}
              >
                Simple steps to start your collaboration journey
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4} sx={{ position: 'relative', alignItems: 'stretch' }}>
            {steps.map((item, index) => (
              <React.Fragment key={index}>
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: 'flex',
                    alignItems: 'stretch',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.7, delay: index * 0.2, type: 'spring', stiffness: 100 }}
                    whileHover={{ y: -10, scale: 1.03 }}
                    style={{ width: '100%', display: 'flex' }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        p: 4,
                        border: '2px solid rgba(255,193,7,0.25)',
                        background: 'linear-gradient(135deg, rgba(255,193,7,0.08) 0%, #FFFFFF 100%)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `radial-gradient(circle at ${index === 0 ? 'top left' : index === 1 ? 'center' : 'bottom right'}, rgba(255,193,7,0.15), transparent 70%)`,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover': {
                          borderColor: '#FFC107',
                          boxShadow: '0 16px 40px rgba(255,193,7,0.3)',
                          '&::before': {
                            opacity: 1,
                          },
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      {/* Animated Step Number Badge */}
                      <Box
                        component={motion.div}
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        sx={{
                          position: 'absolute',
                          top: 20,
                          right: 20,
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          backgroundColor: '#FFC107',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(255,193,7,0.4)',
                          zIndex: 2,
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: '#000000',
                            fontSize: '1.5rem',
                          }}
                        >
                          {item.step}
                        </Typography>
                      </Box>

                      {/* Animated Icon Container */}
                      <Box
                        sx={{
                          mb: 4,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'relative',
                          mt: 2,
                          minHeight: 140,
                        }}
                      >
                        {/* Pulsing Background Circle */}
                        <Box
                          component={motion.div}
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.1, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,193,7,0.2) 0%, transparent 70%)',
                            zIndex: 0,
                          }}
                        />
                        <Box
                          component={motion.div}
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          sx={{
                            position: 'relative',
                            zIndex: 1,
                          }}
                        >
                          {item.icon}
                        </Box>
                        {/* Rotating Ring */}
                        <Box
                          component={motion.div}
                          animate={{
                            rotate: [0, -360],
                          }}
                          transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            border: '2px dashed rgba(255,193,7,0.3)',
                            zIndex: 0,
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h5"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          fontSize: { xs: '1.15rem', md: '1.35rem' },
                          minHeight: { xs: '3rem', md: '3.5rem' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          lineHeight: 1.8,
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          minHeight: { xs: '4.5rem', md: '5rem' },
                        }}
                      >
                        {item.description}
                      </Typography>

                      {/* Animated Details List */}
                      <Stack spacing={1.5} sx={{ mt: 'auto', pt: 3 }}>
                        {item.details.map((detail, detailIndex) => (
                          <motion.div
                            key={detailIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + detailIndex * 0.1 }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: 1.5,
                                py: 1.5,
                                px: { xs: 3, sm: 4, md: 3, lg: 5 },
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,193,7,0.08)',
                                border: '1px solid rgba(255,193,7,0.2)',
                              }}
                            >
                              <CheckCircle sx={{ color: '#FFC107', fontSize: 20, flexShrink: 0 }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: { xs: '0.85rem', md: '0.9rem' },
                                  textAlign: 'left',
                                }}
                              >
                                {detail}
                              </Typography>
                            </Box>
                          </motion.div>
                        ))}
                      </Stack>
                    </Card>
                  </motion.div>
                </Grid>

                {/* Animated Arrow Connector (Desktop Only) */}
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      position: 'absolute',
                      left: `${(index + 1) * 33.33}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      alignItems: 'center',
                    }}
                  >
                    <motion.div
                      animate={{
                        x: [0, 10, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <ArrowRight
                        sx={{
                          fontSize: 48,
                          color: '#FFC107',
                          filter: 'drop-shadow(0 2px 4px rgba(255,193,7,0.3))',
                        }}
                      />
                    </motion.div>
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Grid>

          {/* Animated Progress Bar */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 2, fontWeight: 500 }}
              >
                Your Journey Starts Here
              </Typography>
              <Box
                sx={{
                  maxWidth: 600,
                  mx: 'auto',
                  height: 6,
                  backgroundColor: 'rgba(255,193,7,0.1)',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  component={motion.div}
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, delay: 0.5 }}
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #FFC107, #FFA000)',
                    borderRadius: 3,
                    boxShadow: '0 0 10px rgba(255,193,7,0.5)',
                  }}
                />
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Enhanced Features Section with Background Animation */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 5, md: 8, lg: 10 },
          backgroundColor: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Dots */}
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: 300,
            height: 300,
            backgroundImage: 'radial-gradient(circle, rgba(255,193,7,0.04) 2px, transparent 2px)',
            backgroundSize: '30px 30px',
            zIndex: 0,
            opacity: 0.5,
          }}
        />

        {/* Injecting CSS Keyframes for Orbital Physics */}
        <Box sx={{ width: 0, height: 0 }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes orbit {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes counter-orbit {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            .orbit-ring {
              animation: orbit 30s linear infinite;
            }
            .orbit-ring.paused {
              animation-play-state: paused;
            }
            .orbit-item {
              animation: counter-orbit 30s linear infinite;
            }
            .orbit-item.paused {
              animation-play-state: paused;
            }
          `}} />
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
            px: { xs: 2, md: 4 },
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
              >
                Why Choose InAcadFusion?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 650, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.1rem' } }}
              >
                Powerful features designed to make collaboration seamless and rewarding
              </Typography>
            </Box>
          </motion.div>

          {/* Interactive Orbital Interface Layer */}
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            
            {/* Left Column: Dynamic Text Display */}
            <Grid item xs={12} md={5}>
              <Box sx={{ 
                minHeight: 250, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                textAlign: { xs: 'center', md: 'left' }
              }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeatureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <Box sx={{ mb: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', p: 1.5, borderRadius: 3, background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
                      {features[activeFeatureIndex].icon}
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#111827' }}>
                      {features[activeFeatureIndex].title}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, color: '#6B7280', lineHeight: 1.7 }}>
                      {features[activeFeatureIndex].description}
                    </Typography>
                  </motion.div>
                </AnimatePresence>
              </Box>
            </Grid>

            {/* Right Column: Orbital Animation System */}
            <Grid item xs={12} md={7}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: { xs: 400, md: 500 },
                  width: '100%',
                }}
              >
                {/* Orbital Hub Wrapper */}
                <Box 
                  sx={{ 
                    position: 'relative', 
                    width: { xs: 300, sm: 360, md: 400 }, 
                    height: { xs: 300, sm: 360, md: 400 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  
                  {/* Central Core Branding */}
                  <Box sx={{ position: 'relative', zIndex: 10, width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #FFC107, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(245,158,11,0.4)', border: '4px solid #FFFFFF' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', letterSpacing: -1 }}>IAF</Typography>
                  </Box>

                  {/* Outer Orbit Path Line */}
                  <Box sx={{ position: 'absolute', inset: 0, border: '2px dashed rgba(245,158,11,0.2)', borderRadius: '50%' }} />

                  {/* Rotating Orbit Container */}
                  <Box className={isPaused ? "orbit-ring paused" : "orbit-ring"} sx={{ position: 'absolute', inset: 0, borderRadius: '50%' }}>
                    
                    {features.map((feature, i) => {
                      // Distributed perfectly around 360 degrees
                      const angle = (i * 360) / 6;
                      const isActive = i === activeFeatureIndex;
                      
                      return (
                        <Box
                          key={i}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            // Push exactly to the circle edge based on wrapper size (50% radius)
                            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-200px)`,
                            '@media (max-width: 900px)': {
                               transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-180px)`,
                            },
                            '@media (max-width: 600px)': {
                               transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-150px)`,
                            },
                            width: 64,
                            height: 64,
                            cursor: 'pointer',
                          }}
                          onClick={() => setActiveFeatureIndex(i)}
                        >
                          {/* Anchor element that counter-rotates dynamically against the orbit */}
                          <Box className={isPaused ? "orbit-item paused" : "orbit-item"} sx={{ width: '100%', height: '100%', transformOrigin: 'center' }}>
                            
                            {/* Final static de-rotation to ensure the graphic remains completely upright relative to page geometry */}
                            <Box sx={{ transform: `rotate(${-angle}deg)`, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              
                              <Box sx={{
                                width: isActive ? 64 : 52,
                                height: isActive ? 64 : 52,
                                borderRadius: '50%',
                                background: isActive ? '#F59E0B' : '#FFFFFF',
                                border: isActive ? '4px solid rgba(245,158,11,0.3)' : '1px solid rgba(0,0,0,0.1)',
                                boxShadow: isActive ? '0 10px 25px rgba(245,158,11,0.5)' : '0 4px 10px rgba(0,0,0,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.15)',
                                  boxShadow: '0 8px 20px rgba(245,158,11,0.3)',
                                  borderColor: '#F59E0B'
                                },
                                '& svg': {
                                  color: isActive ? '#FFFFFF' : '#F59E0B',
                                  width: isActive ? 28 : 24,
                                  height: isActive ? 28 : 24,
                                  transition: 'all 0.3s ease',
                                }
                              }}>
                                {/* Clone element to inject styles since feature.icon already holds color props from initialization */}
                                {React.cloneElement(feature.icon, { color: isActive ? '#FFFFFF' : '#F59E0B', size: isActive ? 28 : 24 })}
                              </Box>

                            </Box>
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Benefits Section with Background Animation */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 5, md: 8, lg: 10 },
          backgroundColor: '#F8F9FA',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Lines */}
        <Box
          component={motion.div}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(45deg, transparent 48%, rgba(255,193,7,0.02) 49%, rgba(255,193,7,0.02) 51%, transparent 52%)',
            backgroundSize: '60px 60px',
            zIndex: 0,
          }}
        />

        <Container
          maxWidth={false}
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: { xs: '100%', sm: '600px', md: '960px', lg: '1280px', xl: '1600px' },
            px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
              >
                Benefits for Everyone
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 650, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.1rem' } }}
              >
                Discover what makes our platform the perfect choice for students and startups
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(255,193,7,0.06) 0%, #FFFFFF 100%)',
                    border: '2px solid rgba(255,193,7,0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 100,
                      height: 100,
                      background: 'radial-gradient(circle, rgba(255,193,7,0.1) 0%, transparent 70%)',
                      borderRadius: '50%',
                      transform: 'translate(30%, -30%)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: '#FFC107',
                        width: 56,
                        height: 56,
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(255,193,7,0.3)',
                      }}
                    >
                      <School sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.35rem', md: '1.6rem' } }}>
                        For Students
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        Unlock your potential
                      </Typography>
                    </Box>
                  </Box>
                  <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                    {[
                      'Real-world project experience and portfolio building',
                      'Verified experience letters from industry partners',
                      'Direct connections with startups and industry leaders',
                      'Skill development through hands-on collaboration',
                      'Potential job opportunities and career advancement',
                    ].map((benefit, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box
                          sx={{
                            minWidth: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: '#FFC107',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5,
                            mt: 0.25,
                            flexShrink: 0,
                          }}
                        >
                          <CheckCircle sx={{ color: '#000000', fontSize: 16 }} />
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.7,
                            fontSize: { xs: '0.9rem', md: '1rem' },
                          }}
                        >
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(255,193,7,0.06) 0%, #FFFFFF 100%)',
                    border: '2px solid rgba(255,193,7,0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 100,
                      height: 100,
                      background: 'radial-gradient(circle, rgba(255,193,7,0.1) 0%, transparent 70%)',
                      borderRadius: '50%',
                      transform: 'translate(-30%, -30%)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: '#FFC107',
                        width: 56,
                        height: 56,
                        mr: 2,
                        boxShadow: '0 4px 12px rgba(255,193,7,0.3)',
                      }}
                    >
                      <Business sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.35rem', md: '1.6rem' } }}>
                        For Startups
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        Access top talent
                      </Typography>
                    </Box>
                  </Box>
                  <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                    {[
                      'Access to talented and motivated student developers',
                      'Cost-effective collaboration and project development',
                      'Fresh perspectives and innovative ideas',
                      'Potential long-term hires and talent pipeline',
                      'Flexible engagement models and scalable teams',
                    ].map((benefit, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box
                          sx={{
                            minWidth: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: '#FFC107',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5,
                            mt: 0.25,
                            flexShrink: 0,
                          }}
                        >
                          <CheckCircle sx={{ color: '#000000', fontSize: 16 }} />
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.7,
                            fontSize: { xs: '0.9rem', md: '1rem' },
                          }}
                        >
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section with Background Animation */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 5, md: 8, lg: 10 },
          backgroundColor: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Elements (Rounded Line Animations) */}
        
        {/* Glows */}
        <Box
          component={motion.div}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute', top: '10%', left: '10%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(255,193,7,0.08) 0%, transparent 60%)',
            filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none',
          }}
        />
        
        {/* Rounded Line (Capsule) Animations */}
        <Box
          component={motion.div}
          animate={{ x: ['-20vw', '120vw'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute', top: '25%', left: 0,
            width: '300px', height: '4px',
            background: 'linear-gradient(90deg, transparent, rgba(255,193,7,0.6), transparent)',
            borderRadius: '50px', zIndex: 1, pointerEvents: 'none'
          }}
        />
        <Box
          component={motion.div}
          animate={{ x: ['120vw', '-20vw'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 2 }}
          sx={{
            position: 'absolute', top: '65%', right: 0,
            width: '400px', height: '4px',
            background: 'linear-gradient(90deg, transparent, rgba(255,193,7,0.4), transparent)',
            borderRadius: '50px', zIndex: 1, pointerEvents: 'none'
          }}
        />
        <Box
          component={motion.div}
          animate={{ y: ['-20vh', '120vh'] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 1 }}
          sx={{
            position: 'absolute', left: '15%', top: 0,
            width: '4px', height: '250px',
            background: 'linear-gradient(180deg, transparent, rgba(255,193,7,0.5), transparent)',
            borderRadius: '50px', zIndex: 1, pointerEvents: 'none'
          }}
        />
        <Box
          component={motion.div}
          animate={{ y: ['120vh', '-20vh'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear', delay: 4 }}
          sx={{
            position: 'absolute', right: '20%', bottom: 0,
            width: '4px', height: '350px',
            background: 'linear-gradient(180deg, transparent, rgba(255,193,7,0.4), transparent)',
            borderRadius: '50px', zIndex: 1, pointerEvents: 'none'
          }}
        />

        <Container
          maxWidth={false}
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: { xs: '100%', sm: '600px', md: '960px', lg: '1280px', xl: '1600px' },
            px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
              >
                What People Say
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 650, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.1rem' } }}
              >
                Hear from students and startups who have found success on our platform
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index} sx={{ display: 'flex' }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -5 }}
                  style={{ height: '100%', width: '100%' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 3.5,
                      border: '1px solid rgba(0,0,0,0.08)',
                      background: 'linear-gradient(135deg, rgba(255,193,7,0.03) 0%, #FFFFFF 100%)',
                      position: 'relative',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(255,193,7,0.15)',
                        borderColor: '#FFC107',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#FFC107',
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} sx={{ color: '#FFC107', fontSize: 18 }} />
                      ))}
                    </Box>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.7,
                        fontSize: { xs: '0.9rem', md: '0.95rem' },
                        fontStyle: 'italic',
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      {/* Enhanced Featured Projects Section with Background Animation */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 5, md: 8, lg: 10 },
          backgroundColor: '#FAFAFA',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Grid */}
        <Box
          component={motion.div}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(rgba(255,193,7,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,193,7,0.02) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            zIndex: 0,
          }}
        />

        <Container
          maxWidth={false}
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: { xs: '100%', sm: '600px', md: '960px', lg: '1280px', xl: '1600px' },
            px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
              >
                Featured Projects
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 650, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.1rem' } }}
              >
                Explore exciting opportunities from innovative startups and talented students
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
            {featuredProjects.map((project, index) => (
              <Grid
                item
                xs={12}
                md={4}
                key={project._id || index}
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  style={{ width: '100%', display: 'flex' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid rgba(0,0,0,0.08)',
                      background: '#FFFFFF',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: 'linear-gradient(90deg, #FFC107, #FFA000)',
                        transform: 'scaleX(0)',
                        transition: 'transform 0.3s ease',
                      },
                      '&:hover': {
                        boxShadow: '0 12px 32px rgba(255,193,7,0.2)',
                        borderColor: '#FFC107',
                        '&::before': {
                          transform: 'scaleX(1)',
                        },
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Chip
                          label={project.domain}
                          size="small"
                          sx={{
                            backgroundColor: '#FFC107',
                            color: '#000000',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                        <Work sx={{ color: 'rgba(0,0,0,0.2)', fontSize: 24 }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1.5,
                          fontWeight: 600,
                          fontSize: { xs: '1.05rem', md: '1.15rem' },
                          lineHeight: 1.3,
                          minHeight: { xs: '3rem', md: '3.5rem' },
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {project.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2.5,
                          lineHeight: 1.7,
                          fontSize: { xs: '0.875rem', md: '0.9rem' },
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: { xs: '4rem', md: '4.5rem' },
                        }}
                      >
                        {project.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2, minHeight: '2.5rem' }}>
                        {project.requiredSkills.slice(0, 3).map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255,193,7,0.1)',
                              color: '#000000',
                              fontSize: '0.7rem',
                              fontWeight: 500,
                            }}
                          />
                        ))}
                        {project.requiredSkills.length > 3 && (
                          <Chip
                            label={`+${project.requiredSkills.length - 3}`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              fontSize: '0.7rem',
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                        <Assignment sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {project.uploadedBy === 'startup' ? 'Posted by Startup' : 'Student Portfolio'}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2.5, pt: 0, mt: 'auto' }}>
                      <Button
                        size="small"
                        onClick={() => navigate('/projects')}
                        endIcon={<ArrowForward sx={{ fontSize: 18 }} />}
                        sx={{
                          color: '#FFC107',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          '&:hover': {
                            backgroundColor: 'rgba(255,193,7,0.1)',
                            transform: 'translateX(4px)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/projects')}
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: '#FFC107',
                  color: '#000000',
                  px: 5,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 4px 16px rgba(255,193,7,0.3)',
                  '&:hover': {
                    backgroundColor: '#FFA000',
                    boxShadow: '0 6px 20px rgba(255,193,7,0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                View All Projects
              </Button>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* CTA Section with Background Animation */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 6, md: 8, lg: 10 },
          background: 'linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(255,255,255,1) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Elements */}
        <Box
          component={motion.div}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,193,7,0.08) 0%, transparent 70%)',
            zIndex: 0,
            filter: 'blur(20px)',
          }}
        />
        <Box
          component={motion.div}
          animate={{
            rotate: [360, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,193,7,0.06) 0%, transparent 70%)',
            zIndex: 0,
            filter: 'blur(25px)',
          }}
        />

        <Container
          maxWidth={false}
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: { xs: '100%', sm: '600px', md: '960px', lg: '1280px', xl: '1600px' },
            px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <Card
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,193,7,0.05) 100%)',
                border: '2px solid rgba(255,193,7,0.2)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,193,7,0.1) 0%, transparent 70%)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -50,
                  left: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,193,7,0.1) 0%, transparent 70%)',
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                  }}
                >
                  Ready to Get Started?
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    mb: 4,
                    maxWidth: 600,
                    mx: 'auto',
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    fontWeight: 400,
                  }}
                >
                  Join hundreds of students and startups already collaborating on InAcadFusion
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      startIcon={<RocketLaunch />}
                      sx={{
                        backgroundColor: '#FFC107',
                        color: '#000000',
                        px: 5,
                        py: 1.5,
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 16px rgba(255,193,7,0.3)',
                        '&:hover': {
                          backgroundColor: '#FFA000',
                          boxShadow: '0 6px 20px rgba(255,193,7,0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Sign Up Free
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/contact')}
                      sx={{
                        borderColor: '#000000',
                        borderWidth: 2,
                        color: '#000000',
                        px: 5,
                        py: 1.5,
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        '&:hover': {
                          borderColor: '#FFC107',
                          backgroundColor: 'rgba(255,193,7,0.1)',
                          borderWidth: 2,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Contact Us
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </Card>
          </motion.div>
        </Container>
      </Box>

      <CinematicFooter />
    </Box>
  )
}

export default LandingPage
