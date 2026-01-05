import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs, query, orderBy, writeBatch } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { Link } from 'react-router-dom';
import './ManagePages.css';

const compressAndConvertToBase64 = (file, maxWidth = 400, maxHeight = 400, quality = 0.7) => {
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

const ManageExecutive = () => {
    const [executives, setExecutives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
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
            let imageUrl = currentImageUrl;

            // If new image selected, compress and convert to Base64
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
                // UPDATE existing executive
                await updateDoc(doc(db, 'executives', editingId), {
                    ...formData,
                    order: Number(formData.order),
                    imageUrl
                });

                // Reset edit mode
                setEditingId(null);
                setCurrentImageUrl(null);
                alert("Executive updated successfully!");
            } else {
                // ADD new executive
                await addDoc(collection(db, 'executives'), {
                    ...formData,
                    order: Number(formData.order),
                    imageUrl
                });
                alert("Executive added successfully!");
            }

            setFormData({ name: '', role: 'Executive', responsibility: '', order: executives.length + 1 });
            setImageFile(null);
            setImagePreview(null);
            fetchExecutives();
        } catch (error) {
            console.error("Error saving executive:", error);
            alert("Failed to save executive: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this executive member? This action cannot be undone.")) return;

        try {
            // Get the executive data to check for legacy images
            const executive = executives.find(e => e.id === id);

            // Delete legacy image from storage if it exists (starts with https)
            if (executive?.imageUrl && executive.imageUrl.startsWith('https://')) {
                try {
                    const imageRef = ref(storage, executive.imageUrl);
                    await deleteObject(imageRef).catch(err => {
                        console.warn("Storage deletion failed (likely already deleted or CORS):", err);
                    });
                } catch (error) {
                    console.warn("Could not create storage ref for deletion:", error);
                }
            }

            // Always delete the Firestore document
            await deleteDoc(doc(db, 'executives', id));

            // Refresh list and notify user
            await fetchExecutives();
            alert("Executive member deleted successfully.");
        } catch (error) {
            console.error("Error deleting executive:", error);
            alert("Failed to delete executive: " + error.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image must be less than 2MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEdit = (exec) => {
        setEditingId(exec.id);
        setFormData({
            name: exec.name,
            role: exec.role,
            responsibility: exec.responsibility || '',
            order: exec.order
        });
        setCurrentImageUrl(exec.imageUrl || null);
        setImagePreview(exec.imageUrl || null);
        setImageFile(null);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setCurrentImageUrl(null);
        setFormData({ name: '', role: 'Executive', responsibility: '', order: executives.length + 1 });
        setImageFile(null);
        setImagePreview(null);
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
                    <h2>{editingId ? 'Edit Executive' : 'Add Executive'}</h2>
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
                        <div className="form-group">
                            <label>Profile Picture (Optional)</label>
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
                                            width: '150px',
                                            height: '150px',
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
                                {editingId ? 'Update Member' : 'Add Member'}
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
                                    {exec.imageUrl && (
                                        <img
                                            src={exec.imageUrl}
                                            alt={exec.name}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                                marginRight: '1rem'
                                            }}
                                        />
                                    )}
                                    <div className="item-info">
                                        <h3>{exec.name}</h3>
                                        <p style={{ fontWeight: 'bold', color: 'var(--color-poppy-red)' }}>{exec.role}</p>
                                        {exec.responsibility && <p className="item-meta">Focus: {exec.responsibility}</p>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEdit(exec)}
                                            className="btn btn-outline-dark"
                                            disabled={editingId && editingId !== exec.id}
                                            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exec.id)}
                                            className="btn-delete"
                                        >
                                            Delete
                                        </button>
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

export default ManageExecutive;
