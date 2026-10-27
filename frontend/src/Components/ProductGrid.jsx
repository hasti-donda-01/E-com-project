// Hero banner section with festive collection and quick category links
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/action/productApi';
import gold from './Images/gold.jpg';
import lehangas from './Images/lehangas.jpg';
import jewellery from './Images/jewellery.jpg';
import mensweargold from './Images/mensweargold.jpg';
import saress from './Images/saress.jpg';
import { useNavigate } from 'react-router-dom';

export default function ProductGrid() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux categories state
    const { categories, categoriesStatus, categoriesError } = useSelector((state) => state.product);

    // Fetch categories using Redux action
    useEffect(() => {
        if (!categories || categories.length === 0) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories]);

    const loadingCategories = categoriesStatus === 'loading';
    const categoryError = categoriesError || '';


    // Festive wear categories shown on banner
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
                    <a href="#products-catalog">Shop Now</a>
                </div>
                <div className="gold-imgs">
                    <a href="#products-catalog" aria-label="Browse products">
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