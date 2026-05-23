import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  CircularProgress,
  Divider,
} from '@mui/material'
import { 
  Edit, 
  Check, 
  Close,
  UploadFile,
  Business,
  Language,
  Description,
  Person,
  Email
} from '@mui/icons-material'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import Snackbar from '../../components/shared/Snackbar'
import { DashboardSkeleton as PageLoader } from '../../components/shared/SkeletonLoader'

const STYLES = `
.sp-root {
  font-family: 'Public Sans', 'Inter', system-ui, sans-serif;
  background: #F8F8F9;
  min-height: 100vh;
  color: #4B465C;
  padding-top: 100px;
  padding-bottom: 80px;
}

.sp-banner {
  height: 200px;
  background: linear-gradient(135deg, #2F2B3D 0%, #1A1824 100%);
  border-radius: 16px 16px 0 0;
  position: relative;
}

.sp-avatar-wrapper {
  position: absolute;
  bottom: -40px;
  left: 40px;
  display: flex;
  align-items: flex-end;
  gap: 24px;
}

.sp-avatar {
  width: 120px !important;
  height: 120px !important;
  border: 4px solid #FFFFFF;
  box-shadow: 0 4px 18px rgba(47, 43, 61, 0.1);
  background: #FFC107 !important;
  color: #000 !important;
  font-size: 3rem !important;
  font-weight: 800 !important;
}

.sp-upload-btn {
  background: #FFFFFF !important;
  color: #4B465C !important;
  border: 1px solid #EBEBEF !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 6px 16px !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 6px rgba(47,43,61,0.04) !important;
  margin-bottom: 40px;
  cursor: pointer;
}
.sp-upload-btn:hover {
  background: #F8F8F9 !important;
}

.sp-title {
  font-weight: 800;
  font-size: 1.8rem;
  color: #2F2B3D;
  margin-bottom: 24px;
}

.sp-main-card {
  background: #FFFFFF;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 18px rgba(47, 43, 61, 0.04);
  padding: 60px 40px 40px 40px;
  margin-bottom: 32px;
}

.sp-side-card {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(47, 43, 61, 0.04);
  padding: 32px;
  position: sticky;
  top: 100px;
}

.sp-section-card {
  border: 1px solid #EBEBEF;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  transition: all 0.2s ease;
}
.sp-section-card.editing {
  background: #FAFAFA;
  border-color: #FFC107;
  box-shadow: 0 4px 12px rgba(255,193,7,0.05);
}

.sp-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sp-section-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2F2B3D;
}

.sp-edit-btn {
  border: 1px solid #EBEBEF !important;
  color: #4B465C !important;
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 4px 16px !important;
  transition: all 0.2s !important;
}
.sp-edit-btn:hover {
  background: #F8F8F9 !important;
  border-color: #DBDADE !important;
}

.sp-save-btn {
  background: #FFC107 !important;
  color: #000 !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  text-transform: none !important;
  padding: 8px 24px !important;
  box-shadow: 0 2px 6px rgba(255,193,7,0.2) !important;
}
.sp-save-btn:hover {
  background: #FFB300 !important;
  box-shadow: 0 4px 10px rgba(255,193,7,0.3) !important;
}

.sp-cancel-btn {
  color: #A5A3AE !important;
  font-weight: 600 !important;
  text-transform: none !important;
}

/* ── INPUT OVERRIDE ── */
.sp-input .MuiOutlinedInput-root {
  border-radius: 8px;
  font-size: 0.95rem;
  background: #FFFFFF;
  transition: all 0.15s ease;
}
.sp-input .MuiOutlinedInput-notchedOutline {
  border-color: #DBDADE;
}
.sp-input .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
  border-color: #A5A3AE;
}
.sp-input .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
  border-color: #FFC107;
  border-width: 2px;
}

/* ── READONLY FIELDS ── */
.sp-field-label {
  font-size: 0.8rem;
  color: #A5A3AE;
  font-weight: 600;
  margin-bottom: 4px;
}
.sp-field-value {
  font-size: 1rem;
  color: #4B465C;
  font-weight: 500;
}

/* ── COMPLETION WIDGET ── */
.sp-completion-task {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed #EBEBEF;
}
.sp-completion-task:last-child {
  border-bottom: none;
}
.sp-task-icon {
  width: 24px; height: 24px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
}
.sp-task-done {
  background: rgba(40,199,111,0.16);
  color: #28C76F;
}
.sp-task-pending {
  background: rgba(47,43,61,0.08);
  color: #A5A3AE;
}
`

