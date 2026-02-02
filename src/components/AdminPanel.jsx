import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

// أيقونات SVG
const GridIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
)

const UsersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const ClockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
)

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
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

// شعار الكويت
const KuwaitEmblem = () => (
    <svg viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill="url(#emblem-gradient)" stroke="#c4a44e" strokeWidth="2" />
        <path d="M24 10 L20 20 L24 18 L28 20 L24 10" fill="#c4a44e" />
        <circle cx="24" cy="26" r="8" fill="none" stroke="#c4a44e" strokeWidth="1.5" />
        <path d="M18 34 Q24 38 30 34" stroke="#c4a44e" strokeWidth="1.5" fill="none" />
        <defs>
            <linearGradient id="emblem-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a4d7c" />
                <stop offset="100%" stopColor="#0d3a5c" />
            </linearGradient>
        </defs>
    </svg>
)

// بطاقة الزائر
const VisitorCard = ({ visitor, onDelete }) => {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`هل تريد حذف "${visitor.full_name}"؟`)) return

        setDeleting(true)
        try {
            await axios.delete(`/api/visitors/${visitor.id}`)
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
                src={`/uploads/${visitor.photo_path}`}
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

function AdminPanel() {
    const [visitors, setVisitors] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [activeTab, setActiveTab] = useState('registry')

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

    const fetchVisitors = async () => {
        try {
            const response = await axios.get('/api/visitors')
            setVisitors(response.data.visitors)
        } catch (err) {
            console.error('Fetch error:', err)
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
                headers: { 'Content-Type': 'multipart/form-data' }
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
        <div className="admin-page">
            {/* الشريط الجانبي - للشاشات الكبيرة */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-emblem">
                        <KuwaitEmblem />
                    </div>
                    <div className="sidebar-title">Kuwait MOI</div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <GridIcon />
                        نظرة عامة
                    </button>
                    <button
                        className={`sidebar-link ${activeTab === 'registry' ? 'active' : ''}`}
                        onClick={() => setActiveTab('registry')}
                    >
                        <UsersIcon />
                        السجل البيومتري
                    </button>
                    <button
                        className={`sidebar-link ${activeTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        <ClockIcon />
                        سجلات الدخول
                    </button>
                    <button
                        className={`sidebar-link ${activeTab === 'config' ? 'active' : ''}`}
                        onClick={() => setActiveTab('config')}
                    >
                        <SettingsIcon />
                        إعدادات النظام
                    </button>
                </nav>
            </aside>

            {/* المحتوى الرئيسي */}
            <main className="admin-main">
                <div className="admin-header">
                    <h2>MOI Biometric - إدارة الأمن العالمية</h2>
                    <div className="admin-actions">
                        <button className="admin-btn secondary">إغلاق</button>
                        <button className="admin-btn primary">لوحة التحكم</button>
                    </div>
                </div>

                <div className="admin-content">
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
                                <h3>تسجيل بيومتري جديد</h3>
                            </div>
                            <div className="form-section-body">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem' }}>
                                    <div>
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
                                    </div>

                                    {/* رفع الصورة */}
                                    <div className="photo-upload">
                                        <div
                                            className={`photo-preview ${previewUrl ? 'has-image' : ''}`}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="معاينة" />
                                            ) : (
                                                <div className="photo-preview-text">
                                                    <ImageIcon />
                                                    <p>صورة جواز السفر</p>
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
                                </div>
                            </div>
                        </div>

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
                                    تسجيل الزائر الجديد
                                </>
                            )}
                        </button>
                    </form>

                    {/* قائمة الزوار */}
                    <div className="form-section" style={{ marginTop: '2rem' }}>
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
            </main>
        </div>
    )
}

export default AdminPanel
