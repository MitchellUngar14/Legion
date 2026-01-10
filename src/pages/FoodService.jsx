import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import './FoodService.css';

const FoodService = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categoryNotes, setCategoryNotes] = useState({});
    const [weeklySpecials, setWeeklySpecials] = useState([]);
    const [specialsEnabled, setSpecialsEnabled] = useState(false);
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
                setMenuItems(items);

                // Fetch category notes
                const notesSnapshot = await getDocs(collection(db, 'category_notes'));
                const notes = {};
                notesSnapshot.docs.forEach(doc => {
                    notes[doc.id] = doc.data().note || '';
                });
                setCategoryNotes(notes);

                // Fetch weekly specials
                const specialsSnapshot = await getDocs(collection(db, 'weekly_specials'));
                setWeeklySpecials(specialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Check if specials are enabled
                const settingsDoc = await getDoc(doc(db, 'menu_settings', 'weekly_specials'));
                if (settingsDoc.exists()) {
                    setSpecialsEnabled(settingsDoc.data().enabled || false);
                }
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
                <h1>Cove Catering</h1>
                <p>Welcome Mel and Cove Catering to the Limestone City Branch 560! Enjoy our favorites: fish and chips, wings, burgers, poutine, salads and more.</p>
            </header>

            {/* Weekly Specials Section */}
            {specialsEnabled && weeklySpecials.length > 0 && (
                <div className="weekly-specials-section">
                    <h2>Weekly Specials</h2>
                    <div className="specials-grid">
                        {weeklySpecials.map(special => (
                            <div key={special.id} className="special-item">
                                <div className="special-header">
                                    <h3>{special.name}</h3>
                                    {special.price && (
                                        <span className="special-price">${special.price.toFixed(2)}</span>
                                    )}
                                </div>
                                {special.description && (
                                    <p className="special-description">{special.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {menuItems.length === 0 ? (
                <p className="no-menu">Menu is currently being updated.</p>
            ) : (
                <div className="menu-container">
                    {categories.map(category => (
                        <div key={category} className="menu-category">
                            <h2>{category}</h2>
                            {categoryNotes[category] && (
                                <p className="category-note">{categoryNotes[category]}</p>
                            )}
                            <div className="menu-items-grid">
                                {menuItems
                                    .filter(item => item.category === category)
                                    .map(item => {
                                        const hasSizes = item.smallPrice || item.largePrice;
                                        return (
                                            <div key={item.id} className="menu-item-wrapper">
                                                <div className="menu-item-header">
                                                    <h3>
                                                        {item.name}
                                                        {item.glutenFree && (
                                                            <span className="gf-badge" title="Gluten Free">GF</span>
                                                        )}
                                                    </h3>
                                                    <span className="menu-dots"></span>
                                                    {hasSizes ? (
                                                        <span className="price">
                                                            {item.smallPrice && `Sm $${Number(item.smallPrice).toFixed(2)}`}
                                                            {item.smallPrice && item.largePrice && ' / '}
                                                            {item.largePrice && `Lg $${Number(item.largePrice).toFixed(2)}`}
                                                        </span>
                                                    ) : (
                                                        <span className="price">
                                                            {item.price ? `$${Number(item.price).toFixed(2)}` : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && <p className="description">{item.description}</p>}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="catering-info">
                <div className="catering-hours">
                    <h3>Hours of Operation</h3>
                    <p><strong>Tuesday - Saturday:</strong> 12:00 PM - 7:00 PM</p>
                    <p><strong>Sunday - Monday:</strong> Closed</p>
                </div>
                <div className="catering-contact">
                    <h3>Book Your Event</h3>
                    <p>Let Cove Catering make your next event special!</p>
                    <p>
                        <a href="mailto:covecatering2024@gmail.com">covecatering2024@gmail.com</a>
                    </p>
                    <p>
                        <a href="tel:613-449-2997">613-449-2997</a>
                    </p>
                    <p>
                        <a href="https://www.facebook.com/thecovegrill/" target="_blank" rel="noopener noreferrer">Follow us on Facebook</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FoodService;
