import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

export function register(data) {
    return api.post('/auth/register', data)
}

export function login(email, password) {
    return api.post('/auth/login', { email, password })
}

export function getProfile() {
    return api.get('/auth/profile')
}

export function updateProfile(data) {
    return api.put('/auth/profile', data)
}

export function getOpportunities(params = {}) {
    return api.get('/opportunities', { params })
}

export function getOpportunityById(id) {
    return api.get(`/opportunities/${id}`)
}

export function applyToOpportunity(opportunityId, generateType = 'all') {
    return api.post('/applications', { opportunityId, generateType })
}

export function getMyApplications() {
    return api.get('/applications')
}

export function getDashboard() {
    return api.get('/applications/dashboard')
}

export function updateApplicationStatus(id, status) {
    return api.patch(`/applications/${id}/status`, { status })
}

export function regenerateContent(id, contentType) {
    return api.post(`/applications/${id}/regenerate`, { contentType })
}

export default api
