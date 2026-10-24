import React, { useState, useEffect } from 'react'
import meeshoLogo from './Images/meeshoLogo.svg'
import Desktoppic2 from './Images/Desktoppic2.jpg'

/* 👇 import your real images and assign them here */
// import shippingHero from './Images/shippingHero.png'
// import returnImg from './Images/returnPolicy.png'
// import cancelImg from './Images/cancellation.png'
// import videoThumb from './Images/videoThumb.jpg'
const IMG = {
    hero: null,       // shippingHero
    returns: null,    // returnImg
    cancel: null,     // cancelImg
    video: null,      // videoThumb
}

const PINK = '#f43397'
const INDIGO = '#3d1fc4'
const FONT = "'Poppins', sans-serif"
const WRAP = { width: '100%', maxWidth: 1300, margin: '0 auto', paddingLeft: 24, paddingRight: 24, boxSizing: 'border-box' }

/* ================= NAVBAR ================= */
const NAV_LINKS = [
    { label: 'Sell Online', href: '#' },
    { label: 'How it works', href: '#' },
    { label: 'Pricing & Commission', href: '#' },
    { label: 'Shipping & Returns', href: '#', active: true },
    { label: 'Grow Business', href: '#' },
    { label: 'Don’t have GST?', href: '#' },
]

