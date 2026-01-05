import React from 'react';

const Sports = () => {
    return (
        <div className="branch-content">
            <h2>Sports</h2>
            <p>The Legion Promotes Comradeship through games and sports. Many of the social games do not require membership; however, to qualify to play in Legion Competitions you must be a member.</p>

            <div className="sports-grid">
                <div className="sport-card">
                    <h3>Darts</h3>
                    <p>Weekly leagues and drop-in play.</p>
                </div>
                <div className="sport-card">
                    <h3>Cards</h3>
                    <p>Euchre and Cribbage tournaments.</p>
                </div>
                <div className="sport-card">
                    <h3>Pool</h3>
                    <p>8 Ball and Snooker tables available.</p>
                </div>
                <div className="sport-card">
                    <h3>Outdoor Games</h3>
                    <p>Horse Shoes, Washer Toss, and Cornhole.</p>
                </div>
                <div className="sport-card">
                    <h3>Golf</h3>
                    <p>Annual tournaments.</p>
                </div>
            </div>
        </div>
    );
};

export default Sports;
