// API Configuration
// Production backend URL as fallback
const PRODUCTION_API = 'https://moi-biometric-backend-production.up.railway.app'
export const API_URL = import.meta.env.VITE_API_URL || PRODUCTION_API

// Helper function to get full image URL
export const getImageUrl = (path) => {
    if (!path) return ''
    // If path already starts with http, return as is
    if (path.startsWith('http')) return path
    // Otherwise prepend API URL
    return `${API_URL}/uploads/${path}`
}

