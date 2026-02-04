import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ShieldXIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="10" y1="10" x2="14" y2="14" />
        <line x1="14" y1="10" x2="10" y2="14" />
    </svg>
)

function AccessDeniedModal({ message, onClose }) {
    return (
        <div className="access-denied-overlay">
            <div className="access-denied-modal">
                <div className="access-denied-icon">
                    <ShieldXIcon />
                </div>
                <h2>غير مصرح بالدخول</h2>
                <p>{message || 'ليس لديك صلاحية للوصول لهذه الصفحة'}</p>
                <button onClick={onClose}>العودة</button>
            </div>
        </div>
    )
}

function ProtectedRoute({ pageId, children }) {
    const [loading, setLoading] = useState(true)
    const [allowed, setAllowed] = useState(false)
    const [message, setMessage] = useState('')
    const [showDenied, setShowDenied] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        checkPermission()
    }, [pageId])

    const checkPermission = async () => {
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                navigate('/login')
                return
            }

            const response = await axios.get(`/api/permissions/check/${pageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.data.allowed) {
                setAllowed(true)
            } else {
                setMessage(response.data.message)
                setShowDenied(true)
            }
        } catch (err) {
            console.error('Permission check error:', err)
            // If error, allow access and let backend handle it
            setAllowed(true)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setShowDenied(false)
        navigate(-1) // Go back
    }

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '200px' 
            }}>
                <div className="spinner" style={{ width: 40, height: 40 }}></div>
            </div>
        )
    }

    if (showDenied) {
        return <AccessDeniedModal message={message} onClose={handleClose} />
    }

    if (!allowed) {
        return null
    }

    return children
}

export default ProtectedRoute
export { AccessDeniedModal }
