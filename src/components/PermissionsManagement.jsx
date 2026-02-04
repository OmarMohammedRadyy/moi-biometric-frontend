import { useState, useEffect } from 'react'
import axios from 'axios'

// أيقونات
const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
)

const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const SaveIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
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

// ترجمة أسماء الصفحات
const PAGE_ICONS = {
    scanner: '🔍',
    visitors: '👥',
    users: '👤',
    auth_logs: '📋',
    scan_logs: '📊',
    notifications: '🔔',
    dashboard: '📈',
    permissions: '🔐'
}

function PermissionsManagement() {
    const [users, setUsers] = useState([])
    const [pages, setPages] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState({})
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [userPermissions, setUserPermissions] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000)
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

    const fetchData = async () => {
        try {
            const [pagesRes, usersRes] = await Promise.all([
                axios.get('/api/permissions/pages', { headers: getAuthHeader() }),
                axios.get('/api/permissions/users', { headers: getAuthHeader() })
            ])
            
            setPages(pagesRes.data.pages || [])
            setUsers(usersRes.data.users || [])
            
            // Initialize permissions state
            const permsState = {}
            usersRes.data.users.forEach(user => {
                permsState[user.id] = user.permissions || []
            })
            setUserPermissions(permsState)
        } catch (err) {
            console.error('Fetch error:', err)
            setError('فشل في جلب البيانات')
        } finally {
            setLoading(false)
        }
    }

    const togglePermission = (userId, pageId) => {
        setUserPermissions(prev => {
            const current = prev[userId] || []
            if (current.includes(pageId)) {
                return { ...prev, [userId]: current.filter(p => p !== pageId) }
            } else {
                return { ...prev, [userId]: [...current, pageId] }
            }
        })
    }

    const savePermissions = async (userId) => {
        setSaving(prev => ({ ...prev, [userId]: true }))
        
        try {
            const response = await axios.put(
                `/api/permissions/users/${userId}`,
                { permissions: userPermissions[userId] || [] },
                { headers: getAuthHeader() }
            )
            
            setSuccess(response.data.message)
            
            // Update local state
            setUsers(prev => prev.map(u => 
                u.id === userId 
                    ? { ...u, permissions: userPermissions[userId] }
                    : u
            ))
        } catch (err) {
            setError(err.response?.data?.detail || 'فشل في حفظ الصلاحيات')
        } finally {
            setSaving(prev => ({ ...prev, [userId]: false }))
        }
    }

    const selectAllPages = (userId) => {
        setUserPermissions(prev => ({
            ...prev,
            [userId]: pages.map(p => p.id)
        }))
    }

    const clearAllPages = (userId) => {
        setUserPermissions(prev => ({
            ...prev,
            [userId]: []
        }))
    }

    if (loading) {
        return (
            <div className="permissions-management">
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner" style={{ width: 50, height: 50, margin: '0 auto' }}></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>جاري التحميل...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="permissions-management">
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

            {/* العنوان */}
            <div className="section-header">
                <h2><ShieldIcon /> إدارة الصلاحيات</h2>
                <p className="section-desc">تحديد صلاحيات الوصول للصفحات لكل عسكري</p>
            </div>

            {users.length === 0 ? (
                <div className="empty-state">
                    <UserIcon />
                    <h3>لا يوجد عساكر</h3>
                    <p>قم بإضافة عساكر من صفحة إدارة المستخدمين أولاً</p>
                </div>
            ) : (
                <div className="permissions-grid">
                    {users.map(user => (
                        <div key={user.id} className={`permission-card ${!user.is_active ? 'disabled' : ''}`}>
                            <div className="permission-card-header">
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {user.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="user-name">{user.full_name}</div>
                                        <div className="user-username">@{user.username}</div>
                                    </div>
                                </div>
                                {!user.is_active && (
                                    <span className="status-badge inactive">معطّل</span>
                                )}
                            </div>

                            <div className="permission-card-body">
                                <div className="pages-header">
                                    <span>الصفحات المسموحة:</span>
                                    <div className="quick-actions">
                                        <button 
                                            className="quick-btn"
                                            onClick={() => selectAllPages(user.id)}
                                        >
                                            تحديد الكل
                                        </button>
                                        <button 
                                            className="quick-btn"
                                            onClick={() => clearAllPages(user.id)}
                                        >
                                            إلغاء الكل
                                        </button>
                                    </div>
                                </div>

                                <div className="pages-list">
                                    {pages.map(page => {
                                        const isChecked = (userPermissions[user.id] || []).includes(page.id)
                                        return (
                                            <label 
                                                key={page.id} 
                                                className={`page-item ${isChecked ? 'checked' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => togglePermission(user.id, page.id)}
                                                />
                                                <span className="page-icon">{PAGE_ICONS[page.id] || '📄'}</span>
                                                <span className="page-name">{page.name}</span>
                                                {isChecked && (
                                                    <span className="check-mark"><CheckIcon /></span>
                                                )}
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="permission-card-footer">
                                <button
                                    className="save-btn"
                                    onClick={() => savePermissions(user.id)}
                                    disabled={saving[user.id]}
                                >
                                    {saving[user.id] ? (
                                        <>
                                            <div className="spinner small"></div>
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        <>
                                            <SaveIcon />
                                            حفظ الصلاحيات
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PermissionsManagement
