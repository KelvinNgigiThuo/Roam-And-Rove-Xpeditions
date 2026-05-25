import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function CEOExpenseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usersMap, setUsersMap] = useState({})
  const [expenseTypesMap, setExpenseTypesMap] = useState({})
  const [tasksMap, setTasksMap] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenseRes, usersRes, typesRes, tasksRes] = await Promise.all([
          api.get(`/operations/expenses/${id}/`),
          api.get('/users/'),
          api.get('/operations/expense-types/'),
          api.get('/operations/tasks/'),
        ])

        setExpense(expenseRes.data)

        const uMap = {}
        usersRes.data.forEach((u) => {
          uMap[u.id] = u.username
        })
        setUsersMap(uMap)

        const tMap = {}
        typesRes.data.forEach((t) => {
          tMap[t.id] = t.name
        })
        setExpenseTypesMap(tMap)

        const tasksM = {}
        tasksRes.data.forEach((t) => {
          tasksM[t.id] = t.title
        })
        setTasksMap(tasksM)
      } catch (err) {
        console.error('Failed to fetch expense', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const paymentColor = (method) => {
    if (method === 'MPESA') return { background: '#E1F5EE', color: '#085041' }
    if (method === 'CARD') return { background: '#E6F1FB', color: '#0C447C' }
    return { background: '#F1EFE8', color: '#5F5E5A' }
  }

  if (loading) return <div style={styles.loading}>Loading...</div>
  if (!expense) return <div style={styles.loading}>Expense not found</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          style={styles.backBtn}
          onClick={() => navigate('/ceo/expenses')}
        >
          ← Back
        </button>
        <span style={styles.headerTitle}>Expense detail</span>
        <span style={{ width: '60px' }} />
      </div>

      <div style={styles.body}>
        <div style={styles.amountHero}>
          <div style={styles.amountValue}>
            KES {parseFloat(expense.amount).toLocaleString()}
          </div>
          <div style={styles.amountDate}>
            {new Date(expense.created_at).toLocaleDateString('en-KE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}{' '}
            ·{' '}
            {new Date(expense.created_at).toLocaleTimeString('en-KE', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        <div style={styles.detailCard}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Expense type</span>
            <span style={styles.detailValue}>
              {expenseTypesMap[expense.expense_type] ?? 'No type'}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Payment method</span>
            <span
              style={{
                ...styles.badge,
                ...paymentColor(expense.payment_method),
              }}
            >
              {expense.payment_method}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Submitted by</span>
            <span style={styles.detailValue}>
              {usersMap[expense.created_by] ?? `User ${expense.created_by}`}
            </span>
          </div>
          {expense.task && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Linked task</span>
              <span style={styles.taskChip}>
                {tasksMap[expense.task] ?? `Task ${expense.task}`}
              </span>
            </div>
          )}
          {expense.description && (
            <div style={styles.descriptionBlock}>
              <div style={styles.detailLabel}>Description</div>
              <div style={styles.descriptionText}>{expense.description}</div>
            </div>
          )}
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate('/ceo/expenses')}
        >
          Back to all expenses
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  loading: { padding: '40px', textAlign: 'center', color: '#888' },
  header: {
    background: '#1D9E75',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#E1F5EE',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '0',
  },
  headerTitle: { fontSize: '15px', fontWeight: '500', color: '#ffffff' },
  body: { padding: '16px' },
  amountHero: {
    textAlign: 'center',
    padding: '24px 0 20px',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '16px',
  },
  amountValue: { fontSize: '32px', fontWeight: '500', color: '#085041' },
  amountDate: { fontSize: '12px', color: '#aaa', marginTop: '4px' },
  detailCard: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '4px 14px',
    marginBottom: '16px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '11px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  detailLabel: { fontSize: '12px', color: '#888' },
  detailValue: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a' },
  badge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '20px',
    fontWeight: '500',
  },
  taskChip: {
    fontSize: '12px',
    padding: '3px 10px',
    borderRadius: '20px',
    background: '#E6F1FB',
    color: '#0C447C',
    fontWeight: '500',
  },
  descriptionBlock: { padding: '11px 0' },
  descriptionText: {
    fontSize: '13px',
    color: '#1a1a1a',
    marginTop: '6px',
    lineHeight: '1.6',
  },
  backButton: {
    width: '100%',
    padding: '12px',
    background: '#ffffff',
    color: '#1D9E75',
    border: '1px solid #1D9E75',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
}

export default CEOExpenseDetail
