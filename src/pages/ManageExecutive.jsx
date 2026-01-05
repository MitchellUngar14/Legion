import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, query, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import './ManagePages.css';

const ManageExecutive = () => {
    const [executives, setExecutives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        responsibility: '',
        order: 0
    });

    const roles = [
        'President', 'Past President', '1st Vice President', '2nd Vice President',
        '3rd Vice President', 'Secretary', 'Treasurer', 'Executive', 'Sgt at Arms',
        'Chaplain', 'Service Officer'
    ];

    // Hardcoded data for migration
    const initialExecutives = [
        { role: 'President', name: 'Gary Veley', responsibility: 'Sports', order: 1 },
        { role: 'Past President', name: 'Leo Lund', responsibility: 'Housing', order: 2 },
        { role: '1st Vice President', name: 'John Price', responsibility: 'Veterans Services Officer', order: 3 },
        { role: '2nd Vice President', name: 'Joan Campbell', responsibility: 'Membership / H&A', order: 4 },
        { role: '3rd Vice President', name: 'David Price', responsibility: 'Finance', order: 5 },
        { role: 'Secretary', name: "Kathleen (Katie) O'Connor", responsibility: 'Entertainment', order: 6 },
        { role: 'Executive', name: 'Holly Thompson', responsibility: 'Seniors', order: 7 },
        { role: 'Executive', name: 'Marlene Scoutan', responsibility: 'Lotto', order: 8 },
        { role: 'Executive', name: 'Tracy Gray', responsibility: 'Sick and Visiting', order: 9 },
        { role: 'Executive', name: 'Merrill Gooderham', responsibility: 'Poppy / Cadets', order: 10 },
        { role: 'Executive', name: 'Jean Blain', responsibility: 'Sgt at Arms, LA', order: 11 },
        { role: 'Executive', name: "Melissa O'Meara", responsibility: 'PRO', order: 12 },
    ];

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

    useEffect(() => {
        fetchExecutives();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'executives'), {
                ...formData,
                order: Number(formData.order)
            });
            setFormData({ name: '', role: 'Executive', responsibility: '', order: executives.length + 1 });
            fetchExecutives();
        } catch (error) {
            console.error("Error adding executive:", error);
            alert("Failed to add executive");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this executive member?")) {
            try {
                await deleteDoc(doc(db, 'executives', id));
                fetchExecutives();
            } catch (error) {
                console.error("Error deleting executive:", error);
            }
        }
    };

    const handleMigrate = async () => {
        if (!window.confirm("This will add all default executive members to the database. Continue?")) return;

        setLoading(true);
        try {
            const batch = writeBatch(db);
            initialExecutives.forEach(exec => {
                const docRef = doc(collection(db, 'executives'));
                batch.set(docRef, exec);
            });
            await batch.commit();
            alert("Migration successful!");
            fetchExecutives();
        } catch (error) {
            console.error("Migration failed:", error);
            alert("Migration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="manage-container container">
            <div className="manage-header">
                <h1>Manage Executives</h1>
                <Link to="/dashboard" className="btn btn-outline-dark">Back to Dashboard</Link>
            </div>

            <div className="manage-grid">
                <div className="form-section">
                    <h2>Add Executive</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="">Select Role/Title...</option>
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                    <option value="Custom">Custom Title (Type below)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Sort Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Responsibility (Optional)</label>
                            <input
                                type="text"
                                value={formData.responsibility}
                                onChange={(e) => setFormData({ ...formData, responsibility: e.target.value })}
                                placeholder="e.g. Sports, Housing"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Member</button>
                    </form>

                    {executives.length === 0 && (
                        <div className="migration-section" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ccc' }}>
                            <h3>Setup</h3>
                            <p>Database appears empty. Click below to add current executive team.</p>
                            <button onClick={handleMigrate} className="btn btn-warning">Migrate Default Data</button>
                        </div>
                    )}
                </div>

                <div className="list-section">
                    <h2>Executive Team</h2>
                    {loading ? <p>Loading...</p> : (
                        <ul className="manage-list">
                            {executives.map(exec => (
                                <li key={exec.id} className="manage-item">
                                    <div className="item-info">
                                        <h3>{exec.name}</h3>
                                        <p style={{ fontWeight: 'bold', color: 'var(--color-poppy-red)' }}>{exec.role}</p>
                                        {exec.responsibility && <p className="item-meta">Focus: {exec.responsibility}</p>}
                                    </div>
                                    <button onClick={() => handleDelete(exec.id)} className="btn-delete">Delete</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageExecutive;
