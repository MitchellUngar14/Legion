import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import './ManagePages.css';

const compressAndConvertToBase64 = (file, maxWidth = 800, maxHeight = 1000, quality = 0.8) => {
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

const ManageEventPosters = () => {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        order: 1
    });

    const fetchPosters = async () => {
        try {
            const q = query(collection(db, 'event_posters'), orderBy('order', 'asc'));
            const snapshot = await getDocs(q);
            setPosters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching posters:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosters();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile && !currentImageUrl) {
            alert("Please select an image to upload.");
            return;
        }

        setUploading(true);
        try {
            let imageUrl = currentImageUrl;

            if (imageFile) {
                try {
                    imageUrl = await compressAndConvertToBase64(imageFile);
                } catch (convError) {
                    console.error("Image conversion error:", convError);
                    alert("Failed to process image. Please try another one.");
                    setUploading(false);
                    return;
                }
            }

            if (editingId) {
                await updateDoc(doc(db, 'event_posters', editingId), {
                    title: formData.title,
                    order: Number(formData.order),
                    imageUrl
                });
                setEditingId(null);
                setCurrentImageUrl(null);
                alert("Poster updated successfully!");
            } else {
                await addDoc(collection(db, 'event_posters'), {
                    title: formData.title,
                    order: Number(formData.order) || posters.length + 1,
                    imageUrl
                });
                alert("Poster added successfully!");
            }

            setFormData({ title: '', order: posters.length + 2 });
            setImageFile(null);
            setImagePreview(null);
            fetchPosters();
        } catch (error) {
            console.error("Error saving poster:", error);
            alert("Failed to save poster: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this event poster? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, 'event_posters', id));
            await fetchPosters();
            alert("Poster deleted successfully.");
        } catch (error) {
            console.error("Error deleting poster:", error);
            alert("Failed to delete poster: " + error.message);
        }
    };

    const handleEdit = (poster) => {
        setEditingId(poster.id);
        setFormData({
            title: poster.title || '',
            order: poster.order || 1
        });
        setCurrentImageUrl(poster.imageUrl || null);
        setImagePreview(poster.imageUrl || null);
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setCurrentImageUrl(null);
        setFormData({ title: '', order: posters.length + 1 });
        setImageFile(null);
        setImagePreview(null);
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

    return (
        <div className="manage-container container">
            <div className="manage-header">
                <h1>Manage Event Posters</h1>
                <Link to="/dashboard" className="btn btn-outline-dark">Back to Dashboard</Link>
            </div>

            <p style={{ marginBottom: '2rem', color: '#666' }}>
                Upload promotional images for upcoming events. These will display below the calendar on the Events page.
            </p>

            <div className="manage-grid">
                <div className="form-section">
                    <h2>{editingId ? 'Edit Poster' : 'Add Poster'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Event Poster Image *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required={!editingId && !currentImageUrl}
                            />
                            {imagePreview && (
                                <div style={{ marginTop: '1rem' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            maxWidth: '300px',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            border: '2px solid var(--color-gray-200)'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Title (for reference)</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Dart Tournament Poster"
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
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={uploading}>
                                {uploading ? 'Uploading...' : (editingId ? 'Update Poster' : 'Add Poster')}
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
                    <h2>Current Posters</h2>
                    {loading ? <p>Loading...</p> : (
                        posters.length === 0 ? (
                            <p style={{ color: '#666' }}>No event posters yet. Add one using the form.</p>
                        ) : (
                            <div className="poster-grid">
                                {posters.map(poster => (
                                    <div key={poster.id} className="poster-item">
                                        <img
                                            src={poster.imageUrl}
                                            alt={poster.title || 'Event poster'}
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '6px'
                                            }}
                                        />
                                        <div className="poster-info">
                                            <p style={{ fontWeight: 'bold', margin: '0.5rem 0 0.25rem' }}>
                                                {poster.title || 'Untitled'}
                                            </p>
                                            <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
                                                Order: {poster.order}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(poster)}
                                                className="btn btn-outline-dark"
                                                disabled={editingId && editingId !== poster.id}
                                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', flex: 1 }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(poster.id)}
                                                className="btn-delete"
                                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>

            <style>{`
                .poster-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1rem;
                }
                .poster-item {
                    background: #f9f9f9;
                    padding: 0.75rem;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
};

export default ManageEventPosters;
