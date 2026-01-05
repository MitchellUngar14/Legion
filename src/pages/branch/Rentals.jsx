import React from 'react';
import { Link } from 'react-router-dom';

const Rentals = () => {
    return (
        <div className="branch-content">
            <h2>Room Rentals</h2>
            <p>We have beautiful rooms available for weddings, parties, meetings, and special events.</p>

            <div className="contact-cta">
                <p>For rates and availability, please contact us directly.</p>
                <Link to="/contact" className="btn btn-primary">Inquire Now</Link>
            </div>
        </div>
    );
};

export default Rentals;
