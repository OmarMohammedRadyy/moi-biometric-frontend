import { useState, useEffect } from 'react'
import axios from 'axios'

// أيقونات
const BellIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
)

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

const UserXIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="18" y1="8" x2="23" y2="13" />
        <line x1="23" y1="8" x2="18" y2="13" />
    </svg>
)

const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
)

function Notifications() {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        fetchNotifications()
    }, [])

    const getAuthHeader = () => {
        const token = localStorage.getItem('auth_token')
        return { Authorization: `Bearer ${token}` }
    }

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const response = await axios.get('/api/notifications', { headers: getAuthHeader() })
            setNotifications(response.data?.notifications || [])
            setTotal(response.data?.total || 0)
            setUnreadCount(response.data?.unread_count || 0)
        } catch (err) {
            console.error('Fetch notifications error:', err)
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id) => {
        try {
            await axios.patch(`/api/notifications/${id}/read`, {}, { headers: getAuthHeader() })
            setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, is_read: true } : n
            ))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (err) {
            console.error('Mark as read error:', err)
        }
    }

    const markAllAsRead = async () => {
        try {
            await axios.patch('/api/notifications/read-all', {}, { headers: getAuthHeader() })
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
            setUnreadCount(0)
        } catch (err) {
            console.error('Mark all as read error:', err)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ar-KW', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'account_disabled':
            case 'account_enabled':
                return <UserXIcon />
            case 'failed_login_disabled':
                return <AlertIcon />
            default:
                return <BellIcon />
        }
    }

    const getNotificationClass = (type) => {
        switch (type) {
            case 'account_disabled':
            case 'failed_login_disabled':
                return 'warning'
            case 'account_enabled':
                return 'success'
            default:
                return 'info'
        }
    }

    return (
        <div className="notifications-page">
            {/* Header */}
            <div className="notifications-header">
                <div className="header-title">
                    <BellIcon />
                    <h2>الإشعارات</h2>
                    {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount}</span>
                    )}
                </div>
                <div className="header-actions">
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="mark-all-btn">
                            <CheckIcon />
                            قراءة الكل
                        </button>
                    )}
                    <button onClick={fetchNotifications} className="refresh-btn">
                        <RefreshIcon />
                        تحديث
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner" style={{ width: 40, height: 40 }}></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="empty-state">
                        <BellIcon />
                        <h3>لا توجد إشعارات</h3>
                        <p>ستظهر هنا الإشعارات الجديدة</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            className={`notification-item ${notification.is_read ? 'read' : 'unread'} ${getNotificationClass(notification.type)}`}
                            onClick={() => !notification.is_read && markAsRead(notification.id)}
                        >
                            <div className="notification-icon">
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="notification-content">
                                <h4>{notification.title}</h4>
                                <p>{notification.message}</p>
                                <span className="notification-time">{formatDate(notification.timestamp)}</span>
                            </div>
                            {!notification.is_read && (
                                <span className="unread-dot"></span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Notifications
