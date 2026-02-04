import { useState, useEffect, useRef, useContext } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getImageSrc } from '../config'
import { PermissionsContext } from '../App'
import Dashboard from './Dashboard'
import UsersManagement from './UsersManagement'
import AuthLogs from './AuthLogs'
import ScanLogs from './ScanLogs'
import Notifications from './Notifications'
import PermissionsManagement from './PermissionsManagement'

// مكون رسالة عدم الصلاحية
const AccessDenied = () => {
    const navigate = useNavigate()
    
    return (
        <div className="access-denied-container">
            <div className="access-denied-content">
                <div className="access-denied-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <line x1="10" y1="10" x2="14" y2="14" />
                        <line x1="14" y1="10" x2="10" y2="14" />
                    </svg>
                </div>
                <h2>غير مصرح بالدخول</h2>
                <p>ليس لديك صلاحية للوصول لهذه الصفحة بناءً على الصلاحيات المحددة من قبل المدير</p>
                <button onClick={() => navigate(-1)} className="back-btn">
                    العودة
                </button>
            </div>
        </div>
    )
}

// مكون حماية الصفحة
const ProtectedPage = ({ pageId, children }) => {
    const { hasPermission } = useContext(PermissionsContext)
    
    if (!hasPermission(pageId)) {
        return <AccessDenied />
    }
    
    return children
}

// أيقونات SVG
const UsersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const VisitorsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const LogIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
)

const ScanLogIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
)

const DashboardIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
)

const BellIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
)

const ShieldLockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <rect x="9" y="9" width="6" height="5" rx="1" />
        <path d="M10 9V7a2 2 0 0 1 4 0v2" />
    </svg>
)

const UserPlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
)

const ImageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
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

// شعار الإدارة
const DeptLogo = () => (
    <img src="/logo.png" alt="شعار الإدارة" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
)

