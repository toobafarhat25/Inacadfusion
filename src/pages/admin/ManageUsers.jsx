import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material'
import { Block, Delete } from '@mui/icons-material'
import Snackbar from '../../components/shared/Snackbar'
import api from '../../utils/api'

const ManageUsers = () => {
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [students, setStudents] = useState([])
  const [startups, setStartups] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/admin/users')
        const allUsers = res.data.data
        setStudents(allUsers.filter(u => u.role === 'student'))
        setStartups(allUsers.filter(u => u.role === 'startup'))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleDelete = async (id, type) => {
    try {
      if (!window.confirm("Are you sure you want to delete this user completely?")) return;
      await api.delete(`/admin/users/${id}`)
      if (type === 'student') {
        setStudents(students.filter(s => s._id !== id))
      } else {
        setStartups(startups.filter(s => s._id !== id))
      }
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success',
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete user',
        severity: 'error',
      })
    }
  }

  if (loading) {
    return (
      <Box sx={{ pt: 10, px: 3, pb: 4 }}>
        <Container maxWidth="lg">
          <Typography>Loading...</Typography>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ pt: 10, px: 3, pb: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          Manage Users
        </Typography>

        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Students" />
          <Tab label="Startups" />
        </Tabs>

        {tab === 0 && (
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Academic Background</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.profileDetails?.academicBackground || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label="Active"
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(student._id, 'student')}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {tab === 1 && (
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Industry Domain</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {startups.map((startup) => (
                    <TableRow key={startup._id}>
                      <TableCell>{startup.name}</TableCell>
                      <TableCell>{startup.email}</TableCell>
                      <TableCell>{startup.profileDetails?.industryDomain || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label="Active"
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(startup._id, 'startup')}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Container>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  )
}

export default ManageUsers
