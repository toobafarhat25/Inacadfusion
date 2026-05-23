import React from 'react'
import { Box, Container, Typography, Link, Grid, IconButton, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  Facebook,
  Twitter,
  LinkedIn,
  Email,
  LocationOn,
  Phone,
} from '@mui/icons-material'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#F8F9FA',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        py: { xs: 4, md: 6 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              InAcadFusion
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
              Bridging the gap between academia and industry through meaningful collaborations. 
              Empowering students and startups to create impactful projects together.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: 'rgba(255,193,7,0.1)',
                    color: '#FFC107',
                  },
                }}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: 'rgba(255,193,7,0.1)',
                    color: '#FFC107',
                  },
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: 'rgba(255,193,7,0.1)',
                    color: '#FFC107',
                  },
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: 'rgba(255,193,7,0.1)',
                    color: '#FFC107',
                  },
                }}
              >
                <Email fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000000' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/')}
                sx={{
                  color: 'text.secondary',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: '#FFC107', fontWeight: 600 },
                  transition: 'all 0.2s ease',
                }}
              >
                Home
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/about')}
                sx={{
                  color: 'text.secondary',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: '#FFC107', fontWeight: 600 },
                  transition: 'all 0.2s ease',
                }}
              >
                About
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/projects')}
                sx={{
                  color: 'text.secondary',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: '#FFC107', fontWeight: 600 },
                  transition: 'all 0.2s ease',
                }}
              >
                Projects
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/contact')}
                sx={{
                  color: 'text.secondary',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: '#FFC107', fontWeight: 600 },
                  transition: 'all 0.2s ease',
                }}
              >
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000000' }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: '#FFC107', fontWeight: 600 },
                  transition: 'all 0.2s ease',
                }}
              >
                Documentation
              </Link>
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: '#FFC107', fontWeight: 600 },
                  transition: 'all 0.2s ease',
                }}
              >
                Help Center
              </Link>
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: '#FFC107', fontWeight: 600 },
                  transition: 'all 0.2s ease',
                }}
              >
                Community
              </Link>
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': { color: '#FFC107', fontWeight: 600 },
                  transition: 'all 0.2s ease',
                }}
              >
                Blog
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000000' }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                <Email sx={{ color: '#FFC107', fontSize: 20, mt: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  contact@inacadfusion.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                <Phone sx={{ color: '#FFC107', fontSize: 20, mt: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                <LocationOn sx={{ color: '#FFC107', fontSize: 20, mt: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  123 Innovation Street<br />
                  Tech City, TC 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.08)' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 InAcadFusion. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              component="button"
              variant="body2"
              sx={{
                color: 'text.secondary',
                cursor: 'pointer',
                '&:hover': { color: '#FFC107', fontWeight: 600 },
                transition: 'all 0.2s ease',
              }}
            >
              Terms of Service
            </Link>
            <Link
              component="button"
              variant="body2"
              sx={{
                color: 'text.secondary',
                cursor: 'pointer',
                '&:hover': { color: '#FFC107', fontWeight: 600 },
                transition: 'all 0.2s ease',
              }}
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
