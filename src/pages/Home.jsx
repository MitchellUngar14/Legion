import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Limestone City Branch 560</h1>
                    <h2>Royal Canadian Legion</h2>
                    <p>Serving Veterans and the Community in Kingston, Ontario</p>
                    <div className="hero-buttons">
                        <Link to="/events" className="btn btn-primary">Upcoming Events</Link>
                        <Link to="/membership" className="btn btn-outline">Join Us</Link>
                    </div>
                </div>
            </section>

            <section className="info-section">
                <div className="container">
                    <div className="info-grid">
                        <div className="info-card">
                            <h3>We Are Open</h3>
                            <p>Come visit us at 734 Montreal St. Enjoy our facilities, sports, and camaraderie.</p>
                        </div>
                        <div className="info-card">
                            <h3>Hall Rentals</h3>
                            <p>Hosting an event? We have beautiful rooms available for weddings, parties, and meetings.</p>
                            <Link to="/contact">Contact for Rentals</Link>
                        </div>
                        <div className="info-card">
                            <h3>Cove Catering</h3>
                            <p>Delicious food available. Check out our menu and specials.</p>
                            <Link to="/food-service">View Menu</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
