import React from 'react';
import athenic from './Images/athenic.jpg';
import menswear from './Images/menswear.jpg';
import western from './Images/western.jpg';
import footwear from './Images/footwear.jpg';
import beauty from './Images/beauty.jpg';
import decor from './Images/decor.jpg';
import grocery from './Images/grocery.jpg';
import accessories from './Images/accesorries.jpg';
import gold from './Images/gold.jpg';
import lehangas from './Images/lehangas.jpg';
import jewellery from './Images/jewellery.jpg';
import mensweargold from './Images/mensweargold.jpg';
import saress from './Images/saress.jpg';
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
        </>
    );
}