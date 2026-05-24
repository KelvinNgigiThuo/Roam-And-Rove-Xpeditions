import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'
import api from '../../api/axios'

function DriverDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, tasksRes] = await Promise.all([
          api.get('/operations/expenses/'),
          api.get('/operations/tasks/'),
        ])
        setExpenses(expensesRes.data)
        setTasks(tasksRes.data)
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const todayTotal = expenses
    .filter(e => e.created_at.startsWith(today))
    .reduce((sum, e) => sum + parseFloat(e.amount), 0)

  const monthTotal = expenses
    .reduce((sum, e) => sum + parseFloat(e.amount), 0)

  const recentExpenses = expenses.slice(0, 2)
  const recentTasks = tasks.slice(0, 2)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formatDate = () => {
    return new Date().toLocaleDateString('en-KE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  if (loading) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.headerBrand}>Roam & Rove</span>
        <span style={styles.headerUser}>{user?.username}</span>
      </div>

      <div style={styles.body}>
        <div style={styles.greeting}>{greeting()}, {user?.username}</div>
        <div style={styles.date}>{formatDate()}</div>

        <div style={styles.metrics}>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Today's expenses</div>
            <div style={styles.metricValue}>KES {todayTotal.toLocaleString()}</div>
            <div style={styles.metricSub}>
              {expenses.filter(e => e.created_at.startsWith(today)).length} entries
            </div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>This month</div>
            <div style={styles.metricValue}>KES {monthTotal.toLocaleString()}</div>
            <div style={styles.metricSub}>{expenses.length} entries</div>
          </div>
        </div>

        <div style={styles.quickActions}>
          <button
            style={styles.primaryAction}
            onClick={() => navigate('/driver/expenses/log')}
          >
            + Log expense
          </button>
          <button
            style={styles.secondaryAction}
            onClick={() => navigate('/driver/expenses')}
          >
            My expenses
          </button>
        </div>

        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Recent expenses</span>
          <span style={styles.seeAll} onClick={() => navigate('/driver/expenses')}>
            See all
          </span>
        </div>
        <div style={styles.card}>
          {recentExpenses.length === 0 && (
            <div style={styles.empty}>No expenses yet</div>
          )}
          {recentExpenses.map((expense, index) => (
            <div
              key={expense.id}
              style={{
                ...styles.row,
                borderBottom: index < recentExpenses.length - 1
                  ? '1px solid #f0f0f0' : 'none'
              }}
            >
              <div>
                <div style={styles.rowTitle}>{expense.expense_type ?? 'No type'}</div>
                <div style={styles.rowSub}>{expense.created_at.split('T')[0]}</div>
              </div>
              <div style={styles.amount}>
                KES {parseFloat(expense.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>My tasks</span>
          <span style={styles.seeAll} onClick={() => navigate('/driver/tasks')}>
            See all
          </span>
        </div>
        <div style={{ ...styles.card, marginBottom: '80px' }}>
          {recentTasks.length === 0 && (
            <div style={styles.empty}>No tasks assigned yet</div>
          )}
          {recentTasks.map((task, index) => (
            <div
              key={task.id}
              style={{
                ...styles.row,
                borderBottom: index < recentTasks.length - 1
                  ? '1px solid #f0f0f0' : 'none'
              }}
            >
              <div>
                <div style={styles.rowTitle}>{task.title}</div>
                <div style={styles.rowSub}>{task.created_at.split('T')[0]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav role="DRIVER" />
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  loading: { padding: '40px', textAlign: 'center', color: '#888' },
  header: {
    background: '#1D9E75', padding: '10px 16px 8px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  headerBrand: { fontSize: '13px', color: '#E1F5EE' },
  headerUser: { fontSize: '12px', color: '#9FE1CB' },
  body: { padding: '14px' },
  greeting: { fontSize: '16px', fontWeight: '500', color: '#1a1a1a', marginBottom: '2px' },
  date: { fontSize: '12px', color: '#888', marginBottom: '16px' },
  metrics: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' },
  metricCard: { background: '#ffffff', borderRadius: '8px', padding: '12px' },
  metricLabel: { fontSize: '11px', color: '#888', marginBottom: '4px' },
  metricValue: { fontSize: '18px', fontWeight: '500', color: '#1a1a1a' },
  metricSub: { fontSize: '11px', color: '#aaa', marginTop: '2px' },
  quickActions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' },
  primaryAction: {
    padding: '11px 8px', background: '#1D9E75', color: '#ffffff',
    border: 'none', borderRadius: '8px', fontSize: '13px',
    fontWeight: '500', cursor: 'pointer',
  },
  secondaryAction: {
    padding: '11px 8px', background: '#ffffff', color: '#1a1a1a',
    border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px',
    fontWeight: '500', cursor: 'pointer',
  },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '8px',
  },
  sectionTitle: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a' },
  seeAll: { fontSize: '12px', color: '#1D9E75', cursor: 'pointer' },
  card: { background: '#ffffff', borderRadius: '8px', padding: '4px 12px', marginBottom: '16px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' },
  rowTitle: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a' },
  rowSub: { fontSize: '11px', color: '#aaa', marginTop: '2px' },
  amount: { fontSize: '13px', fontWeight: '500', color: '#085041' },
  empty: { padding: '16px 0', textAlign: 'center', color: '#aaa', fontSize: '13px' },
}

export default DriverDashboard