import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import mlogo from './Images/mlogo.svg';

const navItems = [
    { label: 'Home', href: '/investor-relations' },
    { label: 'Financials', href: '/investor-relations/financials' },
    { label: 'Governance', href: '/investor-relations/governance' },
    { label: 'Announcements', href: '/investor-relations/announcements' },
    { label: 'Resources', href: '/investor-relations/resources' }
];

export default function InvestorHeader() {
    const [hovered, setHovered] = useState('');
    const location = useLocation();
    const path = location.pathname.toLowerCase();
    const active = path.includes('financials')
        ? 'Financials'
        : path.includes('governance')
            ? 'Governance'
            : path.includes('announcements')
                ? 'Announcements'
                : path.includes('resources')
                    ? 'Resources'
                    : 'Home';

    return (
        <header className="investor-header">
            <div className="investor-header-inner">
                <a className="investor-brand" href="/investor-relations">
                    <img src={mlogo} alt="" />
                    <span>Investor Relations</span>
                </a>
                <nav className="investor-nav" aria-label="Investor relations">
                    {navItems.map((item) => {
                        const selected = active === item.label;
                        const highlighted = selected || hovered === item.label;
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                aria-current={selected ? 'page' : undefined}
                                onMouseEnter={() => setHovered(item.label)}
                                onMouseLeave={() => setHovered('')}
                                className={highlighted ? 'is-highlighted' : ''}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
