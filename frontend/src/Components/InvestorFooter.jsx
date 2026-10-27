// Footer for investor relations portal pages
import { Link } from 'react-router-dom';
import mlogo from './Images/mlogo.svg';

// Quick links for investor relations
const footerLinks = [
    { label: 'Home', to: '/investor-relations' },
    { label: 'Financials', to: '/investor-relations/financials' },
    { label: 'Governance', to: '/investor-relations/governance' },
    { label: 'Announcements', to: '/investor-relations/announcements' },
    { label: 'Resources', to: '/investor-relations/resources' }
];

// Footer layout component
export default function InvestorFooter() {
    return (
        <footer className="investor-footer">
            <div className="investor-footer-inner">
                <Link className="investor-footer-brand" to="/investor-relations" aria-label="Investor Relations home">
                    <img src={mlogo} alt="" />
                    <span>Investor<br />Relations</span>
                </Link>
                <nav className="investor-footer-nav" aria-label="Footer navigation">
                    {footerLinks.map((link) => (
                        <Link key={link.label} to={link.to}>{link.label}</Link>
                    ))}
                </nav>
                <div className="investor-footer-socials" aria-label="Meesho social media">
                    <a href="https://www.linkedin.com/company/meesho/" aria-label="LinkedIn">in</a>
                    <a href="https://www.youtube.com/" aria-label="YouTube">▶</a>
                    <a href="https://www.facebook.com/" aria-label="Facebook">f</a>
                </div>
                <p>© 2026 Meesho. All rights reserved.</p>
            </div>
        </footer>
    );
}
