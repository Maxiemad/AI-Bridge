import { Link, useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const user = JSON.parse(localStorage.getItem('user') || 'null')

    function handleLogout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    if (!user) return null

    function cls(path) {
        return location.pathname === path ? 'nav-link active' : 'nav-link'
    }

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="nav-brand">
                <span className="brand-icon">⚡</span>
                <span>AI Bridge</span>
            </Link>
            <div className="nav-links">
                <Link to="/dashboard" className={cls('/dashboard')}>Dashboard</Link>
                <Link to="/opportunities" className={cls('/opportunities')}>Opportunities</Link>
                <Link to="/applications" className={cls('/applications')}>Tracker</Link>
                <Link to="/profile" className={cls('/profile')}>Profile</Link>
            </div>
            <div className="nav-user">
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
        </nav>
    )
}

export default Navbar
