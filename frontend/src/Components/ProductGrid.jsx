import { useEffect, useState } from 'react';
import gold from './Images/gold.jpg';
import lehangas from './Images/lehangas.jpg';
import jewellery from './Images/jewellery.jpg';
import mensweargold from './Images/mensweargold.jpg';
import saress from './Images/saress.jpg';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

export default function ProductGrid() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        const loadCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/category/get`, {
                    signal: controller.signal
                });
                const payload = await response.json();
                if (!response.ok || payload.success === false || !Array.isArray(payload.data)) {
                    throw new Error(payload.message || `Could not load categories (${response.status}).`);
                }
                setCategories(payload.data.filter((category) => category.isActive !== false));
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setCategoryError(error.message || 'Could not load categories.');
                }
            } finally {
                if (!controller.signal.aborted) setLoadingCategories(false);
            }
        };
        loadCategories();
        return () => controller.abort();
    }, []);

    let golditems = [
        {image: lehangas, name: 'Lehangas'},
        {image: mensweargold, name: 'Menswear'},
        {image: saress, name: 'Sarees'},
        {image: jewellery, name: 'jewellery'},
    ]
    return (
        <>
            <section className="gold">
                <img src={gold} alt="" />
                <div className="gold-button">
                    <a href="">Shop Now</a>
                </div>
                <div className="gold-imgs">
                    <a href="">
                        <div className="gold-item">
                       { golditems.map((x, i) => {
                            return <img src={x.image} alt={x.name} key={i} />;
                        })}
                        </div>
                    </a>
                </div>
            </section>
            <section className="grid-container">
                {loadingCategories ? (
                    <p role="status">Loading categories…</p>
                ) : categoryError ? (
                    <p role="alert">{categoryError}</p>
                ) : categories.length === 0 ? (
                    <p>No categories are available yet.</p>
                ) : (
                    <div className="grid-items">
                        {categories.map((category) => (
                            <button
                                className="grid-category-button"
                                key={category._id}
                                type="button"
                                onClick={() => {
                                    navigate(`/?category=${encodeURIComponent(category._id)}#products-catalog`);
                                    document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <div className="grid-item">
                                    {category.category_Image && (
                                        <img src={category.category_Image} alt={category.category_name} />
                                    )}
                                    <div className="grid-item-name">{category.category_name}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}