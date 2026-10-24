import { MdVerified } from "react-icons/md";
import { PiGreaterThanDuotone, PiGreaterThanThin } from "react-icons/pi";
import personalcare from './Images/personalcare.jpg';
import electronics from './Images/electronics.jpg';
import books from './Images/books.jpg';
import makeup from './Images/makeup.jpg';
import manperfume from './Images/menperfume.jpg';
import bags from './Images/bags.jpg';
import footwearbrand from './Images/footwearbrand.jpg';

let brands = [
    { href: '/', image: personalcare, name: 'Personal Care' },
    { href: '/', image: electronics, name: 'Electronics' },
    { href: '/', image: makeup, name: 'Make up' },
    { href: '/', image: manperfume, name: 'Men Perfume' },
    { href: '/', image: bags, name: 'Bags' },
    { href: '/', image: footwearbrand, name: 'Footwear' },
    { href: '/', image: books, name: 'Books' },
]
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
        </section>
    )
}
