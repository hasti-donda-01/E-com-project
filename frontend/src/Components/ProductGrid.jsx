import React from 'react';
import athenic from './Images/athenic.jpg';
import menswear from './Images/menswear.jpg';
import western from './Images/western.jpg';
import footwear from './Images/footwear.jpg';
import beauty from './Images/beauty.jpg';
import decor from './Images/decor.jpg';
import grocery from './Images/grocery.jpg';
import accessories from './Images/accesorries.jpg';

export default function ProductGrid() {
    const items = [
        { image: athenic, name: 'Ethnic Wear' },
        { image: western, name: 'Western Dresses' },
        { image: menswear, name: 'Menswear' },
        { image: footwear, name: 'Footwear' },
        { image: decor, name: 'Home Decor' },
        { image: beauty, name: 'Beauty' },
        { image: accessories, name: 'Accessories' },
        { image: grocery, name: 'Grocery' },
    ];

    return (
        <section className="grid-container">
            <div className="grid-items">
                {items.map((x, i) => (
                    <a href="/" key={i}>
                        <div className="grid-item">
                            <img src={x.image} alt={x.name} />
                            <div className="grid-item-name">{x.name}</div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}