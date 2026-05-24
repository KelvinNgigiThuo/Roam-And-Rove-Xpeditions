import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function DriverExpenseDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [expense, setExpense] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [amount, setAmount] = useState('')
    const [expenseType, setExpenseType] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('MPESA')
    const [description, setDescription] = useState('')
    const [task, setTask] = useState('')
    const [expenseTypes, setExpenseTypes] = useState([])
    const [tasks, setTasks] = useState([])
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expenseRes, typesRes, tasksRes] = await Promise.all([
                    api.get(`/operations/expenses/${id}/`),
                    api.get('/operations/expense-types/'),
                    api.get('/operations/tasks/'),
                ])
                setExpense(expenseRes.data)
                setAmount(expenseRes.data.amount)
                setExpenseType(expenseRes.data.expense_type ?? '')
                setPaymentMethod(expenseRes.data.payment_method)
                setDescription(expenseRes.data.description)
                setTask(expenseRes.data.task ?? '')
                setExpenseTypes(typesRes.data)
                setTasks(tasksRes.data)
            } catch (err) {
                console.error('Failed to fetch expense', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleSave = async () => {
        if (!amount || !expenseType) {
            setError('Amount and expense type are required.')
            return
        }
        setSaving(true)
        setError('')
        try {
            await api.patch(`/operations/expenses/${id}/`, {
                amount,
                expense_type: expenseType,
                payment_method: paymentMethod,
                description,
                task: task || null,
            })
            navigate('/driver/expenses')
        } catch (err) {
            setError('Failed to save changes. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return
        setDeleting(true)
        try {
            await api.delete(`/operations/expenses/${id}/`)
            navigate('/driver/expenses')
        } catch (err) {
            setError('Failed to delete expense. Please try again.')
        } finally {
            setDeleting(false)
        }
    }

    const paymentColor = (method) => {
        if (method === 'MPESA') return { background: '#E1F5EE', color: '#085041' }
        if (method === 'CARD') return { background: '#E6F1FB', color: '#0C447C' }
        return { background: '#F1EFE8', color: '#5F5E5A' }
    }

    const paymentMethods = ['MPESA', 'CASH', 'CARD']

    if (loading) return <div style={styles.loading}>Loading...</div>
    if (!expense) return <div style={styles.loading}>Expense not found</div>

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate('/driver/expenses')}>
                    ← Back
                </button>
                <span style={styles.headerTitle}>Expense detail</span>
                {!editing
                    ? <button style={styles.editHeaderBtn} onClick={() => setEditing(true)}>Edit</button>
                    : <button style={styles.editHeaderBtn} onClick={() => setEditing(false)}>Cancel</button>
                }
            </div>

            <div style={styles.body}>
                {error && <div style={styles.errorBox}>{error}</div>}

                {!editing ? (
                    <>
                        <div style={styles.amountHero}>
                            <div style={styles.amountValue}>
                                KES {parseFloat(expense.amount).toLocaleString()}
                            </div>
                            <div style={styles.amountDate}>
                                {new Date(expense.created_at).toLocaleDateString('en-KE', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })} · {new Date(expense.created_at).toLocaleTimeString('en-KE', {
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </div>
                        </div>

                        <div style={styles.detailCard}>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Expense type</span>
                                <span style={styles.detailValue}>{expense.expense_type ?? 'No type'}</span>
                            </div>
                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>Payment method</span>
                                <span style={{ ...styles.badge, ...paymentColor(expense.payment_method) }}>
                                    {expense.payment_method}
                                </span>
                            </div>
                            {expense.task && (
                                <div style={styles.detailRow}>
                                    <span style={styles.detailLabel}>Linked task</span>
                                    <span style={styles.taskChip}>Task {expense.task}</span>
                                </div>
                            )}
                            {expense.description && (
                                <div style={styles.descBlock}>
                                    <div style={styles.detailLabel}>Description</div>
                                    <div style={styles.descText}>{expense.description}</div>
                                </div>
                            )}
                        </div>

                        <div style={styles.actions}>
                            <button style={styles.editBtn} onClick={() => setEditing(true)}>
                                Edit expense
                            </button>
                            <button
                                style={styles.deleteBtn}
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete expense'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={styles.field}>
                            <label style={styles.label}>Amount (KES) *</label>
                            <input
                                style={styles.input}
                                type="number"
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
                            <label style={styles.label}>Payment method</label>
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
    amountHero: {
        textAlign: 'center', padding: '24px 0 20px',
        borderBottom: '1px solid #e0e0e0', marginBottom: '16px',
    },
    amountValue: { fontSize: '32px', fontWeight: '500', color: '#085041' },
    amountDate: { fontSize: '12px', color: '#aaa', marginTop: '4px' },
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
    badge: { fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '500' },
    taskChip: {
        fontSize: '12px', padding: '3px 10px', borderRadius: '20px',
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
        borderRadius: '8px', fontSize: '14px', color: '#1a1a1a', background: '#ffffff',
    },
    paymentGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' },
    payBtn: {
        padding: '9px 4px', border: '1px solid #e0e0e0',
        borderRadius: '8px', fontSize: '13px',
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
    saveBtn: {
        width: '100%', padding: '13px', background: '#E8A020',
        color: '#0a0a0a', border: 'none', borderRadius: '8px',
        fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    },
}

export default DriverExpenseDetail