const StartupProfile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  
  // profile holds the committed state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    companyName: '',
    domain: '',
    description: '',
  })
  
  // editSection controls which card is currently in edit mode
  // 'company' | 'contact' | 'about' | null
  const [editSection, setEditSection] = useState(null)
  const [tempProfile, setTempProfile] = useState({})
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem(`avatar_${user?.id}`) || null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me')
        if (res.data.data) {
          setProfile({
            name: user?.name || '',
            email: user?.email || '',
            companyName: res.data.data.companyName || '',
            domain: res.data.data.domain || '',
            description: res.data.data.description || ''
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const handleEdit = (section) => {
    setTempProfile({ ...profile })
    setEditSection(section)
  }

  const handleCancel = () => {
    setEditSection(null)
    setTempProfile({})
  }

  const handleChange = (field, value) => {
    setTempProfile({ ...tempProfile, [field]: value })
  }

  const handleSave = async () => {
    try {
      await api.put('/profile', {
        companyName: tempProfile.companyName,
        domain: tempProfile.domain,
        description: tempProfile.description
      })
      setProfile({ ...tempProfile })
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' })
      setEditSection(null)
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Error updating profile', severity: 'error' })
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'File size must be less than 2MB', severity: 'error' })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarUrl(reader.result)
      localStorage.setItem(`avatar_${user?.id}`, reader.result)
      setSnackbar({ open: true, message: 'Photo uploaded successfully!', severity: 'success' })
    }
    reader.readAsDataURL(file)
  }

  // Calculate completion
  const completionTasks = [
    { label: 'Company Name', isDone: !!profile.companyName },
    { label: 'Industry Domain', isDone: !!profile.domain },
    { label: 'Company Description', isDone: !!profile.description },
    { label: 'Profile Picture', isDone: !!avatarUrl }
  ]
  const completedCount = completionTasks.filter(t => t.isDone).length
  const completionPercent = Math.round((completedCount / completionTasks.length) * 100)

  if (loading) return <PageLoader />

  const initials = profile.companyName ? profile.companyName[0].toUpperCase() : (profile.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="sp-root">
        <Container maxWidth="lg">
          
          <Typography className="sp-title">Startup Profile</Typography>

          <Grid container spacing={4}>
            {/* ══════ LEFT: MAIN PROFILE FORM ══════ */}
            <Grid item xs={12} md={8}>
              
              {/* Banner & Avatar */}
              <Box sx={{ mb: 4 }}>
                <Box className="sp-banner">
                  <Box className="sp-avatar-wrapper">
                    <Avatar 
                      className="sp-avatar" 
                      src={avatarUrl}
                    >
                      {!avatarUrl && initials}
                    </Avatar>
                    
                    {/* Hidden file input wrapped by a label button */}
                    <label>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg" 
                        style={{ display: 'none' }} 
                        onChange={handlePhotoUpload}
                      />
                      <Box className="sp-upload-btn" component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UploadFile sx={{ fontSize: 18 }} /> Upload logo
                      </Box>
                    </label>
                  </Box>
                </Box>
                <Box className="sp-main-card">
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#2F2B3D' }}>
                    {profile.companyName || profile.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#A5A3AE', mt: 0.5 }}>
                    {profile.domain || 'Verified Startup'}
                  </Typography>
                </Box>
              </Box>

              {/* ── SECTION: COMPANY INFO ── */}
              <div className={`sp-section-card ${editSection === 'company' ? 'editing' : ''}`}>
                <div className="sp-section-header">
                  <Typography className="sp-section-title">Company Information</Typography>
                  {editSection !== 'company' && (
                    <Button startIcon={<Edit />} className="sp-edit-btn" onClick={() => handleEdit('company')}>
                      Edit
                    </Button>
                  )}
                </div>
                
                {editSection === 'company' ? (
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Name"
                          variant="outlined"
                          className="sp-input"
                          value={tempProfile.companyName}
                          onChange={(e) => handleChange('companyName', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Industry / Domain"
                          variant="outlined"
                          className="sp-input"
                          placeholder="e.g. Fintech, Edtech"
                          value={tempProfile.domain}
                          onChange={(e) => handleChange('domain', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                      <Button className="sp-cancel-btn" onClick={handleCancel}>Cancel</Button>
                      <Button className="sp-save-btn" onClick={handleSave}>Save Changes</Button>
                    </Box>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography className="sp-field-label">Company Name</Typography>
                      <Typography className="sp-field-value">{profile.companyName || '—'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography className="sp-field-label">Industry / Domain</Typography>
                      <Typography className="sp-field-value">{profile.domain || '—'}</Typography>
                    </Grid>
                  </Grid>
                )}
              </div>

              {/* ── SECTION: CONTACT PERSON ── */}
              <div className={`sp-section-card ${editSection === 'contact' ? 'editing' : ''}`}>
                <div className="sp-section-header">
                  <Typography className="sp-section-title">Contact Person</Typography>
                </div>
                
                {/* Contact person is usually tied to auth user, kept readonly here for demonstration */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography className="sp-field-label">Full Name</Typography>
                    <Typography className="sp-field-value">{profile.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography className="sp-field-label">Email Address</Typography>
                    <Typography className="sp-field-value">{profile.email}</Typography>
                  </Grid>
                </Grid>
              </div>

              {/* ── SECTION: ABOUT COMPANY ── */}
              <div className={`sp-section-card ${editSection === 'about' ? 'editing' : ''}`}>
                <div className="sp-section-header">
                  <Typography className="sp-section-title">About Company</Typography>
                  {editSection !== 'about' && (
                    <Button startIcon={<Edit />} className="sp-edit-btn" onClick={() => handleEdit('about')}>
                      Edit
                    </Button>
                  )}
                </div>
                
                {editSection === 'about' ? (
                  <Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      variant="outlined"
                      className="sp-input"
                      placeholder="Describe what your startup is building..."
                      value={tempProfile.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                      <Button className="sp-cancel-btn" onClick={handleCancel}>Cancel</Button>
                      <Button className="sp-save-btn" onClick={handleSave}>Save Changes</Button>
                    </Box>
                  </Box>
                ) : (
                  <Typography className="sp-field-value" sx={{ whiteSpace: 'pre-wrap' }}>
                    {profile.description || <span style={{ color: '#A5A3AE', fontStyle: 'italic' }}>No description provided.</span>}
                  </Typography>
                )}
              </div>

            </Grid>

            {/* ══════ RIGHT: PROFILE COMPLETION ══════ */}
            <Grid item xs={12} md={4}>
              <div className="sp-side-card">
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#2F2B3D', mb: 3 }}>
                  Profile Completion
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, position: 'relative' }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={100} 
                    size={120} 
                    thickness={4} 
                    sx={{ color: '#F8F8F9', position: 'absolute' }}
                  />
                  <CircularProgress 
                    variant="determinate" 
                    value={completionPercent} 
                    size={120} 
                    thickness={4} 
                    sx={{ color: '#FFC107', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }}
                  />
                  <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#2F2B3D', lineHeight: 1 }}>
                      {completionPercent}%
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3, borderColor: '#EBEBEF' }} />

                <Box>
                  {completionTasks.map((task, i) => (
                    <div key={i} className="sp-completion-task">
                      <div className={`sp-task-icon ${task.isDone ? 'sp-task-done' : 'sp-task-pending'}`}>
                        {task.isDone ? <Check fontSize="inherit" /> : <Close fontSize="inherit" />}
                      </div>
                      <Typography sx={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 600, 
                        color: task.isDone ? '#4B465C' : '#A5A3AE',
                        textDecoration: task.isDone ? 'line-through' : 'none'
                      }}>
                        {task.label}
                      </Typography>
                    </div>
                  ))}
                </Box>

              </div>
            </Grid>

          </Grid>

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

export default StartupProfile
