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
  IconButton,
  Paper,
} from '@mui/material'
import { 
  CloudUpload, 
  Delete, 
  Code, 
  Work, 
  Description, 
  AttachFile,
  CheckCircle
} from '@mui/icons-material'
import Snackbar from '../../components/shared/Snackbar'
import api from '../../utils/api'

const STYLES = `

.vx-root {
  font-family: 'Inter', system-ui, sans-serif;
  background: #FAFAFA;
  min-height: 100vh;
  color: #111827;
}

.vx-card {
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.04);
  padding: 40px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.06);
  position: relative;
  overflow: hidden;
}
.vx-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FFC107, #FF8F00);
}

.vx-section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-size: 1.15rem;
  color: #111827;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
}

.vx-field-label {
  font-weight: 700;
  font-size: 0.85rem;
  color: #4B5563;
  margin-bottom: 8px;
  display: block;
}

.vx-input .MuiOutlinedInput-root {
  border-radius: 12px;
  background: #F9FAFB;
  transition: all 0.3s ease;
}
.vx-input .MuiOutlinedInput-notchedOutline {
  border-color: #E5E7EB;
  transition: all 0.3s ease;
}
.vx-input .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
  border-color: #FFC107;
}
.vx-input .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
  border-color: #FFC107;
  border-width: 2px;
}
.vx-input .MuiOutlinedInput-root.Mui-focused {
  background: #FFFFFF;
  box-shadow: 0 4px 16px rgba(255,193,7,0.15);
}

.vx-upload-zone {
  border: 2px dashed #CBD5E1;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  background: #F8FAFC;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.vx-upload-zone:hover {
  border-color: #FF8F00;
  background: #FFFBEB;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255,193,7,0.15);
}

.vx-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  margin-top: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: transform 0.2s;
}
.vx-file-item:hover {
  transform: translateX(4px);
  border-color: #FFC107;
}

.vx-btn-primary {
  background: linear-gradient(135deg, #FFC107 0%, #FF8F00 100%) !important;
  color: #111827 !important;
  font-weight: 600 !important;
  font-family: 'Inter', system-ui !important;
  font-size: 0.9rem !important;
  border-radius: 6px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.06em !important;
  padding: 14px 36px !important;
  box-shadow: 0 4px 10px rgba(255,193,7,0.2) !important;
  transition: all 0.3s ease !important;
}
.vx-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(255,193,7,0.3) !important;
  background: linear-gradient(135deg, #FFCF33 0%, #FFA000 100%) !important;
}
`

const UploadProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    technologies: [],
    files: [],
  })
  const [newTech, setNewTech] = useState('')
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleAddTech = () => {
    if (newTech && !formData.technologies.includes(newTech)) {
      setFormData({ ...formData, technologies: [...formData.technologies, newTech] })
      setNewTech('')
    }
  }

  const handleRemoveTech = (tech) => {
    setFormData({ ...formData, technologies: formData.technologies.filter((t) => t !== tech) })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData({ ...formData, files: [...formData.files, ...files] })
  }

  const handleRemoveFile = (index) => {
    setFormData({ ...formData, files: formData.files.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('domain', formData.domain)
      formData.technologies.forEach(t => data.append('technologies[]', t))
      formData.files.forEach(f => data.append('files', f))

      await api.post('/projects', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setSnackbar({ open: true, message: 'Project uploaded successfully!', severity: 'success' })
      setFormData({ title: '', description: '', domain: '', technologies: [], files: [] })
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to upload project.', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="vx-root" sx={{ pt: { xs: 10, md: 14 }, px: { xs: 2, md: 4 }, pb: 8 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, color: '#111827', letterSpacing: '-0.04em', mb: 1.5, lineHeight: 1.1 }}>
                Submit a{' '}
                <Box component="span" sx={{ background: 'linear-gradient(135deg, #FFC107, #FF8F00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Project
                </Box>
              </Typography>
              <Typography sx={{ color: '#6B7280', fontWeight: 500, fontSize: '1.1rem', maxWidth: '500px', mx: 'auto' }}>
                Showcase your best work and start matching with premium startups in the network.
              </Typography>
            </Box>

            <div className="vx-card">
              <Box component="form" onSubmit={handleSubmit}>
                {/* Section 1: Basic Details */}
                <div className="vx-section-title">
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,193,7,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Description sx={{ color: '#FF8F00', fontSize: 20 }} /> 
                  </Box>
                  Project Thesis
                </div>
                <Grid container spacing={4} sx={{ mb: 6 }}>
                  <Grid item xs={12}>
                    <span className="vx-field-label">Project Title</span>
                    <TextField
                      fullWidth variant="outlined" className="vx-input"
                      placeholder="e.g. HealthTech Predictive Engine"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <span className="vx-field-label">Core Domain</span>
                    <TextField
                      fullWidth variant="outlined" className="vx-input"
                      placeholder="e.g. AI, DeFi, Healthcare"
                      value={formData.domain}
                      onChange={(e) => handleChange('domain', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <span className="vx-field-label">Executive Summary</span>
                    <TextField
                      fullWidth variant="outlined" className="vx-input" multiline rows={4}
                      placeholder="Detail the architecture, objectives, and impact of the implementation..."
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>

                {/* Section 2: Technical Stack */}
                <div className="vx-section-title">
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,193,7,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Code sx={{ color: '#FF8F00', fontSize: 20 }} /> 
                  </Box>
                  Tech Stack
                </div>
                <Box sx={{ mb: 6 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                    {formData.technologies.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        onDelete={() => handleRemoveTech(tech)}
                        sx={{ fontWeight: 700, background: '#FFFBEB', color: '#B45309', border: '1px solid rgba(255,193,7,0.3)', borderRadius: '8px' }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      variant="outlined" className="vx-input" size="small"
                      placeholder="e.g. Next.js, FastAPI"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      sx={{ flexGrow: 1 }}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    />
                    <Button variant="contained" onClick={handleAddTech} sx={{ background: '#111827', color: '#FFFFFF', fontWeight: 600, fontFamily: '"Inter", system-ui', letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: '6px', px: 3, boxShadow: '0 2px 6px rgba(0,0,0,0.1)', '&:hover': { background: '#374151', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }, transition: 'all 0.2s' }}>
                      Add Tech
                    </Button>
                  </Box>
                </Box>

                {/* Section 3: Files */}
                <div className="vx-section-title">
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,193,7,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AttachFile sx={{ color: '#FF8F00', fontSize: 20 }} /> 
                  </Box>
                  Attachments
                </div>
                <Box sx={{ mb: 6 }}>
                  <input
                    type="file" id="file-upload" hidden multiple
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload">
                    <div className="vx-upload-zone">
                      <CloudUpload sx={{ fontSize: 48, color: '#FFC107', mb: 1 }} />
                      <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '1.05rem' }}>Browse files to upload</Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#6B7280', mt: 0.5 }}>Drag & drop or click to attach ZIPs, PDFs, or Images</Typography>
                    </div>
                  </label>

                  <Box sx={{ mt: 3 }}>
                    {formData.files.map((file, index) => (
                      <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="vx-file-item">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{file.name}</Typography>
                          </Box>
                          <IconButton onClick={() => handleRemoveFile(index)} size="small" sx={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)', '&:hover': { background: 'rgba(239,68,68,0.2)' } }}>
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </div>
                      </motion.div>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    type="submit" disabled={loading}
                    className="vx-btn-primary"
                  >
                    {loading ? 'Processing...' : 'Submit Project Formulation'}
                  </Button>
                </Box>
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

export default UploadProject
