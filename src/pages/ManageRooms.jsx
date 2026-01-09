import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import './ManagePages.css';

const compressAndConvertToBase64 = (file, maxWidth = 800, maxHeight = 600, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

const ManageRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cost: '',
        order: 0
    });

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

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = currentImageUrl;

            if (imageFile) {
                try {
                    imageUrl = await compressAndConvertToBase64(imageFile);
                } catch (convError) {
                    console.error("Image conversion error:", convError);
                    alert("Failed to process image. Please try another one.");
                    return;
                }
            }

            if (editingId) {
                await updateDoc(doc(db, 'rooms', editingId), {
                    name: formData.name,
                    description: formData.description,
                    cost: formData.cost,
                    order: Number(formData.order),
                    imageUrl
                });
                setEditingId(null);
                setCurrentImageUrl(null);
                alert("Room updated successfully!");
            } else {
                await addDoc(collection(db, 'rooms'), {
                    name: formData.name,
                    description: formData.description,
                    cost: formData.cost,
                    order: Number(formData.order) || rooms.length + 1,
                    imageUrl
                });
                alert("Room added successfully!");
            }

            setFormData({ name: '', description: '', cost: '', order: rooms.length + 1 });
            setImageFile(null);
            setImagePreview(null);
            fetchRooms();
        } catch (error) {
            console.error("Error saving room:", error);
            alert("Failed to save room: " + error.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this room? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, 'rooms', id));
            await fetchRooms();
            alert("Room deleted successfully.");
        } catch (error) {
            console.error("Error deleting room:", error);
            alert("Failed to delete room: " + error.message);
        }
    };

    const handleEdit = (room) => {
        setEditingId(room.id);
        setFormData({
            name: room.name,
            description: room.description,
            cost: room.cost,
            order: room.order || 0
        });
        setCurrentImageUrl(room.imageUrl || null);
        setImagePreview(room.imageUrl || null);
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setCurrentImageUrl(null);
        setFormData({ name: '', description: '', cost: '', order: rooms.length + 1 });
        setImageFile(null);
        setImagePreview(null);
    };

    return (
        <div className="manage-container container">
            <div className="manage-header">
                <h1>Manage Rooms</h1>
                <Link to="/dashboard" className="btn btn-outline-dark">Back to Dashboard</Link>
            </div>

            <div className="manage-grid">
                <div className="form-section">
                    <h2>{editingId ? 'Edit Room' : 'Add Room'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Room Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Main Hall, Meeting Room A"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the room, capacity, amenities..."
                                required
                            ></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Cost / Pricing Info</label>
                                <input
                                    type="text"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    placeholder="e.g., $200/hour or Starting at $500"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Display Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                    min="1"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Room Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <div style={{ marginTop: '1rem' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            maxWidth: '300px',
                                            height: '180px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '2px solid var(--color-gray-200)'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update Room' : 'Add Room'}
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
                    <h2>Available Rooms</h2>
                    {loading ? <p>Loading...</p> : (
                        rooms.length === 0 ? (
                            <p style={{ color: '#666' }}>No rooms yet. Add one using the form.</p>
                        ) : (
                            <ul className="manage-list">
                                {rooms.map(room => (
                                    <li key={room.id} className="manage-item">
                                        {room.imageUrl && (
                                            <img
                                                src={room.imageUrl}
                                                alt={room.name}
                                                style={{
                                                    width: '100px',
                                                    height: '70px',
                                                    objectFit: 'cover',
                                                    borderRadius: '6px',
                                                    marginRight: '1rem',
                                                    flexShrink: 0
                                                }}
                                            />
                                        )}
                                        <div className="item-info">
                                            <h3>{room.name}</h3>
                                            <p style={{
                                                color: '#555',
                                                marginTop: '0.25rem',
                                                whiteSpace: 'pre-wrap',
                                                maxHeight: '60px',
                                                overflow: 'hidden'
                                            }}>
                                                {room.description}
                                            </p>
                                            <p className="item-meta" style={{ color: 'var(--color-poppy-red)', fontWeight: 'bold' }}>
                                                {room.cost}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                            <button
                                                onClick={() => handleEdit(room)}
                                                className="btn btn-outline-dark"
                                                disabled={editingId && editingId !== room.id}
                                                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(room.id)}
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

export default ManageRooms;
