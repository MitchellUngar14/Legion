import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="dashboard-container container">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="user-info">
                    <span>{currentUser?.email}</span>
                    <button onClick={handleLogout} className="btn btn-outline-dark">Logout</button>
                </div>
            </div>

            <div className="dashboard-grid">
                <Link to="/admin/events" className="dashboard-card">
                    <h2>Manage Events</h2>
                    <p>Add, edit, or remove upcoming events.</p>
                </Link>
                <Link to="/admin/food" className="dashboard-card">
                    <div className="card-icon">🍽️</div>
                    <h2>Food Service</h2>
                    <p>Update catering menus.</p>
                </Link>

                <Link to="/admin/executive" className="dashboard-card">
                    <div className="card-icon">👥</div>
                    <h2>Executives</h2>
                    <p>Update leadership team.</p>
                </Link>

                <Link to="/admin/announcements" className="dashboard-card">
                    <div className="card-icon">📢</div>
                    <h2>Announcements</h2>
                    <p>Create and manage homepage announcements.</p>
                </Link>
            </div>

            <div className="dashboard-alert">
                <h3>Important Note</h3>
                <p>Changes made here update the public website immediately.</p>
            </div>
        </div>
    );
};

export default Dashboard;
