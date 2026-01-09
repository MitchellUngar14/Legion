import React from 'react';
import './BookingModal.css';

const BookingModal = ({ room, onClose }) => {
    if (!room) return null;

    const contactEmail = 'rcl560@kingston.net';
    const emailSubject = encodeURIComponent(`Room Rental Inquiry: ${room.name}`);
    const emailBody = encodeURIComponent(
        `Hello,\n\nI am interested in renting the ${room.name} at Legion Branch 560.\n\nRoom: ${room.name}\nListed Price: ${room.cost}\n\nPlease provide more information about availability and booking.\n\nThank you.`
    );
    const emailLink = `mailto:${contactEmail}?subject=${emailSubject}&body=${emailBody}`;

    const handleBackdropClick = (e) => {
        if (e.target.className === 'modal-backdrop') {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>

                {room.imageUrl && (
                    <div className="modal-image">
                        <img src={room.imageUrl} alt={room.name} />
                    </div>
                )}

                <h2>Book {room.name}</h2>

                <div className="modal-room-info">
                    <p className="modal-description">{room.description}</p>
                    <p className="modal-cost">{room.cost}</p>
                </div>

                <div className="modal-contact">
                    <p>To inquire about availability or make a reservation, please contact us:</p>

                    <a href={emailLink} className="btn btn-primary modal-email-btn">
                        Send Email Inquiry
                    </a>

                    <p className="modal-phone">
                        Or call us at: <a href="tel:6135484570">(613) 548-4570</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
