import { useState, useEffect } from 'react'
import { getOpportunities } from '../services/api'
import OpportunityCard from '../components/OpportunityCard'
import ApplyModal from '../components/ApplyModal'

function Opportunities() {
    const [opportunities, setOpportunities] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [modalOpp, setModalOpp] = useState(null)
    const [appliedIds, setAppliedIds] = useState(new Set())
    const [feedback, setFeedback] = useState(null)

    useEffect(() => { fetchOpportunities() }, [filter])

    function fetchOpportunities() {
        setLoading(true)
        const params = filter ? { type: filter } : {}
        getOpportunities(params)
            .then(res => setOpportunities(res.data.data || []))
            .catch(() => setOpportunities([]))
            .finally(() => setLoading(false))
    }

    function handleApplyClick(opp) {
        setModalOpp(opp)
    }

    function handleApplied(oppId) {
        setAppliedIds(prev => new Set([...prev, oppId]))
        setFeedback({ type: 'success', message: 'Application submitted! Check your Applications page.' })
        setTimeout(() => setFeedback(null), 4000)
    }

    const types = ['hackathon', 'internship', 'grant', 'fellowship', 'competition', 'job']

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Opportunities</h1>
                <p>Ranked by relevance to your profile</p>
            </div>

            <div className="filter-bar">
                <button className={`filter-btn ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
                {types.map(t => (
                    <button key={t} className={`filter-btn ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {feedback && (
                <div className={`result-banner ${feedback.type}`}>
                    <strong>{feedback.message}</strong>
                    <button className="close-btn" onClick={() => setFeedback(null)}>✕</button>
                </div>
            )}

            {loading ? (
                <div>{[1,2,3].map(i => <div key={i} className="skeleton skeleton-card" />)}</div>
            ) : opportunities.length === 0 ? (
                <div className="empty-state"><p>No opportunities found</p></div>
            ) : (
                <div className="opportunity-list">
                    {opportunities.map(opp => (
                        <OpportunityCard
                            key={opp._id}
                            opportunity={opp}
                            onApply={() => handleApplyClick(opp)}
                            isApplying={false}
                            applied={appliedIds.has(opp._id)}
                        />
                    ))}
                </div>
            )}

            {modalOpp && (
                <ApplyModal
                    opportunity={modalOpp}
                    onClose={() => setModalOpp(null)}
                    onApplied={handleApplied}
                />
            )}
        </div>
    )
}

export default Opportunities
