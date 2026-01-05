import React from 'react';

const Membership = () => {
    return (
        <div className="branch-content">
            <h2>Membership</h2>
            <h3>Why Join?</h3>
            <p>By joining The Royal Canadian Legion you will have the opportunity to make new friends, become involved with your community and to develop and share your leadership skills.</p>

            <div className="benefits-section">
                <h4>Member Benefits</h4>
                <ul>
                    <li><strong>Social Activities:</strong> Recreational facilities, licensed lounge, dances, barbeques, and entertainment.</li>
                    <li><strong>Member Sports:</strong> Darts, curling, cribbage, and golf competitions from local to national levels.</li>
                    <li><strong>Member Benefits Package:</strong> Exclusive deals with corporate partners for insurance, health care, and more.</li>
                    <li><strong>Community Service:</strong> Support youth, seniors, and veterans. We support Scouts, Guides, and Cadets.</li>
                    <li><strong>Legion Magazine:</strong> Subscription included, published six times a year.</li>
                </ul>
            </div>

            <div className="cta-section">
                <p>You don't have to be a Veteran to join! Membership is open to all Canadian citizens.</p>
                <a href="https://www.legion.ca/join-us" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Join Today</a>
            </div>
        </div>
    );
};

export default Membership;
