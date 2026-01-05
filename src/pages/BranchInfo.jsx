import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import './BranchInfo.css';

const BranchInfoLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Redirect to first tab if exact match on /branch-info
    if (location.pathname === '/branch-info') {
        return <Navigate to="/branch-info/executive" replace />;
    }

    const navItems = [
        { path: '/branch-info/executive', label: 'Executive Members' },
        { path: '/branch-info/membership', label: 'Membership' },
        { path: '/branch-info/resources', label: 'Member Resources' },
        { path: '/branch-info/sports', label: 'Sports' },
        { path: '/branch-info/rentals', label: 'Room Rentals' },
    ];

    const activeItem = navItems.find(item => location.pathname === item.path) || navItems[0];

    return (
        <div className="container branch-container">
            <h1 className="page-title">Branch Information</h1>

            <div className="branch-layout">
                <aside className="branch-sidebar">
                    <div
                        className="mobile-nav-header"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span>{activeItem.label}</span>
                        <ChevronDown className={`chevron ${isMenuOpen ? 'open' : ''}`} size={20} />
                    </div>

                    <nav className={isMenuOpen ? 'show' : ''}>
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) => isActive ? "active" : ""}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                <main className="branch-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default BranchInfoLayout;
