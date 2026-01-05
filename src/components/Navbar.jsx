import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Branch Info', path: '/branch-info' },
        { name: 'Poppy & Remembrance', path: '/poppy-remembrance' },
        { name: 'Events', path: '/events' },
        { name: 'Food Service', path: '/food-service' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo-link">
                    <img src={logo} alt="Legion 560" className="navbar-logo-img" />
                </Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </div>

                <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
                    {navLinks.map((link) => (
                        <li key={link.name} className="nav-item">
                            <NavLink
                                to={link.path}
                                className={({ isActive }) => "nav-links" + (isActive ? " active-link" : "")}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
