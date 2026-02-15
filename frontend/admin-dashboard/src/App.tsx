import React from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import Analytics from './pages/Analytics'
import Dashboard from './pages/Dashboard'
import Disputes from './pages/Disputes'
import Jobs from './pages/Jobs'
import Login from './pages/Login'
import ResourceEdit from './pages/ResourceEdit'
import Resources from './pages/Resources'
import Users from './pages/Users'
import { useAuthStore } from './store/authStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={<AdminRedirect />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="disputes" element={<Disputes />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="resources" element={<Resources />} />
        <Route path="resources/:resourceId/edit" element={<ResourceEdit />} />
      </Route>
    </Routes>
  )
}

function AdminRedirect() {
  const location = useLocation()
  const navigate = useNavigate()

  React.useEffect(() => {
    const newPath = location.pathname.replace(/^\/admin/, '') || '/'
    navigate(newPath + location.search + location.hash, { replace: true })
  }, [location, navigate])

  return null
}

export default App
