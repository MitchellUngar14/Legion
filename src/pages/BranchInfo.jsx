import React from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import './BranchInfo.css';

const BranchInfoLayout = () => {
    // Redirect to first tab if exact match on /branch-info
    const location = useLocation();
    if (location.pathname === '/branch-info') {
        return <Navigate to="/branch-info/executive" replace />;
    }

    return (
        <div className="container branch-container">
            <h1 className="page-title">Branch Information</h1>

            <div className="branch-layout">
                <aside className="branch-sidebar">
                    <nav>
                        <NavLink to="/branch-info/executive" className={({ isActive }) => isActive ? "active" : ""}>Executive Members</NavLink>
                        <NavLink to="/branch-info/membership" className={({ isActive }) => isActive ? "active" : ""}>Membership</NavLink>
                        <NavLink to="/branch-info/resources" className={({ isActive }) => isActive ? "active" : ""}>Member Resources</NavLink>
                        <NavLink to="/branch-info/sports" className={({ isActive }) => isActive ? "active" : ""}>Sports</NavLink>
                        <NavLink to="/branch-info/rentals" className={({ isActive }) => isActive ? "active" : ""}>Room Rentals</NavLink>
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
