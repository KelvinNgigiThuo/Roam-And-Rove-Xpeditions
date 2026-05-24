import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function DriverTaskCreate() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await api.post('/operations/tasks/', { title, description })
      navigate('/driver/tasks')
    } catch (err) {
      setError('Failed to create task. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/driver/tasks')}>
          ← Back
        </button>
        <span style={styles.headerTitle}>Create task</span>
        <span style={{ width: '40px' }} />
      </div>

      <div style={styles.body}>
        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Title *</label>
          <input
            style={styles.input}
            placeholder="Enter task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>
            Description <span style={styles.optional}>(optional)</span>
          </label>
          <textarea
            style={styles.textarea}
            placeholder="Add details about this task..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <button
          style={saving ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Creating...' : 'Create task'}
        </button>
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
  },
  textarea: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 12px', border: '1px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', color: '#1a1a1a',
    height: '120px', resize: 'none',
  },
  submitBtn: {
    width: '100%', padding: '13px', background: '#1D9E75',
    color: '#ffffff', border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '500', cursor: 'pointer',
  },
}

export default DriverTaskCreate