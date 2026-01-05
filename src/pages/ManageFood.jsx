import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import './ManagePages.css';

const ManageFood = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Entrees',
        description: ''
    });

    const categories = ['Entrees', 'Appetizers', 'Soup & Salads', 'Hand Holds & Burgers', 'Combos', 'Sides', 'Beverages'];

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

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'menu_items'), {
                ...formData,
                price: Number(formData.price) // Ensure price is number
            });
            setFormData({ ...formData, name: '', price: '', description: '' }); // Keep category
            fetchItems();
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Failed to add item");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this menu item?")) {
            try {
                await deleteDoc(doc(db, 'menu_items', id));
                fetchItems();
            } catch (error) {
                console.error("Error deleting item:", error);
            }
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
                    <h2>Add Menu Item</h2>
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
                        <div className="form-row">
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Add Item</button>
                    </form>
                </div>

                <div className="list-section">
                    <h2>Current Menu</h2>
                    {loading ? <p>Loading...</p> : (
                        <ul className="manage-list">
                            {items.map(item => (
                                <li key={item.id} className="manage-item">
                                    <div className="item-info">
                                        <h3>{item.name} (${item.price})</h3>
                                        <p className="item-meta">{item.category}</p>
                                    </div>
                                    <button onClick={() => handleDelete(item.id)} className="btn-delete">Delete</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageFood;
