import { MdVerified } from "react-icons/md";
import { PiGreaterThanDuotone } from "react-icons/pi";
import personalcare from './Images/personalcare.jpg';
import electronics from './Images/electronics.jpg';
import books from './Images/books.jpg';
import makeup from './Images/makeup.jpg';
import manperfume from './Images/menperfume.jpg';
import bags from './Images/bags.jpg';
import footwearbrand from './Images/footwearbrand.jpg';
import trending from './productimages/trending.jpg'
import budget from './productimages/budget.jpg'
import daily from './productimages/daily.jpg'
import picks from './productimages/picks.jpg'

let brands = [
    { href: '/', image: personalcare, name: 'Personal Care' },
    { href: '/', image: electronics, name: 'Electronics' },
    { href: '/', image: makeup, name: 'Make up' },
    { href: '/', image: manperfume, name: 'Men Perfume' },
    { href: '/', image: bags, name: 'Bags' },
    { href: '/', image: footwearbrand, name: 'Footwear' },
    { href: '/', image: books, name: 'Books' },
];

const featuredBrands = [
    { name: 'WILD\nSTONE', className: 'wildstone' },
    { name: 'plum', className: 'plum' },
    { name: 'NIVEA', className: 'nivea' },
    { name: 'Himalaya', className: 'himalaya' },
    { name: 'mi', className: 'mi' },
    { name: 'Bata', className: 'bata' },
    { name: 'WOW', className: 'wow' },
    { name: 'WILD\nSTONE', className: 'wildstone' },
    { name: 'plum', className: 'plum' },
    { name: 'NIVEA', className: 'nivea' },
    { name: 'Himalaya', className: 'himalaya' },
    { name: 'mi', className: 'mi' },
    { name: 'Bata', className: 'bata' },
    { name: 'WOW', className: 'wow' },
];

const promoCards = [
    {
        title: 'Trending Now',
        image: trending,
    },
    {
        title: 'Budget Buys',
        image: budget
    },
    {
        title: 'Top Rated Picks',
        image: picks,
    },
    {
        title: 'Daily Essentials',
        image: daily,
    },
];

export default function Brand() {
    return (
        <section className="brand-container">
            <header className="brand-header">
                <div className="brand-header-title">
                    Original Brands <MdVerified aria-hidden="true" font-size="32px" color="#6625FF" />
                </div>
                <a href="/" className="brand-header-link">
                    View All <PiGreaterThanDuotone />
                </a>
            </header>
            <div className="brandSlider">
                {
                    brands.map((x, i) => {
                        return <a href={x.href} key={i} className="brandSlider-item">
                            <div className="brandcard">
                                <img src={x.image} alt={x.name} className="brandimg" />

                            </div>
                        </a>
                    })
                }
            </div>

            <div className="brand-logos-shell" aria-label="Featured brand logos">
                <div className="brand-marquee">
                    <div className="brand-marquee-track">
                        {featuredBrands.map((brand, index) => (
                            <div key={`${brand.className}-${index}`} className={`brand-logo-item ${brand.className}`}>
                                {brand.name.split('\n').map((line, lineIndex) => (
                                    <span key={`${brand.className}-${lineIndex}`}>{line}</span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <section className="promo-offer-section" aria-label="Shop offers">
                <div className="promo-offer-copy">
                    <p className="promo-offer-kicker">Up to</p>
                    <h2>35% OFF</h2>
                    <p className="promo-offer-subtitle">on first order</p>
                    <p className="promo-offer-note">*Only on App</p>
                    <button type="button" className="promo-download-btn">Download Now</button>
                </div>

                <div className="promo-offer-cards">
                    {promoCards.map((card) => (
                        <div key={card.title} className="promo-card">
                            <img src={card.image} alt={card.title} />
                            <div className="promo-card-label">{card.title}</div>
                        </div>
                    ))}
                </div>
            </section>
        </section>
    )
}
