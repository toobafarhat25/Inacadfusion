import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip
} from '@mui/material'
import { 
  Search, 
  FilterList, 
  ArrowForward,
  AutoAwesome, // For AI
  Domain,
  RocketLaunch,
  WorkOutline
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { ProjectCardSkeleton } from '../../components/shared/SkeletonLoader'
import EmptyState from '../../components/shared/EmptyState'
import api from '../../utils/api'

const STYLES = `
.vx-root {
  font-family: 'Public Sans', 'Inter', system-ui, sans-serif;
  background: #F8F8F9;
  min-height: 100vh;
  color: #4B465C;
}

/* Typography Overrides */
.vx-text-heading {
  color: #2F2B3D;
  font-weight: 600;
}
.vx-text-body {
  color: #4B465C;
}
.vx-text-muted {
  color: #A5A3AE;
}

/* Base Card Style */
.vx-card {
  background: #FFFFFF;
  border-radius: 6px;
  box-shadow: 0 2px 6px 0 rgba(47, 43, 61, 0.12);
  transition: all 0.25s ease-in-out;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.vx-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 18px 0 rgba(47, 43, 61, 0.15);
}

.vx-card-header {
  padding: 24px 24px 0 24px;
}
.vx-card-body {
  padding: 24px;
  flex-grow: 1;
}
.vx-card-footer {
  padding: 0 24px 24px 24px;
  margin-top: auto;
}

/* Search Card Wrapper */
.vx-search-wrapper {
  background: #FFFFFF;
  border-radius: 6px;
  box-shadow: 0 2px 6px 0 rgba(47, 43, 61, 0.12);
  padding: 20px 24px;
  margin-bottom: 24px;
}

.vx-search-input-container {
  border: 1px solid #DBDADE;
  border-radius: 6px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  display: flex;
  align-items: center;
  padding: 4px 16px;
}
.vx-search-input-container:focus-within {
  border-color: #FFC107;
  box-shadow: 0 0 0 2px rgba(255,193,7, 0.16);
}

.vx-filter-pill {
  font-weight: 600 !important;
  border-radius: 6px !important;
  padding: 6px 16px !important;
  background: #F8F8F9 !important;
  border: 1px solid #DBDADE !important;
  color: #4B465C !important;
  transition: all 0.2s ease-in-out !important;
}
.vx-filter-pill:hover {
  background: #EBEBEF !important;
}
.vx-filter-pill.active {
  background: rgba(255, 193, 7, 0.16) !important;
  color: #D9A406 !important;
  border-color: rgba(255, 193, 7, 0.5) !important;
}

/* Badges */
.vx-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 159, 67, 0.16);
  color: #FF9F43;
}

/* Buttons */
.vx-btn-primary {
  background-color: #FFC107 !important;
  color: #000000 !important;
  font-weight: 600 !important;
  border-radius: 6px !important;
  box-shadow: 0 2px 4px 0 rgba(255,193,7, 0.4) !important;
  text-transform: none !important;
  padding: 8px 20px !important;
  transition: all 0.2s ease-in-out !important;
}
.vx-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px 0 rgba(255,193,7, 0.45) !important;
}

.vx-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 193, 7, 0.16);
  color: #FFC107;
}
`

const BrowseProjects = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  
  const [search, setSearch] = useState('')
  const [isAiMode, setIsAiMode] = useState(false)
  const [domainFilter, setDomainFilter] = useState('All')

  const domains = ['All', 'Technology', 'AI', 'Web Development', 'Mobile App', 'Data Science']

  const loadProjects = async (isManual = false) => {
    setLoading(true)
    try {
      if (isAiMode && (search || isManual)) {
        // Semantic AI Search
        const res = await api.post('/ai/recommend', { query: search, top_n: 9 })
        setProjects(res.data.data)
      } else {
        // Standard Text Search
        const params = {}
        if (search) params.search = search
        if (domainFilter !== 'All') params.domain = domainFilter
        const res = await api.get('/projects', { params })
        setProjects(res.data.data)
      }
    } catch (err) {
      console.error("Fetch error:", err)
      if (isAiMode) {
        alert("AI Service is sleeping. Starting Standard search...")
        setIsAiMode(false)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAiMode) loadProjects()
  }, [domainFilter, isAiMode])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadProjects(true)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="vx-root" sx={{ pt: { xs: 12, md: 14 }, px: { xs: 2, md: 3 }, pb: 8 }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" className="vx-text-heading" sx={{ mb: 1, fontSize: '1.75rem' }}>
                Explore Opportunities
              </Typography>
              <Typography className="vx-text-muted" sx={{ mb: 3 }}>
                Discover projects that perfectly match your skillset using advanced search or AI matching.
              </Typography>
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="vx-search-wrapper">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography className="vx-text-heading" sx={{ fontSize: '1.1rem' }}>Search Filters</Typography>
                <Tooltip title="AI Mode understands natural language like 'I know Java and love AI'">
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={isAiMode} 
                        onChange={(e) => setIsAiMode(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#FFC107' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FFC107' },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: isAiMode ? '#D9A406' : '#4B465C', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoAwesome sx={{ fontSize: 18 }} /> AI Semantic Match
                      </Typography>
                    }
                  />
                </Tooltip>
              </Box>

              <form onSubmit={handleSearchSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={isAiMode ? 10 : 12}>
                    <div className="vx-search-input-container">
                      {isAiMode ? <AutoAwesome sx={{ color: '#D9A406', mr: 1 }} /> : <Search sx={{ color: '#A5A3AE', mr: 1 }} />}
                      <TextField
                        fullWidth
                        placeholder={isAiMode ? "Describe your skills & interests (e.g. 'I know React')..." : "Search project keywords..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{ py: 1, '& input': { color: '#4B465C', fontSize: '0.95rem' } }}
                      />
                    </div>
                  </Grid>
                  {isAiMode && (
                    <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button fullWidth type="submit" className="vx-btn-primary" sx={{ height: '100%' }}>
                        Match Me
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </form>

              <AnimatePresence>
                {!isAiMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography className="vx-text-muted" sx={{ fontSize: '0.85rem', fontWeight: 600, mr: 1 }}>Domain:</Typography>
                      {domains.map((dom) => (
                        <Chip
                          key={dom}
                          label={dom}
                          onClick={() => setDomainFilter(dom)}
                          className={`vx-filter-pill ${domainFilter === dom ? 'active' : ''}`}
                        />
                      ))}
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Projects Grid */}
          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}><ProjectCardSkeleton /></Grid>
              ))}
            </Grid>
          ) : projects.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="vx-card" style={{ padding: '40px', alignItems: 'center', textAlign: 'center' }}>
                <EmptyState icon="projects" title="No projects found" message="Try different keywords or turn on AI mode for better matching." />
              </div>
            </motion.div>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {projects.map((project, index) => (
                  <Grid item xs={12} sm={6} md={4} key={project.id || project._id}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      style={{ height: '100%' }}
                    >
                      <div className="vx-card">
                        <div className="vx-card-header">
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div className="vx-icon-box">
                              <WorkOutline sx={{ fontSize: 20 }} />
                            </div>
                            {project.confidence && (
                              <div className="vx-badge">
                                <AutoAwesome sx={{ fontSize: 14, mr: 0.5 }} /> {project.confidence}% Match
                              </div>
                            )}
                          </Box>
                        </div>
                        
                        <div className="vx-card-body">
                          <Typography className="vx-text-heading" sx={{ fontSize: '1.2rem', mb: 1.5, lineHeight: 1.4 }}>
                            {project.title}
                          </Typography>
                          
                          <Typography className="vx-text-body" sx={{ fontSize: '0.9rem', mb: 3, flexGrow: 1, lineHeight: 1.6 }}>
                            {project.description.length > 120 ? project.description.substring(0, 120) + '...' : project.description}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Domain sx={{ fontSize: 18, color: '#A5A3AE' }} />
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#4B465C' }}>
                              {project.domain}
                            </Typography>
                          </Box>
                        </div>

                        <div className="vx-card-footer">
                          <Button 
                            fullWidth endIcon={<ArrowForward />} 
                            className="vx-btn-primary"
                            onClick={() => navigate(`/student/project/${project.id || project._id}`)}
                          >
                            View Opportunity
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  )
}

export default BrowseProjects

