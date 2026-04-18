import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from '../services/api'

function Profile() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [skillInput, setSkillInput] = useState('')
    const [interestInput, setInterestInput] = useState('')
    const [bio, setBio] = useState('')
    const [experience, setExperience] = useState('student')
    const [msg, setMsg] = useState('')

    useEffect(() => {
        getProfile().then(res => {
            const p = res.data
            setProfile(p)
            setBio(p.bio || '')
            setExperience(p.experience || 'student')
        }).catch(() => {}).finally(() => setLoading(false))
    }, [])

    function addSkill(e) {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault()
            if (!profile.skills.includes(skillInput.trim())) {
                setProfile(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }))
            }
            setSkillInput('')
        }
    }

    function removeSkill(s) {
        setProfile(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }))
    }

    function addInterest(e) {
        if (e.key === 'Enter' && interestInput.trim()) {
            e.preventDefault()
            if (!profile.interests.includes(interestInput.trim())) {
                setProfile(prev => ({ ...prev, interests: [...prev.interests, interestInput.trim()] }))
            }
            setInterestInput('')
        }
    }

    function removeInterest(i) {
        setProfile(prev => ({ ...prev, interests: prev.interests.filter(x => x !== i) }))
    }

    async function handleSave() {
        setSaving(true)
        setMsg('')
        try {
            const res = await updateProfile({ skills: profile.skills, interests: profile.interests, bio, experience })
            setProfile(res.data)
            localStorage.setItem('user', JSON.stringify(res.data))
            setMsg('Profile updated')
            setTimeout(() => setMsg(''), 3000)
        } catch {
            setMsg('Failed to save')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="page-container"><div className="loading-spinner">Loading profile...</div></div>
    if (!profile) return <div className="page-container"><div className="empty-state">Could not load profile</div></div>

    return (
        <div className="profile-page" style={{animation:'fadeIn .4s ease'}}>
            <div className="page-header">
                <h1>Your Profile</h1>
                <p>This feeds the AI ranking and application engine</p>
            </div>

            <div className="profile-card">
                <h2>👤 Basic Info</h2>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={profile.name} readOnly style={{opacity:.6}} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="text" value={profile.email} readOnly style={{opacity:.6}} />
                </div>
                <div className="form-group">
                    <label>Experience Level</label>
                    <select value={experience} onChange={e => setExperience(e.target.value)}
                        style={{width:'100%',padding:'.8rem 1rem',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#fff',fontSize:'.95rem',fontFamily:'inherit'}}>
                        <option value="student">Student</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid-Level</option>
                        <option value="senior">Senior</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                        placeholder="Tell us about yourself..."
                        style={{width:'100%',padding:'.8rem 1rem',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#fff',fontSize:'.9rem',fontFamily:'inherit',resize:'vertical',outline:'none'}} />
                </div>
            </div>

            <div className="profile-card">
                <h2>🛠️ Skills</h2>
                <p style={{fontSize:'.8rem',color:'#64748b',marginBottom:'.75rem'}}>Press Enter to add a skill</p>
                <div className="tag-input-wrapper">
                    {profile.skills.map(s => (
                        <span key={s} className="tag-pill">{s}<button onClick={() => removeSkill(s)}>×</button></span>
                    ))}
                    <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill} placeholder="Type a skill..." />
                </div>
            </div>

            <div className="profile-card">
                <h2>💡 Interests</h2>
                <p style={{fontSize:'.8rem',color:'#64748b',marginBottom:'.75rem'}}>Press Enter to add an interest</p>
                <div className="tag-input-wrapper">
                    {profile.interests.map(i => (
                        <span key={i} className="tag-pill">{i}<button onClick={() => removeInterest(i)}>×</button></span>
                    ))}
                    <input value={interestInput} onChange={e => setInterestInput(e.target.value)} onKeyDown={addInterest} placeholder="Type an interest..." />
                </div>
            </div>

            {msg && <div className={`result-banner ${msg.includes('Failed') ? 'error' : 'success'}`}>{msg}</div>}

            <button className="btn-primary" onClick={handleSave} disabled={saving} style={{maxWidth:300}}>
                {saving ? 'Saving...' : 'Save Profile'}
            </button>
        </div>
    )
}

export default Profile
