import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <img src={logo} alt="Legion 560" className="footer-logo" />
                    <h3 style={{ display: 'none' }}>Royal Canadian Legion</h3>
                    <p>Limestone City Branch 560</p>
                    <p>734 Montreal St, Kingston, Ontario K7K 3J4</p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/events">Events</Link></li>
                        <li><Link to="/food-service">Food Service</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/login">Admin Login</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Connect</h3>
                    <a href="https://www.facebook.com/profile.php?id=100047612774595" target="_blank" rel="noopener noreferrer">Facebook</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Legion Branch 560. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
