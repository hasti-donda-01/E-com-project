import { useState, useEffect } from 'react'
import meeshoLogo from './Images/meeshoLogo.svg'
import Desktoppic2 from './Images/Desktoppic2.jpg'
import SupplierFooter from './SupplierFooter'

/* 👇 import your real images and assign them here */
const IMG = {
    adsVideo: null,
    recoPerson: null,
    recoVideo: null,
    priceVideo: null,
    qualityVideo: null,
    nddVideo: null,
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
    { label: 'Shipping & Returns', href: '#' },
    { label: 'Grow Business', href: '#', active: true },
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
        style={{ margin: '44px 0 0', fontSize: 20, fontWeight: 600, color: '#111', borderLeft: '3px solid #5a4a00', paddingLeft: 14, scrollMarginTop: 96 }}
    >
        {children}
    </h3>
)

const P = ({ children, style }) => (
    <p style={{ margin: '18px 0 0', fontSize: 16, lineHeight: '27px', color: '#333', ...style }}>{children}</p>
)

const Dot = () => <span style={{ width: 7, height: 7, borderRadius: '50%', background: PINK, marginTop: 9, flexShrink: 0 }} />

const Pink = ({ children }) => <span style={{ color: PINK, fontWeight: 600 }}>{children}</span>

/* video thumbnail + label card */
const VideoCard = ({ img, label, bg = '#e6eef0' }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
        <div style={{ position: 'relative', width: 130, height: 78, background: bg, overflow: 'hidden' }}>
            {img && <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            <span style={{ position: 'absolute', left: 51, top: 25, width: 28, height: 28, borderRadius: '50%', background: PINK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="14" viewBox="0 0 6 7"><path d="M0 0l6 3.5L0 7z" fill="#fff" /></svg>
            </span>
        </div>
        <div style={{ width: 188, height: 78, background: '#e8ecff', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 13, fontWeight: 600, lineHeight: '19px', color: '#111', boxSizing: 'border-box' }}>
            {label}
        </div>
    </div>
)

/* 3-step horizontal stepper in a grey box */
const Steps3 = ({ steps }) => (
    <div style={{ marginTop: 20, background: '#f4f4f6', borderRadius: 6, padding: '28px 24px 30px', display: 'flex', gap: 24 }}>
        {steps.map((s, i) => (
            <div key={s.title} style={{ flex: 1, position: 'relative' }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: PINK, color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                {i < steps.length - 1 && <span style={{ position: 'absolute', top: 12, left: 36, right: 12, height: 1, background: PINK }} />}
                <div style={{ marginTop: 14, fontSize: 15, fontWeight: 600, lineHeight: '22px', color: '#111' }}>{s.title}</div>
                <div style={{ marginTop: 8, fontSize: 14, lineHeight: '21px', color: '#666' }}>{s.text}</div>
            </div>
        ))}
    </div>
)

/* feature with pink icon, title, text */
const Feature = ({ icon, title, text }) => (
    <div style={{ display: 'flex', gap: 12 }}>
        <span style={{ width: 26, height: 26, borderRadius: 6, background: '#fde3f0', color: PINK, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
        <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>{title}</div>
            <div style={{ marginTop: 6, fontSize: 14, lineHeight: '22px', color: '#555' }}>{text}</div>
        </div>
    </div>
)

const Art = ({ src, alt, size = 200 }) => (
    <div style={{ position: 'relative', width: size, height: size + 10, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: '20px 0 0 0', borderRadius: '50%', background: '#f4f5f7' }} />
        {src ? (
            <img src={src} alt={alt} style={{ position: 'absolute', left: '50%', bottom: 0, height: size, transform: 'translateX(-50%)' }} />
        ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#aaa' }}>{alt}</div>
        )}
    </div>
)

/* ================= DATA ================= */
const SIDEBAR = [
    { id: 'ads', label: 'Advertise Your Products', sub: [{ id: 'campaign', label: 'How Campaign Works' }] },
    { id: 'reco', label: 'Product Recommendation', sub: [{ id: 'recs', label: 'Recommendations' }, { id: 'increase', label: 'Increase Sales' }] },
    { id: 'price', label: 'Price Recommendation' },
    { id: 'quality', label: 'Quality Dashboard' },
    { id: 'ndd', label: 'Next Day Dispatch Program', sub: [{ id: 'benefits', label: 'Benefits of Registering' }, { id: 'register', label: 'Steps to Register' }] },
]
// flat, in page order, for scroll-spy
const ORDER = ['ads', 'campaign', 'reco', 'recs', 'increase', 'price', 'quality', 'ndd', 'benefits', 'register']
const PARENT = {}
SIDEBAR.forEach((t) => { PARENT[t.id] = t.id; (t.sub || []).forEach((s) => (PARENT[s.id] = t.id)) })

const AD_FEATURES = [
    { icon: '🚀', title: 'Boost Visibility', text: 'Advertising on Meesho boosts the rank of your catalogs. It means higher visibility, leads to more clicks and increases orders.' },
    { icon: '📈', title: 'Increase Your Sales', text: 'By being present at the right place at the right time, your catalogs get more orders. Reaching the right customers helps you increase your sales.' },
    { icon: '👥', title: 'Attract More Customers', text: 'Interested customers can view and shop your product catalogs from the top slots.' },
    { icon: '📊', title: 'Track & Manage Ads', text: 'Make better decisions with performance metrics like return on investment and budget utilized.' },
    { icon: '👆', title: 'Pay only for Click', text: 'No cost to pay unless a customer clicks on your advertisement.' },
    { icon: '🎯', title: 'Control Costs', text: 'You create the campaigns, you decide when to run or pause them through the performance data.' },
]

const AD_STEPS = [
    { title: 'Choose Catalog', text: 'Select the product catalog or catalogs you want to advertise' },
    { title: 'Select Budget', text: 'Allocate an advertising budget for your campaign' },
    { title: 'Select Duration', text: 'Choose how long you want to run the advertisement campaign' },
]

const RECO_WAYS = [
    { title: 'Trending searches', text: 'Products people are looking for but can’t find anything they like' },
    { title: 'Top selling', text: 'Selling well on Meesho' },
    { title: 'Other categories', text: 'Suggestions based on categories similar to what you are selling' },
]

const RECO_STEPS = [
    { title: 'Explore recommendations by Meesho', text: 'We curate product recommendations for you based on customer feedback and data' },
    { title: 'Accept Recommendations & Source', text: 'Accept the recommendations provided by Meesho and source the products that customers want' },
    { title: 'Upload Recommendations', text: 'Add & upload the product recommended to your catalog and boost your sales' },
]

const NDD_BENEFITS = [
    'Higher visibility',
    'Lesser order cancellation',
    'Catalogs appear at the top of the homepage',
    <>Lesser chances of <span style={{ color: '#1a8fc4' }}>RTO</span></>,
    'Get your own FE Account Manager',
]

const NDD_STEPS = [
    <>Login to your <b>“Supplier Panel”</b></>,
    <>Click on <b>“Support”</b></>,
    <>Select <b>“Orders &amp; Delivery”</b></>,
    <>Choose <b>“I want to add my catalogs under Next Day Dispatch Program / I want to put my complete account under Next Day Dispatch (NDD) program”</b></>,
    <>Raise Ticket</>,
]

/* ================= GUIDE ================= */
function Guide() {
    const [current, setCurrent] = useState('ads')

    useEffect(() => {
        const onScroll = () => {
            let cur = ORDER[0]
            ORDER.forEach((id) => {
                const el = document.getElementById(id)
                if (el && el.getBoundingClientRect().top <= 160) cur = id
            })
            setCurrent(cur)
        }
        window.addEventListener('scroll', onScroll)
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const activeTop = PARENT[current]

    return (
        <section style={{ background: '#fff', padding: '42px 0 56px' }}>
            <div style={{ ...WRAP, display: 'flex', alignItems: 'flex-start', gap: 15 }}>
                {/* Sidebar */}
                <aside style={{ width: 220, flexShrink: 0, position: 'sticky', top: 90, paddingTop: 4 }}>
                    {SIDEBAR.map((t) => {
                        const isActive = activeTop === t.id
                        return (
                            <div key={t.id}>
                                <div
                                    onClick={() => goTo(t.id)}
                                    style={{
                                        width: 210, cursor: 'pointer', fontSize: 15, lineHeight: '22px', padding: '11px 10px', marginTop: 10,
                                        borderLeft: `3px solid ${isActive ? PINK : 'transparent'}`,
                                        background: isActive ? 'linear-gradient(90deg, #fde3f0 0%, #fff 100%)' : 'transparent',
                                        color: isActive ? '#111' : '#777', whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t.label}
                                </div>
                                {t.sub && (
                                    <ul style={{ listStyle: 'none', margin: '4px 0 0 4px', padding: 0 }}>
                                        {t.sub.map((s) => (
                                            <li
                                                key={s.id} onClick={() => goTo(s.id)}
                                                style={{
                                                    fontSize: 13, lineHeight: '20px', color: current === s.id ? '#111' : '#777', padding: '8px 10px', cursor: 'pointer',
                                                    borderLeft: `2px solid ${current === s.id ? INDIGO : '#e4e4e4'}`
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
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* 1. Advertise */}
                    <div id="ads" style={{ scrollMarginTop: 96, paddingBottom: 56 }}>
                        <SectionTitle>Advertise Your Products</SectionTitle>
                        <P style={{ marginTop: 14 }}>
                            Promote your products and catalogs by creating sponsored advertisements or <Pink>Meesho Ads.</Pink> This will help you to reach the right customers and increase sales. Your catalogs will list on top slots on discovery pages across Meesho. It looks like a regular catalog listing with an “Ad” tag. Currently, not available for sellers who don’t have a regular GSTIN.
                        </P>

                        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 48, rowGap: 28 }}>
                            {AD_FEATURES.map((f) => <Feature key={f.title} {...f} />)}
                        </div>

                        <SubTitle id="campaign">Start Your Ad Campaign in 3 Simple Steps</SubTitle>
                        <Steps3 steps={AD_STEPS} />

                        <div style={{ marginTop: 26, background: '#f4f4f6', borderRadius: 4, padding: '14px 18px', fontSize: 15, fontWeight: 600, color: '#111' }}>
                            Learn More About Advertisement on Meesho by Visiting Our <Pink>Meesho Ads Page .</Pink>
                        </div>

                        <VideoCard img={IMG.adsVideo} label="Learn More About Creating Ad Campaign" bg="#f4dede" />
                    </div>

                    {/* 2. Product recommendation */}
                    <div id="reco" style={{ scrollMarginTop: 96, paddingBottom: 56 }}>
                        <SectionTitle>Increase Sales Through Product Recommendation</SectionTitle>
                        <P style={{ marginTop: 14 }}>
                            With Meesho supplier Panel, you get access to the Product recommendation tool that is very easy to use and helps in expanding your business as well.
                        </P>

                        <SubTitle id="recs">Recommendations are made in a few ways:</SubTitle>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                            <div style={{ width: '62%' }}>
                                {RECO_WAYS.map((w) => (
                                    <div key={w.title} style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                                        <Dot />
                                        <div>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{w.title}</div>
                                            <div style={{ marginTop: 4, fontSize: 14, lineHeight: '21px', color: '#666' }}>{w.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Art src={IMG.recoPerson} alt="Seller" size={200} />
                        </div>

                        <SubTitle id="increase">Increase sales through product recommendations in 3 simple steps</SubTitle>
                        <Steps3 steps={RECO_STEPS} />
                        <VideoCard img={IMG.recoVideo} label="Learn More About Product Recommendation" bg="#f0d6ea" />
                    </div>

                    {/* 3. Price recommendation */}
                    <div id="price" style={{ scrollMarginTop: 96, paddingBottom: 56 }}>
                        <SectionTitle>Attract More Customers Through Price Recommendation</SectionTitle>
                        <P style={{ marginTop: 14 }}>
                            You want to set optimal prices for your products but lacked a tool to align your pricing strategy effectively. Now, with Meesho’s Price Recommendation tool, sellers can access data-driven pricing insights to make informed decisions across the platform.
                        </P>
                        <VideoCard img={IMG.priceVideo} label="Learn More About Price Recommendation" bg="#cfe3f5" />
                    </div>

                    {/* 4. Quality dashboard */}
                    <div id="quality" style={{ scrollMarginTop: 96, paddingBottom: 56 }}>
                        <SectionTitle>Reduce Returns Through Quality Dashboard</SectionTitle>
                        <P style={{ marginTop: 14 }}>
                            When your catalogs become live on Meesho, they will be visible to the crores of customers who shop on Meesho. Every time a customer uses the Meesho platform and provides feedback, it will immediately reflect on your quality dashboard. This will help you understand how customers are responding to your products and thereby optimises your inventory in the future.
                        </P>
                        <VideoCard img={IMG.qualityVideo} label="Learn More About Quality Dashboard" bg="#a9dde0" />
                    </div>

                    {/* 5. NDD */}
                    <div id="ndd" style={{ scrollMarginTop: 96, paddingBottom: 20 }}>
                        <SectionTitle>Next Day Dispatch Program</SectionTitle>
                        <P style={{ marginTop: 14 }}>
                            To increase visibility and improve customer satisfaction, suppliers can sign up for the Next Day Dispatch program. The NDD program requires those registered to dispatch their orders the next day. Sellers receive a special badge that tells customers they can receive their items in one day after ordering. As a result, customers are more likely to order from you.
                        </P>
                        <VideoCard img={IMG.nddVideo} label="Learn More About Next Day Dispatch Program" bg="#e9e3dc" />

                        <SubTitle id="benefits">Benefits of Registering for NDD Program:</SubTitle>
                        <div style={{ marginTop: 6 }}>
                            {NDD_BENEFITS.map((b, i) => (
                                <div key={i} style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                                    <Dot />
                                    <span style={{ fontSize: 14, lineHeight: '22px', color: '#444' }}>{b}</span>
                                </div>
                            ))}
                        </div>

                        <SubTitle id="register">Steps to Register for Meesho NDD Program:</SubTitle>
                        <div style={{ marginTop: 14 }}>
                            {NDD_STEPS.map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, background: '#f4f4f6', borderRadius: 4, padding: '14px 16px' }}>
                                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: PINK, color: '#fff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                                    <span style={{ fontSize: 14, lineHeight: '21px', color: '#222' }}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ================= FOOTER ================= */


/* ================= PAGE ================= */
export default function GrowBusiness() {
    const [mobile, setMobile] = useState('')
    const [focused, setFocused] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!/^[6-9]\d{9}$/.test(mobile)) return
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
                        <h1 style={{ margin: 0, fontSize: 42, fontWeight: 600, lineHeight: '52px', color: '#111' }}>
                            Grow Your Business on Meesho
                        </h1>
                        <p style={{ margin: '18px 0 0', fontSize: 18, lineHeight: '28px', color: '#2b2b2b', maxWidth: 520 }}>
                            Use ads, recommendations and quality tools to <Pink>boost your sales</Pink> and reduce returns.
                        </p>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', width: 500, height: 58, marginTop: 30, padding: 0, background: '#fff', border: `1px solid ${focused ? PINK : '#d9dbe3'}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 16px', minWidth: 0 }}>
                                <span style={{ fontSize: 16, color: '#2b2b2b', marginRight: 13 }}>+91</span>
                                <input
                                    type="tel" inputMode="numeric" maxLength={10} placeholder="Enter Your Mobile Number"
                                    value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                                    style={{ flex: 1, minWidth: 0, height: '100%', padding: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: '#2b2b2b', fontFamily: 'inherit' }}
                                />
                            </div>
                            <button type="submit" style={{ width: 140, padding: 0, border: 'none', background: PINK, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Start Selling</button>
                        </form>
                    </div>
                    <div style={{ position: 'absolute', right: 0, bottom: 0, width: 460, height: 400 }}>
                        <img src={Desktoppic2} alt="Grow" style={{ position: 'absolute', right: 0, bottom: 0, width: 460, height: 400, objectFit: 'contain' }} />
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

            <SupplierFooter />
        </div>
    )
}