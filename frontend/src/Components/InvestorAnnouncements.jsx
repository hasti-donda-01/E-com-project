// Investor relations announcements and press releases page
import { useMemo, useState } from 'react';
import InvestorFooter from './InvestorFooter';
import InvestorHeader from './InvestorHeader';

// Corporate filings and regulatory intimations
const corporateAnnouncements = [
    {
        date: '23 October, 2026',
        title: 'Intimation of Investors’ Analysts Conference Call'
    },
    {
        date: '22 October, 2026',
        title: 'Intimation w.r.t allotment of equity shares pursuant to exercise of ESOP'
    },
    {
        date: '15 October, 2026',
        title: 'Intimation under Regulation 30 of the SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015'
    },
    {
        date: '13 October, 2026',
        title: 'Intimation w.r.t Board Meeting for considering and approving the unaudited financial results for the quarter and half year ended September 30, 2026'
    }
];

// Press releases and company news
const pressReleases = [
    {
        date: '14 October, 2026',
        title: 'West Bengal Gets Pujo-Ready on Meesho: Sindoor Orders Nearly Triple, Pandal-Hopping Essentials Surge'
    },
    {
        date: '02 October, 2026',
        title: 'Bharat Shops for Navratri: Dandiya Orders Double, Puja Demand Jumps ~70%'
    },
    {
        date: '17 September, 2026',
        title: 'Meesho’s Mega Blockbuster Sale Opens with ~75% YoY Growth in Day 1 Orders'
    },
    {
        date: '04 September, 2026',
        title: 'Meesho Content Commerce NVM Grows 152% YoY, Powered by Bharat’s Homemakers and Young Graduates'
    },
    {
        date: '11 September, 2026',
        title: 'Ganesh Chaturthi 2026: Karnataka Among Meesho’s Largest Festive Markets as Seller Participation Grows ~26%'
    },
    {
        date: '11 September, 2026',
        title: 'Ganesh Chaturthi 2026: Maharashtra Among Meesho’s Largest Festive Markets as Seller Participation Grows ~26%'
    },
    {
        date: '27 August, 2026',
        title: 'Ethereal Celebrates Rakhi 2026: Meesho Sees 3X Order Growth as Non-Metro India and Small Sellers Power the Festival'
    },
    {
        date: '20 August, 2026',
        title: 'Building AI for Bharat: Meesho’s First Annual Report as a Listed Company Details Its Technology Serving 264 Million Users'
    },
    {
        date: '11 June, 2026',
        title: 'Meesho Acquires Kiran Club to Expand Digital Commerce Access for India’s 13 Million Kiranas'
    },
    {
        date: '4 June, 2026',
        title: 'Meesho’s NPS Brings Intent-Driven Discovery to 264 Million Indians'
    },
    {
        date: '2 June, 2026',
        title: 'Meesho Partners with BSE to Accelerate SME IPO Readiness for MSMEs in India'
    },
    {
        date: '30 May, 2026',
        title: 'Google Cloud Partner and Meesho to Build a High-Performance Foundation for Next Phase of Growth'
    },
    {
        date: '28 May, 2026',
        title: 'Meesho Launches “Vaani - Your Meesho Bot”, India’s First Gen-AI Powered Conversational Voice Shopping Assistant'
    }
];

// Filterable list helper for announcements
function AnnouncementList({ items, query }) {
    const filteredItems = items.filter((item) =>
        `${item.date} ${item.title}`.toLowerCase().includes(query.trim().toLowerCase())
    );

    if (filteredItems.length === 0) {
        return <p className="announcement-empty-state">No announcements match your search.</p>;
    }

    return (
        <ul className="announcement-list">
            {filteredItems.map((item) => (
                <li key={`${item.date}-${item.title}`}>
                    <time>{item.date}</time>
                    <p>{item.title}</p>
                </li>
            ))}
        </ul>
    );
}

// Announcements and press release directory
export default function InvestorAnnouncements() {
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('2026');
    const [activeSection, setActiveSection] = useState('corporate-announcements');
    const years = useMemo(
        () => [...new Set(pressReleases.map(({ date }) => date.slice(-4)))].sort((a, b) => b.localeCompare(a)),
        []
    );
    const yearFilteredPressReleases = pressReleases.filter(({ date }) => date.endsWith(year));

    return (
        <div className="investor-page">
            <InvestorHeader />
            <main className="investor-announcements-page">
                <h1>Announcements</h1>
                <nav className="announcement-tabs" aria-label="Announcement categories">
                    <a
                        href="#corporate-announcements"
                        className={activeSection === 'corporate-announcements' ? 'is-active' : ''}
                        aria-current={activeSection === 'corporate-announcements' ? 'location' : undefined}
                        onClick={() => setActiveSection('corporate-announcements')}
                    >
                        Corporate Announcements
                    </a>
                    <a
                        href="#press-releases"
                        className={activeSection === 'press-releases' ? 'is-active' : ''}
                        aria-current={activeSection === 'press-releases' ? 'location' : undefined}
                        onClick={() => setActiveSection('press-releases')}
                    >
                        Press Releases
                    </a>
                </nav>

                <section id="corporate-announcements" className="announcement-section">
                    <h2>Corporate Announcements</h2>
                    <label className="announcement-search">
                        <span className="announcement-search-icon" aria-hidden="true">⌕</span>
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search Announcements"
                            aria-label="Search announcements"
                        />
                    </label>
                    <AnnouncementList items={corporateAnnouncements} query={query} />
                </section>

                <section id="press-releases" className="announcement-section press-release-section">
                    <div className="press-release-heading">
                        <h2>Press Releases</h2>
                        <label>
                            <span className="visually-hidden">Filter press releases by year</span>
                            <select value={year} onChange={(event) => setYear(event.target.value)}>
                                {years.map((availableYear) => (
                                    <option key={availableYear} value={availableYear}>{availableYear}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <AnnouncementList items={yearFilteredPressReleases} query={query} />
                </section>
            </main>
            <InvestorFooter />
        </div>
    );
}
