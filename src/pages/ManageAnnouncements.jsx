import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import './ManagePages.css';

const ManageAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        link: '',
        endDate: '',
        endTime: ''
    });

    const fetchAnnouncements = async () => {
        try {
            const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Combine date and time for end date
            const endDateTimeString = `${formData.endDate}T${formData.endTime || '23:59'}`;
            const endDateObj = new Date(endDateTimeString);

            if (editingId) {
                // UPDATE existing announcement
                await updateDoc(doc(db, 'announcements', editingId), {
                    title: formData.title,
                    message: formData.message,
                    link: formData.link || null,
                    endDate: Timestamp.fromDate(endDateObj)
                });
                setEditingId(null);
                alert("Announcement updated successfully!");
            } else {
                // ADD new announcement
                await addDoc(collection(db, 'announcements'), {
                    title: formData.title,
                    message: formData.message,
                    link: formData.link || null,
                    endDate: Timestamp.fromDate(endDateObj),
                    createdAt: Timestamp.fromDate(new Date())
                });
                alert("Announcement added successfully!");
            }

            setFormData({ title: '', message: '', link: '', endDate: '', endTime: '' });
            fetchAnnouncements();
        } catch (error) {
            console.error("Error saving announcement:", error);
            alert("Failed to save announcement: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this announcement? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, 'announcements', id));
            await fetchAnnouncements();
            alert("Announcement deleted successfully.");
        } catch (error) {
            console.error("Error deleting announcement:", error);
            alert("Failed to delete announcement: " + error.message);
        }
    };

    const handleEdit = (announcement) => {
        setEditingId(announcement.id);

        // Convert Firestore Timestamp to date/time strings for form inputs
        const endDateObj = announcement.endDate.toDate();
        const dateStr = endDateObj.toISOString().split('T')[0];
        const timeStr = endDateObj.toTimeString().slice(0, 5);

        setFormData({
            title: announcement.title,
            message: announcement.message,
            link: announcement.link || '',
            endDate: dateStr,
            endTime: timeStr
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', message: '', link: '', endDate: '', endTime: '' });
    };

    const isExpired = (endDate) => {
        if (!endDate) return false;
        const endDateTime = endDate.toDate();
        return endDateTime < new Date();
    };

    const formatEndDate = (timestamp) => {
        if (!timestamp) return 'No end date';
        const date = timestamp.toDate();
        return date.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    return (
        <div className="manage-container container">
            <div className="manage-header">
                <h1>Manage Announcements</h1>
                <Link to="/dashboard" className="btn btn-outline-dark">Back to Dashboard</Link>
            </div>

            <div className="manage-grid">
                <div className="form-section">
                    <h2>{editingId ? 'Edit Announcement' : 'Add Announcement'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Announcement headline"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                rows="4"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Announcement details..."
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Link (Optional)</label>
                            <input
                                type="url"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                            The announcement will automatically stop displaying on the home page after this date and time.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update Announcement' : 'Add Announcement'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="btn btn-outline-dark"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="list-section">
                    <h2>All Announcements</h2>
                    {loading ? <p>Loading...</p> : (
                        announcements.length === 0 ? (
                            <p style={{ color: '#666' }}>No announcements yet. Create one using the form.</p>
                        ) : (
                            <ul className="manage-list">
                                {announcements.map(announcement => (
                                    <li
                                        key={announcement.id}
                                        className="manage-item"
                                        style={{
                                            opacity: isExpired(announcement.endDate) ? 0.5 : 1,
                                            background: isExpired(announcement.endDate) ? '#f9f9f9' : 'transparent'
                                        }}
                                    >
                                        <div className="item-info">
                                            <h3>
                                                {announcement.title}
                                                {isExpired(announcement.endDate) && (
                                                    <span style={{
                                                        marginLeft: '0.5rem',
                                                        fontSize: '0.75rem',
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        fontWeight: 'normal'
                                                    }}>
                                                        Expired
                                                    </span>
                                                )}
                                            </h3>
                                            <p style={{
                                                color: '#555',
                                                marginTop: '0.25rem',
                                                whiteSpace: 'pre-wrap',
                                                maxHeight: '60px',
                                                overflow: 'hidden'
                                            }}>
                                                {announcement.message}
                                            </p>
                                            <p className="item-meta">
                                                Expires: {formatEndDate(announcement.endDate)}
                                            </p>
                                            {announcement.link && (
                                                <p className="item-meta" style={{ marginTop: '0.25rem' }}>
                                                    Link: <a href={announcement.link} target="_blank" rel="noopener noreferrer">{announcement.link}</a>
                                                </p>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                            <button
                                                onClick={() => handleEdit(announcement)}
                                                className="btn btn-outline-dark"
                                                disabled={editingId && editingId !== announcement.id}
                                                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(announcement.id)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageAnnouncements;
