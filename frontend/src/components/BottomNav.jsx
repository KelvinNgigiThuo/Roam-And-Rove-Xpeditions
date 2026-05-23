import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function BottomNav({ role }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const ceoTabs = [
    { label: 'Home', path: '/ceo/dashboard', icon: '🏠' },
    { label: 'Expenses', path: '/ceo/expenses', icon: '🧾' },
    { label: 'Tasks', path: '/ceo/tasks', icon: '📋' },
  ]

  const driverTabs = [
    { label: 'Home', path: '/driver/dashboard', icon: '🏠' },
    { label: 'Expenses', path: '/driver/expenses', icon: '🧾' },
    { label: 'Tasks', path: '/driver/tasks', icon: '📋' },
  ]

  const tabs = role === 'CEO' ? ceoTabs : driverTabs

  return (
    <div style={styles.nav}>
      {tabs.map((tab) => (
        <button
          key={tab.path}
          style={{
            ...styles.tab,
            color: location.pathname === tab.path ? '#E8A020' : '#888',
          }}
          onClick={() => navigate(tab.path)}
        >
          <span style={styles.icon}>{tab.icon}</span>
          <span style={styles.label}>{tab.label}</span>
        </button>
      ))}
      <button
        style={{ ...styles.tab, color: '#888' }}
        onClick={handleLogout}
      >
        <span style={styles.icon}>🚪</span>
        <span style={styles.label}>Logout</span>
      </button>
    </div>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    justifyContent: 'space-around',
    background: '#ffffff',
    borderTop: '1px solid #e0e0e0',
    padding: '8px 0 12px',
    zIndex: 100,
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 12px',
  },
  icon: {
    fontSize: '20px',
  },
  label: {
    fontSize: '10px',
    fontWeight: '500',
  },
}

export default BottomNav