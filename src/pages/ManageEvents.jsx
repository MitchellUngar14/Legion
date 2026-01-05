import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import './ManagePages.css';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        untilClose: false,
        description: ''
    });

    const fetchEvents = async () => {
        try {
            const q = query(collection(db, 'events'), orderBy('date', 'asc'));
            const snapshot = await getDocs(q);
            setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Combine date and start time for sorting/calendar placement
            const dateTimeString = `${formData.date}T${formData.startTime || '00:00'}`;
            const dateObj = new Date(dateTimeString);

            await addDoc(collection(db, 'events'), {
                title: formData.title,
                date: Timestamp.fromDate(dateObj),
                startTime: formData.startTime,
                endTime: formData.untilClose ? 'Close' : formData.endTime,
                untilClose: formData.untilClose,
                description: formData.description
            });

            setFormData({
                title: '',
                date: '',
                startTime: '',
                endTime: '',
                untilClose: false,
                description: ''
            });
            fetchEvents(); // Refresh list
        } catch (error) {
            console.error("Error adding event:", error);
            alert("Failed to add event");
        }
    };

    // ... handleDelete remains the same ...

    return (
        <div className="manage-container container">
            <div className="manage-header">
                <h1>Manage Events</h1>
                <Link to="/dashboard" className="btn btn-outline-dark">Back to Dashboard</Link>
            </div>

            <div className="manage-grid">
                <div className="form-section">
                    <h2>Add New Event</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Event Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row" style={{ alignItems: 'flex-end' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>End Time</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    disabled={formData.untilClose}
                                />
                            </div>
                            <div className="form-group checkbox-group" style={{ marginBottom: '1rem' }}>
                                <input
                                    type="checkbox"
                                    id="untilClose"
                                    checked={formData.untilClose}
                                    onChange={(e) => setFormData({ ...formData, untilClose: e.target.checked })}
                                />
                                <label htmlFor="untilClose" style={{ marginBottom: 0, marginLeft: '0.5rem' }}>Until Close</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Add Event</button>
                    </form>
                </div>

                <div className="list-section">
                    <h2>Existing Events</h2>
                    {loading ? <p>Loading...</p> : (
                        <ul className="manage-list">
                            {events.map(event => (
                                <li key={event.id} className="manage-item">
                                    <div className="item-info">
                                        <h3>{event.title}</h3>
                                        <p>{new Date(event.date.seconds * 1000).toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => handleDelete(event.id)} className="btn-delete">Delete</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageEvents;
