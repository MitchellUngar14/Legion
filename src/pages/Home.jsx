import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import './Home.css';

const Home = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const now = new Date();

                // Filter to only show non-expired announcements
                const activeAnnouncements = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(announcement => {
                        if (!announcement.endDate) return false;
                        const endDateTime = announcement.endDate.toDate();
                        return endDateTime > now;
                    });

                setAnnouncements(activeAnnouncements);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        };

        fetchAnnouncements();
    }, []);

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

            {announcements.length > 0 && (
                <section className="announcements-section">
                    <div className="container">
                        <h2>Announcements</h2>
                        <div className="announcements-grid">
                            {announcements.map(announcement => (
                                <div key={announcement.id} className="announcement-card">
                                    <h3>{announcement.title}</h3>
                                    <p>{announcement.message}</p>
                                    {announcement.link && (
                                        <a
                                            href={announcement.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="announcement-link"
                                        >
                                            Learn More
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

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
