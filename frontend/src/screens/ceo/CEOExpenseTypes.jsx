import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function CEOExpenseTypes() {
  const navigate = useNavigate()
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [newType, setNewType] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTypes()
  }, [])

  const fetchTypes = async () => {
    try {
      const res = await api.get('/operations/expense-types/')
      setTypes(res.data)
    } catch (err) {
      console.error('Failed to fetch expense types', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newType.trim()) {
      setError('Please enter a type name.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await api.post('/operations/expense-types/', { name: newType.trim() })
      setNewType('')
      fetchTypes()
    } catch (err) {
      setError('Failed to create type. It may already exist.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/operations/expense-types/${id}/`)
      fetchTypes()
    } catch (err) {
      setError('Failed to delete type.')
    }
  }

  if (loading) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/ceo/dashboard')}>
          ← Back
        </button>
        <span style={styles.headerTitle}>Expense Types</span>
        <span style={{ width: '40px' }} />
      </div>

      <div style={styles.body}>
        <div style={styles.infoBox}>
          Expense types are available to all drivers when logging expenses.
          Only you can create or delete them.
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.createSection}>
          <label style={styles.label}>Add new type</label>
          <div style={styles.createRow}>
            <input
              style={styles.input}
              placeholder="e.g. Fuel, Parking, Meals..."
              value={newType}
              onChange={e => setNewType(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
            <button
              style={saving ? { ...styles.addBtn, opacity: 0.7 } : styles.addBtn}
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? '...' : 'Add'}
            </button>
          </div>
        </div>

        <div style={styles.sectionTitle}>
          Current types ({types.length})
        </div>

        {types.length === 0 && (
          <div style={styles.empty}>
            No expense types yet. Add your first one above.
          </div>
        )}

        {types.map(type => (
          <div key={type.id} style={styles.typeRow}>
            <span style={styles.typeName}>{type.name}</span>
            <button
              style={styles.deleteBtn}
              onClick={() => handleDelete(type.id, type.name)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  loading: { padding: '40px', textAlign: 'center', color: '#888' },
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
  infoBox: {
    background: '#E1F5EE', borderRadius: '8px',
    padding: '10px 14px', fontSize: '12px',
    color: '#085041', marginBottom: '16px', lineHeight: '1.5',
  },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', padding: '10px 14px',
    borderRadius: '8px', fontSize: '13px', marginBottom: '16px',
  },
  createSection: {
    background: '#ffffff', borderRadius: '8px',
    padding: '14px', marginBottom: '16px',
  },
  label: {
    display: 'block', fontSize: '12px', fontWeight: '600',
    color: '#555', marginBottom: '8px',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  createRow: { display: 'flex', gap: '8px' },
  input: {
    flex: 1, padding: '10px 12px',
    border: '1px solid #e0e0e0', borderRadius: '8px',
    fontSize: '14px', color: '#1a1a1a', background: '#ffffff',
  },
  addBtn: {
    padding: '10px 18px', background: '#1D9E75',
    color: '#ffffff', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '500', cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  sectionTitle: {
    fontSize: '13px', fontWeight: '500',
    color: '#1a1a1a', marginBottom: '8px',
  },
  empty: {
    textAlign: 'center', padding: '24px',
    color: '#aaa', fontSize: '13px',
  },
  typeRow: {
    background: '#ffffff', borderRadius: '8px',
    padding: '12px 14px', marginBottom: '7px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    border: '1px solid #f0f0f0',
  },
  typeName: { fontSize: '14px', color: '#1a1a1a', fontWeight: '500' },
  deleteBtn: {
    background: 'none', border: '1px solid #fecaca',
    color: '#dc2626', borderRadius: '6px',
    padding: '4px 12px', fontSize: '12px', cursor: 'pointer',
  },
}

export default CEOExpenseTypes