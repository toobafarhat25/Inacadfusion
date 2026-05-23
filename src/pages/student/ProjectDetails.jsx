import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Grid,
  Breadcrumbs,
  Link,
  Tabs,
  Tab
} from '@mui/material'
import { 
  ArrowBack,
  Work, 
  Description,
  FolderZip,
  PictureAsPdf,
  Image as ImageIcon,
  Code,
  NavigateNext
} from '@mui/icons-material'
import Snackbar from '../../components/shared/Snackbar'
import api from '../../utils/api'
import { DashboardSkeleton as PageLoader } from '../../components/shared/SkeletonLoader'
import { API_BASE_URL } from '../../utils/api'

const STYLES = `
.pd-root {
  font-family: 'Inter', system-ui, sans-serif;
  background: #FFFFFF;
  min-height: 100vh;
  padding-top: 140px;
  padding-bottom: 100px;
}

/* ── HEADER & BREADCRUMBS ── */
.pd-header-area {
  text-align: center;
  margin-bottom: 60px;
}
.pd-header-area h1 {
  font-weight: 800;
  font-size: 2.2rem;
  color: #111827;
  margin-bottom: 12px;
}
.pd-breadcrumb {
  display: flex;
  justify-content: center;
}
.pd-breadcrumb-text {
  color: #6B7280;
  font-size: 0.95rem;
  font-weight: 500;
}

/* ── LEFT IMAGE AREA ── */
.pd-main-img-box {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 20px;
  border: 1px solid #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #FAFAFA;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}
.pd-thumbnail {
  width: 90px;
  height: 90px;
  border-radius: 12px;
  border: 1px solid #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.pd-thumbnail.active {
  border: 2px solid #10B981; /* Using green like the sample, or could be mustard */
}
.pd-thumbnail:hover:not(.active) {
  border-color: #D1D5DB;
}

/* ── RIGHT CONTENT AREA ── */
.pd-category {
  color: #10B981; /* Green like sample */
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 12px;
}
.pd-title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.pd-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}
.pd-badge {
  background: rgba(16, 185, 129, 0.1) !important;
  color: #10B981 !important;
  font-weight: 700 !important;
  border-radius: 20px !important;
}
.pd-price-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.pd-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
}
.pd-short-desc {
  color: #6B7280;
  line-height: 1.7;
  font-size: 1rem;
  margin-bottom: 32px;
}

/* ── VARIANTS (SKILLS) ── */
.pd-variant-title {
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  font-size: 0.95rem;
}
.pd-variant-chip {
  padding: 8px 20px;
  border-radius: 24px;
  border: 1px solid #E5E7EB;
  color: #111827;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: default;
  display: inline-block;
  background: #FFF;
}
.pd-variant-chip.active {
  background: #10B981;
  border-color: #10B981;
  color: #FFF;
}

/* ── ACTIONS ── */
.pd-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
}
.pd-btn-secondary {
  background: #10B981 !important;
  color: #FFF !important;
  font-weight: 700 !important;
  padding: 12px 32px !important;
  border-radius: 30px !important;
  text-transform: none !important;
  font-size: 1rem !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
}
.pd-btn-primary {
  background: #FFC107 !important;
  color: #111827 !important;
  font-weight: 700 !important;
  padding: 12px 40px !important;
  border-radius: 30px !important;
  text-transform: none !important;
  font-size: 1rem !important;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2) !important;
}

/* ── TABS (BOTTOM SECTION) ── */
.pd-tabs-container {
  margin-top: 80px;
  border-bottom: 1px solid #F3F4F6;
}
.pd-tab {
  font-size: 1.4rem !important;
  text-transform: none !important;
  font-weight: 600 !important;
  color: #9CA3AF !important;
  min-width: auto !important;
  padding: 16px 32px 16px 0 !important;
  margin-right: 32px !important;
}
.pd-tab.Mui-selected {
  color: #111827 !important;
  font-weight: 800 !important;
}
.pd-tabs-container .MuiTabs-indicator {
  background-color: #111827;
  height: 3px;
}
.pd-tab-content {
  padding: 40px 0;
  color: #4B5563;
  line-height: 1.8;
  font-size: 1.05rem;
}
`

