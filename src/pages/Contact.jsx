import React from 'react';
import './Contact.css';

const Contact = () => {
    const contactEmail = 'rcl560@kingston.net';

    return (
        <div className="container contact-page">
            <h1>Contact Us</h1>
            <div className="contact-grid">
                <div className="contact-info">
                    <h2>Get in Touch</h2>
                    <p>
                        <strong>Address:</strong><br />
                        734 Montreal St<br />
                        Kingston, Ontario<br />
                        K7K 3J4
                    </p>
                    <p style={{ marginTop: '1.5rem' }}>
                        <strong>Phone:</strong><br />
                        <a href="tel:6135484570">(613) 548-4570</a>
                    </p>
                    <p style={{ marginTop: '1.5rem' }}>
                        <strong>Email:</strong><br />
                        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                    </p>
                </div>

                <div className="contact-form">
                    <h2>Send us a Message</h2>
                    <p>Have questions or want to get in touch? Click below to send us an email.</p>
                    <a
                        href={`mailto:${contactEmail}?subject=${encodeURIComponent('Contact from Legion 560 Website')}`}
                        className="btn btn-primary"
                    >
                        Send Email
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Contact;
