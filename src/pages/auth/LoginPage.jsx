import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import Snackbar from '../../components/shared/Snackbar'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const from = location.state?.from || null
  const projectId = location.state?.projectId || null
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      await login(formData.email, formData.password, formData.role)
      setSnackbar({
        open: true,
        message: 'Login successful!',
        severity: 'success',
      })
      setTimeout(() => {
        // If user was trying to view a project, redirect there
        if (projectId && formData.role === 'student') {
          navigate(`/student/project/${projectId}`)
        } else if (from) {
          navigate(from)
        } else if (formData.role === 'student') {
          navigate('/student/dashboard')
        } else if (formData.role === 'startup') {
          navigate('/startup/dashboard')
        } else if (formData.role === 'admin') {
          navigate('/admin/dashboard')
        }
      }, 500)
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
      setSnackbar({
        open: true,
        message: err.message || 'Login failed. Please try again.',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <Grid container sx={{ flex: 1 }}>
        
        {/* Left Side - Illustration */}
        <Grid 
          item 
          xs={12} 
          md={7} 
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F8F9FA',
            position: 'relative',
            zIndex: 10,
            pointerEvents: 'none', /* FIX: This prevents the overflowing transparent container from blocking clicks on the form! */
          }}
        >
          {/* Abstract background shapes safely contained in their own masked box so they don't bleed into the form */}
          <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <Box sx={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', backgroundColor: 'rgba(255,193,7,0.06)', top: -150, left: -200 }} />
            <Box sx={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', backgroundColor: 'rgba(255,193,7,0.03)', bottom: -200, right: -400 }} />
          </Box>
          
          <motion.div 
            initial={{ opacity: 0, x: -50, scale: 0.9 }} 
            animate={{ opacity: 1, x: 0, scale: 1 }} 
            transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
          >
            {/* Cinematic Parallax & Breathing Aura Wrapper */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', position: 'relative', right: '-45%' }} /* Extremely pushed over the boundary */
            >
              <motion.img 
                src="/login-bg.jpg" 
                alt="Login Character Illustration" 
                animate={{
                  filter: [
                    'drop-shadow(0px 10px 20px rgba(255, 193, 7, 0.15))',
                    'drop-shadow(0px 30px 50px rgba(255, 193, 7, 0.4))',
                    'drop-shadow(0px 10px 20px rgba(255, 193, 7, 0.15))'
                  ]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                style={{ 
                  position: 'relative', 
                  width: '145%',      // Bumped scale slightly
                  maxWidth: '1300px',
                  objectFit: 'contain',
                  pointerEvents: 'none', 
                }}
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                  e.target.parentElement.innerHTML = '<div style="color: #FFC107; text-align: center; font-family: sans-serif; padding: 20px;"><h2>Image Not Found</h2><p>Please place your illustration in the <code>public/</code> folder and name it <code>login-bg.jpg</code></p></div>';
                }} 
              />
            </motion.div>
          </motion.div>
        </Grid>

        {/* Right Side - Form */}
        <Grid 
          item 
          xs={12} 
          md={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', /* Reverted strictly to center */
            backgroundColor: '#FFFFFF',
            p: { xs: 4, sm: 8, md: 6 },
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                Welcome to InAcadFusion! <span role="img" aria-label="wave">👋</span>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Please sign in to your account and start the adventure
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                  <FormLabel component="legend" sx={{ fontSize: '0.875rem', mb: 0.5 }}>I am a</FormLabel>
                  <RadioGroup
                    row
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="student" control={<Radio size="small" />} label={<Typography variant="body2">Student</Typography>} />
                    <FormControlLabel value="startup" control={<Radio size="small" />} label={<Typography variant="body2">Startup</Typography>} />
                    <FormControlLabel value="admin" control={<Radio size="small" />} label={<Typography variant="body2">Admin</Typography>} />
                  </RadioGroup>
                </FormControl>

                <TextField
                  fullWidth
                  size="small"
                  label="Email or Username"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2.5 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ mb: 1 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#FFC107', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    Forgot Password?
                  </Typography>
                </Box>

                {error && (
                  <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: '#FFC107',
                    color: '#000000',
                    py: 1.2,
                    mb: 3,
                    boxShadow: '0 4px 14px rgba(255, 193, 7, 0.4)',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#FFA000',
                      boxShadow: '0 6px 20px rgba(255, 193, 7, 0.6)',
                    },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <Typography variant="body2" align="center" color="text.secondary">
                  New on our platform?{' '}
                  <span
                    onClick={() => navigate('/register')}
                    style={{ color: '#FFC107', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Create an account
                  </span>
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  )
}

export default LoginPage
