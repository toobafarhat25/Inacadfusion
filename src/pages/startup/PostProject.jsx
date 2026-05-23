import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  Divider,
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  RocketLaunch, 
  Code, 
  Psychology, 
  Description, 
  Business,
  ArrowForward
} from '@mui/icons-material'
import Snackbar from '../../components/shared/Snackbar'
import api from '../../utils/api'

const STYLES = `

.vx-root {
  font-family: 'Inter', system-ui, sans-serif;
  background: #F4F5FA;
  min-height: 100vh;
  color: #2D3748;
}

.vx-card {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.04);
  overflow: hidden;
  padding: 32px;
}

.vx-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.1rem;
  color: #1A202C;
  margin-bottom: 24px;
}

.vx-field-label {
  font-weight: 700;
  font-size: 0.85rem;
  color: rgba(0,0,0,0.5);
  margin-bottom: 8px;
  display: block;
}

.vx-input .MuiOutlinedInput-root {
  border-radius: 12px;
  background: #F8F9FA;
  transition: all 0.2s;
}
.vx-input .MuiOutlinedInput-root:hover {
  background: #FFF;
}

.vx-btn-mustard {
  background: #FFC107 !important;
  color: #000 !important;
  font-weight: 800 !important;
  border-radius: 12px !important;
  text-transform: none !important;
  padding: 14px !important;
  box-shadow: 0 4px 12px rgba(255,193,7,0.3) !important;
}

.vx-chip-skill {
  background: #EDE7FF !important;
  color: #7367F0 !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
}

.vx-chip-tech {
  background: #E6F9EE !important;
  color: #28C76F !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
}
`

const PostProject = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isEdit = location.state?.editMode || false
  const pData = location.state?.project || null

  const [formData, setFormData] = useState({
    title: pData?.title || '',
    description: pData?.description || '',
    domain: pData?.domain || '',
    requiredSkills: pData?.requiredSkills || [],
    technologies: pData?.technologies || [],
  })
  const [newSkill, setNewSkill] = useState('')
  const [newTech, setNewTech] = useState('')
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleAddSkill = () => {
    if (newSkill && !formData.requiredSkills.includes(newSkill)) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, newSkill],
      })
      setNewSkill('')
    }
  }

  const handleAddTech = () => {
    if (newTech && !formData.technologies.includes(newTech)) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTech],
      })
      setNewTech('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('domain', formData.domain)
      formData.requiredSkills.forEach(s => data.append('requiredSkills[]', s))
      formData.technologies.forEach(t => data.append('technologies[]', t))

      if (isEdit) {
        await api.put(`/projects/${pData._id}`, data)
        setSnackbar({ open: true, message: 'Project updated successfully!', severity: 'success' })
      } else {
        await api.post('/projects', data)
        setSnackbar({ open: true, message: 'Project posted successfully!', severity: 'success' })
      }
      setTimeout(() => navigate('/startup/manage-projects'), 1000)
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to post project.', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="vx-root" sx={{ pt: 12, px: { xs: 2, md: 3 }, pb: 8 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '2rem', color: '#1A202C', letterSpacing: '-0.02em', mb: 1 }}>
                {isEdit ? 'Edit Project' : 'Post New Project'}
              </Typography>
              <Typography sx={{ color: 'rgba(0,0,0,0.5)', fontWeight: 500 }}>
                {isEdit ? 'Update your project specifications.' : 'Define your vision and discover the perfect student partners.'}
              </Typography>
            </Box>

            <div className="vx-card">
              <Box component="form" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="vx-section-title">
                  <Description sx={{ color: '#FFC107' }} /> Project Vision
                </div>
                <Grid container spacing={3} sx={{ mb: 5 }}>
                  <Grid item xs={12}>
                    <span className="vx-field-label">Project Title</span>
                    <TextField
                      fullWidth variant="outlined" className="vx-input"
                      placeholder="e.g. Next-Gen Decentralized Marketplace"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <span className="vx-field-label">Domain</span>
                    <TextField
                      fullWidth variant="outlined" className="vx-input"
                      placeholder="e.g. Artificial Intelligence, Fintech"
                      value={formData.domain}
                      onChange={(e) => handleChange('domain', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <span className="vx-field-label">Project Description</span>
                    <TextField
                      fullWidth variant="outlined" className="vx-input" multiline rows={6}
                      placeholder="Describe the opportunity, goals, and what you expect from student collaborators..."
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>

                {/* Talent Requirements */}
                <div className="vx-section-title">
                  <Psychology sx={{ color: '#FFC107' }} /> Talent Requirements
                </div>
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {formData.requiredSkills.map((skill) => (
                      <Chip
                        key={skill} label={skill} className="vx-chip-skill"
                        onDelete={() => setFormData({...formData, requiredSkills: formData.requiredSkills.filter(s => s !== skill)})}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      variant="outlined" className="vx-input" size="small" sx={{ flexGrow: 1 }}
                      placeholder="Add required skill (e.g. Problem Solving)"
                      value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button variant="contained" onClick={handleAddSkill} sx={{ background: '#1A202C', color: '#FFF', borderRadius: '10px' }}>Add</Button>
                  </Box>
                </Box>

                {/* Tech Stack */}
                <div className="vx-section-title">
                  <Code sx={{ color: '#FFC107' }} /> Desired Technologies
                </div>
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {formData.technologies.map((tech) => (
                      <Chip
                        key={tech} label={tech} className="vx-chip-tech"
                        onDelete={() => setFormData({...formData, technologies: formData.technologies.filter(t => t !== tech)})}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      variant="outlined" className="vx-input" size="small" sx={{ flexGrow: 1 }}
                      placeholder="Add tech stack (e.g. Python, AWS)"
                      value={newTech} onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    />
                    <Button variant="contained" onClick={handleAddTech} sx={{ background: '#1A202C', color: '#FFF', borderRadius: '10px' }}>Add</Button>
                  </Box>
                </Box>

                <Button
                  type="submit" fullWidth variant="contained" disabled={loading}
                  className="vx-btn-mustard" endIcon={!loading && <RocketLaunch />}
                >
                  {loading ? (isEdit ? 'Updating...' : 'Publishing...') : (isEdit ? 'Save Changes' : 'Launch Project Idea')}
                </Button>
              </Box>
            </div>
          </motion.div>
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

export default PostProject
