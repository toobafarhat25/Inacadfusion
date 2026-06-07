import React, { useState, lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppBar from './components/shared/AppBar'
import Sidebar from './components/shared/Sidebar'

// Public Pages
const LandingPage = lazy(() => import('./pages/public/LandingPage'))
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))
const PublicProjects = lazy(() => import('./pages/public/PublicProjects'))
const VerifyLetter = lazy(() => import('./pages/public/VerifyLetter'))

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'))
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'))
const BrowseProjects = lazy(() => import('./pages/student/BrowseProjects'))
const ProjectDetails = lazy(() => import('./pages/student/ProjectDetails'))
const MyCollaborations = lazy(() => import('./pages/student/MyCollaborations'))
const UploadProject = lazy(() => import('./pages/student/UploadProject'))
const StudentManageProjects = lazy(() => import('./pages/student/ManageProjects'))
const NotificationsPage = lazy(() => import('./pages/student/NotificationsPage'))
const MyLetters = lazy(() => import('./pages/student/MyLetters'))
const MessagesPage = lazy(() => import('./pages/shared/MessagesPage'))

// Startup Pages
const StartupDashboard = lazy(() => import('./pages/startup/StartupDashboard'))
const StartupProfile = lazy(() => import('./pages/startup/StartupProfile'))
const PostProject = lazy(() => import('./pages/startup/PostProject'))
const StartupManageProjects = lazy(() => import('./pages/startup/ManageProjects'))
const ManageCollaborations = lazy(() => import('./pages/startup/ManageCollaborations'))
const ExperienceLetter = lazy(() => import('./pages/startup/ExperienceLetter'))
const DiscoverStudents = lazy(() => import('./pages/startup/DiscoverStudents'))

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'))
const AdminManageProjects = lazy(() => import('./pages/admin/ManageProjects'))
const ReportsLogs = lazy(() => import('./pages/admin/ReportsLogs'))
const DisputeManagement = lazy(() => import('./pages/admin/DisputeManagement'))

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])
  return null
}

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress sx={{ color: '#FFC107' }} />
  </Box>
)

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

const AppContent = () => {
  const { isAuthenticated } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.25,
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100vw',
      position: 'relative',
    }}>
      <ScrollToTop />
      <AppBar onMenuClick={() => setDrawerOpen(!drawerOpen)} drawerOpen={drawerOpen} />
      {isAuthenticated && (
        <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <LandingPage />
              </motion.div>
            }
          />
          <Route
            path="/about"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AboutPage />
              </motion.div>
            }
          />
          <Route
            path="/contact"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ContactPage />
              </motion.div>
            }
          />
          <Route
            path="/projects"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <PublicProjects />
              </motion.div>
            }
          />
          <Route
            path="/verify/:hash"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <VerifyLetter />
              </motion.div>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <LoginPage />
              </motion.div>
            }
          />
          <Route
            path="/register"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <RegisterPage />
              </motion.div>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <StudentDashboard />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <StudentProfile />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/browse-projects"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <BrowseProjects />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/project/:slugId"
            element={
              <ProtectedRoute allowedRoles={['student', 'startup', 'admin']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ProjectDetails />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/collaborations"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MyCollaborations />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/letters"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MyLetters />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/manage-projects"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <StudentManageProjects />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/upload-project"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <UploadProject />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/edit-project/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <UploadProject />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <NotificationsPage />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/messages"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MessagesPage />
                </motion.div>
              </ProtectedRoute>
            }
          />

          {/* Startup Routes */}
          <Route
            path="/startup/notifications"
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <NotificationsPage />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/startup/dashboard"
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <StartupDashboard />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/startup/profile"
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <StartupProfile />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/startup/post-project"
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <PostProject />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/startup/discover-students"
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <DiscoverStudents />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/startup/manage-projects"
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <StartupManageProjects />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/startup/collaborations"
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ManageCollaborations />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/startup/experience-letter"
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ExperienceLetter />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/startup/messages"
            element={
              <ProtectedRoute allowedRoles={['startup']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MessagesPage />
                </motion.div>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AdminDashboard />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ManageUsers />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AdminManageProjects />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ReportsLogs />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/disputes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <DisputeManagement />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <NotificationsPage />
                </motion.div>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </Box>
    </Box>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