function Navbar() {
    const [hover, setHover] = useState('')
    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid #ececec', fontFamily: FONT }}>
            <div style={{ ...WRAP, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a href="/"><img src={meeshoLogo} alt="Meesho" style={{ width: 100, display: 'block' }} /></a>
                <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {NAV_LINKS.map((l) => (
                        <a
                            key={l.label} href={l.href}
                            onMouseEnter={() => setHover(l.label)} onMouseLeave={() => setHover('')}
                            style={{ fontSize: 14, textDecoration: 'none', color: l.active || hover === l.label ? PINK : '#222', transition: 'color .2s' }}
                        >
                            {l.label}
                        </a>
                    ))}
                    <a href="/SupplierLogin" style={{ padding: '10px 26px', border: `1px solid ${INDIGO}`, borderRadius: 3, color: INDIGO, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Login</a>
                    <a href="/supplier-signup" style={{ padding: '11px 20px', background: INDIGO, borderRadius: 3, color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Start Selling</a>
                </nav>
            </div>
        </header>
    )
}

/* ================= ICONS ================= */
const TruckIcon = () => (
    <svg width="56" height="46" viewBox="0 0 46 38" fill="none">
        <path d="M2 8h22v18H2z" fill={PINK} />
        <path d="M24 13h9l7 8v5H24z" fill="#7a5af0" />
        <circle cx="12" cy="29" r="5" fill="#4b2fd0" stroke="#fff" strokeWidth="2" />
        <circle cx="34" cy="29" r="5" fill="#4b2fd0" stroke="#fff" strokeWidth="2" />
        <path d="M0 12h8M2 17h6" stroke="#7a5af0" strokeWidth="2" strokeLinecap="round" />
    </svg>
)
const IndiaIcon = () => (
    <svg width="52" height="54" viewBox="0 0 44 44" fill="none">
        <path d="M14 4l10 3 8 8-4 6 6 8-10 4-4 10-6-12-8-6 4-8 4-6z" fill={PINK} />
        <circle cx="16" cy="18" r="4" fill="#fff" stroke="#7a5af0" strokeWidth="2" />
        <circle cx="26" cy="23" r="4" fill="#fff" stroke="#7a5af0" strokeWidth="2" />
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

/* ================= HELPERS ================= */
const SectionTitle = ({ children }) => (
    <h2
        style={{
            display: 'inline-block', margin: 0, fontSize: 26, fontWeight: 600, color: '#111',
            padding: '14px 44px 14px 18px', borderLeft: `4px solid ${PINK}`,
            background: 'linear-gradient(90deg, #fde3f0 0%, #fff 100%)'
        }}
    >
        {children}
    </h2>
)

const SubTitle = ({ children, id }) => (
    <h3
        id={id}
        style={{ margin: '40px 0 0', fontSize: 21, fontWeight: 600, color: '#111', borderLeft: '3px solid #5a4a00', paddingLeft: 14, scrollMarginTop: 96 }}
    >
        {children}
    </h3>
)

const P = ({ children, style }) => (
    <p style={{ margin: '18px 0 0', fontSize: 17, lineHeight: '28px', color: '#333', ...style }}>{children}</p>
)

const Dot = () => <span style={{ width: 7, height: 7, borderRadius: '50%', background: PINK, marginTop: 8, flexShrink: 0 }} />

const Art = ({ src, alt, size = 120 }) => (
    <div style={{ position: 'relative', width: size, height: size + 20, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: '20px 0 0 0', borderRadius: '50%', background: '#f4f5f7' }} />
        {src ? (
            <img src={src} alt={alt} style={{ position: 'absolute', left: '50%', bottom: 0, height: size + 10, transform: 'translateX(-50%)' }} />
        ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#aaa' }}>{alt}</div>
        )}
    </div>
)

/* ================= GUIDE ================= */
const SIDEBAR = [
    { id: 'shipping', label: 'Shipping & Delivery Charges', sub: [{ id: 'how', label: 'How shipping works' }, { id: 'timeline', label: 'Shipping timeline' }] },
    { id: 'returns', label: 'Return Policy' },
    { id: 'cancel', label: 'Cancellation Policy' },
]
const SECTION_IDS = ['shipping', 'returns', 'cancel']

const SHIP_STEPS = [
    { title: 'Manage and process your orders through Meesho Supplier Panel', text: 'Log on to the Meesho Supplier Panel and accept your order. Once done, you will have to download and print the label and Manifest.' },
    { title: 'Pack your product and keep it ready for pickup', text: 'Pack the product properly in plain packaging material with no branding. Meesho does not provide any packaging material. Please ensure that the product is properly packed and paste the label on the packaging.' },
    { title: 'Hand over the product to Meesho Delivery Partner', text: 'Our logistics partner will pick up the order from your pickup address and deliver it directly to the customer.' },
]

const RETURN_FEES = [
    'If a customer returns a product, then the seller is charged a return shipping fee based on the weight of the shipment.',
    'If an order is not delivered to a customer and gets converted to an RTO (return to origin), the seller will not be charged any additional fee for shipping.',
    'All return & RTO related charges can be tracked & managed using different tools that are provided to Meesho sellers.',
    'Please note that for some exceptional cases, the return shipping fees can be waived off.',
]

function Guide() {
    const [active, setActive] = useState('shipping')

    useEffect(() => {
        const onScroll = () => {
            let cur = SECTION_IDS[0]
            SECTION_IDS.forEach((id) => {
                const el = document.getElementById(id)
                if (el && el.getBoundingClientRect().top <= 160) cur = id
            })
            setActive(cur)
        }
        window.addEventListener('scroll', onScroll)
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    return (
        <section style={{ background: '#fff', padding: '42px 0 56px' }}>
            <div style={{ ...WRAP, display: 'flex', alignItems: 'flex-start' }}>
                {/* Sidebar */}
                <aside style={{ width: 220, flexShrink: 0, position: 'sticky', top: 90, paddingTop: 4 }}>
                    {SIDEBAR.map((t) => {
                        const isActive = active === t.id
                        return (
                            <div key={t.id}>
                                <div
                                    onClick={() => goTo(t.id)}
                                    style={{
                                        width: 210, cursor: 'pointer', fontSize: 16, lineHeight: '23px', padding: '12px 10px', marginTop: 14,
                                        borderLeft: `3px solid ${isActive ? PINK : 'transparent'}`,
                                        background: isActive ? 'linear-gradient(90deg, #fde3f0 0%, #fff 100%)' : 'transparent',
                                        color: isActive ? '#111' : '#777', whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t.label}
                                </div>
                                {t.sub && (
                                    <ul style={{ listStyle: 'none', margin: '6px 0 0 4px', padding: 0 }}>
                                        {t.sub.map((s, i) => (
                                            <li
                                                key={s.id} onClick={() => goTo(s.id)}
                                                style={{
                                                    fontSize: 14, lineHeight: '21px', color: '#777', padding: '9px 10px', cursor: 'pointer',
                                                    borderLeft: `2px solid ${active === 'shipping' && i === 0 ? INDIGO : '#e4e4e4'}`
                                                }}
                                            >
                                                {s.label}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )
                    })}
                </aside>

                {/* Content */}
                <div style={{ flex: 1 }} />
                <div style={{ position: 'absolute' }} />
            </div>

            {/* real content column, aligned like the screenshot */}
            <div style={{ ...WRAP, marginTop: -((SIDEBAR.length * 0)), position: 'relative' }}>
                <div style={{ marginLeft: 235 }}>
                    {/* 1. Shipping */}
                    <div id="shipping" style={{ scrollMarginTop: 96, paddingBottom: 56 }}>
                        <SectionTitle>Meesho Shipping &amp; Delivery Charges</SectionTitle>
                        <P style={{ marginTop: 14 }}>
                            Meesho offers cost-effective shipping across all online platforms in India. We have tied up with multiple Logistics Partners who pick up the product from your location and deliver it straight to the customer.
                        </P>
                        <P>
                            With affordable delivery charges, you can receive orders from all over India and focus more on selling your products online than handling the stress of shipping and logistics all by yourself.
                        </P>

                        <SubTitle id="how">How to Ship Your Orders in 3 simple steps</SubTitle>

                        <div style={{ marginTop: 20, background: '#f4f4f6', borderRadius: 6, padding: '28px 24px 30px', display: 'flex', gap: 24 }}>
                            {SHIP_STEPS.map((s, i) => (
                                <div key={s.title} style={{ flex: 1, position: 'relative' }}>
                                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: PINK, color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                                    {i < SHIP_STEPS.length - 1 && <span style={{ position: 'absolute', top: 6, left: 22, right: -4, height: 1, background: PINK }} />}
                                    <div style={{ marginTop: 14, fontSize: 16, fontWeight: 600, lineHeight: '23px', color: '#111' }}>{s.title}</div>
                                    <div style={{ marginTop: 10, fontSize: 15, lineHeight: '22px', color: '#555' }}>{s.text}</div>
                                </div>
                            ))}
                        </div>

                        <P style={{ marginTop: 14 }}>
                            Sit back and relax while Meesho delivers your products safely and quickly. Customers love it when their products are packed well and delivered on time, and a happy customer service means a higher number of returning customers and orders for you.
                        </P>

                        {/* video card */}
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
                            <div style={{ position: 'relative', width: 120, height: 74, background: '#9fd6dd', overflow: 'hidden' }}>
                                {IMG.video && <img src={IMG.video} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                <span style={{ position: 'absolute', left: 53, top: 27, width: 28, height: 28, borderRadius: '50%', background: PINK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="12" height="14" viewBox="0 0 6 7"><path d="M0 0l6 3.5L0 7z" fill="#fff" /></svg>
                                </span>
                            </div>
                            <div style={{ marginLeft: 16, width: 170, height: 64, background: '#e8ecff', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 13, fontWeight: 600, lineHeight: '18px', color: '#111', boxSizing: 'border-box' }}>
                                Ship Your Orders in 3 simple steps
                            </div>
                        </div>

                        <SubTitle id="timeline">Shipping Timeline</SubTitle>
                        <P>
                            The orders must be shipped within 2-3 days from the date of receiving the order within the agreed time provided by you (also known as service level agreement or SLA). You can check the status of your order and the days left for dispatch on the Meesho Supplier Panel.
                        </P>
                    </div>

                    {/* 2. Returns */}
                    <div id="returns" style={{ scrollMarginTop: 96, paddingBottom: 50 }}>
                        <SectionTitle>Meesho Return Policy</SectionTitle>
                        <P style={{ marginTop: 14 }}>
                            Customers can return the product within 7 days from the date of delivery and the shipments which weren’t delivered to the customer get converted to an RTO (return to Origin).
                        </P>
                        <P>
                            Meesho gives sellers all the information they need to manage their customer returns or RTOs (return to origin) along with details on compensation and charges levied for each return/RTO. We have comprehensive tools to help our sellers track and manage their returns, get order or product level data as well as detailed shipping tracking, payment and order history.
                        </P>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
                            <div style={{ width: '72%', marginLeft: 3 }}>
                                <h4 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111' }}>Return Shipping Fee</h4>
                                {RETURN_FEES.map((f) => (
                                    <div key={f} style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                                        <Dot />
                                        <span style={{ fontSize: 15, lineHeight: '23px', color: '#444' }}>{f}</span>
                                    </div>
                                ))}
                            </div>
                            <Art src={IMG.returns} alt="Return" size={190} />
                        </div>
                    </div>

                    {/* 3. Cancellation */}
                    <div id="cancel" style={{ scrollMarginTop: 96, paddingBottom: 20 }}>
                        <SectionTitle>Cancellation Policy on Meesho</SectionTitle>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                            <div style={{ width: '72%', marginLeft: 3 }}>
                                <h4 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111' }}>No Cancellation Penalty</h4>
                                <p style={{ margin: '14px 0 0', fontSize: 15, lineHeight: '23px', color: '#444' }}>
                                    In order to maintain a good customer experience for customers, it is important for you to ensure that the products you have listed on Meesho are in stock and available to ship. However, we understand that there could be delays that are out of your control leading to late dispatch or order cancellation. In that case, Meesho will not charge any penalty to you so you can continue to sell online without any tension.
                                </p>
                            </div>
                            <Art src={IMG.cancel} alt="Cancellation" size={190} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

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
export default function Return() {
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
            <section style={{ position: 'relative', overflow: 'hidden', background: '#fcf1f6', height: 400 }}>
                <div style={{ position: 'absolute', top: 120, right: -560, width: 1100, height: 900, borderRadius: '50%', background: '#f8d9e8' }} />
                <div style={{ ...WRAP, position: 'relative', height: '100%' }}>
                    <div style={{ position: 'absolute', top: 48, left: 0, width: 560 }}>
                        <h1 style={{ margin: 0, fontSize: 42, fontWeight: 600, lineHeight: '52px', color: '#111', maxWidth: 560 }}>
                            Meesho Shipping, Delivery &amp; Returns Policy
                        </h1>
                        <p style={{ margin: '18px 0 0', fontSize: 18, lineHeight: '28px', color: '#2b2b2b', maxWidth: 520 }}>
                            Get your products delivered to crores of customers with the{' '}
                            <span style={{ color: PINK, fontWeight: 600 }}>cost-effective shipping.</span>
                        </p>
                        <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: '25px', color: '#2b2b2b' }}>
                            <span style={{ display: 'inline-block', background: PINK, color: '#fff', fontSize: 13, fontWeight: 600, padding: '2px 11px', borderRadius: 3, marginRight: 10, lineHeight: '22px' }}>New!</span>
                            Don’t have a GSTIN or have a Composition GSTIN?<br />
                            You can still sell on Meesho. Click <a href="/non-gst-sellers" style={{ color: PINK, fontWeight: 600, textDecoration: 'none' }}>here</a> to know more.
                        </p>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', width: 500, height: 58, marginTop: 22, padding: 0, background: '#fff', border: `1px solid ${focused ? PINK : '#d9dbe3'}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 16px', minWidth: 0 }}>
                                <span style={{ fontSize: 16, color: '#2b2b2b', marginRight: 13 }}>+91</span>
                                <input
                                    type="tel" inputMode="numeric" maxLength={10} placeholder="Enter Your Mobile Number"
                                    value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                                    style={{ flex: 1, minWidth: 0, height: '100%', padding: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, fontFamily: 'inherit' }}
                                />
                            </div>
                            <button type="submit" style={{ width: 140, padding: 0, border: 'none', background: PINK, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Start Selling</button>
                        </form>
                    </div>

                    <div style={{ position: 'absolute', right: 0, bottom: 0, width: 460, height: 400 }}>
                      
                            <img src={Desktoppic2} alt="Delivery" style={{ position: 'absolute', right: 0, bottom: 0, width: 460, height: 400, objectFit: 'contain' }} />
                      
                    </div>
                </div>
            </section>

            {/* ---------- Deliver across India ---------- */}
            <section style={{ background: '#f6f7f9', height: 190 }}>
                <div style={{ ...WRAP, position: 'relative', height: '100%' }}>
                    <div style={{ position: 'absolute', top: 36, left: 3, width: 330 }}>
                        <h2 style={{ margin: 0, fontSize: 25, fontWeight: 600, color: '#111' }}>Deliver products across India</h2>
                        <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: '24px', color: '#444' }}>
                            Meesho ensures quick and hassle-free delivery of all your products across India
                        </p>
                    </div>
                    <div style={{ position: 'absolute', top: 28, right: 4, width: 470, height: 134, background: '#fff', border: '1px solid #ece8f0', borderRadius: 6, display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
                        {[
                            { icon: <TruckIcon />, text: 'Cost- Effective\nShipping' },
                            { icon: <IndiaIcon />, text: 'Delivering across\nIndia' },
                            { icon: <HandCoinIcon />, text: '0% Commission' },
                        ].map((c, i) => (
                            <React.Fragment key={c.text}>
                                {i > 0 && <div style={{ width: 1, height: 90, background: '#e5e5e5' }} />}
                                <div style={{ flex: 1, textAlign: 'center', whiteSpace: 'pre-line' }}>
                                    {c.icon}
                                    <div style={{ marginTop: 9, fontSize: 16, fontWeight: 600, lineHeight: '22px', color: '#111' }}>{c.text}</div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            <Guide />

            {/* ---------- CTA band ---------- */}
            <section style={{ background: '#f4f5f7' }}>
                <div style={{ ...WRAP, display: 'flex', padding: '64px 24px 66px' }}>
                    <h3 style={{ margin: 0, width: 500, flexShrink: 0, fontSize: 28, fontWeight: 600, lineHeight: '38px', color: '#111' }}>
                        Sell Products Online at 0%<br />Commission on Meesho
                    </h3>
                    <div style={{ maxWidth: 560 }}>
                        <p style={{ margin: 0, fontSize: 16, lineHeight: '26px', color: '#333' }}>
                            Join the fastest growing e-commerce platform in India and sell to crores of users and grow your business.
                        </p>
                        <a href="/supplier-signup" style={{ display: 'inline-block', marginTop: 26, padding: '14px 30px', background: INDIGO, borderRadius: 3, color: '#fff', fontSize: 16, fontWeight: 500, textDecoration: 'none' }}>
                            Start Selling
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}