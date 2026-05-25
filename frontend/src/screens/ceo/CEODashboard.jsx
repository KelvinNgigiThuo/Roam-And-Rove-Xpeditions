import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'
import api from '../../api/axios'

function CEODashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState({})
  const [expenseTypes, setExpenseTypes] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, tasksRes, typesRes, usersRes] = await Promise.all([
          api.get('/operations/expenses/'),
          api.get('/operations/tasks/'),
          api.get('/operations/expense-types/'),
          api.get('/users/'),
        ])

        setExpenses(expensesRes.data)
        setTasks(tasksRes.data)

        // Build a lookup map of id -> name for expense types
        const typesMap = {}
        typesRes.data.forEach((t) => {
          typesMap[t.id] = t.name
        })
        setExpenseTypes(typesMap)

        // Build a lookup map of id -> username for users
        const usersMap = {}
        usersRes.data.forEach((u) => {
          usersMap[u.id] = u.username
        })
        setUsers(usersMap)
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
    .filter((e) => e.created_at.startsWith(today))
    .reduce((sum, e) => sum + parseFloat(e.amount), 0)

  const monthTotal = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)

  const weekTotal = expenses
    .filter((e) => new Date(e.created_at) >= weekAgo)
    .reduce((sum, e) => sum + parseFloat(e.amount), 0)

  const recentExpenses = expenses.slice(0, 3)
  const recentTasks = tasks.slice(0, 2)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formatDate = () => {
    return new Date().toLocaleDateString('en-KE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
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
        <div style={styles.greeting}>
          {greeting()}, {user?.username}
        </div>
        <div style={styles.date}>{formatDate()}</div>

        {/* Metrics */}
        <div style={styles.metricsLarge}>
          <div style={{ ...styles.metricCard, ...styles.metricAccent }}>
            <div style={{ ...styles.metricLabel, color: '#085041' }}>
              This month
            </div>
            <div style={{ ...styles.metricValue, color: '#085041' }}>
              KES {monthTotal.toLocaleString()}
            </div>
            <div style={{ ...styles.metricSub, color: '#0F6E56' }}>
              {expenses.length} expenses
            </div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>This week</div>
            <div style={styles.metricValue}>
              KES {weekTotal.toLocaleString()}
            </div>
            <div style={styles.metricSub}>
              {expenses.filter((e) => new Date(e.created_at) >= weekAgo).length}{' '}
              expenses
            </div>
          </div>
        </div>

        <div style={styles.metricsSmall}>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Today</div>
            <div style={{ ...styles.metricValue, fontSize: '16px' }}>
              KES {todayTotal.toLocaleString()}
            </div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Drivers</div>
            <div style={{ ...styles.metricValue, fontSize: '16px' }}>
              {
                Object.keys(users).filter((id) => users[id] !== user?.username)
                  .length
              }
            </div>
            <div style={styles.metricSub}>active</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Tasks</div>
            <div style={{ ...styles.metricValue, fontSize: '16px' }}>
              {tasks.length}
            </div>
            <div style={styles.metricSub}>open</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <button
            style={styles.actionBtn}
            onClick={() => navigate('/ceo/expenses/log')}
          >
            <span style={styles.actionIcon}>🧾</span>
            <span style={styles.actionLabel}>Log expense</span>
          </button>
          <button
            style={styles.actionBtn}
            onClick={() => navigate('/ceo/tasks/create')}
          >
            <span style={styles.actionIcon}>📋</span>
            <span style={styles.actionLabel}>New task</span>
          </button>
          <button
            style={styles.actionBtn}
            onClick={() => navigate('/ceo/expense-types')}
          >
            <span style={styles.actionIcon}>🏷️</span>
            <span style={styles.actionLabel}>Expense types</span>
          </button>
        </div>

        {/* Recent Expenses */}
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Recent expenses</span>
          <span style={styles.seeAll} onClick={() => navigate('/ceo/expenses')}>
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
                borderBottom:
                  index < recentExpenses.length - 1
                    ? '1px solid #f0f0f0'
                    : 'none',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/ceo/expenses/${expense.id}`)}
            >
              <div>
                <div style={styles.rowTitle}>
                  {expenseTypes[expense.expense_type] ?? 'No type'}
                </div>
                <div style={styles.rowSub}>
                  {users[expense.created_by] ?? `User ${expense.created_by}`}
                  {' · '}
                  {expense.created_at.split('T')[0]}
                </div>
              </div>
              <div style={styles.amount}>
                KES {parseFloat(expense.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Tasks */}
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Recent tasks</span>
          <span style={styles.seeAll} onClick={() => navigate('/ceo/tasks')}>
            See all
          </span>
        </div>
        <div style={{ ...styles.card, marginBottom: '80px' }}>
          {recentTasks.length === 0 && (
            <div style={styles.empty}>No tasks yet</div>
          )}
          {recentTasks.map((task, index) => (
            <div
              key={task.id}
              style={{
                ...styles.row,
                borderBottom:
                  index < recentTasks.length - 1 ? '1px solid #f0f0f0' : 'none',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/ceo/tasks/${task.id}`)}
            >
              <div style={{ flex: 1, marginRight: '8px' }}>
                <div style={styles.rowTitle}>{task.title}</div>
                <div style={styles.rowSub}>
                  {task.assigned_to
                    ? `→ ${users[task.assigned_to] ?? `User ${task.assigned_to}`}`
                    : 'Not assigned yet'}
                </div>
              </div>
              <div
                style={
                  task.assigned_to
                    ? styles.assignedBadge
                    : styles.unassignedBadge
                }
              >
                {task.assigned_to ? 'Assigned' : 'Unassigned'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav role="CEO" />
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#888',
  },
  header: {
    background: '#1D9E75',
    padding: '10px 16px 8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBrand: { fontSize: '13px', color: '#E1F5EE' },
  headerUser: { fontSize: '12px', color: '#9FE1CB' },
  body: { padding: '14px' },
  greeting: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '2px',
  },
  date: { fontSize: '12px', color: '#888', marginBottom: '16px' },
  metricsLarge: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '8px',
  },
  metricsSmall: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    marginBottom: '16px',
  },
  metricCard: { background: '#ffffff', borderRadius: '8px', padding: '12px' },
  metricAccent: { background: '#E1F5EE' },
  metricLabel: { fontSize: '11px', color: '#888', marginBottom: '4px' },
  metricValue: { fontSize: '18px', fontWeight: '500', color: '#1a1a1a' },
  metricSub: { fontSize: '11px', color: '#aaa', marginTop: '2px' },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    marginBottom: '16px',
  },
  actionBtn: {
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  actionIcon: { fontSize: '22px' },
  actionLabel: { fontSize: '12px', fontWeight: '500', color: '#1a1a1a' },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  sectionTitle: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a' },
  seeAll: { fontSize: '12px', color: '#1D9E75', cursor: 'pointer' },
  card: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '4px 12px',
    marginBottom: '16px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
  },
  rowTitle: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a' },
  rowSub: { fontSize: '11px', color: '#aaa', marginTop: '2px' },
  amount: { fontSize: '13px', fontWeight: '500', color: '#085041' },
  assignedBadge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '20px',
    background: '#E6F1FB',
    color: '#0C447C',
    fontWeight: '500',
  },
  unassignedBadge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '20px',
    background: '#F1EFE8',
    color: '#5F5E5A',
    fontWeight: '500',
  },
  empty: {
    padding: '16px 0',
    textAlign: 'center',
    color: '#aaa',
    fontSize: '13px',
  },
}

export default CEODashboard
