import React from 'react';
import './Membership.css';

const Membership = () => {
    return (
        <div className="branch-content membership-page">
            <h2>Membership</h2>
            <p className="membership-tagline">Become a Legionnaire and join the finest Veterans organization in the world.</p>

            <section className="membership-section">
                <h3>Application Process</h3>
                <p>Members must submit a Royal Canadian Legion Membership Application form to the Branch Membership Chairman. All applications undergo review based on the organization's General By-Laws and local branch approval.</p>
                <p>Applicants must be Canadian citizens or Commonwealth subjects of federal voting age.</p>
            </section>

            <section className="membership-section">
                <h3>Membership Categories</h3>

                <div className="membership-category">
                    <h4>Ordinary Membership</h4>
                    <p>Eligible candidates have served in:</p>
                    <ul>
                        <li>Canadian Forces or allied military forces during conflicts involving Canada</li>
                        <li>Merchant Navy or non-military services in war theaters where Canada participated</li>
                        <li>Royal Canadian Mounted Police or Newfoundland Constabulary (minimum one year)</li>
                        <li>NATO/NORAD member country forces</li>
                        <li>U.S. Armed Forces</li>
                        <li>Vietnam War service with allied nations</li>
                        <li>Canadian Coast Guard (two or more years active service)</li>
                        <li>City, municipal, or provincial police forces (minimum one year)</li>
                    </ul>
                </div>

                <div className="membership-category">
                    <h4>Associate Membership</h4>
                    <p>Qualifications include:</p>
                    <ul>
                        <li>Family relations to ordinary members (children, spouses, parents, siblings, etc.)</li>
                        <li>Three or more years in Royal Canadian Sea, Army, or Air Cadets</li>
                        <li>Three or more years as cadet civilian instructor</li>
                        <li>Two or more years as Navy League of Canada officer</li>
                        <li>Polish Armed Forces service post-WWII below officer rank</li>
                        <li>Fire service experience (minimum one year)</li>
                    </ul>
                </div>

                <div className="membership-category">
                    <h4>Affiliate Voting Membership</h4>
                    <p>Available to those supporting Legion aims without meeting other membership criteria.</p>
                </div>

                <div className="membership-category">
                    <h4>Affiliate Non-Voting Membership</h4>
                    <p>For non-Canadian or non-Commonwealth citizens from allied nations.</p>
                </div>
            </section>

            <section className="membership-section">
                <h3>Benefits of Membership</h3>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <h4>Social Activities</h4>
                        <p>Members can enjoy a wide variety of social events such as dances, barbeques, and entertainment.</p>
                    </div>
                    <div className="benefit-card">
                        <h4>Sports Programs</h4>
                        <p>Darts, curling, cribbage, and golf competitions from local to national levels.</p>
                    </div>
                    <div className="benefit-card">
                        <h4>Member Benefits Package</h4>
                        <p>Corporate partnerships offering insurance, healthcare, credit cards, and auto club services.</p>
                    </div>
                    <div className="benefit-card">
                        <h4>Community Service</h4>
                        <p>Youth support, senior assistance, bursaries, scholarships, and sponsorship of Scouts, Guides, and Cadets.</p>
                    </div>
                    <div className="benefit-card">
                        <h4>Leadership Development</h4>
                        <p>Opportunities for branch, zone, district, and provincial leadership roles.</p>
                    </div>
                    <div className="benefit-card">
                        <h4>Legion Magazine</h4>
                        <p>Six annual issues included with membership covering history, current events, and member recognition.</p>
                    </div>
                </div>
            </section>

            <section className="membership-cta">
                <p>You don't have to be a Veteran to join! Membership is open to all Canadian citizens who support our aims.</p>
                <a href="https://www.legion.ca/join-us" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Join Today</a>
            </section>
        </div>
    );
};

export default Membership;
