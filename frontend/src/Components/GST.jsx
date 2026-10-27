// Selling on Meesho without GST guide (covers Enrolment ID, UIN, and FAQs)
import { useState } from 'react'
import SupplierNavbar from './SupplierNavbar'

// Optional image placeholders
const IMG = {
    hero: null,      // gstHero
    hub: null,       // learningHubLogo
}

const PINK = '#f43397'
const FONT = "'Poppins', sans-serif"
const NARROW = { width: '100%', maxWidth: 1000, margin: '0 auto', paddingLeft: 24, paddingRight: 24, boxSizing: 'border-box' }

// Reusable styling and button components
const Pink = ({ children }) => <span style={{ color: PINK, fontWeight: 600 }}>{children}</span>

const Heading = ({ children, style }) => (
    <h2 style={{ margin: 0, textAlign: 'center', fontSize: 20, fontWeight: 600, color: '#111', ...style }}>{children}</h2>
)

const RegisterBtn = ({ suffix }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <a href="/supplier-signup" style={{ display: 'inline-block', padding: '12px 22px', background: PINK, borderRadius: 3, color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Register Now
        </a>
        <span style={{ fontSize: 14, color: '#333' }}>{suffix}</span>
    </div>
)

// Icon helpers
const IconBox = ({ children }) => (
    <span style={{ width: 28, height: 28, borderRadius: 6, background: '#fde3f0', color: PINK, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{children}</span>
)
const Tick = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7.5l3 3L12 3" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

// Selling benefits and onboarding steps data
const BENEFITS = [
    { icon: '%', title: '0% Commission Fee', text: 'Suppliers selling on Meesho keep 100% of their profit by not paying any commission.' },
    { icon: '₹', title: '0 Penalty Charges', text: 'Sell online without the fear of order cancellation charges with 0 Penalty for late dispatch or order cancellations.' },
    { icon: '↗', title: 'Growth for Every Supplier', text: 'From small to large and unbranded to branded, all suppliers have grown their businesses on Meesho.' },
]
const EASE = ['Easy Product Listing', 'Cost-effective Shipping', '7-Day Payment Cycle from the delivery date']

const STEPS = [
    { title: 'Get Enrolment ID/UIN', text: <>Get Enrolment ID/UIN from <Pink>here</Pink>. If you don’t have GSTIN. Otherwise, use your Composition GSTIN.</> },
    { title: 'Sign up for free', text: <><Pink>Register</Pink> as a Meesho seller. All you need is an active bank account and Enrolment ID / UIN (for sellers without GSTIN) or GSTIN (for GSTIN sellers).</> },
    { title: 'Upload your product & catalog', text: 'After completing the registration, upload your product catalog on the Meesho Supplier Panel.' },
    { title: 'Receive & Ship Orders', text: 'Meesho offers cost-effective shipping for deliveries.' },
    { title: 'Receive Payments', text: 'Payment is securely deposited directly to your bank account on Meesho following a 7-day payment cycle from order delivery, including cash on delivery orders.' },
]

// Frequently asked questions about GST exemption
const FAQS = [
    { q: 'I have a Composition GSTIN. Can I sell on Meesho?', a: 'Yes. Sellers with a Composition GSTIN can register on Meesho and sell to customers within their own state.' },
    { q: 'I don’t have a GSTIN but I want to sell on Meesho. How do I register?', a: 'Get an Enrolment ID or UIN, then sign up on Meesho as a seller using your active bank account and that ID.' },
    { q: 'How do I get my Enrolment ID or UIN?', a: 'You can apply for an Enrolment ID / UIN on the GST portal. Once you have it, return to Meesho and complete your registration.' },
    { q: 'In which states can I sell without GSTIN or with Composition GSTIN?', a: 'Sellers without a regular GSTIN can sell to customers within their own state. Add the official list or rules here.' },
    { q: 'What are the turnover restrictions for Enrolment ID / UIN and Composition GSTIN sellers?', a: 'Turnover limits apply as per GST rules. Add the official limits for each seller type here.' },
]

/* ================= FAQ ================= */
function FaqItem({ q, a, open, onToggle }) {
    return (
        <div style={{ borderBottom: '1px solid #dcdcdc' }}>
            <div
                onClick={onToggle}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 0', cursor: 'pointer', gap: 20 }}
            >
                <span style={{ fontSize: 14, color: '#222' }}>{q}</span>
                <span style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s'
                }}>
                    <svg width="9" height="6" viewBox="0 0 9 6" fill="none"><path d="M1 1l3.5 3.5L8 1" stroke="#555" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </span>
            </div>
            {open && <p style={{ margin: '0 0 22px', fontSize: 14, lineHeight: '23px', color: '#555', paddingRight: 40 }}>{a}</p>}
        </div>
    )
}

/* ================= PAGE ================= */
export default function GST() {
    const [openIdx, setOpenIdx] = useState(-1)

    return (
        <div style={{ fontFamily: FONT, background: '#fff' }}>
            <SupplierNavbar />

            {/* ---------- Hero ---------- */}
            <section style={{ background: '#fcf1f1', height: 300 }}>
                <div style={{ ...NARROW, position: 'relative', height: '100%' }}>
                    <div style={{ position: 'absolute', top: 56, left: 24 }}>
                        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, lineHeight: '38px', color: '#111' }}>
                            <span style={{ color: PINK }}>No GSTIN?</span> No Worries!<br />
                            <span style={{ color: PINK }}>Composition GSTIN?</span> No Worries!
                        </h1>
                        <p style={{ margin: '14px 0 0', fontSize: 15, lineHeight: '23px', color: '#2b2b2b', maxWidth: 420 }}>
                            Whether you’re a big business or a small one, now sell to millions in your state, <Pink>without a Regular GSTIN</Pink>
                        </p>
                        <div style={{ marginTop: 24 }}><RegisterBtn suffix="and Start Selling" /></div>
                    </div>
                    <div style={{ position: 'absolute', right: 24, bottom: 0, width: 360, height: 280 }}>
                        {IMG.hero ? (
                            <img src={IMG.hero} alt="Seller" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'right bottom' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 14 }}>Hero image</div>
                        )}
                    </div>
                </div>
            </section>

            {/* ---------- Opportunity ---------- */}
            <section style={{ ...NARROW, paddingTop: 40 }}>
                <Heading>Opportunity for Sellers without a GSTIN or having a Composition GSTIN</Heading>
                <p style={{ margin: '26px 0 0', fontSize: 14, lineHeight: '24px', color: '#333' }}>
                    Meesho welcomes sellers without a GSTIN or having a Composition GSTIN to sign up and begin selling to lakhs of customers within their own state.
                </p>
                <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: '24px', color: '#333' }}>
                    For sellers not registered under GST, it’s necessary to possess an enrollment ID or UIN for the registration process. If you haven’t obtained your Enrolment ID or UIN yet, you can apply for it <Pink>here</Pink> and proceed to <Pink>register</Pink> on Meesho.
                </p>
            </section>

            {/* ---------- Why suppliers love Meesho ---------- */}
            <section style={{ ...NARROW, marginTop: 40 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: 340, marginLeft: 0 }}>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111' }}>Why Suppliers Love Meesho</h3>
                        <p style={{ margin: '12px 0 28px', fontSize: 13, lineHeight: '21px', color: '#555', maxWidth: 280 }}>
                            All the benefits that come with selling on Meesho are designed to help you sell more, and make it easier to grow your business.
                        </p>
                        <RegisterBtn suffix="and Start Selling" />
                    </div>

                    <div style={{ width: 460, border: '1px solid #e6e1ee', borderRadius: 4, padding: '20px 24px', boxSizing: 'border-box' }}>
                        {BENEFITS.map((b) => (
                            <div key={b.title} style={{ display: 'flex', gap: 12, paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid #ececec' }}>
                                <IconBox>{b.icon}</IconBox>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{b.title}</div>
                                    <div style={{ marginTop: 6, fontSize: 13, lineHeight: '20px', color: '#666' }}>{b.text}</div>
                                </div>
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: 12 }}>
                            <IconBox>★</IconBox>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Ease of Doing Business</div>
                                <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                                    {EASE.map((e) => (
                                        <div key={e} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, lineHeight: '19px', color: '#555' }}>
                                            <span style={{ marginTop: 3 }}><Tick /></span>{e}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- Become a seller steps ---------- */}
            <section style={{ ...NARROW, marginTop: 64 }}>
                <Heading>Become a Seller on Meesho in simple steps</Heading>
                <div style={{ marginTop: 24, background: '#f4f4f6', borderRadius: 4, padding: '28px 12px 32px', display: 'flex', gap: 18 }}>
                    {STEPS.map((s, i) => (
                        <div key={s.title} style={{ flex: 1, position: 'relative', padding: '0 4px' }}>
                            <span style={{ width: 22, height: 22, borderRadius: '50%', background: PINK, color: '#fff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                            {i < STEPS.length - 1 && <span style={{ position: 'absolute', top: 11, left: 34, right: -10, height: 1, background: PINK }} />}
                            <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, lineHeight: '19px', color: '#111' }}>{s.title}</div>
                            <div style={{ marginTop: 8, fontSize: 12, lineHeight: '19px', color: '#666' }}>{s.text}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- FAQ ---------- */}
            <section style={{ ...NARROW, marginTop: 56, paddingBottom: 56 }}>
                <Heading>Commonly Asked Questions</Heading>
                <div style={{ maxWidth: 800, margin: '18px auto 0' }}>
                    {FAQS.map((f, i) => (
                        <FaqItem key={f.q} {...f} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
                    ))}
                </div>
            </section>

            {/* ---------- Learning hub band ---------- */}
            <section style={{ background: '#f4f5f7' }}>
                <div style={{ ...NARROW, maxWidth: 820, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 118 }}>
                    <div>
                        {IMG.hub ? (
                            <img src={IMG.hub} alt="Supplier Learning Hub" style={{ height: 22, display: 'block' }} />
                        ) : (
                            <div style={{ fontSize: 18, fontWeight: 700, color: PINK }}>meesho <span style={{ fontSize: 9, color: '#333', fontWeight: 500 }}>Supplier Learning Hub</span></div>
                        )}
                        <div style={{ marginTop: 12, fontSize: 15, fontWeight: 600, lineHeight: '22px', color: '#111' }}>
                            Learn how to sell and grow<br />your business on Meesho
                        </div>
                    </div>
                    <span aria-disabled="true" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '1px solid #aaa', borderRadius: 3, background: '#f5f5f5', color: '#777', fontSize: 12, cursor: 'not-allowed' }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: PINK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="7" height="8" viewBox="0 0 6 7"><path d="M0 0l6 3.5L0 7z" fill="#fff" /></svg>
                        </span>
                        Visit Learning Hub
                    </span>
                </div>
            </section>

            {/* ---------- Register band ---------- */}
            <section style={{ background: '#fff', height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RegisterBtn suffix="to become a seller" />
            </section>

            {/* ---------- Support band ---------- */}
            <section style={{ background: '#f4f5f7' }}>
                <div style={{ ...NARROW, display: 'flex', padding: '38px 24px 40px' }}>
                    <h3 style={{ margin: 0, width: 420, flexShrink: 0, fontSize: 18, fontWeight: 600, lineHeight: '25px', color: '#111' }}>
                        Meesho Supplier Support<br />Available 24/7
                    </h3>
                    <div style={{ maxWidth: 420 }}>
                        <p style={{ margin: 0, fontSize: 12, lineHeight: '19px', color: '#555' }}>
                            Meesho supplier support is available to solve all your doubts and issues before and after you start your online selling business.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                            <span style={{ width: 30, height: 30, borderRadius: 4, background: '#fb9fc9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✉</span>
                            <div style={{ fontSize: 11, lineHeight: '16px', color: '#555' }}>
                                You can reach out to<br />
                                <a href="mailto:sell@meesho.com" style={{ color: PINK, textDecoration: 'none' }}>sell@meesho.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}