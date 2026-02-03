import { useState, useEffect } from 'react'
import axios from 'axios'

// أيقونات
const LogIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
)

const LoginIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
)

const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
)

const ClockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
)

const DeviceIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
)

const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
)

const ChevronLeftIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15 18 9 12 15 6" />
    </svg>
)

const ChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

function AuthLogs() {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [filter, setFilter] = useState('all') // all, login, logout
    const perPage = 30

    useEffect(() => {
        fetchLogs()
    }, [page, filter])

    const getAuthHeader = () => {
        const token = localStorage.getItem('auth_token')
        return { Authorization: `Bearer ${token}` }
    }

    const fetchLogs = async () => {
        setLoading(true)
        try {
            let url = `/api/logs/auth?page=${page}&per_page=${perPage}`
            if (filter !== 'all') {
                url += `&action=${filter}`
            }
            const response = await axios.get(url, { headers: getAuthHeader() })
            setLogs(response.data?.logs || [])
            setTotal(response.data?.total || 0)
        } catch (err) {
            console.error('Fetch logs error:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ar-KW', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('ar-KW', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    const getDeviceInfo = (userAgent) => {
        if (!userAgent) return 'غير معروف'
        if (userAgent.includes('iPhone')) return 'iPhone'
        if (userAgent.includes('Android')) return 'Android'
        if (userAgent.includes('Windows')) return 'Windows'
        if (userAgent.includes('Mac')) return 'Mac'
        return 'متصفح ويب'
    }

    const totalPages = Math.ceil(total / perPage)

    return (
        <div className="auth-logs">
            {/* Header */}
            <div className="logs-header">
                <h2><LogIcon /> سجل المراقبة</h2>
                <div className="logs-controls">
                    <select
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                        className="filter-select"
                    >
                        <option value="all">جميع العمليات</option>
                        <option value="login">تسجيل الدخول فقط</option>
                        <option value="logout">تسجيل الخروج فقط</option>
                    </select>
                    <button onClick={fetchLogs} className="refresh-btn">
                        <RefreshIcon />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="logs-stats">
                <div className="stat-card">
                    <span className="stat-value">{total}</span>
                    <span className="stat-label">إجمالي السجلات</span>
                </div>
            </div>

            {/* Logs Table */}
            <div className="logs-table-container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto' }}></div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="empty-state">
                        <LogIcon />
                        <h3>لا يوجد سجلات</h3>
                        <p>لم يتم تسجيل أي عمليات دخول أو خروج بعد</p>
                    </div>
                ) : (
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>العملية</th>
                                <th>المستخدم</th>
                                <th>التاريخ</th>
                                <th>الوقت</th>
                                <th>العنوان IP</th>
                                <th>الجهاز</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>
                                        <span className={`action-badge ${log.action}`}>
                                            {log.action === 'login' ? (
                                                <><LoginIcon /> دخول</>
                                            ) : (
                                                <><LogoutIcon /> خروج</>
                                            )}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="user-cell">
                                            <span className="user-fullname">{log.full_name}</span>
                                            <span className="user-username">@{log.username}</span>
                                        </div>
                                    </td>
                                    <td>{formatDate(log.timestamp)}</td>
                                    <td>
                                        <span className="time-cell">
                                            <ClockIcon />
                                            {formatTime(log.timestamp)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="ip-cell">
                                            <GlobeIcon />
                                            {log.ip_address || '-'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="device-cell">
                                            <DeviceIcon />
                                            {getDeviceInfo(log.user_agent)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="page-btn"
                    >
                        <ChevronRightIcon />
                    </button>
                    <span className="page-info">
                        صفحة {page} من {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="page-btn"
                    >
                        <ChevronLeftIcon />
                    </button>
                </div>
            )}
        </div>
    )
}

export default AuthLogs
