import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './screens/Login'
import ProtectedRoute from './components/ProtectedRoute'
import CEODashboard from './screens/ceo/CEODashboard'
import CEOExpenses from './screens/ceo/CEOExpenses'
import CEOExpenseDetail from './screens/ceo/CEOExpenseDetail'
import CEOTasks from './screens/ceo/CEOTasks'
import CEOTaskDetail from './screens/ceo/CEOTaskDetail'
import CEOTaskCreate from './screens/ceo/CEOTaskCreate'
import CEOLogExpense from './screens/ceo/CEOLogExpense'
import CEOExpenseTypes from './screens/ceo/CEOExpenseTypes'
import DriverDashboard from './screens/driver/DriverDashboard'
import DriverExpenses from './screens/driver/DriverExpense'
import DriverLogExpense from './screens/driver/DriverLogExpense'
import DriverExpenseDetail from './screens/driver/DriverExpenseDetail'
import DriverTasks from './screens/driver/DriverTasks'
import DriverTaskDetail from './screens/driver/DriverTaskDetail'
import DriverTaskCreate from './screens/driver/DriverTaskCreate'

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
        <Route path="/ceo/expense-types" element={
          <ProtectedRoute role="CEO">
            <CEOExpenseTypes />
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