import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import Calendar from 'react-calendar';
import { format, isSameDay, parseISO } from 'date-fns';
import { Printer, X } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import './Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsRef = collection(db, 'events');
                const q = query(eventsRef, orderBy('date', 'asc'));
                const querySnapshot = await getDocs(q);
                const eventsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore Timestamp to JS Date
                    const date = data.date ? new Date(data.date.seconds * 1000) : new Date();
                    return {
                        id: doc.id,
                        ...data,
                        jsDate: date
                    };
                });
                setEvents(eventsList);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const onDateChange = (date) => {
        setSelectedDate(date);
        // Check if the selected date has events
        const hasEvents = events.some(event => isSameDay(event.jsDate, date));
        if (hasEvents) {
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showModal) {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [showModal]);

    // Filter events for the selected date
    const selectedEvents = events.filter(event =>
        isSameDay(event.jsDate, selectedDate)
    );

    // Helper to check if a date has any events (for calendar tile)
    const hasEvent = (date) => {
        return events.some(event => isSameDay(event.jsDate, date));
    };

    if (loading) {
        return <div className="loading-container">Loading calendar...</div>;
    }

    const formatTimeRange = (event) => {
        if (!event.startTime) return format(event.jsDate, 'h:mm a');

        // Convert 24h start time string to 12h format
        const [startH, startM] = event.startTime.split(':');
        const startDate = new Date();
        startDate.setHours(startH, startM);
        const formattedStart = format(startDate, 'h:mm a');

        if (event.untilClose) {
            return `${formattedStart} - Close`;
        }

        if (event.endTime) {
            const [endH, endM] = event.endTime.split(':');
            const endDate = new Date();
            endDate.setHours(endH, endM);
            const formattedEnd = format(endDate, 'h:mm a');
            return `${formattedStart} - ${formattedEnd}`;
        }

        return formattedStart;
    };

    // Custom content for calendar tiles
    const getTileContent = ({ date, view }) => {
        if (view !== 'month') return null;
        const dayEvents = events.filter(event => isSameDay(event.jsDate, date));

        if (dayEvents.length === 0) return null;

        return (
            <div className="tile-events">
                {dayEvents.map(event => (
                    <div key={event.id} className="tile-event-item">
                        <span className="tile-time">
                            {event.startTime ? formatTimeRange(event).split(' - ')[0] : format(event.jsDate, 'h:mm a')}
                        </span>
                        <span className="tile-title">{event.title}</span>
                    </div>
                ))}
            </div>
        );
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="events-page container">
            <header className="events-header">
                <h1>Events Calendar</h1>
                <p>Join us for upcoming activities at the Branch.</p>
                <button onClick={handlePrint} className="print-button" aria-label="Print Calendar">
                    <Printer size={20} />
                    <span>Print Calendar</span>
                </button>
            </header>

            <div className="calendar-container">
                <div className="calendar-wrapper">
                    <Calendar
                        onChange={onDateChange}
                        value={selectedDate}
                        tileClassName={({ date, view }) =>
                            view === 'month' && hasEvent(date) ? 'has-event' : null
                        }
                        tileContent={getTileContent}
                    />
                </div>
            </div>

            {/* Modal for event details */}
            {showModal && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Events for {format(selectedDate, 'MMMM do, yyyy')}</h2>
                            <button
                                className="modal-close-btn"
                                onClick={closeModal}
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {selectedEvents.length === 0 ? (
                                <div className="no-events-selected">
                                    <p>No events scheduled for this day.</p>
                                </div>
                            ) : (
                                <div className="events-list">
                                    {selectedEvents.map(event => (
                                        <div key={event.id} className="event-card">
                                            <div className="event-time-badge">
                                                {formatTimeRange(event)}
                                            </div>
                                            <div className="event-info">
                                                <h3>{event.title}</h3>
                                                <p>{event.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
