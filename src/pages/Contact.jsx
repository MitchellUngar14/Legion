import React from 'react';

const Contact = () => {
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1>Contact Us</h1>
            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '2rem' }}>
                <div className="contact-info">
                    <h2>Get in Touch</h2>
                    <p>
                        <strong>Address:</strong><br />
                        734 Montreal St<br />
                        Kingston, Ontario<br />
                        K7K 3J4
                    </p>
                    <p>
                        <strong>Phone:</strong><br />
                        (613) 548-4570
                    </p>
                    <p>
                        <strong>Email:</strong><br />
                        rcl560@kingston.net
                    </p>
                </div>

                <div className="contact-form">
                    <h2>Send us a Message</h2>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="text" placeholder="Your Name" style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <input type="email" placeholder="Your Email" style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <textarea rows="5" placeholder="Message" style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}></textarea>
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--color-poppy-red)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px' }}>Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
