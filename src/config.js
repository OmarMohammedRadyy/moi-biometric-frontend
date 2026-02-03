// API Configuration
// Production backend URL - always use this for images
const PRODUCTION_API = 'https://moi-biometric-backend-production.up.railway.app'

// For API calls, use env variable if available, otherwise production
export const API_URL = import.meta.env.VITE_API_URL || PRODUCTION_API

// For images, always use production URL directly to avoid CORS/proxy issues
export const getImageUrl = (path) => {
    if (!path) return ''
    // If path already starts with http, return as is
    if (path.startsWith('http')) return path
    // Always use production API for images
    return `${PRODUCTION_API}/uploads/${path}`
}

