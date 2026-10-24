import React, { useState, useEffect } from 'react'
import meeshoLogo from './Images/meeshoLogo.svg'
import DesktopPicsell from './Images/DesktopPicsell.jpg'
import { useNavigate } from 'react-router-dom'
import SupplierNavbar from './SupplierNavbar'
import SupplierFooter from './SupplierFooter'

const PINK = '#f43397'
const MAROON = '#570d48'
const INDIGO = '#3d1fc4'
const FONT = "'Poppins', sans-serif"
const CONTAINER = { maxWidth: 1524, margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }

/* ================= NAVBAR ================= */


/* ================= ICONS (register cards) ================= */
const PhoneAtIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M12 10c-2 2-3 5-2 9 3 12 13 26 27 31 4 2 8 1 10-1l3-4c1-1 1-3 0-4l-8-6c-1-1-3-1-4 0l-3 3c-6-3-11-8-14-14l3-3c1-1 1-3 0-4l-6-8c-1-1-4-1-6 1z" fill={PINK} />
        <circle cx="45" cy="17" r="11" stroke="#9b8cf0" strokeWidth="3" />
        <text x="45" y="22.5" textAnchor="middle" fontSize="15" fontWeight="700" fill="#9b8cf0">@</text>
    </svg>
)
const DocIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M14 6h22l10 10v38a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z" fill={PINK} />
        <path d="M36 6v10h10z" fill="#c9b8f5" />
        <rect x="18" y="24" width="16" height="3.5" rx="1.7" fill="#fff" />
        <rect x="18" y="32" width="12" height="3.5" rx="1.7" fill="#fff" />
        <rect x="18" y="40" width="14" height="3.5" rx="1.7" fill="#fff" />
        <circle cx="46" cy="38" r="10" fill={PINK} stroke="#fff" strokeWidth="3" />
        <path d="M42.5 41.5l7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
)
const BankIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M32 6L6 22h52z" fill={PINK} />
        <circle cx="32" cy="16" r="2.2" fill="#fff" />
        <rect x="8" y="24" width="48" height="5" fill={PINK} />
        {[14, 24, 34, 44].map((x) => <rect key={x} x={x} y="31" width="6" height="16" fill="#9b8cf0" />)}
        <rect x="6" y="49" width="52" height="6" fill={PINK} />
    </svg>
)

const REGISTER_CARDS = [
    { icon: <PhoneAtIcon />, text: 'Mobile Number & Email ID' },
    { icon: <DocIcon />, text: 'GSTIN Number (for GST sellers) or Enrolment ID / UIN (for non-GST sellers)' },
    { icon: <BankIcon />, text: 'Active Bank Account with the same GST' },
]

/* ================= SMALL HELPERS ================= */
const SectionTitle = ({ children }) => (
    <h2
        style={{
            display: 'inline-block', margin: 0, fontSize: 30, fontWeight: 600, color: '#111',
            padding: '15px 60px 15px 19px', borderLeft: `5px solid ${PINK}`,
            background: 'linear-gradient(90deg, #fde3f0 0%, #fff 100%)'
        }}
    >
        {children}
    </h2>
)

const P = ({ children, style }) => (
    <p style={{ margin: '18px 0 0 18px', fontSize: 16, lineHeight: '27px', color: '#2b2b2b', ...style }}>{children}</p>
)

const Bullet = ({ title, children }) => (
    <div style={{ display: 'flex', gap: 14, marginTop: 28, marginLeft: 18 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: PINK, marginTop: 11, flexShrink: 0 }} />
        <div>
            <div style={{ fontSize: 19, fontWeight: 600, color: '#111' }}>{title}</div>
            <p style={{ margin: '8px 0 0', fontSize: 16, lineHeight: '27px', color: '#2b2b2b' }}>{children}</p>
        </div>
    </div>
)

const MoreLink = ({ href = '#', children }) => (
    <a href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, margin: '16px 0 0 18px', fontSize: 15, fontWeight: 600, color: '#111', textDecoration: 'none' }}>
        {children}
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 7h19M14 1l6 6-6 6" />
        </svg>
    </a>
)

/* ================= GUIDE (sidebar + scrolling sections) ================= */
const SIDEBAR = [
    { id: 'register', label: 'Register Your Account' },
    {
        id: 'listing', label: 'Listing Your Product',
        sub: [
            { id: 'panel', label: 'What Is The Meesho Supplier Panel?' },
            { id: 'catalog', label: 'What Is A Catalog?' },
            { id: 'upload', label: 'How To Upload A Catalog?' },
        ],
    },
    { id: 'orders', label: 'Getting Orders' },
    { id: 'payment', label: 'Delivery & Payment' },
]
const SECTION_IDS = ['register', 'listing', 'orders', 'payment']

