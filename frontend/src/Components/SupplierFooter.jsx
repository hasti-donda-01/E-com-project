import { Link } from 'react-router-dom'
import footerlogo from './Images/footerlogo.svg'
export default function SupplierFooter() {
    const footerLinks = ['Sell Online', 'Pricing & Commission', 'How it works', 'Shipping & Returns', 'Grow Your Business', 'Learning Hub', 'Meesho Ads', 'Shop Online on Meesho']

    return (
        <div>
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <img src={footerlogo} alt="Meesho" className="footer-logo" />
                            <p className="footer-tagline">
                                Sell your products to crores of customers on Meesho at 0% commission
                            </p>
                            <Link to="/StartSelling" className="footer-cta">Start Selling</Link>
                        </div>

                        <div className="footer-col">
                            <h3 className="footer-heading">Sell on Meesho</h3>
                            <ul className="footer-links">
                                {footerLinks.map((l) => (
                                    <li key={l}><a href="/">{l}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h3 className="footer-heading">Contact Us</h3>
                            <a href="mailto:sell@meesho.com" className="footer-mail">sell@meesho.com</a>
                            <div className="footer-social">
                                <a href="/" aria-label="Instagram">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden="true">
                                        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                                        <circle cx="12" cy="12" r="4" />
                                        <circle cx="17" cy="7" r="0.8" fill="#fff" />
                                    </svg>
                                </a>
                                <a href="/" aria-label="Facebook">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff" aria-hidden="true">
                                        <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.7V13h2.7v8z" />
                                    </svg>
                                </a>
                                <a href="/" aria-label="YouTube">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff" aria-hidden="true">
                                        <path d="M21 8.2a2.5 2.5 0 0 0-1.8-1.8C17.7 6 12 6 12 6s-5.700 0-7.200.4A2.500 2.500 0 0 0 3 8.200C2.600 9.700 2.600 12 2.600 12s0 2.300.4 3.800a2.500 2.500 0 0 0 1.800 1.800C6.300 18 12 18 12 18s5.700 0 7.200-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.500.4-3.800.4-3.800s0-2.300-.4-3.800zM10.200 14.600V9.400l4.400 2.600z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        © 2015-22 Meesho Inc. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