const getFileIcon = (filename) => {
  if (!filename) return <Description />;
  const ext = filename.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return <PictureAsPdf sx={{ color: '#EF4444' }} />;
  if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) return <ImageIcon sx={{ color: '#10B981' }} />;
  if (['zip', 'rar'].includes(ext)) return <FolderZip sx={{ color: '#F59E0B' }} />;
  return <Description sx={{ color: '#6366F1' }} />;
};

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const [activeTab, setActiveTab] = useState(0)
  const [activeThumb, setActiveThumb] = useState(0)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`)
        setProject(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  const handleApply = async () => {
    try {
      await api.post('/collaborations', { projectId: id })
      setSnackbar({
        open: true,
        message: 'Collaboration request sent successfully!',
        severity: 'success',
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send request. Please try again.',
        severity: 'error',
      })
    }
  }

  if (loading) return <PageLoader />
  if (!project) return (
    <Box className="pd-root" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>Project not found</Typography>
    </Box>
  )

  const isStartup = project.uploadedBy?.role === 'startup'
  const uploaderName = project.uploadedBy?.name || (isStartup ? 'Startup' : 'Student')
  const initials = uploaderName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) || 'U'

  const thumbnails = [
    { type: 'main', label: 'Main' },
    ...(project.files || []).map((f) => ({ type: 'file', path: f, label: f.split('/').pop() }))
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="pd-root">
        
        {/* ══════ HEADER ══════ */}
        <Container maxWidth="lg">
          <Box className="pd-header-area">
            <h1>Project Details</h1>
            <Breadcrumbs 
              separator={<NavigateNext fontSize="small" />} 
              className="pd-breadcrumb"
            >
              <Link 
                underline="hover" 
                color="inherit" 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigate('/student/browse-projects'); }}
                className="pd-breadcrumb-text"
              >
                Projects
              </Link>
              <Typography className="pd-breadcrumb-text" sx={{ color: '#111827', fontWeight: 600 }}>
                Details
              </Typography>
            </Breadcrumbs>
          </Box>

          <Grid container spacing={8}>
            
            {/* ══════ LEFT COLUMN (IMAGES/THUMBNAILS) ══════ */}
            <Grid item xs={12} md={5}>
              <Box className="pd-main-img-box">
                {activeThumb === 0 ? (
                  <>
                    <Code sx={{ fontSize: 100, color: '#10B981', mb: 2 }} />
                    <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '1.2rem' }}>
                      {project.domain}
                    </Typography>
                  </>
                ) : (
                  <>
                    {getFileIcon(thumbnails[activeThumb].label)}
                    <Typography sx={{ fontWeight: 600, color: '#111827', mt: 2, px: 3, textAlign: 'center' }}>
                      {thumbnails[activeThumb].label}
                    </Typography>
                  </>
                )}
              </Box>

              {/* Thumbnails Row */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {thumbnails.map((thumb, index) => (
                  <Box 
                    key={index} 
                    className={`pd-thumbnail ${activeThumb === index ? 'active' : ''}`}
                    onClick={() => setActiveThumb(index)}
                  >
                    {thumb.type === 'main' ? (
                      <Code sx={{ color: '#10B981', fontSize: 32 }} />
                    ) : (
                      getFileIcon(thumb.label)
                    )}
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* ══════ RIGHT COLUMN (DETAILS) ══════ */}
            <Grid item xs={12} md={7}>
              <Typography className="pd-category">{project.domain}</Typography>
              
              <Box className="pd-title-row">
                <Typography className="pd-title">{project.title}</Typography>
                <Chip
                  label={isStartup ? 'Startup' : 'Student'}
                  size="small"
                  className="pd-badge"
                />
              </Box>

              <Box className="pd-price-row">
                <Typography className="pd-price">
                  {project.cost || 'Negotiable'}
                </Typography>
              </Box>

              <Typography className="pd-short-desc">
                {project.description.length > 200 
                  ? project.description.substring(0, 200) + '...' 
                  : project.description}
              </Typography>

              {/* Required Skills (Rendered like the "Weight" variants) */}
              {project.requiredSkills?.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography className="pd-variant-title">Required Skills</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {project.requiredSkills.map((skill, idx) => (
                      <div key={skill} className={`pd-variant-chip ${idx === 0 ? 'active' : ''}`}>
                        {skill}
                      </div>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Technologies */}
              {project.technologies?.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography className="pd-variant-title">Technologies</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {project.technologies.map((tech) => (
                      <div key={tech} className="pd-variant-chip">
                        {tech}
                      </div>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Box className="pd-actions">
                <Button
                  startIcon={<ArrowBack />}
                  className="pd-btn-secondary"
                  onClick={() => navigate('/student/browse-projects')}
                >
                  Back
                </Button>
                {user?._id !== project.uploadedBy?._id && user?.role !== 'admin' && (
                  <Button
                    className="pd-btn-primary"
                    onClick={handleApply}
                  >
                    Request Collaboration
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* ══════ BOTTOM SECTION (TABS) ══════ */}
          <Box className="pd-tabs-container">
            <Tabs 
              value={activeTab} 
              onChange={(e, v) => setActiveTab(v)}
              TabIndicatorProps={{ style: { backgroundColor: '#111827' } }}
            >
              <Tab label="Description" className="pd-tab" disableRipple />
              <Tab label="Attached Files" className="pd-tab" disableRipple />
            </Tabs>
          </Box>

          <Box className="pd-tab-content">
            {activeTab === 0 && (
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {project.description}
              </Typography>
            )}
            {activeTab === 1 && (
              <Box>
                {project.files && project.files.length > 0 ? (
                  <Grid container spacing={2}>
                    {project.files.map((file, i) => {
                      const filename = file.split('/').pop() || `Attachment ${i + 1}`
                      return (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                          <a 
                            href={`${API_BASE_URL}${file}`} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ 
                              display: 'flex', alignItems: 'center', gap: '16px', 
                              padding: '16px', border: '1px solid #E5E7EB', 
                              borderRadius: '12px', textDecoration: 'none', color: 'inherit'
                            }}
                          >
                            <Box sx={{ background: '#F3F4F6', p: 1.5, borderRadius: '8px' }}>
                              {getFileIcon(filename)}
                            </Box>
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                                {filename.length > 20 ? filename.substring(0,20) + '...' : filename}
                              </Typography>
                              <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
                                Download File
                              </Typography>
                            </Box>
                          </a>
                        </Grid>
                      )
                    })}
                  </Grid>
                ) : (
                  <Typography>No files attached to this project.</Typography>
                )}
              </Box>
            )}
          </Box>

        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  )
}

export default ProjectDetails
