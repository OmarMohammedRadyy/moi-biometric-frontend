import { useState } from 'react'
import axios from 'axios'

// أيقونة القفل
const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
)

// أيقونة المستخدم
const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password
            })

            // حفظ التوكن
            localStorage.setItem('auth_token', response.data.token)
            localStorage.setItem('auth_user', response.data.username)

            // إبلاغ App بنجاح تسجيل الدخول
            onLoginSuccess(response.data)

        } catch (err) {
            console.error('Login error:', err)
            setError(err.response?.data?.detail || 'فشل تسجيل الدخول')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Header */}
                <div className="login-header">
                    <div className="login-emblem">
                        <img src="/logo.png" alt="شعار الإدارة" />
                    </div>
                    <h1>الإدارة العامة لشئون الاقامة</h1>
                    <p>إدارة الخدمات الالكترونية</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="login-error">
                            <LockIcon />
                            {error}
                        </div>
                    )}

                    <div className="login-field">
                        <label>اسم المستخدم</label>
                        <div className="login-input-wrapper">
                            <UserIcon />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="أدخل اسم المستخدم"
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label>كلمة المرور</label>
                        <div className="login-input-wrapper">
                            <LockIcon />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="أدخل كلمة المرور"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: 20, height: 20 }}></div>
                                جاري الدخول...
                            </>
                        ) : (
                            <>
                                <LockIcon />
                                تسجيل الدخول
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="login-footer">
                    <p>© 2026 الإدارة العامة لشئون الاقامة - دولة الكويت</p>
                    <p>Gen. Dep. of Residency Affairs</p>
                </div>
            </div>
        </div>
    )
}

export default Login
