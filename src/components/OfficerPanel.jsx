import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import AuthLogs from './AuthLogs'
import ScanLogs from './ScanLogs'
import Notifications from './Notifications'
import { AccessDeniedModal } from './ProtectedRoute'

// أيقونات الصفحات
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

// شعار الإدارة
const DeptLogo = () => (
    <svg viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45" stroke="var(--moi-gold)" strokeWidth="2" fill="var(--moi-navy-deep)" />
        <circle cx="50" cy="50" r="35" stroke="var(--moi-gold)" strokeWidth="1" fill="none" />
        <path d="M50 20 L55 40 L75 40 L60 52 L65 72 L50 60 L35 72 L40 52 L25 40 L45 40 Z" fill="var(--moi-gold)" />
    </svg>
)

// تعريف الصفحات المتاحة
const PAGE_CONFIG = {
    dashboard: { path: '/officer', label: 'الرئيسية', icon: <DashboardIcon /> },
    visitors: { path: '/officer/visitors', label: 'الزوار', icon: <VisitorsIcon /> },
    auth_logs: { path: '/officer/auth-logs', label: 'المراقبة', icon: <LogIcon /> },
    scan_logs: { path: '/officer/scan-logs', label: 'المسح', icon: <ScanLogIcon /> },
    notifications: { path: '/officer/notifications', label: 'الإشعارات', icon: <BellIcon /> },
}

// مكون حماية الصفحات
function ProtectedPage({ pageId, permissions, children }) {
    const [showDenied, setShowDenied] = useState(false)
    
    useEffect(() => {
        if (!permissions.includes(pageId)) {
            setShowDenied(true)
        }
    }, [pageId, permissions])
    
    if (showDenied) {
        return (
            <AccessDeniedModal 
                message="غير مصرح لك بالدخول لهذه الصفحة بناءً على الصلاحيات المحددة من قبل المدير"
                onClose={() => window.history.back()}
            />
        )
    }
    
    if (!permissions.includes(pageId)) {
        return null
    }
    
    return children
}

// مكون إدارة الزوار للعسكري (مبسط)
function OfficerVisitors() {
    return (
        <div style={{ padding: '1rem' }}>
            <h2>إدارة الزوار</h2>
            <p style={{ color: 'var(--text-muted)' }}>يمكنك عرض بيانات الزوار من هنا</p>
            {/* يمكن إضافة جدول الزوار هنا */}
        </div>
    )
}

function OfficerPanel({ permissions = [] }) {
    const location = useLocation()
    const currentPath = location.pathname
    
    // Get first allowed page for redirect
    const getFirstAllowedPage = () => {
        const pageOrder = ['dashboard', 'visitors', 'auth_logs', 'scan_logs', 'notifications']
        for (const page of pageOrder) {
            if (permissions.includes(page) && PAGE_CONFIG[page]) {
                return PAGE_CONFIG[page].path
            }
        }
        return '/officer'
    }
    
    // Filter tabs based on permissions
    const allowedTabs = Object.entries(PAGE_CONFIG)
        .filter(([key]) => permissions.includes(key))
        .map(([key, config]) => ({ ...config, key }))
    
    const isActive = (path) => {
        if (path === '/officer') {
            return currentPath === '/officer'
        }
        return currentPath.startsWith(path)
    }
    
    return (
        <div className="admin-page">
            {/* الشريط الجانبي */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-emblem">
                        <DeptLogo />
                    </div>
                    <div className="sidebar-title">لوحة التحكم</div>
                </div>
                
                <nav className="sidebar-nav">
                    {allowedTabs.map(tab => (
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
            
            {/* المحتوى الرئيسي */}
            <main className="admin-main">
                <div className="admin-content">
                    <Routes>
                        <Route path="/" element={
                            permissions.includes('dashboard') ? (
                                <ProtectedPage pageId="dashboard" permissions={permissions}>
                                    <Dashboard />
                                </ProtectedPage>
                            ) : (
                                <Navigate to={getFirstAllowedPage()} replace />
                            )
                        } />
                        <Route path="/visitors" element={
                            <ProtectedPage pageId="visitors" permissions={permissions}>
                                <OfficerVisitors />
                            </ProtectedPage>
                        } />
                        <Route path="/auth-logs" element={
                            <ProtectedPage pageId="auth_logs" permissions={permissions}>
                                <AuthLogs />
                            </ProtectedPage>
                        } />
                        <Route path="/scan-logs" element={
                            <ProtectedPage pageId="scan_logs" permissions={permissions}>
                                <ScanLogs />
                            </ProtectedPage>
                        } />
                        <Route path="/notifications" element={
                            <ProtectedPage pageId="notifications" permissions={permissions}>
                                <Notifications />
                            </ProtectedPage>
                        } />
                        {/* أي صفحة غير مسموحة */}
                        <Route path="*" element={
                            <AccessDeniedModal 
                                message="غير مصرح لك بالدخول لهذه الصفحة"
                                onClose={() => window.history.back()}
                            />
                        } />
                    </Routes>
                </div>
            </main>
        </div>
    )
}

export default OfficerPanel
