import { useState, useEffect } from 'react'
import axios from 'axios'

// أيقونات
const UserPlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
)

const UsersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const ToggleOnIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
        <circle cx="16" cy="12" r="3" fill="currentColor" />
    </svg>
)

const ToggleOffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
        <circle cx="8" cy="12" r="3" />
    </svg>
)

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
)


const AlertIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)

const SuccessIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

function UsersManagement() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        role: 'officer'
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [success])

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [error])

    const getAuthHeader = () => {
        const token = localStorage.getItem('auth_token')
        return { Authorization: `Bearer ${token}` }
    }

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users', { headers: getAuthHeader() })
            setUsers(response.data?.users || [])
        } catch (err) {
            console.error('Fetch users error:', err)
            setError('فشل في جلب بيانات المستخدمين')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const response = await axios.post('/api/users', formData, { headers: getAuthHeader() })
            setUsers(prev => [response.data, ...prev])
            setSuccess(`تم إنشاء حساب "${response.data.full_name}" بنجاح`)
            setFormData({ username: '', password: '', full_name: '', role: 'officer' })
            setShowForm(false)
        } catch (err) {
            setError(err.response?.data?.detail || 'فشل في إنشاء المستخدم')
        } finally {
            setSubmitting(false)
        }
    }

    const handleToggle = async (userId) => {
        try {
            const response = await axios.patch(`/api/users/${userId}/toggle`, {}, { headers: getAuthHeader() })
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, is_active: response.data.is_active } : u
            ))
            setSuccess(response.data.message)
        } catch (err) {
            setError(err.response?.data?.detail || 'فشل في تحديث حالة المستخدم')
        }
    }

    const handleDelete = async (userId, fullName) => {
        if (!confirm(`هل تريد حذف حساب "${fullName}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) return

        try {
            await axios.delete(`/api/users/${userId}`, { headers: getAuthHeader() })
            setUsers(prev => prev.filter(u => u.id !== userId))
            setSuccess(`تم حذف حساب "${fullName}"`)
        } catch (err) {
            setError(err.response?.data?.detail || 'فشل في حذف المستخدم')
        }
    }

    const officers = users.filter(u => u.role === 'officer')
    const admins = users.filter(u => u.role === 'admin')

    return (
        <div className="users-management">
            {/* رسائل التنبيه */}
            {error && (
                <div className="alert error">
                    <AlertIcon />
                    {error}
                </div>
            )}
            {success && (
                <div className="alert success">
                    <SuccessIcon />
                    {success}
                </div>
            )}

            {/* زر إضافة مستخدم */}
            <div className="section-header">
                <h2><UsersIcon /> إدارة المستخدمين</h2>
                <button className="add-user-btn" onClick={() => setShowForm(!showForm)}>
                    <UserPlusIcon />
                    {showForm ? 'إلغاء' : 'إضافة عسكري'}
                </button>
            </div>

            {/* نموذج إضافة مستخدم */}
            {showForm && (
                <div className="form-section">
                    <div className="form-section-header">
                        <h3>إضافة مستخدم جديد</h3>
                    </div>
                    <div className="form-section-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>الاسم الكامل</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="اسم العسكري الكامل"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>اسم المستخدم</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="اسم الدخول (بالإنجليزية)"
                                        required
                                        dir="ltr"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>كلمة المرور</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="كلمة المرور"
                                        required
                                        dir="ltr"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>الصلاحية</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    >
                                        <option value="officer">عسكري (ماسح فقط)</option>
                                        <option value="admin">مدير (صلاحيات كاملة)</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" disabled={submitting} className="submit-btn" style={{ marginTop: '1rem' }}>
                                {submitting ? (
                                    <>
                                        <div className="spinner"></div>
                                        جاري الإنشاء...
                                    </>
                                ) : (
                                    <>
                                        <UserPlusIcon />
                                        إنشاء الحساب
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* قائمة العساكر */}
            <div className="form-section">
                <div className="form-section-header">
                    <h3>العساكر ({officers.length})</h3>
                </div>
                <div className="form-section-body">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto' }}></div>
                        </div>
                    ) : officers.length === 0 ? (
                        <div className="empty-state">
                            <UsersIcon />
                            <h3>لا يوجد عساكر مسجلون</h3>
                            <p>استخدم زر "إضافة عسكري" لإنشاء حسابات جديدة</p>
                        </div>
                    ) : (
                        <div className="users-list">
                            {officers.map(user => (
                                <div key={user.id} className={`user-card ${!user.is_active ? 'disabled' : ''}`}>
                                    <div className="user-avatar">
                                        {user.full_name.charAt(0)}
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">{user.full_name}</div>
                                        <div className="user-username">@{user.username}</div>
                                        <span className={`user-status ${user.is_active ? 'active' : 'inactive'}`}>
                                            {user.is_active ? 'مفعّل' : 'معطّل'}
                                        </span>
                                    </div>
                                    <div className="user-actions">
                                        <button
                                            onClick={() => handleToggle(user.id)}
                                            className={`toggle-btn ${user.is_active ? 'on' : 'off'}`}
                                            title={user.is_active ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                                        >
                                            {user.is_active ? <ToggleOnIcon /> : <ToggleOffIcon />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id, user.full_name)}
                                            className="delete-btn"
                                            title="حذف الحساب"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* قائمة المديرين */}
            {admins.length > 0 && (
                <div className="form-section">
                    <div className="form-section-header">
                        <h3 style={{ color: 'var(--moi-gold)' }}>المديرون ({admins.length})</h3>
                    </div>
                    <div className="form-section-body">
                        <div className="users-list">
                            {admins.map(user => (
                                <div key={user.id} className="user-card admin">
                                    <div className="user-avatar admin">
                                        {user.full_name.charAt(0)}
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">{user.full_name}</div>
                                        <div className="user-username">@{user.username}</div>
                                        <span className="user-role admin">مدير النظام</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UsersManagement
