import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Droplet, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container flex justify-between align-center">
                <Link to="/" className="logo">
                    <Droplet color="#3b82f6" fill="#3b82f6" />
                    <span>FreshLaundry</span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
                    <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>Orders</Link>
                    <button onClick={logoutHandler} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
