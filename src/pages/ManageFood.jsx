import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import './ManagePages.css';

const ManageFood = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        smallPrice: '',
        largePrice: '',
        category: 'Entrees',
        description: '',
        glutenFree: false
    });
    const [categoryNotes, setCategoryNotes] = useState({});
    const [weeklySpecials, setWeeklySpecials] = useState([]);
    const [specialsEnabled, setSpecialsEnabled] = useState(false);
    const [specialForm, setSpecialForm] = useState({ name: '', description: '', price: '' });
    const [editingSpecialId, setEditingSpecialId] = useState(null);

    const categories = ['Entrees', 'Appetizers', 'Soup & Salads', 'Hand Helds & Burgers', 'Combos', 'Sides', 'Beverages'];

    const fetchItems = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'menu_items'));
            setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching menu:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryNotes = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'category_notes'));
            const notes = {};
            snapshot.docs.forEach(doc => {
                notes[doc.id] = doc.data().note || '';
            });
            setCategoryNotes(notes);
        } catch (error) {
            console.error("Error fetching category notes:", error);
        }
    };

    const fetchWeeklySpecials = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'weekly_specials'));
            setWeeklySpecials(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));

            // Fetch settings
            const settingsDoc = await getDoc(doc(db, 'menu_settings', 'weekly_specials'));
            if (settingsDoc.exists()) {
                setSpecialsEnabled(settingsDoc.data().enabled || false);
            }
        } catch (error) {
            console.error("Error fetching weekly specials:", error);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchCategoryNotes();
        fetchWeeklySpecials();
    }, []);

    const handleSaveCategoryNote = async (category) => {
        try {
            await setDoc(doc(db, 'category_notes', category), {
                note: categoryNotes[category] || ''
            });
            alert(`Note for "${category}" saved!`);
        } catch (error) {
            console.error("Error saving category note:", error);
            alert("Failed to save note");
        }
    };

    const handleToggleSpecials = async () => {
        try {
            const newValue = !specialsEnabled;
            await setDoc(doc(db, 'menu_settings', 'weekly_specials'), { enabled: newValue });
            setSpecialsEnabled(newValue);
        } catch (error) {
            console.error("Error toggling specials:", error);
            alert("Failed to update setting");
        }
    };

    const handleAddSpecial = async (e) => {
        e.preventDefault();
        try {
            const specialData = {
                name: specialForm.name,
                description: specialForm.description,
                price: specialForm.price ? Number(specialForm.price) : null
            };

            if (editingSpecialId) {
                await updateDoc(doc(db, 'weekly_specials', editingSpecialId), specialData);
                setEditingSpecialId(null);
                alert("Special updated!");
            } else {
                await addDoc(collection(db, 'weekly_specials'), specialData);
                alert("Special added!");
            }

            setSpecialForm({ name: '', description: '', price: '' });
            fetchWeeklySpecials();
        } catch (error) {
            console.error("Error saving special:", error);
            alert("Failed to save special");
        }
    };

    const handleEditSpecial = (special) => {
        setEditingSpecialId(special.id);
        setSpecialForm({
            name: special.name,
            description: special.description || '',
            price: special.price ? special.price.toString() : ''
        });
    };

    const handleCancelSpecialEdit = () => {
        setEditingSpecialId(null);
        setSpecialForm({ name: '', description: '', price: '' });
    };

    const handleDeleteSpecial = async (id) => {
        if (!window.confirm("Delete this special?")) return;
        try {
            await deleteDoc(doc(db, 'weekly_specials', id));
            fetchWeeklySpecials();
        } catch (error) {
            console.error("Error deleting special:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const itemData = {
                name: formData.name,
                category: formData.category,
                description: formData.description,
                price: formData.price ? Number(formData.price) : null,
                smallPrice: formData.smallPrice ? Number(formData.smallPrice) : null,
                largePrice: formData.largePrice ? Number(formData.largePrice) : null,
                glutenFree: formData.glutenFree
            };

            if (editingId) {
                await updateDoc(doc(db, 'menu_items', editingId), itemData);
                setEditingId(null);
                alert("Menu item updated successfully!");
            } else {
                await addDoc(collection(db, 'menu_items'), itemData);
                alert("Menu item added successfully!");
            }

            setFormData({ name: '', price: '', smallPrice: '', largePrice: '', category: 'Entrees', description: '', glutenFree: false });
            fetchItems();
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Failed to save item");
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
            name: item.name,
            price: item.price ? item.price.toString() : '',
            smallPrice: item.smallPrice ? item.smallPrice.toString() : '',
            largePrice: item.largePrice ? item.largePrice.toString() : '',
            category: item.category,
            description: item.description || '',
            glutenFree: item.glutenFree || false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', price: '', smallPrice: '', largePrice: '', category: 'Entrees', description: '', glutenFree: false });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this menu item? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, 'menu_items', id));
            await fetchItems();
            alert("Menu item deleted successfully.");
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item: " + error.message);
        }
    };

    return (
        <div className="manage-container container">
            <div className="manage-header">
                <h1>Manage Food Menu</h1>
                <Link to="/dashboard" className="btn btn-outline-dark">Back to Dashboard</Link>
            </div>

            <div className="manage-grid">
                <div className="form-section">
                    <h2>{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Item Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="Regular price"
                                />
                            </div>
                            <div className="form-group">
                                <label>Small ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.smallPrice}
                                    onChange={(e) => setFormData({ ...formData, smallPrice: e.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                            <div className="form-group">
                                <label>Large ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.largePrice}
                                    onChange={(e) => setFormData({ ...formData, largePrice: e.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                            Enter a regular price, or small/large sizes, or all three.
                        </p>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '1rem' }}>
                            <input
                                type="checkbox"
                                checked={formData.glutenFree}
                                onChange={(e) => setFormData({ ...formData, glutenFree: e.target.checked })}
                                style={{ margin: 0 }}
                            />
                            <span style={{ marginLeft: '0.5rem' }}>Gluten Free</span>
                        </label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update Item' : 'Add Item'}
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
                    <h2>Current Menu</h2>
                    {loading ? <p>Loading...</p> : (
                        <ul className="manage-list">
                            {items.map(item => {
                                const priceDisplay = [];
                                if (item.price) priceDisplay.push(`$${item.price.toFixed(2)}`);
                                if (item.smallPrice) priceDisplay.push(`Sm: $${item.smallPrice.toFixed(2)}`);
                                if (item.largePrice) priceDisplay.push(`Lg: $${item.largePrice.toFixed(2)}`);

                                return (
                                    <li key={item.id} className="manage-item">
                                        <div className="item-info">
                                            <h3>
                                                {item.name}
                                                {item.glutenFree && (
                                                    <span style={{
                                                        marginLeft: '0.5rem',
                                                        fontSize: '0.7rem',
                                                        background: '#22c55e',
                                                        color: 'white',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        fontWeight: 'bold',
                                                        verticalAlign: 'middle'
                                                    }}>GF</span>
                                                )}
                                            </h3>
                                            <p style={{ fontSize: '0.9rem', color: '#333', marginTop: '0.25rem' }}>
                                                {priceDisplay.join(' | ') || 'No price set'}
                                            </p>
                                            <p className="item-meta">{item.category}</p>
                                            {item.description && (
                                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="btn btn-outline-dark"
                                                disabled={editingId && editingId !== item.id}
                                                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="btn-delete">Delete</button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {/* Weekly Specials Section */}
            <div className="form-section" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Weekly Specials</h2>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={specialsEnabled}
                            onChange={handleToggleSpecials}
                            style={{ margin: 0 }}
                        />
                        <span style={{ marginLeft: '0.5rem', fontWeight: '500' }}>
                            {specialsEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </label>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                    Add weekly specials that appear at the top of the menu. Toggle to show/hide on the public page.
                </p>

                <div className="manage-grid" style={{ marginTop: '1rem' }}>
                    <div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                            {editingSpecialId ? 'Edit Special' : 'Add Special'}
                        </h3>
                        <form onSubmit={handleAddSpecial}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={specialForm.name}
                                    onChange={(e) => setSpecialForm({ ...specialForm, name: e.target.value })}
                                    placeholder="e.g., Fish & Chips Friday"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={specialForm.price}
                                    onChange={(e) => setSpecialForm({ ...specialForm, price: e.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows="2"
                                    value={specialForm.description}
                                    onChange={(e) => setSpecialForm({ ...specialForm, description: e.target.value })}
                                    placeholder="Optional details..."
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="submit" className="btn btn-primary">
                                    {editingSpecialId ? 'Update' : 'Add Special'}
                                </button>
                                {editingSpecialId && (
                                    <button type="button" onClick={handleCancelSpecialEdit} className="btn btn-outline-dark">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Current Specials</h3>
                        {weeklySpecials.length === 0 ? (
                            <p style={{ color: '#666' }}>No specials added yet.</p>
                        ) : (
                            <ul className="manage-list">
                                {weeklySpecials.map(special => (
                                    <li key={special.id} className="manage-item">
                                        <div className="item-info">
                                            <h3 style={{ fontSize: '1rem' }}>{special.name}</h3>
                                            {special.price && (
                                                <p style={{ color: '#333' }}>${special.price.toFixed(2)}</p>
                                            )}
                                            {special.description && (
                                                <p style={{ fontSize: '0.85rem', color: '#666' }}>{special.description}</p>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                            <button
                                                onClick={() => handleEditSpecial(special)}
                                                className="btn btn-outline-dark"
                                                style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSpecial(special.id)}
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

            {/* Category Notes Section */}
            <div className="form-section" style={{ marginTop: '2rem' }}>
                <h2>Category Notes</h2>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                    Add optional notes that appear under each category heading (e.g., "Add a side of fries for $5").
                </p>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {categories.map(category => (
                        <div key={category} style={{
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'flex-start',
                            padding: '1rem',
                            background: '#f8f9fa',
                            borderRadius: '8px'
                        }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                                    {category}
                                </label>
                                <input
                                    type="text"
                                    value={categoryNotes[category] || ''}
                                    onChange={(e) => setCategoryNotes({ ...categoryNotes, [category]: e.target.value })}
                                    placeholder="Optional note for this section..."
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleSaveCategoryNote(category)}
                                className="btn btn-primary"
                                style={{ marginTop: '1.5rem', padding: '0.5rem 1rem' }}
                            >
                                Save
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageFood;
