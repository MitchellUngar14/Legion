import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import './Executive.css';

const Executive = () => {
    const [executives, setExecutives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExecutives = async () => {
            try {
                const q = query(collection(db, 'executives'), orderBy('order', 'asc'));
                const snapshot = await getDocs(q);
                setExecutives(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching executives:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExecutives();
    }, []);

    if (loading) {
        return <div className="branch-content"><p>Loading executive team...</p></div>;
    }

    return (
        <div className="branch-content">
            <h2>Executive Members</h2>
            <p>Our branch is led by a dedicated group of volunteers elected by the membership. Meet our current executive team:</p>

            <div className="exec-list">
                {executives.map((exec) => (
                    <div key={exec.id} className="exec-role">
                        <h3>{exec.role}</h3>
                        <p className="exec-name">{exec.name}</p>
                        {exec.responsibility && <p className="exec-resp">({exec.responsibility})</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Executive;
