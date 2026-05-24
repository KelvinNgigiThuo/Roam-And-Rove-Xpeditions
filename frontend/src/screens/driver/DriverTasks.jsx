import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'
import api from '../../api/axios'

function DriverTasks() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/operations/tasks/')
        setTasks(res.data)
      } catch (err) {
        console.error('Failed to fetch tasks', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  if (loading) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.headerBrand}>Roam & Rove</span>
        <span style={styles.headerTitle}>My Tasks</span>
      </div>

      <div style={styles.body}>
        <button
          style={styles.createBtn}
          onClick={() => navigate('/driver/tasks/create')}
        >
          + Create new task
        </button>

        <div style={styles.resultsLabel}>{tasks.length} tasks</div>

        {tasks.length === 0 && (
          <div style={styles.empty}>No tasks yet</div>
        )}

        {tasks.map(task => (
          <div
            key={task.id}
            style={styles.card}
            onClick={() => navigate(`/driver/tasks/${task.id}`)}
          >
            <div style={styles.cardTop}>
              <span style={styles.taskTitle}>{task.title}</span>
              <span style={styles.taskDate}>{task.created_at.split('T')[0]}</span>
            </div>
            {task.description && (
              <div style={styles.taskDesc}>{task.description}</div>
            )}
            <div style={styles.cardBottom}>
              {task.created_by === user?.id && (
                <span style={styles.ownBadge}>My task</span>
              )}
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
    background: '#1D9E75', padding: '10px 16px 8px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  headerBrand: { fontSize: '13px', color: '#E1F5EE' },
  headerTitle: { fontSize: '12px', color: '#9FE1CB' },
  body: { padding: '12px 14px' },
  createBtn: {
    width: '100%', padding: '11px', background: '#1D9E75',
    color: '#ffffff', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginBottom: '12px',
  },
  resultsLabel: { fontSize: '12px', color: '#aaa', marginBottom: '8px' },
  empty: { textAlign: 'center', padding: '32px', color: '#aaa', fontSize: '13px' },
  card: {
    background: '#ffffff', borderRadius: '8px',
    padding: '11px 13px', marginBottom: '7px',
    cursor: 'pointer', border: '1px solid #f0f0f0',
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '4px',
  },
  taskTitle: { fontSize: '13px', fontWeight: '500', color: '#1a1a1a', flex: 1, marginRight: '8px' },
  taskDate: { fontSize: '11px', color: '#aaa', whiteSpace: 'nowrap' },
  taskDesc: {
    fontSize: '12px', color: '#888', marginBottom: '6px',
    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
  },
  cardBottom: { display: 'flex', justifyContent: 'flex-end' },
  ownBadge: {
    fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
    background: '#E1F5EE', color: '#085041', fontWeight: '500',
  },
}

export default DriverTasks