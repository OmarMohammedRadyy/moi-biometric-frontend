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

// أيقونات رسمية للصفحات
const PageIcons = {
    scanner: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    ),
    visitors: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    users: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    auth_logs: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    ),
    scan_logs: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    ),
    notifications: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    ),
    dashboard: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    permissions: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <rect x="9" y="9" width="6" height="5" rx="1" />
            <path d="M10 9V7a2 2 0 0 1 4 0v2" />
        </svg>
    )
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
                                        const IconComponent = PageIcons[page.id]
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
                                                <span className="page-icon">
                                                    {IconComponent && <IconComponent />}
                                                </span>
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
