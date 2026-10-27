// Main footer for customer-facing store pages
import { FiFacebook, FiInstagram, FiLinkedin, FiMail, FiPhone, FiYoutube } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import footerLogo from './Images/footerlogo.svg';

// Popular product categories
const categoryLinks = [
    'Women Fashion',
    'Men Fashion',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Electronics',
    'Mobile & Accessories',
    'Toys & Games',
    'Sports & Fitness',
    'Books & Stationery',
    'More Categories'
];

// Customer care and policy links
const serviceLinks = [
    'Help Centre',
    'Track Order',
    'Return & Refund',
    'Shipping Policy',
    'Cancellation Policy',
    'Terms of Use',
    'Privacy Policy',
    'Grievance Redressal',
    'Contact Us'
];

// Seller onboarding and portal links
const supplierLinks = [
    { label: 'Supplier Login', to: '/SupplierLogin' },
    { label: 'Become a Supplier', to: '/Becomesupplier' },
    { label: 'Supplier Help', to: '/HowitWorks' },
    { label: 'Partner With Us', to: '/Becomesupplier' }
];

// About Meesho company links
const aboutLinks = [
    'About Us',
    'Careers',
    'Press',
    'Blog',
    'Investor Relations',
    'Sustainability'
];

// Helper to render unordered list of links
function FooterLinkList({ links }) {
    return (
        <ul className="customer-footer-links">
            {links.map((link) => (
                <li key={link}>
                    <a href="/">{link}</a>
                </li>
            ))}
        </ul>
    );
}

// Main customer footer component
export default function CustomerFooter() {
    return (
        <footer className="customer-footer">
            <div className="customer-footer-main">
                <section className="customer-footer-brand">
                    <Link to="/" aria-label="Meesho home">
                        <img className="customer-footer-logo" src={footerLogo} alt="Meesho" />
                    </Link>
                    <h2>India&apos;s No.1 Reselling App</h2>
                    <p>
                        Trusted by millions of small businesses and resellers across India.
                        Start your online business with Meesho.
                    </p>
                    <h3>Download the Meesho App</h3>
                    <div className="customer-footer-apps">
                        <a href="https://play.google.com/store" target="_blank" rel="noreferrer">
                            <span aria-hidden="true">▶</span>
                            <span><small>GET IT ON</small>Google Play</span>
                        </a>
                        <a href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer">
                            <span aria-hidden="true">●</span>
                            <span><small>Download on the</small>App Store</span>
                        </a>
                    </div>
                    <h3 className="customer-footer-social-title">Follow Us</h3>
                    <div className="customer-footer-socials">
                        <a href="https://www.facebook.com/" aria-label="Facebook"><FiFacebook /></a>
                        <a href="https://www.instagram.com/" aria-label="Instagram"><FiInstagram /></a>
                        <a href="https://www.youtube.com/" aria-label="YouTube"><FiYoutube /></a>
                        <a href="https://www.linkedin.com/" aria-label="LinkedIn"><FiLinkedin /></a>
                    </div>
                </section>

                <section className="customer-footer-column">
                    <h2>Shop by Category</h2>
                    <FooterLinkList links={categoryLinks} />
                </section>

                <section className="customer-footer-column">
                    <h2>Customer Service</h2>
                    <FooterLinkList links={serviceLinks} />
                </section>

                <section className="customer-footer-column customer-footer-about">
                    <h2>Be a Supplier</h2>
                    <ul className="customer-footer-links">
                        {supplierLinks.map(({ label, to }) => (
                            <li key={label}><Link to={to}>{label}</Link></li>
                        ))}
                    </ul>
                    <h2 className="customer-footer-subheading">About Meesho</h2>
                    <FooterLinkList links={aboutLinks} />
                </section>

                <section className="customer-footer-column customer-footer-contact">
                    <h2>Subscribe to our Newsletter</h2>
                    <p>Get the latest updates, offers and more directly in your inbox.</p>
                    <form className="customer-footer-newsletter" onSubmit={(event) => event.preventDefault()}>
                        <label className="visually-hidden" htmlFor="customer-footer-email">Email address</label>
                        <input id="customer-footer-email" type="email" placeholder="Enter your email address" />
                        <button type="submit" disabled title="Newsletter signup is not available yet">Subscribe</button>
                    </form>
                    <h2 className="customer-footer-subheading">For any queries</h2>
                    <div className="customer-footer-contact-item">
                        <span className="customer-footer-contact-icon"><FiPhone /></span>
                        <p><strong>Call us: 1800 123 4567</strong><br />(9 AM - 9 PM, Mon - Sat)</p>
                    </div>
                    <div className="customer-footer-contact-item">
                        <span className="customer-footer-contact-icon"><FiMail /></span>
                        <p>Email us:<br /><a href="mailto:support@meesho.com">support@meesho.com</a></p>
                    </div>
                </section>
            </div>

            <div className="customer-footer-bottom">
                <p>© 2026 Meesho. All rights reserved.</p>
                <nav aria-label="Legal links">
                    <a href="/">Terms of Use</a>
                    <a href="/">Privacy Policy</a>
                    <a href="/">Sitemap</a>
                </nav>
                <div className="customer-footer-payments" aria-label="Secure payment methods">
                    <strong><span aria-hidden="true">◆</span> Secure Payments</strong>
                    <span className="payment-upi">UPI</span>
                    <span className="payment-visa">VISA</span>
                    <span className="payment-mastercard" aria-label="Mastercard"><i /><i /></span>
                    <span className="payment-rupay">RuPay</span>
                </div>
            </div>
        </footer>
    );
}
