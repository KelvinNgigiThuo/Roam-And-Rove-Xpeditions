import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

function DriverTaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/operations/tasks/${id}/`)
        setTask(res.data)
        setTitle(res.data.title)
        setDescription(res.data.description)
      } catch (err) {
        console.error('Failed to fetch task', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTask()
  }, [id])

  const isOwner = task?.created_by === user?.id

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await api.patch(`/operations/tasks/${id}/`, { title, description })
      navigate('/driver/tasks')
    } catch (err) {
      setError('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    setDeleting(true)
    try {
      await api.delete(`/operations/tasks/${id}/`)
      navigate('/driver/tasks')
    } catch (err) {
      setError('Failed to delete task. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div style={styles.loading}>Loading...</div>
  if (!task) return <div style={styles.loading}>Task not found</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/driver/tasks')}>
          ← Back
        </button>
        <span style={styles.headerTitle}>Task detail</span>
        {isOwner && !editing && (
          <button style={styles.editHeaderBtn} onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
        {editing && (
          <button style={styles.editHeaderBtn} onClick={() => setEditing(false)}>
            Cancel
          </button>
        )}
        {!isOwner && <span style={{ width: '40px' }} />}
      </div>

      <div style={styles.body}>
        {error && <div style={styles.errorBox}>{error}</div>}

        {!editing ? (
          <>
            <div style={styles.titleHero}>
              <div style={styles.taskTitle}>{task.title}</div>
              <div style={styles.taskDate}>Created {task.created_at.split('T')[0]}</div>
            </div>

            <div style={styles.detailCard}>
              {task.assigned_to && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Assigned to</span>
                  <span style={styles.assignedBadge}>Driver {task.assigned_to}</span>
                </div>
              )}
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Created by</span>
                <span style={styles.detailValue}>
                  {isOwner ? 'You' : `User ${task.created_by}`}
                </span>
              </div>
              {task.description && (
                <div style={styles.descBlock}>
                  <div style={styles.detailLabel}>Description</div>
                  <div style={styles.descText}>{task.description}</div>
                </div>
              )}
            </div>

            {isOwner && (
              <div style={styles.actions}>
                <button style={styles.editBtn} onClick={() => setEditing(true)}>
                  Edit task
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete task'}
                </button>
              </div>
            )}

            {!isOwner && (
              <div style={styles.viewOnlyNote}>
                You can only edit tasks you created
              </div>
            )}
          </>
        ) : (
          <>
            <div style={styles.field}>
              <label style={styles.label}>Title *</label>
              <input
                style={styles.input}
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <button
              style={saving ? { ...styles.saveBtn, opacity: 0.7 } : styles.saveBtn}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </>
        )}
        <div style={{ height: '20px' }} />
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
  editHeaderBtn: {
    background: 'none', border: 'none',
    color: '#E1F5EE', fontSize: '14px', cursor: 'pointer', padding: '0',
  },
  body: { padding: '16px' },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', padding: '10px 14px',
    borderRadius: '8px', fontSize: '13px', marginBottom: '16px',
  },
  titleHero: {
    paddingBottom: '14px', borderBottom: '1px solid #e0e0e0', marginBottom: '16px',
  },
  taskTitle: { fontSize: '18px', fontWeight: '500', color: '#1a1a1a', marginBottom: '4px' },
  taskDate: { fontSize: '12px', color: '#aaa' },
  detailCard: {
    background: '#ffffff', borderRadius: '8px',
    padding: '4px 14px', marginBottom: '16px',
  },
  detailRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '11px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  detailLabel: { fontSize: '12px', color: '#888' },
  detailValue: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a' },
  assignedBadge: {
    fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
    background: '#E6F1FB', color: '#0C447C', fontWeight: '500',
  },
  descBlock: { padding: '11px 0' },
  descText: { fontSize: '13px', color: '#1a1a1a', marginTop: '6px', lineHeight: '1.6' },
  actions: { display: 'flex', flexDirection: 'column', gap: '8px' },
  editBtn: {
    width: '100%', padding: '11px', background: '#1D9E75',
    color: '#ffffff', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '500', cursor: 'pointer',
  },
  deleteBtn: {
    width: '100%', padding: '11px', background: '#ffffff',
    color: '#dc2626', border: '1px solid #fecaca',
    borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
  },
  viewOnlyNote: {
    textAlign: 'center', fontSize: '12px', color: '#aaa', marginTop: '16px',
  },
  field: { marginBottom: '18px' },
  label: {
    display: 'block', fontSize: '12px', fontWeight: '600',
    color: '#555', marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 12px', border: '1px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', color: '#1a1a1a',
  },
  textarea: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 12px', border: '1px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', color: '#1a1a1a',
    height: '100px', resize: 'none',
  },
  saveBtn: {
    width: '100%', padding: '13px', background: '#E8A020',
    color: '#0a0a0a', border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
  },
}

export default DriverTaskDetail