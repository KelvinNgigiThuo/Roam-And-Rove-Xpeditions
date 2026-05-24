import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import CEODashboard from './pages/ceo/CEODashboard'
import CEOExpenses from './pages/ceo/CEOExpenses'
import CEOExpenseDetail from './pages/ceo/CEOExpenseDetail'
import CEOTasks from './pages/ceo/CEOTasks'
import CEOTaskDetail from './pages/ceo/CEOTaskDetail'
import CEOTaskCreate from './pages/ceo/CEOTaskCreate'
import CEOLogExpense from './pages/ceo/CEOLogExpense'
import DriverDashboard from './pages/driver/DriverDashboard'
import DriverExpenses from './pages/driver/DriverExpense'
import DriverLogExpense from './pages/driver/DriverLogExpense'
import DriverExpenseDetail from './pages/driver/DriverExpenseDetail'
import DriverTasks from './pages/driver/DriverTasks'
import DriverTaskDetail from './pages/driver/DriverTaskDetail'
import DriverTaskCreate from './pages/driver/DriverTaskCreate'

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
            <CEODashboard />
          </ProtectedRoute>
        } />
        <Route path="/ceo/expenses" element={
          <ProtectedRoute role="CEO">
            <CEOExpenses />
          </ProtectedRoute>
        } />
        <Route path="/ceo/expenses/:id" element={
          <ProtectedRoute role="CEO">
            <CEOExpenseDetail />
          </ProtectedRoute>
        } />
        <Route path="/ceo/expenses/log" element={
          <ProtectedRoute role="CEO">
            <CEOLogExpense />
          </ProtectedRoute>
        } />
        <Route path="/ceo/tasks" element={
          <ProtectedRoute role="CEO">
            <CEOTasks />
          </ProtectedRoute>
        } />
        <Route path="/ceo/tasks/create" element={
          <ProtectedRoute role="CEO">
            <CEOTaskCreate />
          </ProtectedRoute>
        } />
        <Route path="/ceo/tasks/:id" element={
          <ProtectedRoute role="CEO">
            <CEOTaskDetail />
          </ProtectedRoute>
        } />
      
        <Route path="/driver/dashboard" element={
          <ProtectedRoute role="DRIVER">
            <DriverDashboard />
          </ProtectedRoute>
        } />
        <Route path="/driver/expenses" element={
          <ProtectedRoute role="DRIVER">
            <DriverExpenses />
          </ProtectedRoute>
        } />
        <Route path="/driver/expenses/log" element={
          <ProtectedRoute role="DRIVER">
            <DriverLogExpense />
          </ProtectedRoute>
        } />
        <Route path="/driver/expenses/:id" element={
          <ProtectedRoute role="DRIVER">
            <DriverExpenseDetail />
          </ProtectedRoute>
        } />
        <Route path="/driver/tasks" element={
          <ProtectedRoute role="DRIVER">
            <DriverTasks />
          </ProtectedRoute>
        } />
        <Route path="/driver/tasks/create" element={
          <ProtectedRoute role="DRIVER">
            <DriverTaskCreate />
          </ProtectedRoute>
        } />
        <Route path="/driver/tasks/:id" element={
          <ProtectedRoute role="DRIVER">
            <DriverTaskDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App