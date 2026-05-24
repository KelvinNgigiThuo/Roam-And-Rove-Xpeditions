import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function DriverLogExpense() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [expenseType, setExpenseType] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('MPESA')
  const [description, setDescription] = useState('')
  const [task, setTask] = useState('')
  const [expenseTypes, setExpenseTypes] = useState([])
  const [tasks, setTasks] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, tasksRes] = await Promise.all([
          api.get('/operations/expense-types/'),
          api.get('/operations/tasks/'),
        ])
        setExpenseTypes(typesRes.data)
        setTasks(tasksRes.data)
      } catch (err) {
        console.error('Failed to fetch form data', err)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async () => {
    if (!amount || !expenseType) {
      setError('Amount and expense type are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await api.post('/operations/expenses/', {
        amount,
        expense_type: expenseType,
        payment_method: paymentMethod,
        description,
        task: task || null,
      })
      navigate('/driver/expenses')
    } catch (err) {
      setError('Failed to submit expense. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const paymentMethods = ['MPESA', 'CASH', 'CARD']

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/driver/expenses')}>
          ← Back
        </button>
        <span style={styles.headerTitle}>Log expense</span>
        <span style={{ width: '40px' }} />
      </div>

      <div style={styles.body}>
        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Amount (KES) *</label>
          <input
            style={styles.input}
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Expense type *</label>
          <select
            style={styles.input}
            value={expenseType}
            onChange={e => setExpenseType(e.target.value)}
          >
            <option value="">Select type...</option>
            {expenseTypes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Payment method *</label>
          <div style={styles.paymentGrid}>
            {paymentMethods.map(method => (
              <button
                key={method}
                style={{
                  ...styles.payBtn,
                  ...(paymentMethod === method ? styles.payBtnActive : {}),
                }}
                onClick={() => setPaymentMethod(method)}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>
            Linked task <span style={styles.optional}>(optional)</span>
          </label>
          <select
            style={styles.input}
            value={task}
            onChange={e => setTask(e.target.value)}
          >
            <option value="">No task linked</option>
            {tasks.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>
            Description <span style={styles.optional}>(optional)</span>
          </label>
          <textarea
            style={styles.textarea}
            placeholder="Add any notes about this expense..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <button
          style={saving ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Submitting...' : 'Submit expense'}
        </button>

        <div style={styles.hint}>
          You will be taken to your expenses list after submitting
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  header: {
    background: '#1D9E75', padding: '10px 16px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  backBtn: {
    background: 'none', border: 'none',
    color: '#E1F5EE', fontSize: '14px', cursor: 'pointer', padding: '0',
  },
  headerTitle: { fontSize: '15px', fontWeight: '500', color: '#ffffff' },
  body: { padding: '16px' },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', padding: '10px 14px',
    borderRadius: '8px', fontSize: '13px', marginBottom: '16px',
  },
  field: { marginBottom: '18px' },
  label: {
    display: 'block', fontSize: '12px', fontWeight: '600',
    color: '#555', marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  optional: { fontSize: '11px', color: '#aaa', textTransform: 'none', fontWeight: '400' },
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 12px', border: '1px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', color: '#1a1a1a',
    background: '#ffffff',
  },
  paymentGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' },
  payBtn: {
    padding: '9px 4px', border: '1px solid #e0e0e0',
    borderRadius: '8px', fontSize: '13px', textAlign: 'center',
    cursor: 'pointer', background: '#ffffff', color: '#1a1a1a',
  },
  payBtnActive: {
    borderColor: '#1D9E75', background: '#E1F5EE',
    color: '#085041', fontWeight: '500',
  },
  textarea: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 12px', border: '1px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', color: '#1a1a1a',
    height: '90px', resize: 'none', background: '#ffffff',
  },
  submitBtn: {
    width: '100%', padding: '13px', background: '#1D9E75',
    color: '#ffffff', border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '500', cursor: 'pointer',
  },
  hint: { textAlign: 'center', fontSize: '12px', color: '#aaa', marginTop: '12px' },
}

export default DriverLogExpense