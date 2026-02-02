import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Scanner from './components/Scanner'
import AdminPanel from './components/AdminPanel'

// شعار الكويت
const KuwaitEmblem = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" fill="url(#emblem-bg)" stroke="#c4a44e" strokeWidth="2" />
    <path d="M24 10 L20 20 L24 18 L28 20 L24 10" fill="#c4a44e" />
    <circle cx="24" cy="26" r="8" fill="none" stroke="#c4a44e" strokeWidth="1.5" />
    <path d="M18 34 Q24 38 30 34" stroke="#c4a44e" strokeWidth="1.5" fill="none" />
    <defs>
      <linearGradient id="emblem-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a4d7c" />
        <stop offset="100%" stopColor="#0d3a5c" />
      </linearGradient>
    </defs>
  </svg>
)

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

function App() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          {/* Brand */}
          <div className="header-brand">
            <div className="header-emblem">
              <KuwaitEmblem />
            </div>
            <div className="header-title">
              <h1>MOI Biometric Scanner</h1>
              <span>Official Scanner</span>
            </div>
          </div>

          {/* Desktop Navigation */}
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
              className={`nav-btn ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <AdminIcon />
              لوحة التحكم
            </Link>
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
            <div className="header-emblem" style={{ width: 40, height: 40 }}>
              <KuwaitEmblem />
            </div>
            <div className="header-title">
              <h1 style={{ fontSize: '1rem' }}>MOI Biometric</h1>
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
            className={`mobile-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <AdminIcon />
            لوحة التحكم
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Scanner />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
