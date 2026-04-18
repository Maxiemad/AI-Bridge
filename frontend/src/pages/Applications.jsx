import { useState, useEffect } from 'react'
import { getMyApplications, updateApplicationStatus } from '../services/api'

function Applications() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(null)

    useEffect(() => {
        getMyApplications()
            .then(res => setApplications(res.data.data || []))
            .catch(() => setApplications([]))
            .finally(() => setLoading(false))
    }, [])

    async function handleStatusChange(appId, newStatus) {
        try {
            await updateApplicationStatus(appId, newStatus)
            setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a))
        } catch {
            alert('Failed to update status')
        }
    }

    function typeColor(type) {
        const c = { hackathon:'#7c3aed', internship:'#3b82f6', grant:'#059669',
            fellowship:'#d97706', competition:'#dc2626', job:'#0891b2', collaboration:'#6366f1' }
        return c[type] || '#6b7280'
    }

    if (loading) {
        return <div className="page-container">{[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-card" style={{height:120}} />)}</div>
    }

    const columns = {
        pending: applications.filter(a => a.status === 'pending'),
        submitted: applications.filter(a => a.status === 'submitted'),
        accepted: applications.filter(a => a.status === 'accepted'),
        rejected: applications.filter(a => a.status === 'rejected')
    }

    function renderCard(app) {
        const isExpanded = expanded === app._id
        return (
            <div key={app._id} className={isExpanded ? 'kanban-card-expanded' : 'kanban-card'}
                 onClick={() => setExpanded(isExpanded ? null : app._id)}>
                <span className="kc-type" style={{backgroundColor: typeColor(app.opportunityId?.type)}}>{app.opportunityId?.type}</span>
                <h4>{app.opportunityId?.title || 'Untitled'}</h4>
                <p className="kc-org">{app.opportunityId?.organization}</p>
                <p className="kc-date">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>

                {isExpanded && (
                    <div className="kc-expanded-content" onClick={e => e.stopPropagation()}>
                        {app.coverLetter && (
                            <>
                                <h5>Cover Letter</h5>
                                <pre>{app.coverLetter}</pre>
                            </>
                        )}
                        {app.emailDraft && (
                            <>
                                <h5>Email Draft</h5>
                                <pre>{app.emailDraft}</pre>
                            </>
                        )}
                        <div className="status-actions">
                            {['pending','submitted','accepted','rejected'].map(s => (
                                <button key={s} className={`status-btn ${app.status === s ? 'current' : ''}`}
                                    onClick={() => handleStatusChange(app._id, s)} disabled={app.status === s}>{s}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Application Tracker</h1>
                <p>{applications.length} application{applications.length !== 1 ? 's' : ''} tracked</p>
            </div>

            {applications.length === 0 ? (
                <div className="empty-state">
                    <p style={{fontSize:'2rem',marginBottom:'.5rem'}}>📋</p>
                    <p>No applications yet</p>
                    <p className="hint">Browse opportunities and click Apply to get started</p>
                </div>
            ) : (
                <div className="kanban-board">
                    <div className="kanban-col col-pending">
                        <div className="kanban-col-header">
                            <h3>⏳ Pending</h3>
                            <span className="count">{columns.pending.length}</span>
                        </div>
                        {columns.pending.map(renderCard)}
                    </div>
                    <div className="kanban-col col-submitted">
                        <div className="kanban-col-header">
                            <h3>📤 Submitted</h3>
                            <span className="count">{columns.submitted.length}</span>
                        </div>
                        {columns.submitted.map(renderCard)}
                    </div>
                    <div className="kanban-col col-accepted">
                        <div className="kanban-col-header">
                            <h3>✅ Accepted</h3>
                            <span className="count">{columns.accepted.length}</span>
                        </div>
                        {columns.accepted.map(renderCard)}
                    </div>
                    <div className="kanban-col col-rejected">
                        <div className="kanban-col-header">
                            <h3>❌ Rejected</h3>
                            <span className="count">{columns.rejected.length}</span>
                        </div>
                        {columns.rejected.map(renderCard)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Applications
