// API Configuration - Build 2026-02-04-v3.1
// Production backend URL
const PRODUCTION_API = 'https://moi-biometric-backend-production.up.railway.app'

// For API calls, use env variable if available, otherwise production
export const API_URL = import.meta.env.VITE_API_URL || PRODUCTION_API

// Helper to get image source - prioritize base64, fallback to URL
export const getImageSrc = (visitor) => {
    if (!visitor) return ''
    // Prefer base64 if available
    if (visitor.photo_base64) {
        return `data:image/jpeg;base64,${visitor.photo_base64}`
    }
    // Fallback to URL path
    if (visitor.photo_path) {
        if (visitor.photo_path.startsWith('http')) return visitor.photo_path
        return `${PRODUCTION_API}/uploads/${visitor.photo_path}`
    }
    return ''
}

// Legacy function for backward compatibility
export const getImageUrl = (path) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    if (path.startsWith('data:')) return path
    return `${PRODUCTION_API}/uploads/${path}`
}

