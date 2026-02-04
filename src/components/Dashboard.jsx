import { useState, useEffect } from 'react'
import axios from 'axios'

// أيقونات
const UsersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const ScanIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
)

const VisitorsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const TrendUpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
)

const ChartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)

const StarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
)

function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(null)

    useEffect(() => {
        fetchStats()
        // Auto refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    const getAuthHeader = () => {
        const token = localStorage.getItem('auth_token')
        return { Authorization: `Bearer ${token}` }
    }

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/dashboard/stats', { headers: getAuthHeader() })
            setStats(response.data)
            setLastUpdate(new Date())
        } catch (err) {
            console.error('Fetch stats error:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatTime = (date) => {
        if (!date) return ''
        return date.toLocaleTimeString('ar-KW', { hour: '2-digit', minute: '2-digit' })
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner" style={{ width: 50, height: 50 }}></div>
                <p>جاري تحميل الإحصائيات...</p>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="dashboard-error">
                <p>فشل في تحميل الإحصائيات</p>
                <button onClick={fetchStats} className="refresh-btn">
                    <RefreshIcon /> إعادة المحاولة
                </button>
            </div>
        )
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <ChartIcon />
                    <h2>لوحة المعلومات</h2>
                </div>
                <div className="dashboard-actions">
                    <span className="last-update">آخر تحديث: {formatTime(lastUpdate)}</span>
                    <button onClick={fetchStats} className="refresh-btn small">
                        <RefreshIcon />
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon"><VisitorsIcon /></div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.total_visitors}</span>
                        <span className="stat-label">إجمالي الزوار</span>
                    </div>
                </div>

                <div className="stat-card info">
                    <div className="stat-icon"><UsersIcon /></div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.total_officers}</span>
                        <span className="stat-label">العساكر</span>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon"><ScanIcon /></div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.total_scans_today}</span>
                        <span className="stat-label">مسح اليوم</span>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon"><TrendUpIcon /></div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.match_rate_today}%</span>
                        <span className="stat-label">نسبة التطابق</span>
                    </div>
                </div>
            </div>

            {/* Detailed Stats */}
            <div className="dashboard-sections">
                {/* Weekly Stats */}
                <div className="dashboard-section">
                    <h3>إحصائيات الأسبوع</h3>
                    <div className="detail-stats">
                        <div className="detail-stat">
                            <span className="detail-label">إجمالي المسح</span>
                            <span className="detail-value">{stats.total_scans_week}</span>
                        </div>
                        <div className="detail-stat">
                            <span className="detail-label">حالات التطابق</span>
                            <span className="detail-value success">{stats.total_matches_week}</span>
                        </div>
                        <div className="detail-stat">
                            <span className="detail-label">نسبة التطابق</span>
                            <span className="detail-value">{stats.match_rate_week}%</span>
                        </div>
                    </div>
                </div>

                {/* Monthly Stats */}
                <div className="dashboard-section">
                    <h3>إحصائيات الشهر</h3>
                    <div className="detail-stats">
                        <div className="detail-stat">
                            <span className="detail-label">إجمالي المسح</span>
                            <span className="detail-value">{stats.total_scans_month}</span>
                        </div>
                        <div className="detail-stat">
                            <span className="detail-label">حالات التطابق</span>
                            <span className="detail-value success">{stats.total_matches_month}</span>
                        </div>
                    </div>
                </div>

                {/* Top Officers */}
                {stats.top_officers && stats.top_officers.length > 0 && (
                    <div className="dashboard-section">
                        <h3><StarIcon /> أكثر العساكر نشاطاً</h3>
                        <div className="top-officers-list">
                            {stats.top_officers.map((officer, index) => (
                                <div key={officer.id} className="top-officer-item">
                                    <span className="rank">#{index + 1}</span>
                                    <div className="officer-info">
                                        <span className="officer-name">{officer.full_name}</span>
                                        <span className="officer-username">@{officer.username}</span>
                                    </div>
                                    <span className="scan-count">{officer.scan_count} مسح</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* System Status */}
            <div className="system-status">
                <span className={`status-indicator ${stats.system_status === 'operational' ? 'online' : 'offline'}`}></span>
                <span>حالة النظام: {stats.system_status === 'operational' ? 'يعمل بشكل طبيعي' : 'يوجد مشكلة'}</span>
            </div>
        </div>
    )
}

export default Dashboard
