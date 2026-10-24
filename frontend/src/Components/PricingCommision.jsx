import React, { useState } from 'react'
import meeshoLogo from './Images/meeshoLogo.svg'
import commision from './Images/commision.jpg'

/* 👇 import your real images and put them here (transparent PNG/WebP work best) */
// import zeroCommission from './Images/zeroCommission.png'
// import shippingImg from './Images/shipping.png'
// import returnPolicyImg from './Images/returnPolicy.png'
// import cancellationImg from './Images/cancellation.png'
// import rtoImg from './Images/rto.png'


const PINK = '#f43397'
const INDIGO = '#3d1fc4'
const FONT = "'Poppins', sans-serif"
const WRAP = { maxWidth: 1140, margin: '0 auto', boxSizing: 'border-box' }

/* ================= NAVBAR ================= */
const NAV_LINKS = [
    { label: 'Sell Online', href: '#' },
    { label: 'How it works', href: '#' },
    { label: 'Pricing & Commission', href: '#', active: true },
    { label: 'Shipping & Returns', href: '#' },
    { label: 'Grow Business', href: '#' },
    { label: 'Don’t have GST?', href: '#' },
]

function Navbar() {
    const [hover, setHover] = useState('')
    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid #ececec', fontFamily: FONT }}>
            <div style={{ ...WRAP, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a href="/"><img src={meeshoLogo} alt="Meesho" style={{ width: 100, display: 'block' }} /></a>
                <nav style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                    {NAV_LINKS.map((l) => (
                        <a
                            key={l.label} href={l.href}
                            onMouseEnter={() => setHover(l.label)} onMouseLeave={() => setHover('')}
                            style={{ fontSize: 13, textDecoration: 'none', color: l.active || hover === l.label ? PINK : '#222', transition: 'color .2s' }}
                        >
                            {l.label}
                        </a>
                    ))}
                    <a href="/SupplierLogin" style={{ padding: '9px 26px', border: `1px solid ${INDIGO}`, borderRadius: 3, color: INDIGO, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Login</a>
                    <a href="/supplier-signup" style={{ padding: '10px 20px', background: INDIGO, borderRadius: 3, color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Start Selling</a>
                </nav>
            </div>
        </header>
    )
}

/* ================= ICONS ================= */
const NoFeeIcon = () => (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="17" stroke="#7a5af0" strokeWidth="3" />
        <path d="M14 38L38 14" stroke={PINK} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M19 22h14M19 30h14" stroke={PINK} strokeWidth="3" strokeLinecap="round" />
    </svg>
)
const HandCoinIcon = () => (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="15" r="9" fill={PINK} />
        <text x="26" y="19.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">₹</text>
        <path d="M6 38c4-2 8-4 12-2l8 3h8c3 0 3 4 0 4h-8M6 34v12h4" stroke="#7a5af0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 42l14-5c3-1 5 2 3 4l-9 6H18" stroke="#7a5af0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
const NoPenaltyIcon = () => (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path d="M13 6h18l8 8v28a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z" fill={PINK} />
        <path d="M31 6v8h8z" fill="#c9b8f5" />
        <rect x="16" y="22" width="14" height="3" rx="1.5" fill="#fff" />
        <rect x="16" y="29" width="10" height="3" rx="1.5" fill="#fff" />
        <circle cx="38" cy="38" r="8" fill="#7a5af0" stroke="#fff" strokeWidth="2.5" />
        <path d="M34.5 41.5l7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
)
const CalendarIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="5" y="8" width="38" height="34" rx="4" fill="#7a5af0" />
        <rect x="5" y="8" width="38" height="9" rx="4" fill={PINK} />
        <rect x="12" y="3" width="4" height="9" rx="2" fill="#4b2fd0" />
        <rect x="32" y="3" width="4" height="9" rx="2" fill="#4b2fd0" />
        {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
            <rect key={`${r}${c}`} x={10 + c * 8} y={21 + r * 7} width="5" height="4" rx="1" fill={(r + c) % 2 ? '#fff' : '#ffd0e6'} />
        )))}
    </svg>
)
const ShieldIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 4l16 6v12c0 10-7 17-16 22C15 39 8 32 8 22V10z" fill="#7a5af0" />
        <path d="M24 9l11 4v9c0 7-5 12-11 16-6-4-11-9-11-16v-9z" fill={PINK} />
        <path d="M18 24l4 4 8-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

/* ================= SMALL HELPERS ================= */
const PromoCard = ({ icon, title, text }) => (
    <div style={{ flex: 1, height: 234, boxSizing: 'border-box', padding: '34px 24px 0', border: '1px solid #f0e8ef', borderRadius: 14, background: '#fff', boxShadow: '0 2px 10px rgba(244,51,151,.06)', textAlign: 'center' }}>
        {icon}
        <div style={{ marginTop: 14, fontSize: 15, fontWeight: 600, color: '#111' }}>{title}</div>
        <p style={{ margin: '12px 0 0', fontSize: 12.5, lineHeight: '20px', color: '#555' }}>{text}</p>
    </div>
)

/* image or placeholder circle */
const Art = ({ src, alt }) => (
    <div style={{ position: 'relative', width: 280, height: 280, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: '70px 0 0 0', borderRadius: '50%', background: '#f4f5f7' }} />
        {src ? (
            <img src={src} alt={alt} style={{ position: 'absolute', left: '50%', bottom: 0, height: 270, transform: 'translateX(-50%)' }} />
        ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#aaa' }}>{alt}</div>
        )}
    </div>
)

const FactRow = ({ title, children, img, alt, flip }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: flip ? 'row-reverse' : 'row', gap: 30, marginBottom: 30 }}>
        <div style={{ width: 500 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111' }}>{title}</h3>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: PINK, marginTop: 9, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 14, lineHeight: '23px', color: '#333' }}>{children}</p>
            </div>
        </div>
        <Art src={img} alt={alt} />
    </div>
)

/* ================= FOOTER ================= */
const FOOTER_LINKS = ['Sell Online', 'Pricing & Commission', 'How it works', 'Shipping & Returns', 'Grow Your Business', 'Learning Hub', 'Meesho Ads', 'Shop Online on Meesho']

function Footer() {
    const colTitle = { margin: '0 0 22px', fontSize: 14, fontWeight: 600, color: '#111' }
    return (
        <footer style={{ background: '#f6f6f6', marginTop: 24, fontFamily: FONT }}>
            <div style={{ ...WRAP, padding: '56px 0 40px' }}>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: 460 }}>
                        <img src={meeshoLogo} alt="Meesho" style={{ width: 230, display: 'block' }} />
                        <p style={{ margin: '14px 0 22px', fontSize: 12, lineHeight: '18px', color: '#555', maxWidth: 260 }}>Sell your products to crores of customers on Meesho at 0% commission</p>
                        <a href="/supplier-signup" style={{ display: 'inline-block', padding: '11px 22px', background: INDIGO, borderRadius: 3, color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Start Selling</a>
                    </div>
                    <div style={{ width: 330 }}>
                        <h4 style={colTitle}>Sell on Meesho</h4>
                        {FOOTER_LINKS.map((l) => (
                            <a key={l} href="#" style={{ display: 'block', marginBottom: 14, fontSize: 13, color: '#555', textDecoration: 'none' }}>{l}</a>
                        ))}
                    </div>
                    <div>
                        <h4 style={colTitle}>Contact Us</h4>
                        <a href="mailto:sell@meesho.com" style={{ fontSize: 13, color: '#555', textDecoration: 'none' }}>sell@meesho.com</a>
                        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                            {['YT', 'f', 'IG'].map((s) => (
                                <span key={s} style={{ width: 24, height: 24, borderRadius: 4, background: '#fb9fc9', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #dcdcdc', margin: '34px 0 18px' }} />
                <div style={{ fontSize: 12, color: '#555' }}>© 2015-22 Meesho Inc. All Rights Reserved.</div>
            </div>
        </footer>
    )
}

/* ================= PAGE ================= */
export default function PricingCommision() {
    const [mobile, setMobile] = useState('')
    const [focused, setFocused] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!/^[6-9]\d{9}$/.test(mobile)) return
        // TODO: navigate to your signup page, e.g. navigate('/supplier-signup', { state: { mobile } })
        console.log('Start selling with', mobile)
    }

    return (
        <div style={{ fontFamily: FONT, background: '#fff' }}>
            <Navbar />

            {/* ---------- Hero ---------- */}
            <section style={{ position: 'relative', overflow: 'hidden', background: '#f6f7f9', height: 450 }}>
                {/* pink curve (right side) */}
                <div style={{ position: 'absolute', top: -20, right: -520, width: 1100, height: 900, borderRadius: '50%', background: '#f8d9e8' }} />

                <div style={{ ...WRAP, position: 'relative', height: '100%' }}>
                    <div style={{ position: 'absolute', top: 100, left: 0, width: 520 }}>
                        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 600, color: '#111' }}>Pricing &amp; Commission</h1>
                        <p style={{ margin: '20px 0 0', fontSize: 13, lineHeight: '22px', color: '#2b2b2b' }}>
                            Meesho charges <span style={{ color: PINK, fontWeight: 600 }}>0% Commission</span> rate across all categories, allowing sellers to retain their full earnings on every sale.
                        </p>
                        <p style={{ margin: '14px 0 0', fontSize: 12.5, lineHeight: '22px', color: '#2b2b2b' }}>
                            <span style={{ display: 'inline-block', background: PINK, color: '#fff', fontSize: 11, fontWeight: 600, padding: '0 10px', borderRadius: 3, marginRight: 10, lineHeight: '20px' }}>New!</span>
                            Don’t have a GSTIN or have a Composition GSTIN?<br />
                            You can still sell on Meesho. Click <a href="/non-gst-sellers" style={{ color: PINK, fontWeight: 600, textDecoration: 'none' }}>here</a> to know more.
                        </p>

                        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 2, display: 'flex', width: 405, height: 42, marginTop: 20, padding: 0, background: '#fff', border: `1px solid ${focused ? PINK : '#d9dbe3'}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 12px', minWidth: 0 }}>
                                <span style={{ fontSize: 12, color: '#2b2b2b', marginRight: 10 }}>+91</span>
                                <input
                                    type="tel" inputMode="numeric" maxLength={10} placeholder="Enter Your Mobile Number"
                                    value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                                    style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: 0, height: '100%', padding: 0, border: 'none', outline: 'none', background: 'transparent', color: '#111', fontSize: 12, fontFamily: 'inherit', cursor: 'text', pointerEvents: 'auto' }}
                                />
                            </div>
                            <button type="submit" style={{ width: 104, border: 'none', background: PINK, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Start Selling</button>
                        </form>
                    </div>

                    <div style={{ position: 'absolute', right: 0, bottom: 0, width: 500, height: 380 }}>
                    
                            <img src={commision} alt="0% Commission" style={{ position: 'absolute', right: 0, bottom: 0, height: 380 }} />
                       
                    </div>
                </div>
            </section>

            {/* ---------- No fee cards ---------- */}
            <section style={{ padding: '14px 0 20px', background: '#fff' }}>
                <div style={{ ...WRAP, display: 'flex', gap: 22 }}>
                    <PromoCard icon={<NoFeeIcon />} title="No Registration Fee" text="Registering as a Meesho seller is free - no cost of creating your account or getting your products listed." />
                    <PromoCard icon={<HandCoinIcon />} title="No Collection Fee" text="You keep 100% of the sale price with no charges on both payment gateway or cash on delivery orders on Meesho." />
                    <PromoCard icon={<NoPenaltyIcon />} title="No Penalty" text="Sell on Meesho stress-free without the fear of penalties for order cancellations." />
                </div>
            </section>

            {/* ---------- Payment cycle ---------- */}
            <section style={{ background: '#f6f7f9', height: 393, marginTop: 14 }}>
                <div style={{ ...WRAP, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', padding: '0 4px' }}>
                    <div style={{ width: 470, alignSelf: 'flex-start', paddingTop: 76 }}>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111' }}>Payment Cycle</h2>
                        <p style={{ margin: '18px 0 0', fontSize: 13, lineHeight: '24px', color: '#333' }}>
                            The settlement amount is securely deposited directly into your bank account following a 7-day payment cycle from order delivery, including cash on delivery orders. You can view your deposited balance and the upcoming payments on the Meesho supplier Panel.
                        </p>
                    </div>

                    <div style={{ width: 552, height: 240, boxSizing: 'border-box', background: '#fff', border: '1px solid #ece8f0', borderRadius: 6, display: 'flex', alignItems: 'center', alignSelf: 'flex-start', marginTop: 76 }}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <CalendarIcon />
                            <div style={{ marginTop: 18, fontSize: 13, fontWeight: 600, color: '#111' }}>7 -day payment cycle</div>
                        </div>
                        <div style={{ width: 1, height: 100, background: '#e5e5e5' }} />
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <ShieldIcon />
                            <div style={{ marginTop: 18, fontSize: 13, fontWeight: 600, lineHeight: '20px', color: '#111' }}>Secured payment<br />in your account</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- Quick facts ---------- */}
            <section style={{ padding: '70px 0 30px', background: '#fff' }}>
                <h2 style={{ margin: '0 0 46px', textAlign: 'center', fontSize: 20, fontWeight: 600, color: '#111' }}>Quick Facts on Shipping &amp; Delivery</h2>

                <div style={{ maxWidth: 880, margin: '0 auto' }}>
                  
                </div>
            </section>

            {/* ---------- CTA band ---------- */}
            <section style={{ background: '#f4f5f7', marginTop: 20 }}>
                <div style={{ ...WRAP, display: 'flex', padding: '60px 24px 62px' }}>
                    <h3 style={{ margin: 0, width: 440, flexShrink: 0, fontSize: 22, fontWeight: 600, lineHeight: '30px', color: '#111' }}>
                        Sell Products Online at 0%<br />Commission on Meesho
                    </h3>
                    <div style={{ maxWidth: 560 }}>
                        <p style={{ margin: 0, fontSize: 14, lineHeight: '24px', color: '#333' }}>
                            Join the fastest growing e-commerce platform in India and sell to crores of users and grow your business.
                        </p>
                        <a href="/supplier-signup" style={{ display: 'inline-block', marginTop: 26, padding: '12px 26px', background: INDIGO, borderRadius: 3, color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                            Start Selling
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}