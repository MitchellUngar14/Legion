import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import './FoodService.css';

const FoodService = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const menuRef = collection(db, 'menu_items');
                const querySnapshot = await getDocs(menuRef);
                const items = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Sort items so price is readable
                setMenuItems(items);
            } catch (error) {
                console.error("Error fetching menu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    // Helper to order categories logically if needed, otherwise uses insertion order
    // For now we'll just extract unique categories
    const categories = [...new Set(menuItems.map(item => item.category))];

    if (loading) {
        return <div className="loading-container">Loading menu...</div>;
    }

    return (
        <div className="food-page container">
            <header className="food-header">
                <h1>Capers Catering</h1>
                <p>Delicious homemade meals served at the Branch</p>
            </header>

            {menuItems.length === 0 ? (
                <p className="no-menu">Menu is currently being updated.</p>
            ) : (
                <div className="menu-container">
                    {categories.map(category => (
                        <div key={category} className="menu-category">
                            <h2>{category}</h2>
                            <div className="menu-items-grid">
                                {menuItems
                                    .filter(item => item.category === category)
                                    .map(item => (
                                        <div key={item.id} className="menu-item-wrapper">
                                            <div className="menu-item-header">
                                                <h3>{item.name}</h3>
                                                <span className="menu-dots"></span>
                                                <span className="price">${Number(item.price).toFixed(2)}</span>
                                            </div>
                                            {item.description && <p className="description">{item.description}</p>}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FoodService;
