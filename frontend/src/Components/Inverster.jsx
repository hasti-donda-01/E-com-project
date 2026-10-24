import React, { useState } from 'react'
import mlogo from './Images/mlogo.svg'

const MAROON = '#570d48'
const PINK = '#9f2089'

const NAV_ITEMS = [
    { label: 'Home', href: '/investor-relations' },
    { label: 'Financials', href: '/investor-relations/financials' },
    { label: 'Governance', href: '/investor-relations/governance' },
    { label: 'Announcements', href: '/investor-relations/announcements' },
    { label: 'Resources', href: '/investor-relations/resources' },
]

/* Meesho app-style logo: maroon rounded square, orange "m", small white "meesho" */
const MeeshoMark = () => (
    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" aria-hidden="true">
        <rect width="58" height="58" rx="9" fill={MAROON} />
        <path
            d="M13 36V25.5c0-4.2 2.6-7 6.2-7 2.6 0 4.3 1.3 5.3 3.2 1-1.9 2.7-3.2 5.3-3.2 3.7 0 6.2 2.8 6.2 7V36"
            stroke="#f9a11b"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(2.5 0)"
        />
        <text x="29" y="48" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#fff" fontFamily="inherit">
            meesho
        </text>
    </svg>
)

export default function Inverster() {
    const [active, setActive] = useState('Home')
    const [hovered, setHovered] = useState('')

    return (
        <header style={{ width: '100%', background: '#fff', borderBottom: '1px solid #e5e5e5', fontFamily: 'inherit' }}>
            <div
                style={{
                    maxWidth: 1186, margin: '0 auto',marginLeft:320, height: 110, padding: '0 20px', boxSizing: 'border-box',
                    display: 'flex', alignItems: 'center', gap:100
                }}
            >
                {/* Left: logo + title */}
                <a
                    href="/investor-relations"
                    style={{ display: 'flex', alignItems: 'center', gap: 15, textDecoration: 'none' }}
                >
                    <img src={mlogo} alt="" style={{width:"50px"}}/>
                    <span style={{ fontSize: 24, fontWeight: 600, lineHeight: '30px', color: '#1a1a1a', width: 110 }}>
                        Investor Relations
                    </span>
                </a>

                {/* Right: nav links */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: 39 }}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = active === item.label
                        const isHover = hovered === item.label
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setActive(item.label)}
                                onMouseEnter={() => setHovered(item.label)}
                                onMouseLeave={() => setHovered('')}
                                style={{
                                    position: 'relative', fontSize: 17, textDecoration: 'none',
                                    color: isActive || isHover ? PINK : '#1a1a1a',
                                    paddingBottom: 6, transition: 'color 0.2s'
                                }}
                            >
                                {item.label}
                                <span
                                    style={{
                                        position: 'absolute', left: 0, right: 0, bottom: 0, height: 2,
                                        background: PINK, transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                                        transformOrigin: 'left', transition: 'transform 0.2s'
                                    }}
                                />
                            </a>
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}