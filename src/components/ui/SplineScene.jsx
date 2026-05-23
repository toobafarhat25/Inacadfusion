import { Suspense, lazy } from 'react'
import { Box } from '@mui/material'

const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, style }) {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid rgba(255,193,7,0.2)',
              borderTopColor: '#FFC107',
              animation: 'spin 0.8s linear infinite',
              '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
            }}
          />
        </Box>
      }
    >
      <Spline scene={scene} style={{ width: '100%', height: '100%', ...style }} />
    </Suspense>
  )
}

export default SplineScene
