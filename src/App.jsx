import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Scanner from './components/Scanner'
import AdminPanel from './components/AdminPanel'
import Login from './components/Login'

// أيقونات التنقل
const ScannerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

const AdminIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

function App() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token')

    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(`/api/auth/verify?token=${token}`)
      if (response.data.valid) {
        setIsAuthenticated(true)
        setUser({
          user_id: response.data.user_id,
          username: response.data.username,
          full_name: response.data.full_name,
          role: response.data.role
        })
      }
    } catch (err) {
      // Token invalid, clear it
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true)
    setUser({
      user_id: data.user_id,
      username: data.username,
      full_name: data.full_name,
      role: data.role
    })
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('auth_token')

    try {
      const formData = new FormData()
      formData.append('token', token)
      await axios.post('/api/auth/logout', formData)
    } catch (err) {
      console.error('Logout error:', err)
    }

    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setIsAuthenticated(false)
    setUser(null)
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  // Check if user is admin
  const isAdmin = user?.role === 'admin'

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="login-page">
        <div className="spinner" style={{ width: 50, height: 50 }}></div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // Officer view - Scanner only (no header navigation)
  if (!isAdmin) {
    return (
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="header-brand">
              <div className="header-emblem">
                <img src="/logo.png" alt="شعار الإدارة" />
              </div>
              <div className="header-title">
                <h1>الإدارة العامة لشئون الإقامة</h1>
                <span>{user?.full_name}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogoutIcon />
              خروج
            </button>
          </div>
        </header>
        <main className="main-content">
          <Scanner />
        </main>
      </div>
    )
  }

  // Admin view - Full navigation
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="header-emblem">
              <img src="/logo.png" alt="شعار الإدارة" />
            </div>
            <div className="header-title">
              <h1>الإدارة العامة لشئون الإقامة</h1>
              <span>إدارة الخدمات الالكترونية</span>
            </div>
          </div>

          {/* Desktop Navigation - Admin Only */}
          <nav className="desktop-nav">
            <Link
              to="/"
              className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
            >
              <ScannerIcon />
              الماسح
            </Link>
            <Link
              to="/admin"
              className={`nav-btn ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
            >
              <AdminIcon />
              لوحة التحكم
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <LogoutIcon />
              خروج
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="header-menu" onClick={toggleMobileMenu}>
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <div className="header-brand">
            <div className="header-emblem" style={{ width: 70, height: 70, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="شعار الإدارة" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.6)' }} />
            </div>
            <div className="header-title">
              <h1 style={{ fontSize: '0.85rem' }}>الإدارة العامة لشئون الإقامة</h1>
              <span style={{ fontSize: '0.7rem' }}>{user?.full_name} ({user?.role === 'admin' ? 'مدير' : 'عسكري'})</span>
            </div>
          </div>
          <button className="mobile-nav-close" onClick={closeMobileMenu}>
            <CloseIcon />
          </button>
        </div>
        <nav className="mobile-nav-links">
          <Link
            to="/"
            className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <ScannerIcon />
            الماسح الأمني
          </Link>
          <Link
            to="/admin"
            className={`mobile-nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <AdminIcon />
            لوحة التحكم
          </Link>
          <button
            className="mobile-nav-link"
            onClick={() => { closeMobileMenu(); handleLogout(); }}
            style={{ color: '#ff3d3d', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '1rem', paddingTop: '1rem' }}
          >
            <LogoutIcon />
            تسجيل الخروج
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Scanner />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