const FULFIL_STEPS = ['Accept your order', 'Download label and manifest', 'Pack the product and paste the label', 'Hand over the product to Meesho’s logistics partners']

function Guide() {
    const [active, setActive] = useState('register')

    useEffect(() => {
        const onScroll = () => {
            const y = 160
            let cur = SECTION_IDS[0]
            SECTION_IDS.forEach((id) => {
                const el = document.getElementById(id)
                if (el && el.getBoundingClientRect().top <= y) cur = id
            })
            setActive(cur)
        }
        window.addEventListener('scroll', onScroll)
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const section = { scrollMarginTop: 96, paddingBottom: 70 }


    return (
        <section style={{ background: '#fff', padding: '70px 0 20px', fontFamily: FONT }}>
            <div style={{ ...CONTAINER, display: 'flex', gap: 14, alignItems: 'flex-start', paddingLeft: 150 }}>
                {/* Sidebar */}
                <aside style={{ width: 350, flexShrink: 0, position: 'sticky', top: 96 }}>
                    {SIDEBAR.map((t) => {
                        const isActive = active === t.id
                        return (
                            <div key={t.id}>
                                <div
                                    onClick={() => goTo(t.id)}
                                    style={{
                                        cursor: 'pointer', fontSize: 20, fontWeight: 500, padding: '14px 14px', marginTop: isActive ? 0 : 14,
                                        borderLeft: `5px solid ${isActive ? PINK : 'transparent'}`,
                                        background: isActive ? 'linear-gradient(90deg, #fde3f0 0%, #fff 100%)' : 'transparent',
                                        color: isActive ? '#111' : '#707070', transition: 'color .2s'
                                    }}
                                >
                                    {t.label}
                                </div>
                                {t.sub && (
                                    <ul style={{ listStyle: 'none', margin: '22px 0 0 25px', padding: '0 0 0 14px', borderLeft: '3px solid #e4e4e4' }}>
                                        {t.sub.map((s) => (
                                            <li key={s.id} onClick={() => goTo(s.id)} style={{ fontSize: 16, lineHeight: '24px', color: '#707070', padding: '11px 20px 11px 0', cursor: 'pointer' }}>
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
                <div style={{ flex: 1, maxWidth: 1170 }}>
                    {/* 1. Register */}
                    <div id="register" style={section}>
                        <SectionTitle>Register Your Account</SectionTitle>
                        <P style={{ marginTop: 28 }}>To start selling on Meesho, you need to first create an account on Meesho. All you need is:</P>
                        <div style={{ display: 'flex', gap: 20, margin: '28px 0 0 18px' }}>
                            {REGISTER_CARDS.map((c) => (
                                <div key={c.text} style={{ flex: 1, height: 268, boxSizing: 'border-box', padding: '40px 24px 0', border: '1px solid #f3e9f0', borderRadius: 26, boxShadow: '0 2px 10px rgba(244,51,151,.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    {c.icon}
                                    <div style={{ marginTop: 34, fontSize: 21, fontWeight: 500, lineHeight: '31px', color: '#111' }}>{c.text}</div>
                                </div>
                            ))}
                        </div>
                        <P style={{ marginTop: 26 }}>
                            Once you have provided these details, enter your Store Name which will be the name of your online business. Add the Pickup Address from which orders will be picked up by our logistics partners. And, that’s all. Your free account on Meesho will be created.
                        </P>
                    </div>

                    {/* 2. Listing (placeholder text – replace with your real copy) */}
                    <div id="listing" style={section}>
                        <SectionTitle>Listing Your Product</SectionTitle>
                        <Bullet title="What Is The Meesho Supplier Panel?"><span id="panel" style={{ scrollMarginTop: 96 }} />The Supplier Panel is where you manage your Meesho business: upload catalogs, track orders, view payments and more.</Bullet>
                        <Bullet title="What Is A Catalog?"><span id="catalog" style={{ scrollMarginTop: 96 }} />A catalog is a group of similar products that you list together, with images, prices and details.</Bullet>
                        <Bullet title="How To Upload A Catalog?"><span id="upload" style={{ scrollMarginTop: 96 }} />Log in to the Supplier Panel, choose a category, add product details and images, set the price and submit.</Bullet>
                    </div>

                    {/* 3. Getting Orders */}
                    <div id="orders" style={section}>
                        <SectionTitle>Getting Orders</SectionTitle>
                        <P>Once your catalog becomes live, you can start selling on Meesho. Crores of active customers across India will be able to view and purchase your products. To increase your sales and attract more customers, you can:</P>
                        <Bullet title="List more catalogs">It usually takes 5-7 catalogs to start getting orders on Meesho. The more catalogs you upload, the better are your chances of getting orders.</Bullet>
                        <Bullet title="Set the Right Price">To set the right price of the products you want to sell on Meesho, consider the associated costs and margin. Set a competitive price for the products so that the customers find them more appealing than the competitive brands.</Bullet>
                        <Bullet title="Use Price Recommendation Tool">You can use the price recommendation tool to arrive at a competitive price and increase your sales and visibility by getting an edge over other sellers.</Bullet>
                        <Bullet title="Right Trend">Customers always prefer fresh and unique trends, so, try to list trending products to get more orders.</Bullet>
                        <Bullet title="Opt for Next Day Dispatch (NDD) Program">Sellers can participate in the Next Day Dispatch (NDD) program to streamline order processing.</Bullet>
                    </div>

                    {/* 4. Delivery & Payment */}
                    <div id="payment" style={{ ...section, paddingBottom: 60 }}>
                        <SectionTitle>Delivery &amp; Payment</SectionTitle>
                        <P>When you receive an order for your product, you are notified via email. You can also check the order update on the Meesho supplier panel.</P>
                        <P style={{ marginTop: 14 }}>Meesho charges you cost-effective shipping for deliveries across India. Our logistics partner picks up the product from your location and delivers it straight to the customer.</P>
                        <MoreLink href="/shipping-returns">Find out more about Shipping and Returns on Meesho</MoreLink>

                        <h3 style={{ margin: '34px 0 0 18px', fontSize: 22, fontWeight: 600, lineHeight: '32px', color: '#111', maxWidth: 560 }}>
                            To fulfill an order, go to the Meesho Supplier Panel and follow these steps
                        </h3>

                        <div style={{ margin: '22px 0 0 18px', background: '#f4f4f6', borderRadius: 4, padding: '28px 24px', display: 'flex', gap: 20 }}>
                            {FULFIL_STEPS.map((s, i) => (
                                <div key={s} style={{ flex: 1, position: 'relative' }}>
                                    <span style={{ width: 26, height: 26, borderRadius: '50%', background: PINK, color: '#fff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                                    {i < FULFIL_STEPS.length - 1 && (
                                        <span style={{ position: 'absolute', top: 12, left: 38, right: 10, height: 1, background: PINK }} />
                                    )}
                                    <div style={{ marginTop: 16, fontSize: 14, lineHeight: '20px', color: '#222', maxWidth: 130 }}>{s}</div>
                                </div>
                            ))}
                        </div>

                        <Bullet title="Zero Commission">Meesho charges a 0% commission rate on all product categories, allowing sellers to keep their full earnings.</Bullet>
                        <MoreLink href="/pricing-commission">Find out more about Pricing and Commission on Meesho</MoreLink>

                        <Bullet title="Payment for Orders">
                            The payment for your orders is securely deposited directly in your bank account on the 7th day from order delivery, including Cash on Delivery orders. (If your product is delivered on 1st January 2022, the payment for that order will be deposited in your bank account on 8th January 2022.)
                        </Bullet>
                        <P style={{ marginLeft: 35 }}>You can view your deposited balance and future payments on the Meesho supplier Panel.</P>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ================= SUPPORT STRIP ================= */
function Support() {
    return (
        <section style={{ background: '#f4f5f7', fontFamily: FONT }}>
            <div style={{ ...CONTAINER, display: 'flex', padding: '56px 24px 60px 174px' }}>
                <h3 style={{ margin: 0, width: 440, flexShrink: 0, fontSize: 22, fontWeight: 600, lineHeight: '30px', color: '#111' }}>
                    Meesho Supplier Support<br />Available 24/7
                </h3>
                <div style={{ maxWidth: 560 }}>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: '25px', color: '#333' }}>
                        Meesho supplier support is available to solve all your doubts and issues before and after you start your online selling business.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 28 }}>
                        <span style={{ width: 48, height: 36, background: '#fb7fb9', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round">
                                <rect x="1" y="1" width="18" height="12" rx="1.5" /><path d="M1 2l9 6 9-6" />
                            </svg>
                        </span>
                        <div style={{ fontSize: 14, color: '#333' }}>
                            You can reach out to<br />
                            <a href="mailto:sell@meesho.com" style={{ color: PINK, textDecoration: 'none', fontWeight: 500 }}>sell@meesho.com</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


/* ================= PAGE ================= */
export default function HowitWorks() {
    const [mobile, setMobile] = useState('')
    const [focused, setFocused] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!/^[6-9]\d{9}$/.test(mobile)) return
        // TODO: navigate to your signup page, e.g. navigate('/supplier-signup', { state: { mobile } })
        console.log('Start selling with', mobile)
    }

    const steps = [
        { title: 'Sign up for free', desc: 'Register as a Meesho Seller. All you need is an active bank account and your GSTIN number (for GST sellers) or Enrolment ID / UIN (for non-GST sellers).' },
        { title: 'Upload your product & catalog', desc: 'After completing the registration, upload your product catalog on the Meesho Supplier Panel' },
        { title: 'Receive & Ship Orders', desc: 'Meesho offers cost-effective shipping options for deliveries across India (for GST sellers) and within the state (for non-GST sellers).' },
        { title: 'Receive Payments', desc: 'Payment is securely deposited directly to your bank account on Meesho following a 7-day payment cycle from order delivery, including Cash on Delivery orders.' },
    ]

    return (
        <>
            <SupplierNavbar />

            {/* ---------- Hero (your code) ---------- */}
            <section style={{ position: 'relative', overflow: 'hidden', background: '#f6f7f9', minHeight: 620, fontFamily: FONT }}>
                <div style={{ position: 'absolute', top: 150, right: -430, width: 1200, height: 900, borderRadius: '50%', background: '#f8d9e8', pointerEvents: 'none' }} />
                <img src={DesktopPicsell} alt="Meesho sellers" style={{ position: 'absolute', right: 100, bottom: 0, height: 450, zIndex: 1 }} />

                <div style={{ position: 'relative', zIndex: 2, maxWidth: 1520, margin: '0 auto', padding: '125px 24px 0 150px', boxSizing: 'border-box' }}>
                    <h1 style={{ margin: 0, fontSize: 46, fontWeight: 600, lineHeight: '70px', color: '#111' }}>How to Sell on Meesho</h1>

                    <p style={{ margin: '28px 0 0', maxWidth: 640, fontSize: 14, lineHeight: '30px', color: '#2b2b2b' }}>
                        Become a Meesho seller and join <span style={{ color: PINK, fontWeight: 600 }}>lakhs of sellers</span> who are growing their business everyday
                    </p>

                    <p style={{ margin: '24px 0 0', maxWidth: 640, fontSize: 14, lineHeight: '31px', color: '#2b2b2b' }}>
                        <span style={{ display: 'inline-block', background: PINK, color: '#fff', fontSize: 16, fontWeight: 600, padding: '1px 17px', borderRadius: 4, marginRight: 12, lineHeight: '30px' }}>New!</span>
                        Don’t have a GSTIN or have a Composition GSTIN?
                        <br />
                        You can still sell on Meesho. Click <a href="/non-gst-sellers" style={{ color: PINK, fontWeight: 600, textDecoration: 'none' }}>here</a> to know more.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', width: 541, height: 48, marginTop: 0, background: '#fff', border: `1px solid ${focused ? PINK : '#d9dbe3'}`, padding: 0, marginTop: 40 }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, }}>
                            <span style={{ fontSize: 14, color: '#2b2b2b' }}>+91</span>
                            <input
                                type="tel" inputMode="numeric" maxLength={10} placeholder="Enter Your Mobile Number"
                                value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                                style={{ flex: 1, minWidth: 0, height: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: '#111', fontFamily: 'inherit', padding: 4, margin: 0 }}
                            />
                        </div>
                        <button type="submit" style={{ width: 141, padding: 0, border: 'none', background: PINK, color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Start Selling
                        </button>
                    </form>
                </div>
            </section>

            {/* ---------- Steps (your code, uses your CSS classes) ---------- */}
            <section className="how">
                <h2 className="how-title">Become a seller on Meesho in simple steps</h2>
                <div className="how-panel">
                    {steps.map((s, i) => (
                        <div className="how-step" key={`${s.title}-${i}`}>
                            <span className="how-num">{i + 1}</span>
                            <h3 className="how-step-title">{s.title}</h3>
                            <p className="how-step-desc">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Guide />
            <Support />
            <SupplierFooter />
        </>
    )
}