import { useState, useEffect } from 'react'
import axios from 'axios'
import { getImageSrc } from '../config'

// أيقونات
const ScanIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 12h10M12 7v10" />
    </svg>
)

const ShieldCheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
)

const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
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

const PassportIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 20v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
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

function ScanLogs() {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const perPage = 20

    useEffect(() => {
        fetchLogs()
    }, [page])

    const getAuthHeader = () => {
        const token = localStorage.getItem('auth_token')
        return { Authorization: `Bearer ${token}` }
    }

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const url = `/api/logs/scans?page=${page}&per_page=${perPage}&match_only=true`
            const response = await axios.get(url, { headers: getAuthHeader() })
            setLogs(response.data?.logs || [])
            setTotal(response.data?.total || 0)
        } catch (err) {
            console.error('Fetch scan logs error:', err)
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
            minute: '2-digit'
        })
    }

    const totalPages = Math.ceil(total / perPage)

    return (
        <div className="scan-logs">
            {/* Header */}
            <div className="logs-header">
                <h2><ShieldCheckIcon /> نتائج المسح الأمني</h2>
                <div className="logs-controls">
                    <button onClick={fetchLogs} className="refresh-btn">
                        <RefreshIcon />
                        تحديث
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="logs-stats">
                <div className="stat-card success">
                    <span className="stat-value">{total}</span>
                    <span className="stat-label">حالات التطابق المسجلة</span>
                </div>
            </div>

            {/* Scan Cards */}
            <div className="scan-cards-container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto' }}></div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="empty-state">
                        <ScanIcon />
                        <h3>لا يوجد سجلات مسح</h3>
                        <p>لم يتم تسجيل أي عمليات مسح ناجحة بعد</p>
                    </div>
                ) : (
                    <div className="scan-cards-grid">
                        {logs.map(log => (
                            <div key={log.id} className="scan-result-card">
                                {/* Header */}
                                <div className="scan-card-header">
                                    <div className="scan-match-badge">
                                        <ShieldCheckIcon />
                                        تطابق {log.confidence?.toFixed(1)}%
                                    </div>
                                    <div className="scan-time">
                                        <ClockIcon />
                                        {formatTime(log.timestamp)}
                                        <span className="scan-date">{formatDate(log.timestamp)}</span>
                                    </div>
                                </div>

                                {/* Visitor Info */}
                                {log.visitor && (
                                    <div className="scan-visitor-info">
                                        <div className="visitor-photo-container">
                                            <img
                                                src={getImageSrc(log.visitor)}
                                                alt={log.visitor.full_name}
                                                className="visitor-photo-large"
                                            />
                                        </div>
                                        <div className="visitor-details">
                                            <h4>{log.visitor.full_name}</h4>
                                            <div className="visitor-detail-row">
                                                <PassportIcon />
                                                <span>{log.visitor.passport_number}</span>
                                            </div>
                                            <div className="visitor-visa-badge">
                                                {log.visitor.visa_status}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Officer Info */}
                                <div className="scan-officer-info">
                                    <div className="officer-label">
                                        <UserIcon />
                                        العسكري المسؤول
                                    </div>
                                    <div className="officer-name">{log.officer_name}</div>
                                    <div className="officer-username">@{log.officer_username}</div>
                                </div>

                                {/* Location Info */}
                                {log.ip_address && (
                                    <div className="scan-location-info">
                                        <GlobeIcon />
                                        <span>{log.ip_address}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
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

export default ScanLogs
