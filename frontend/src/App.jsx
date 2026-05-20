import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          user
            ? user.role === 'CEO'
              ? <Navigate to="/ceo/dashboard" />
              : <Navigate to="/driver/dashboard" />
            : <Navigate to="/login" />
        } />
        <Route path="/ceo/dashboard" element={
          <ProtectedRoute role="CEO">
            <div>CEO Dashboard coming soon</div>
          </ProtectedRoute>
        } />
        <Route path="/driver/dashboard" element={
          <ProtectedRoute role="DRIVER">
            <div>Driver Dashboard coming soon</div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App