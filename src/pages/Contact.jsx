import React from 'react';
import './Contact.css';

const Contact = () => {
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
                        (613) 548-4570
                    </p>
                    <p style={{ marginTop: '1.5rem' }}>
                        <strong>Email:</strong><br />
                        rcl560@kingston.net
                    </p>
                </div>

                <div className="contact-form">
                    <h2>Send us a Message</h2>
                    <form>
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <textarea rows="5" placeholder="Message" required></textarea>
                        <button type="submit" className="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
