import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import BookingModal from '../../components/BookingModal';
import './Rentals.css';

const Rentals = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const q = query(collection(db, 'rooms'), orderBy('order', 'asc'));
                const snapshot = await getDocs(q);
                setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div className="branch-content">
            <h2>Room Rentals</h2>
            <p>We have beautiful rooms available for weddings, parties, meetings, and special events.</p>

            {loading ? (
                <p>Loading available rooms...</p>
            ) : rooms.length === 0 ? (
                <div className="contact-cta">
                    <p>For rates and availability, please contact us directly.</p>
                    <Link to="/contact" className="btn btn-primary">Inquire Now</Link>
                </div>
            ) : (
                <>
                    <div className="rooms-grid">
                        {rooms.map(room => (
                            <div key={room.id} className="room-card">
                                {room.imageUrl ? (
                                    <div className="room-image">
                                        <img src={room.imageUrl} alt={room.name} />
                                    </div>
                                ) : (
                                    <div className="room-image-placeholder">
                                        <span>{room.name.charAt(0)}</span>
                                    </div>
                                )}
                                <div className="room-content">
                                    <h3>{room.name}</h3>
                                    <p className="room-description">{room.description}</p>
                                    <p className="room-cost">{room.cost}</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setSelectedRoom(room)}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="contact-cta">
                        <p>Have questions? Feel free to reach out directly.</p>
                        <Link to="/contact" className="btn btn-outline-dark">Contact Us</Link>
                    </div>
                </>
            )}

            {selectedRoom && (
                <BookingModal
                    room={selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                />
            )}
        </div>
    );
};

export default Rentals;
