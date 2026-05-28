import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import api from '../../api/axios'

function DriverExpenses() {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [expenseTypesMap, setExpenseTypesMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, typesRes] = await Promise.all([
          api.get('/operations/expenses/'),
          api.get('/operations/expense-types/'),
        ])
        setExpenses(expensesRes.data)

        const tMap = {}
        typesRes.data.forEach((t) => {
          tMap[t.id] = t.name
        })
        setExpenseTypesMap(tMap)
      } catch (err) {
        console.error('Failed to fetch expenses', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)

  const paymentColor = (method) => {
    if (method === 'MPESA') return { background: '#E1F5EE', color: '#085041' }
    if (method === 'CARD') return { background: '#E6F1FB', color: '#0C447C' }
    return { background: '#F1EFE8', color: '#5F5E5A' }
  }

  if (loading) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.headerBrand}>Roam & Rove</span>
        <span style={styles.headerTitle}>My Expenses</span>
      </div>

      <div style={styles.body}>
        <div style={styles.summaryBar}>
          <div>
            <div style={styles.summaryLabel}>Total this month</div>
            <div style={styles.summaryAmount}>KES {total.toLocaleString()}</div>
          </div>
          <div style={styles.summaryCount}>{expenses.length} expenses</div>
        </div>

        <button
          style={styles.logBtn}
          onClick={() => navigate('/driver/expenses/log')}
        >
          + Log new expense
        </button>

        {expenses.length === 0 && (
          <div style={styles.empty}>
            No expenses yet. Tap above to log your first one.
          </div>
        )}

        {expenses.map((expense) => (
          <div
            key={expense.id}
            style={styles.card}
            onClick={() => navigate(`/driver/expenses/${expense.id}`)}
          >
            <div style={styles.cardTop}>
              <span style={styles.expenseType}>
                {expenseTypesMap[expense.expense_type] ?? 'No type'}
              </span>
              <span style={styles.expenseAmount}>
                KES {parseFloat(expense.amount).toLocaleString()}
              </span>
            </div>
            {expense.description && (
              <div style={styles.expenseDesc}>{expense.description}</div>
            )}
            <div style={styles.cardBottom}>
              <span style={styles.expenseDate}>
                {expense.created_at.split('T')[0]}
              </span>
              <span
                style={{
                  ...styles.badge,
                  ...paymentColor(expense.payment_method),
                }}
              >
                {expense.payment_method}
              </span>
            </div>
          </div>
        ))}

        <div style={{ height: '80px' }} />
      </div>

      <BottomNav role="DRIVER" />
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  loading: { padding: '40px', textAlign: 'center', color: '#888' },
  header: {
    background: '#1D9E75',
    padding: '10px 16px 8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBrand: { fontSize: '13px', color: '#E1F5EE' },
  headerTitle: { fontSize: '12px', color: '#9FE1CB' },
  body: { padding: '12px 14px' },
  summaryBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
    borderRadius: '8px',
    padding: '10px 12px',
    marginBottom: '12px',
  },
  summaryLabel: { fontSize: '12px', color: '#888' },
  summaryAmount: { fontSize: '18px', fontWeight: '500', color: '#1a1a1a' },
  summaryCount: { fontSize: '12px', color: '#aaa' },
  logBtn: {
    width: '100%',
    padding: '11px',
    background: '#1D9E75',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  empty: {
    textAlign: 'center',
    padding: '32px',
    color: '#aaa',
    fontSize: '13px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '11px 13px',
    marginBottom: '7px',
    cursor: 'pointer',
    border: '1px solid #f0f0f0',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '4px',
  },
  expenseType: { fontSize: '14px', fontWeight: '500', color: '#1a1a1a' },
  expenseAmount: { fontSize: '15px', fontWeight: '500', color: '#085041' },
  expenseDesc: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '6px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  cardBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseDate: { fontSize: '11px', color: '#aaa' },
  badge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '20px',
    fontWeight: '500',
  },
}

export default DriverExpenses
