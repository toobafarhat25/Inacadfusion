import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  Avatar,
  CircularProgress,
  Divider,
} from '@mui/material'
import { 
  Edit, 
  Check, 
  Close,
  UploadFile
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

.sp-title {
  font-weight: 800;
  font-size: 1.8rem;
  color: #2F2B3D;
  margin-bottom: 24px;
}

.sp-main-card {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(47, 43, 61, 0.04);
  padding: 32px;
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
  font-size: 0.95rem;
  color: #2F2B3D;
  font-weight: 500;
}

/* ── PROGRESS ── */
.sp-progress-container {
  position: relative;
  display: inline-flex;
  margin-bottom: 24px;
}
.sp-progress-text {
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.5rem;
  color: #2F2B3D;
}

/* ── CHECKLIST ── */
.sp-check-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
}
.sp-check-item:last-child {
  border-bottom: none;
}
.sp-check-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sp-check-icon {
  width: 20px; height: 20px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.sp-check-icon.done {
  color: #28C76F;
}
.sp-check-icon.pending {
  color: #A5A3AE;
}
.sp-check-label {
  font-size: 0.9rem;
  color: #4B465C;
  font-weight: 500;
}
.sp-check-percent {
  font-size: 0.8rem;
  color: #A5A3AE;
  font-weight: 600;
}
.sp-check-percent.pending-bonus {
  color: #28C76F;
}
`

const StudentProfile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    skills: [],
    education: '',
    university: '',
    portfolioLinks: [],
    bio: '',
  })
  
  // 'personal' | 'bio' | 'skills' | null
  const [editSection, setEditSection] = useState(null)
  const [tempProfile, setTempProfile] = useState({})
  const [newSkill, setNewSkill] = useState('')
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
            skills: res.data.data.skills || [],
            education: res.data.data.education || '',
            university: res.data.data.university || '',
            portfolioLinks: res.data.data.portfolioLinks || [],
            bio: res.data.data.bio || ''
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

  const handleEditClick = (section) => {
    setTempProfile({ ...profile })
    setEditSection(section)
    setNewSkill('')
  }

  const handleCancelEdit = () => {
    setEditSection(null)
  }

  const handleTempChange = (field, value) => {
    setTempProfile({ ...tempProfile, [field]: value })
  }

  const handleAddSkill = () => {
    if (newSkill && !tempProfile.skills.includes(newSkill)) {
      setTempProfile({ ...tempProfile, skills: [...tempProfile.skills, newSkill] })
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skill) => {
    setTempProfile({ ...tempProfile, skills: tempProfile.skills.filter((s) => s !== skill) })
  }

  const handleSaveSection = async () => {
    try {
      await api.put('/profile', {
        skills: tempProfile.skills,
        education: tempProfile.education,
        university: tempProfile.university,
        bio: tempProfile.bio,
        portfolioLinks: tempProfile.portfolioLinks
      })
      setProfile(tempProfile)
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' })
      setEditSection(null)
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Error updating profile', severity: 'error' })
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setSnackbar({ open: true, message: 'Image must be smaller than 2MB', severity: 'error' })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setAvatarUrl(base64String)
        if (user?.id) localStorage.setItem(`avatar_${user.id}`, base64String)
        setSnackbar({ open: true, message: 'Profile photo updated successfully!', severity: 'success' })
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) return <PageLoader />

  const initials = profile.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S'

  // Completion calculation
  const completionItems = [
    { label: 'Setup account', percent: 10, done: true },
    { label: 'Personal Info', percent: 10, done: !!profile.name && !!profile.email },
    { label: 'University', percent: 20, done: !!profile.university },
    { label: 'Education Degree', percent: 20, done: !!profile.education },
    { label: 'Biography', percent: 20, done: !!profile.bio },
    { label: 'Technical Skills', percent: 20, done: profile.skills?.length > 0 },
  ]
  const totalCompletion = completionItems.reduce((acc, item) => item.done ? acc + item.percent : acc, 0)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="sp-root">
        <Container maxWidth="lg">
          <Typography className="sp-title">Edit Profile</Typography>
          
          <Grid container spacing={4}>
            {/* ══════ LEFT: MAIN EDIT AREA ══════ */}
            <Grid item xs={12} md={8}>
              <div className="sp-main-card">
                
                {/* ── AVATAR UPLOAD AREA ── */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                  <Avatar 
                    src={avatarUrl}
                    sx={{
                      width: 80, height: 80,
                      fontSize: '2rem', fontWeight: 700,
                      background: '#FFC107', color: '#000',
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Box>
                    <Button 
                      component="label"
                      variant="outlined" 
                      startIcon={<UploadFile />}
                      sx={{ 
                        textTransform: 'none', borderRadius: '8px', 
                        borderColor: '#DBDADE', color: '#4B465C', mb: 1,
                        fontWeight: 600
                      }}
                    >
                      Upload new photo
                      <input
                        type="file"
                        hidden
                        accept="image/png, image/jpeg"
                        onChange={handlePhotoUpload}
                      />
                    </Button>
                    <Typography sx={{ fontSize: '0.8rem', color: '#A5A3AE' }}>
                      At least 800x800 px recommended.<br/>JPG or PNG is allowed
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 4, borderColor: '#F3F4F6' }} />

                {/* ── PERSONAL INFO SECTION ── */}
                <div className={`sp-section-card ${editSection === 'personal' ? 'editing' : ''}`}>
                  <div className="sp-section-header">
                    <Typography className="sp-section-title">Personal Info</Typography>
                    {editSection === 'personal' ? (
                      <Button className="sp-cancel-btn" onClick={handleCancelEdit}>Cancel</Button>
                    ) : (
                      <Button className="sp-edit-btn" startIcon={<Edit sx={{ fontSize: 16 }} />} onClick={() => handleEditClick('personal')}>
                        Edit
                      </Button>
                    )}
                  </div>

                  {editSection === 'personal' ? (
                    <Box>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#4B465C', mb: 1 }}>Full Name</Typography>
                          <TextField fullWidth variant="outlined" className="sp-input" size="small" value={tempProfile.name} disabled />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#4B465C', mb: 1 }}>Email</Typography>
                          <TextField fullWidth variant="outlined" className="sp-input" size="small" value={tempProfile.email} disabled />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#4B465C', mb: 1 }}>University</Typography>
                          <TextField 
                            fullWidth variant="outlined" className="sp-input" size="small" 
                            value={tempProfile.university} onChange={(e) => handleTempChange('university', e.target.value)}
                            placeholder="e.g. Stanford University"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#4B465C', mb: 1 }}>Degree / Education</Typography>
                          <TextField 
                            fullWidth variant="outlined" className="sp-input" size="small" 
                            value={tempProfile.education} onChange={(e) => handleTempChange('education', e.target.value)}
                            placeholder="e.g. BS in Computer Science"
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button className="sp-save-btn" onClick={handleSaveSection}>Save changes</Button>
                      </Box>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography className="sp-field-label">Full Name</Typography>
                        <Typography className="sp-field-value">{profile.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className="sp-field-label">Email</Typography>
                        <Typography className="sp-field-value">{profile.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className="sp-field-label">University</Typography>
                        <Typography className="sp-field-value">{profile.university || '—'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography className="sp-field-label">Degree / Education</Typography>
                        <Typography className="sp-field-value">{profile.education || '—'}</Typography>
                      </Grid>
                    </Grid>
                  )}
                </div>

                {/* ── BIO SECTION ── */}
                <div className={`sp-section-card ${editSection === 'bio' ? 'editing' : ''}`}>
                  <div className="sp-section-header">
                    <Typography className="sp-section-title">Bio</Typography>
                    {editSection === 'bio' ? (
                      <Button className="sp-cancel-btn" onClick={handleCancelEdit}>Cancel</Button>
                    ) : (
                      <Button className="sp-edit-btn" startIcon={<Edit sx={{ fontSize: 16 }} />} onClick={() => handleEditClick('bio')}>
                        Edit
                      </Button>
                    )}
                  </div>

                  {editSection === 'bio' ? (
                    <Box>
                      <TextField 
                        fullWidth multiline rows={4} variant="outlined" className="sp-input" 
                        value={tempProfile.bio} onChange={(e) => handleTempChange('bio', e.target.value)}
                        placeholder="Hi 👋, I'm a passionate student..."
                      />
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button className="sp-save-btn" onClick={handleSaveSection}>Save changes</Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography sx={{ fontSize: '0.95rem', color: profile.bio ? '#4B465C' : '#A5A3AE', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {profile.bio || 'No bio added yet.'}
                    </Typography>
                  )}
                </div>

                {/* ── SKILLS SECTION ── */}
                <div className={`sp-section-card ${editSection === 'skills' ? 'editing' : ''}`} style={{ marginBottom: 0 }}>
                  <div className="sp-section-header">
                    <Typography className="sp-section-title">Technical Skills</Typography>
                    {editSection === 'skills' ? (
                      <Button className="sp-cancel-btn" onClick={handleCancelEdit}>Cancel</Button>
                    ) : (
                      <Button className="sp-edit-btn" startIcon={<Edit sx={{ fontSize: 16 }} />} onClick={() => handleEditClick('skills')}>
                        Edit
                      </Button>
                    )}
                  </div>

                  {editSection === 'skills' ? (
                    <Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {tempProfile.skills.map((skill) => (
                          <Chip
                            key={skill} label={skill}
                            onDelete={() => handleRemoveSkill(skill)}
                            sx={{ background: '#F3F4F6', color: '#4B465C', fontWeight: 600, borderRadius: '6px' }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField 
                          fullWidth variant="outlined" className="sp-input" size="small"
                          placeholder="Type a skill and press Enter..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); handleAddSkill() }
                          }}
                        />
                        <Button variant="contained" onClick={handleAddSkill} sx={{ background: '#2F2B3D', color: '#FFF', '&:hover':{background: '#1A1824'} }}>Add</Button>
                      </Box>
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button className="sp-save-btn" onClick={handleSaveSection}>Save changes</Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {profile.skills.length === 0 ? (
                        <Typography sx={{ fontSize: '0.95rem', color: '#A5A3AE' }}>No skills added yet.</Typography>
                      ) : (
                        profile.skills.map((skill) => (
                          <Chip key={skill} label={skill} sx={{ background: '#F8F8F9', color: '#4B465C', fontWeight: 600, borderRadius: '6px', border: '1px solid #EBEBEF' }} />
                        ))
                      )}
                    </Box>
                  )}
                </div>

              </div>
            </Grid>

            {/* ══════ RIGHT: COMPLETION CARD ══════ */}
            <Grid item xs={12} md={4}>
              <div className="sp-side-card">
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#2F2B3D', mb: 4, textAlign: 'center' }}>
                  Complete your profile
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <div className="sp-progress-container">
                    <CircularProgress 
                      variant="determinate" 
                      value={100} 
                      size={120} 
                      thickness={5} 
                      sx={{ color: '#F3F4F6', position: 'absolute' }} 
                    />
                    <CircularProgress 
                      variant="determinate" 
                      value={totalCompletion} 
                      size={120} 
                      thickness={5} 
                      sx={{ color: totalCompletion === 100 ? '#28C76F' : '#FFC107', strokeLinecap: 'round' }} 
                    />
                    <div className="sp-progress-text">{totalCompletion}%</div>
                  </div>
                </Box>

                <Box>
                  {completionItems.map((item, i) => (
                    <div className="sp-check-item" key={i}>
                      <div className="sp-check-left">
                        <div className={`sp-check-icon ${item.done ? 'done' : 'pending'}`}>
                          {item.done ? <Check sx={{ fontSize: 18 }} /> : <Close sx={{ fontSize: 18 }} />}
                        </div>
                        <Typography className="sp-check-label">{item.label}</Typography>
                      </div>
                      <Typography className={`sp-check-percent ${!item.done ? 'pending-bonus' : ''}`}>
                        {item.done ? `${item.percent}%` : `+${item.percent}%`}
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

export default StudentProfile
