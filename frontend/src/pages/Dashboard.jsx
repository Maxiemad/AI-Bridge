import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../services/api'

function Dashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    useEffect(() => {
        getDashboard()
            .then(res => setData(res.data))
            .catch(() => setData({ stats: {}, notifications: [] }))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="page-container">
                <div className="skeleton" style={{height:100,marginBottom:'1.5rem',borderRadius:16}} />
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.5rem'}}>
                    {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{height:110,borderRadius:16}} />)}
                </div>
                <div className="skeleton" style={{height:60,borderRadius:16}} />
            </div>
        )
    }

    const stats = data?.stats || {}
    const notifications = data?.notifications || []

    return (
        <div className="page-container">
            <div className="dashboard-welcome">
                <h1>Welcome back, {user.name || 'there'} 👋</h1>
                <p>Here's what's happening with your opportunities</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">{stats.totalApplications || 0}</div>
                    <div className="stat-label">Total Applications</div>
                </div>
                <div className="stat-card stat-pending">
                    <div className="stat-number">{stats.pending || 0}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card stat-submitted">
                    <div className="stat-number">{stats.submitted || 0}</div>
                    <div className="stat-label">Submitted</div>
                </div>
                <div className="stat-card stat-accepted">
                    <div className="stat-number">{stats.accepted || 0}</div>
                    <div className="stat-label">Accepted</div>
                </div>
            </div>

            <div className="dashboard-actions">
                <Link to="/opportunities" className="action-card">
                    <span className="action-icon">🔍</span>
                    <span className="action-text">Browse Opportunities</span>
                </Link>
                <Link to="/applications" className="action-card">
                    <span className="action-icon">📋</span>
                    <span className="action-text">Application Tracker</span>
                </Link>
                <Link to="/profile" className="action-card">
                    <span className="action-icon">👤</span>
                    <span className="action-text">Edit Profile</span>
                </Link>
                <a href="https://github.com/Maxiemad/AI-Bridge" target="_blank" rel="noreferrer" className="action-card">
                    <span className="action-icon">⚡</span>
                    <span className="action-text">View Source</span>
                </a>
            </div>

            {notifications.length > 0 && (
                <div className="notifications-section">
                    <h2>🔔 Notifications</h2>
                    <div className="notification-list">
                        {notifications.slice(0, 6).map((n, i) => (
                            <div key={i} className={`notification-item urgency-${n.urgency}`}>
                                <span>{n.type === 'deadline' ? '⏰' : '📬'}</span>
                                <span>{n.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
