import React from 'react';

const Resources = () => {
    return (
        <div className="branch-content">
            <h2>Member Resources</h2>
            <ul className="resource-list">
                <li>
                    <a href="https://www.on.legion.ca/member-resources/forms-manuals" target="_blank" rel="noopener noreferrer">
                        Forms & Manuals (Legion.ca)
                    </a>
                </li>
                <li>
                    <span>Club House Rules (Available at Branch)</span>
                </li>
                <li>
                    <span>Branch By-Laws (Available at Branch)</span>
                </li>
                <li>
                    <span>Policy and Procedures (Available at Branch)</span>
                </li>
            </ul>
        </div>
    );
};

export default Resources;
