import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import './ManagePages.css';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        untilClose: false,
        description: ''
    });
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringOptions, setRecurringOptions] = useState({
        frequency: 'weekly',
        endDate: ''
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

    // Generate recurring dates based on frequency
    const generateRecurringDates = (startDate, endDate, frequency) => {
        const dates = [];
        const current = new Date(startDate);
        const end = new Date(endDate);

        // Set end date to end of day to include it
        end.setHours(23, 59, 59, 999);

        while (current <= end) {
            dates.push(new Date(current));

            if (frequency === 'weekly') {
                current.setDate(current.getDate() + 7);
            } else if (frequency === 'biweekly') {
                current.setDate(current.getDate() + 14);
            } else if (frequency === 'monthly') {
                current.setMonth(current.getMonth() + 1);
            }
        }

        return dates;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Combine date and start time for sorting/calendar placement
            const dateTimeString = `${formData.date}T${formData.startTime || '00:00'}`;
            const dateObj = new Date(dateTimeString);

            const eventData = {
                title: formData.title,
                date: Timestamp.fromDate(dateObj),
                startTime: formData.startTime,
                endTime: formData.untilClose ? 'Close' : formData.endTime,
                untilClose: formData.untilClose,
                description: formData.description
            };

            if (editingId) {
                // UPDATE existing event (recurring not available when editing)
                await updateDoc(doc(db, 'events', editingId), eventData);
                setEditingId(null);
                alert("Event updated successfully!");
            } else if (isRecurring && recurringOptions.endDate) {
                // ADD multiple recurring events
                const dates = generateRecurringDates(
                    dateObj,
                    recurringOptions.endDate,
                    recurringOptions.frequency
                );

                if (dates.length === 0) {
                    alert("No events to create. Check your date range.");
                    return;
                }

                if (dates.length > 52) {
                    if (!window.confirm(`This will create ${dates.length} events. Continue?`)) {
                        return;
                    }
                }

                // Create all events
                const promises = dates.map(date => {
                    // Preserve the time from the original dateObj
                    const eventDate = new Date(date);
                    eventDate.setHours(dateObj.getHours(), dateObj.getMinutes(), 0, 0);

                    return addDoc(collection(db, 'events'), {
                        ...eventData,
                        date: Timestamp.fromDate(eventDate)
                    });
                });

                await Promise.all(promises);
                alert(`Successfully created ${dates.length} recurring events!`);

                // Reset recurring options
                setIsRecurring(false);
                setRecurringOptions({ frequency: 'weekly', endDate: '' });
            } else {
                // ADD single event
                await addDoc(collection(db, 'events'), eventData);
                alert("Event added successfully!");
            }

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
            console.error("Error saving event:", error);
            alert("Failed to save event");
        }
    };

    const handleEdit = (event) => {
        setEditingId(event.id);

        // Convert Firestore Timestamp to date/time strings for form inputs
        const dateObj = event.date.toDate();
        const dateStr = dateObj.toISOString().split('T')[0];

        setFormData({
            title: event.title,
            date: dateStr,
            startTime: event.startTime || '',
            endTime: event.untilClose ? '' : (event.endTime || ''),
            untilClose: event.untilClose || false,
            description: event.description || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            title: '',
            date: '',
            startTime: '',
            endTime: '',
            untilClose: false,
            description: ''
        });
        setIsRecurring(false);
        setRecurringOptions({ frequency: 'weekly', endDate: '' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this event? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, 'events', id));
            await fetchEvents();
            alert("Event deleted successfully.");
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event: " + error.message);
        }
    };

    return (
        <div className="manage-container container">
            <div className="manage-header">
                <h1>Manage Events</h1>
                <Link to="/dashboard" className="btn btn-outline-dark">Back to Dashboard</Link>
            </div>

            <div className="manage-grid">
                <div className="form-section">
                    <h2>{editingId ? 'Edit Event' : 'Add New Event'}</h2>
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
                                <label>{isRecurring ? 'Start Date' : 'Date'}</label>
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

                        {/* Recurring event options - only show when creating new events */}
                        {!editingId && (
                            <div style={{
                                background: isRecurring ? '#f8f9fa' : 'transparent',
                                padding: isRecurring ? '1rem' : '0',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                border: isRecurring ? '1px solid #dee2e6' : 'none'
                            }}>
                                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: isRecurring ? '1rem' : 0 }}>
                                    <input
                                        type="checkbox"
                                        checked={isRecurring}
                                        onChange={(e) => setIsRecurring(e.target.checked)}
                                        style={{ margin: 0 }}
                                    />
                                    <span style={{ marginLeft: '0.5rem', fontWeight: '500' }}>Recurring Event</span>
                                </label>

                                {isRecurring && (
                                    <>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Repeat</label>
                                                <select
                                                    value={recurringOptions.frequency}
                                                    onChange={(e) => setRecurringOptions({ ...recurringOptions, frequency: e.target.value })}
                                                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                                >
                                                    <option value="weekly">Weekly</option>
                                                    <option value="biweekly">Every 2 Weeks</option>
                                                    <option value="monthly">Monthly</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Until Date</label>
                                                <input
                                                    type="date"
                                                    value={recurringOptions.endDate}
                                                    onChange={(e) => setRecurringOptions({ ...recurringOptions, endDate: e.target.value })}
                                                    min={formData.date}
                                                    required={isRecurring}
                                                />
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
                                            This will create individual events that can be edited or deleted separately.
                                        </p>
                                    </>
                                )}
                            </div>
                        )}

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
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '1rem' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.untilClose}
                                    onChange={(e) => setFormData({ ...formData, untilClose: e.target.checked })}
                                    style={{ margin: 0 }}
                                />
                                <span style={{ marginLeft: '0.5rem' }}>Until Close</span>
                            </label>
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
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update Event' : (isRecurring ? 'Create Recurring Events' : 'Add Event')}
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
                    <h2>Existing Events</h2>
                    {loading ? <p>Loading...</p> : (
                        <ul className="manage-list">
                            {events.map(event => (
                                <li key={event.id} className="manage-item">
                                    <div className="item-info">
                                        <h3>{event.title}</h3>
                                        <p>{new Date(event.date.seconds * 1000).toLocaleDateString()}</p>
                                        <p className="item-meta">
                                            {event.startTime} - {event.endTime}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="btn btn-outline-dark"
                                            disabled={editingId && editingId !== event.id}
                                            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(event.id)} className="btn-delete">Delete</button>
                                    </div>
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
