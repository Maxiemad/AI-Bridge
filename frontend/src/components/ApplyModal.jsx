import { useState, useEffect, useRef } from 'react'
import { applyToOpportunity } from '../services/api'

function ApplyModal({ opportunity, onClose, onApplied }) {
    const [step, setStep] = useState('preview')
    const [coverLetter, setCoverLetter] = useState('')
    const [emailDraft, setEmailDraft] = useState('')
    const [displayedCover, setDisplayedCover] = useState('')
    const [displayedEmail, setDisplayedEmail] = useState('')
    const [error, setError] = useState('')
    const coverRef = useRef(null)

    function typeColor(type) {
        const c = { hackathon:'#7c3aed', internship:'#3b82f6', grant:'#059669',
            fellowship:'#d97706', competition:'#dc2626', job:'#0891b2', collaboration:'#6366f1' }
        return c[type] || '#6b7280'
    }

    async function startGeneration() {
        setStep('generating')
        setError('')
        try {
            const res = await applyToOpportunity(opportunity._id)
            const data = res.data
            setCoverLetter(data.coverLetter || '')
            setEmailDraft(data.emailDraft || '')
            setTimeout(() => {
                setStep('typing')
            }, 1200)
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate')
            setStep('preview')
        }
    }

    useEffect(() => {
        if (step !== 'typing') return
        let idx = 0
        const text = coverLetter
        const interval = setInterval(() => {
            if (idx <= text.length) {
                setDisplayedCover(text.slice(0, idx))
                idx++
            } else {
                clearInterval(interval)
                setDisplayedEmail(emailDraft)
                setStep('done')
            }
        }, 8)
        return () => clearInterval(interval)
    }, [step, coverLetter, emailDraft])

    function handleSubmit() {
        onApplied(opportunity._id)
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="apply-modal">
                <div className="modal-header">
                    <h2>Apply to {opportunity.title}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {step === 'preview' && (
                        <>
                            <div className="modal-step">
                                <h3>Opportunity Details</h3>
                                <div style={{display:'flex',gap:'.6rem',alignItems:'center',marginBottom:'.75rem'}}>
                                    <span className="opp-type" style={{backgroundColor:typeColor(opportunity.type)}}>{opportunity.type}</span>
                                    <span style={{color:'#94a3b8',fontSize:'.85rem'}}>{opportunity.organization || opportunity.source}</span>
                                </div>
                                <p style={{color:'#cbd5e1',fontSize:'.9rem',lineHeight:'1.6'}}>{opportunity.description}</p>
                            </div>
                            {error && <div className="error-box">{error}</div>}
                            <button className="btn-submit" style={{width:'100%'}} onClick={startGeneration}>
                                ✨ Generate My Application
                            </button>
                        </>
                    )}

                    {step === 'generating' && (
                        <div className="ai-generating">
                            <div className="ai-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <p>Generating your application...</p>
                            <p style={{fontSize:'.8rem',color:'#64748b',marginTop:'.5rem'}}>AI is crafting a personalized cover letter and email</p>
                        </div>
                    )}

                    {(step === 'typing' || step === 'done') && (
                        <>
                            <div className="modal-step">
                                <h3>Cover Letter</h3>
                                <div className="generated-output">
                                    <textarea
                                        ref={coverRef}
                                        value={step === 'done' ? coverLetter : displayedCover}
                                        onChange={e => setCoverLetter(e.target.value)}
                                        readOnly={step === 'typing'}
                                    />
                                </div>
                            </div>
                            {step === 'done' && (
                                <div className="modal-step">
                                    <h3>Email Draft</h3>
                                    <div className="generated-output">
                                        <textarea
                                            value={emailDraft}
                                            onChange={e => setEmailDraft(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {step === 'done' && (
                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn-submit" onClick={handleSubmit}>
                            Submit Application
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ApplyModal
