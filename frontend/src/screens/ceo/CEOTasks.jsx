import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import api from '../../api/axios'

function CEOTasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDriver, setFilterDriver] = useState('')
  const [users, setUsers] = useState([])
  const [usersMap, setUsersMap] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, usersRes] = await Promise.all([
          api.get('/operations/tasks/'),
          api.get('/users/'),
        ])

        setTasks(tasksRes.data)
        setFiltered(tasksRes.data)
        setUsers(usersRes.data)

        const uMap = {}
        usersRes.data.forEach((u) => {
          uMap[u.id] = u.username
        })
        setUsersMap(uMap)
      } catch (err) {
        console.error('Failed to fetch tasks', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!filterDriver) {
      setFiltered(tasks)
      return
    }
    if (filterDriver === 'unassigned') {
      setFiltered(tasks.filter((t) => !t.assigned_to))
      return
    }
    setFiltered(tasks.filter((t) => t.assigned_to === parseInt(filterDriver)))
  }, [filterDriver, tasks])

  if (loading) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.headerBrand}>Roam & Rove</span>
        <span style={styles.headerTitle}>Task Management</span>
      </div>

      <div style={styles.body}>
        <button
          style={styles.createBtn}
          onClick={() => navigate('/ceo/tasks/create')}
        >
          + Create new task
        </button>

        <select
          style={styles.select}
          value={filterDriver}
          onChange={(e) => setFilterDriver(e.target.value)}
        >
          <option value="">All drivers</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
          <option value="unassigned">Unassigned</option>
        </select>

        <div style={styles.resultsLabel}>{filtered.length} tasks</div>

        {filtered.length === 0 && (
          <div style={styles.empty}>No tasks found</div>
        )}

        {filtered.map((task) => (
          <div
            key={task.id}
            style={styles.card}
            onClick={() => navigate(`/ceo/tasks/${task.id}`)}
          >
            <div style={styles.cardTop}>
              <span style={styles.taskTitle}>{task.title}</span>
              <span style={styles.taskDate}>
                {task.created_at.split('T')[0]}
              </span>
            </div>
            {task.description && (
              <div style={styles.taskDesc}>{task.description}</div>
            )}
            <div style={styles.cardBottom}>
              {task.assigned_to ? (
                <span style={styles.assignedBadge}>
                  {usersMap[task.assigned_to] ?? `User ${task.assigned_to}`}
                </span>
              ) : (
                <span style={styles.unassignedBadge}>Unassigned</span>
              )}
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
  headerTitle: { fontSize: '12px', color: '#9FE1CB' },
  body: { padding: '12px 14px' },
  createBtn: {
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
  select: {
    width: '100%',
    padding: '7px 10px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '12px',
    background: '#ffffff',
    color: '#1a1a1a',
    marginBottom: '10px',
  },
  resultsLabel: { fontSize: '12px', color: '#aaa', marginBottom: '8px' },
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
  taskTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#1a1a1a',
    flex: 1,
    marginRight: '8px',
  },
  taskDate: { fontSize: '11px', color: '#aaa', whiteSpace: 'nowrap' },
  taskDesc: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '8px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  cardBottom: { display: 'flex', justifyContent: 'flex-end' },
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
}

export default CEOTasks
