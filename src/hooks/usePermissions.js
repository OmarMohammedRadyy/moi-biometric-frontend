import { useState, useEffect } from 'react'
import axios from 'axios'

export function usePermissions() {
    const [permissions, setPermissions] = useState([])
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)
    const [allPages, setAllPages] = useState(false)

    useEffect(() => {
        fetchPermissions()
    }, [])

    const fetchPermissions = async () => {
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                setLoading(false)
                return
            }

            const response = await axios.get('/api/user/permissions', {
                headers: { Authorization: `Bearer ${token}` }
            })

            setPermissions(response.data.permissions || [])
            setRole(response.data.role)
            setAllPages(response.data.all_pages)
        } catch (err) {
            console.error('Failed to fetch permissions:', err)
        } finally {
            setLoading(false)
        }
    }

    const hasPermission = (pageId) => {
        if (allPages) return true
        return permissions.includes(pageId)
    }

    const isAdmin = () => role === 'admin'

    return {
        permissions,
        role,
        loading,
        allPages,
        hasPermission,
        isAdmin,
        refresh: fetchPermissions
    }
}

export default usePermissions
