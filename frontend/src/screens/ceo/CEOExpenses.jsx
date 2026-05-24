import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import api from '../../api/axios'

function CEOExpenses() {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDriver, setFilterDriver] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [expenseTypes, setExpenseTypes] = useState([])
  const [drivers, setDrivers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, typesRes] = await Promise.all([
          api.get('/operations/expenses/'),
          api.get('/operations/expense-types/'),
        ])
        setExpenses(expensesRes.data)
        setFiltered(expensesRes.data)
        setExpenseTypes(typesRes.data)
        const uniqueDrivers = [...new Set(expensesRes.data.map(e => e.created_by))]
        setDrivers(uniqueDrivers)
      } catch (err) {
        console.error('Failed to fetch expenses', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    let result = expenses
    if (filterDriver) result = result.filter(e => e.created_by === parseInt(filterDriver))
    if (filterType) result = result.filter(e => e.expense_type === parseInt(filterType))
    if (filterFrom) result = result.filter(e => e.created_at.split('T')[0] >= filterFrom)
    if (filterTo) result = result.filter(e => e.created_at.split('T')[0] <= filterTo)
    setFiltered(result)
  }, [filterDriver, filterType, filterFrom, filterTo, expenses])

  const total = filtered.reduce((sum, e) => sum + parseFloat(e.amount), 0)

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
        <span style={styles.headerUser}>All Expenses</span>
      </div>

      <div style={styles.body}>
        <div style={styles.summaryBar}>
          <div>
            <div style={styles.summaryLabel}>Total (filtered)</div>
            <div style={styles.summaryAmount}>KES {total.toLocaleString()}</div>
          </div>
          <div style={styles.summaryCount}>{filtered.length} expenses</div>
        </div>

        <button
          style={styles.logBtn}
          onClick={() => navigate('/ceo/expenses/log')}
        >
          + Log expense
        </button>

        <div style={styles.filters}>
          <div style={styles.filterRow}>
            <select
              style={styles.select}
              value={filterDriver}
              onChange={e => setFilterDriver(e.target.value)}
            >
              <option value="">All drivers</option>
              {drivers.map(d => (
                <option key={d} value={d}>Driver {d}</option>
              ))}
            </select>
            <select
              style={styles.select}
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="">All types</option>
              {expenseTypes.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div style={styles.filterRow}>
            <input
              style={styles.dateInput}
              type="date"
              value={filterFrom}
              onChange={e => setFilterFrom(e.target.value)}
            />
            <input
              style={styles.dateInput}
              type="date"
              value={filterTo}
              onChange={e => setFilterTo(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.resultsLabel}>{filtered.length} results</div>

        {filtered.length === 0 && (
          <div style={styles.empty}>No expenses match your filters</div>
        )}

        {filtered.map(expense => (
          <div
            key={expense.id}
            style={styles.card}
            onClick={() => navigate(`/ceo/expenses/${expense.id}`)}
          >
            <div style={styles.cardTop}>
              <div>
                <div style={styles.expenseType}>
                  {expense.expense_type ?? 'No type'}
                </div>
                <div style={styles.expenseDriver}>
                  Driver {expense.created_by} · {expense.created_at.split('T')[0]}
                </div>
              </div>
              <div style={styles.expenseAmount}>
                KES {parseFloat(expense.amount).toLocaleString()}
              </div>
            </div>
            <div style={styles.cardBottom}>
              <span style={{ ...styles.badge, ...paymentColor(expense.payment_method) }}>
                {expense.payment_method}
              </span>
            </div>
          </div>
        ))}

        <div style={{ height: '80px' }} />
      </div>

      <BottomNav role="CEO" />
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
  headerUser: { fontSize: '12px', color: '#9FE1CB' },
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
      width: '100%', padding: '11px', background: '#1D9E75',
      color: '#ffffff', border: 'none', borderRadius: '8px',
      fontSize: '14px', fontWeight: '500', cursor: 'pointer',
      marginBottom: '12px',
    },
  filters: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' },
  filterRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' },
  select: {
    width: '100%',
    padding: '7px 10px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '12px',
    background: '#ffffff',
    color: '#1a1a1a',
  },
  dateInput: {
    width: '100%',
    padding: '7px 10px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '12px',
    background: '#ffffff',
    color: '#888',
    boxSizing: 'border-box',
  },
  resultsLabel: { fontSize: '12px', color: '#aaa', marginBottom: '8px' },
  empty: { textAlign: 'center', padding: '32px', color: '#aaa', fontSize: '13px' },
  card: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '11px 13px',
    marginBottom: '7px',
    cursor: 'pointer',
    border: '1px solid #f0f0f0',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' },
  expenseType: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a' },
  expenseDriver: { fontSize: '11px', color: '#aaa', marginTop: '2px' },
  expenseAmount: { fontSize: '15px', fontWeight: '500', color: '#085041' },
  cardBottom: { display: 'flex', justifyContent: 'flex-end' },
  badge: { fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '500' },
}

export default CEOExpenses