// بطاقة الزائر
const VisitorCard = ({ visitor, onDelete }) => {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`هل تريد حذف "${visitor.full_name}"؟`)) return

        setDeleting(true)
        try {
            const token = localStorage.getItem('auth_token')
            await axios.delete(`/api/visitors/${visitor.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            onDelete(visitor.id)
        } catch (err) {
            console.error('Delete error:', err)
            alert('فشل في حذف الزائر')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="visitor-card">
            <img
                src={getImageSrc(visitor)}
                alt={visitor.full_name}
                className="visitor-photo"
            />
            <div className="visitor-info">
                <div className="visitor-name">{visitor.full_name}</div>
                <div className="visitor-passport">{visitor.passport_number}</div>
                <span className="visitor-visa">{visitor.visa_status}</span>
            </div>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="visitor-delete"
            >
                {deleting ? <div className="spinner" style={{ width: '18px', height: '18px' }}></div> : <TrashIcon />}
            </button>
        </div>
    )
}

// صفحة إدارة الزوار
function VisitorsManagement() {
    const [visitors, setVisitors] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        passport_number: '',
        visa_status: 'سارية'
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchVisitors()
    }, [])

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [success])

    const getAuthHeader = () => {
        const token = localStorage.getItem('auth_token')
        return { Authorization: `Bearer ${token}` }
    }

    const fetchVisitors = async () => {
        try {
            const response = await axios.get('/api/visitors', { headers: getAuthHeader() })
            setVisitors(response.data?.visitors || [])
        } catch (err) {
            console.error('Fetch error:', err)
            setVisitors([])
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const clearForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            passport_number: '',
            visa_status: 'سارية'
        })
        setSelectedFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedFile) {
            setError('يرجى اختيار صورة')
            return
        }

        setSubmitting(true)
        setError(null)
        setSuccess(null)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('full_name', `${formData.first_name} ${formData.last_name}`)
            formDataToSend.append('passport_number', formData.passport_number)
            formDataToSend.append('visa_status', formData.visa_status)
            formDataToSend.append('photo', selectedFile)

            const response = await axios.post('/api/visitors', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...getAuthHeader()
                }
            })

            setVisitors(prev => [response.data, ...prev])
            setSuccess(`تم تسجيل "${response.data.full_name}" بنجاح`)
            clearForm()
        } catch (err) {
            console.error('Submit error:', err)
            setError(err.response?.data?.detail || 'فشل في تسجيل الزائر')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = (id) => {
        setVisitors(prev => prev.filter(v => v.id !== id))
    }

    return (
        <div className="visitors-management">
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

            {/* نموذج التسجيل */}
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <div className="form-section-header">
                        <h3>تسجيل زائر جديد</h3>
                    </div>
                    <div className="form-section-body">
                        {/* رفع الصورة - أولاً على الجوال */}
                        <div className="photo-upload-mobile">
                            <div
                                className={`photo-preview ${previewUrl ? 'has-image' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="معاينة" />
                                ) : (
                                    <div className="photo-preview-text">
                                        <ImageIcon />
                                        <p>صورة الزائر</p>
                                        <span>اضغط للرفع</span>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* الحقول */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label>الاسم الأول</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="الاسم الأول"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>اسم العائلة</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="اسم العائلة"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>رقم الجواز</label>
                                <input
                                    type="text"
                                    name="passport_number"
                                    value={formData.passport_number}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="رقم جواز السفر"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>حالة التأشيرة</label>
                                <select
                                    name="visa_status"
                                    value={formData.visa_status}
                                    onChange={handleInputChange}
                                    className="form-input"
                                >
                                    <option value="سارية">سارية - صالحة</option>
                                    <option value="سياحية">سياحية</option>
                                    <option value="عمل">عمل</option>
                                    <option value="استثمار">استثمار تجاري</option>
                                    <option value="إقامة">إقامة</option>
                                </select>
                            </div>
                        </div>

                        {/* زر الإرسال */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="submit-btn"
                        >
                            {submitting ? (
                                <>
                                    <div className="spinner"></div>
                                    جاري التسجيل...
                                </>
                            ) : (
                                <>
                                    <UserPlusIcon />
                                    تسجيل الزائر
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* قائمة الزوار */}
            <div className="form-section">
                <div className="form-section-header">
                    <h3>الزوار المسجلون ({visitors.length})</h3>
                </div>
                <div className="form-section-body">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
                        </div>
                    ) : visitors.length === 0 ? (
                        <div className="empty-state">
                            <UsersIcon />
                            <h3>لا يوجد زوار مسجلون</h3>
                            <p>استخدم النموذج أعلاه لإضافة زائر جديد</p>
                        </div>
                    ) : (
                        <div className="visitors-grid">
                            {visitors.map(visitor => (
                                <VisitorCard
                                    key={visitor.id}
                                    visitor={visitor}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// لوحة التحكم الرئيسية
function AdminPanel() {
    const location = useLocation()
    const currentPath = location.pathname
    const { hasPermission, isAdmin } = useContext(PermissionsContext)

    // جميع التبويبات مع معرّف الصلاحية
    const allTabs = [
        { path: '/admin', label: 'الرئيسية', icon: <DashboardIcon />, permId: 'dashboard' },
        { path: '/admin/visitors', label: 'الزوار', icon: <VisitorsIcon />, permId: 'visitors' },
        { path: '/admin/users', label: 'المستخدمين', icon: <UsersIcon />, permId: 'users' },
        { path: '/admin/permissions', label: 'الصلاحيات', icon: <ShieldLockIcon />, permId: 'permissions' },
        { path: '/admin/auth-logs', label: 'المراقبة', icon: <LogIcon />, permId: 'auth_logs' },
        { path: '/admin/scan-logs', label: 'المسح', icon: <ScanLogIcon />, permId: 'scan_logs' },
        { path: '/admin/notifications', label: 'الإشعارات', icon: <BellIcon />, permId: 'notifications' },
    ]
    
    // فلترة التبويبات حسب الصلاحيات
    const tabs = allTabs.filter(tab => hasPermission(tab.permId))

    const isActive = (path) => {
        if (path === '/admin') {
            return currentPath === '/admin'
        }
        return currentPath.startsWith(path)
    }

    return (
        <div className="admin-page">
            {/* الشريط الجانبي - للشاشات الكبيرة */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-emblem">
                        <DeptLogo />
                    </div>
                    <div className="sidebar-title">لوحة التحكم</div>
                </div>

                <nav className="sidebar-nav">
                    {tabs.map(tab => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`sidebar-link ${isActive(tab.path) ? 'active' : ''}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* شريط التنقل السفلي - للجوال */}
            <div className="admin-tabs-mobile">
                {tabs.map(tab => (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        className={`admin-tab ${isActive(tab.path) ? 'active' : ''}`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </Link>
                ))}
            </div>

            {/* المحتوى الرئيسي */}
            <main className="admin-main">
                <div className="admin-content">
                    <Routes>
                        <Route path="/" element={
                            <ProtectedPage pageId="dashboard">
                                <Dashboard />
                            </ProtectedPage>
                        } />
                        <Route path="/visitors" element={
                            <ProtectedPage pageId="visitors">
                                <VisitorsManagement />
                            </ProtectedPage>
                        } />
                        <Route path="/users" element={
                            <ProtectedPage pageId="users">
                                <UsersManagement />
                            </ProtectedPage>
                        } />
                        <Route path="/permissions" element={
                            <ProtectedPage pageId="permissions">
                                <PermissionsManagement />
                            </ProtectedPage>
                        } />
                        <Route path="/auth-logs" element={
                            <ProtectedPage pageId="auth_logs">
                                <AuthLogs />
                            </ProtectedPage>
                        } />
                        <Route path="/scan-logs" element={
                            <ProtectedPage pageId="scan_logs">
                                <ScanLogs />
                            </ProtectedPage>
                        } />
                        <Route path="/notifications" element={
                            <ProtectedPage pageId="notifications">
                                <Notifications />
                            </ProtectedPage>
                        } />
                    </Routes>
                </div>
            </main>
        </div>
    )
}

export default AdminPanel
