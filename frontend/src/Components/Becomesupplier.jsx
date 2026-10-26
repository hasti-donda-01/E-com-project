import meeshoLogo from './Images/meeshoLogo.svg'
import { Link, useNavigate } from 'react-router-dom'
import newtag from './Images/new-tag.svg'
import DesktopPic from './Images/DesktopPic.jpg'
import lazy from './Images/lazy.svg'
import penalty from './Images/penalty.svg'
import growth from './Images/growth.svg';
import business from './Images/business.svg'
import tick from './Images/tick.svg'
import amit from './Images/amit.jpg'
import suman from './Images/suman.jpg'
import mohit from './Images/mohit.jpg'
import meeshologopink from './Images/meeshologopink.svg'
import footerlogo from './Images/footerlogo.svg'
export default function Becomesupplier() {
   
    const steps = [
        {
            title: "Create Account",
            desc: "All you need is :",
            list: ["GSTIN (for GST sellers) or Enrolment ID / UIN (for non-GST sellers)", "Bank Account"],
        },
        { title: "List Products", desc: "List the products you want to sell in your supplier panel" },
        { title: "Get Orders", desc: "Start getting orders from crores of Indians actively shopping on our platform." },
        { title: "Affordable Shipping", desc: "Enjoy affordable shipping to customers across India" },
        { title: "Receive Payments", desc: "Payments are deposited directly to your bank account following a 7-day payment cycle from order delivery." },
    ]
    const stories = [
        {
            img: amit,
            name: "Amit and Rajat Jain",
            shop: "Smartees, Tiruppur",
            text: "Our business has grown beyond our imagination, getting upto 10,000 orders consistently during sale days. We are now constantly bringing new products thanks to Meesho's insights.",
        },
        {
            img: suman,
            name: "Suman",
            shop: "Keshav Fashion, Hisar",
            text: "I started selling on Meesho with 4-5 orders on the very first day. In no time I was getting over 1000 orders a day, like a dream come true.",
        },
        {
            img: mohit,
            name: "Mohit Rathi",
            shop: "Meira Jewellery, Ahmedabad",
            text: "Meesho made it extremely simple to transition to online business during lockdown. Suddenly we were all over India to our surprise, seeing up to 5X growth on sale days.",
        },
    ]

    let supplierblocks = [
        { icon: lazy, blocktitle: "0% Commission Fee", blockdesc: "Suppliers selling on Meesho keep 100% of their profit by not paying any commission" },
        { icon: penalty, blocktitle: "0 Penalty Charges", blockdesc: "Sell online without the fear of order cancellation charges with 0 Penalty for late dispatch or order cancellations." },
        { icon: growth, blocktitle: "Growth for Every Supplier", blockdesc: "From small to large and unbranded to branded, and now open for Sellers who don't have a Regular GSTIN too, Meesho fuels growth for all suppliers." },
        {
            icon: business,
            blocktitle: "Ease of Doing Business",
            blockdesc: [
                "Easy Product Listing",
                "Lowest Cost Shipping",
                "7-Day Payment Cycle from the delivery date"
            ]
        }
    ]

    const icons = {
        tag: (
            <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <path d="M16 12h22v26H22z" fill="#a89cff" />
                <path d="M4 20 18 6l16 4 4 16L24 40 4 20z" fill="#ff3d8b" />
                <circle cx="14" cy="16" r="2.2" fill="#fff" />
                <circle cx="24" cy="26" r="2.2" fill="#fff" />
                <path d="M24 14 14 28" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        shirt: (
            <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <path d="M6 4l2 3 2-3 2 3 2-3M30 4l2 3 2-3" stroke="#7b6cff" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M12 16l6-4h8l6 4 5 6-5 4-2-2v16H14V24l-2 2-5-4z" fill="#ff3d8b" />
            </svg>
        ),
        chart: (
            <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <rect x="2" y="30" width="9" height="12" rx="3" fill="#ff3d8b" />
                <rect x="15" y="22" width="9" height="20" rx="3" fill="#ff3d8b" />
                <rect x="28" y="12" width="9" height="30" rx="3" fill="#ff3d8b" />
                <path d="M3 18 24 8" stroke="#7b6cff" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="36" cy="6" r="5" fill="#a89cff" />
            </svg>
        ),
        eye: (
            <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
                <path d="M16 6l-1-4M22 5V1M28 6l1-4" stroke="#7b6cff" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M2 28c6-10 14-12 20-12s14 2 20 12c-6 8-14 10-20 10S8 36 2 28z" fill="#ff3d8b" />
                <circle cx="22" cy="27" r="8" fill="#fff" />
                <circle cx="22" cy="27" r="4" fill="#ff3d8b" />
            </svg>
        ),
    }

    const growColumns = [
        [
            { icon: icons.tag, title: "Efficient & Affordable Shipping", text: "Sell your products across India to over 28,000+ pincodes with affordable shipping solutions." },
            { icon: icons.chart, title: "Next Day Dispatch Program", text: "The Next Day Dispatch (NDD) Program supports faster shipping timelines for eligible sellers, with access to a dedicated account manager." },
        ],
        [
            {
                icon: icons.shirt,
                title: "Ads to grow more",
                text: (
                    <>
                        Use selling tools like <span className="grow-link">Meesho Ads</span> to be more visible and sell more products. Currently, not available for Sellers who don't have a Regular GSTIN
                    </>
                ),
            },
            { icon: icons.eye, title: "Business Insights", text: "Use product & price recommendations so that you’re always on top of your business" },
        ],
    ]
    const categories = [
        "Sell Sarees Online",
        "Sell Jewellery Online",
        "Sell Tshirts Online",
        "Sell Shirts Online",
        "Sell Watches Online",
        "Sell Electronics Online",
        "Sell Clothes Online",
        "Sell Socks Online",
    ]
    const footerLinks = [
        "Sell Online",
        "Pricing & Commission",
        "How it works",
        "Shipping & Returns",
        "Grow Your Business",
        "Learning Hub",
        "Meesho Ads",
        "Shop Online on Meesho",
    ];

      let navigate = useNavigate()
        const sellOnline = () => {
            navigate('/signuppage')
        }
        const howitworks = () => {
            navigate('/HowitWorks')
        }
    
        const PricingCommision = () => {
            navigate('/PricingCommision')
        }
    
        const Return = () => {
            navigate('/Return')
        }
        const Grow = () => {
            navigate('/Grow')
        }
    return (
        <div style={{ backgroundColor: "white" }}>
            <section className="becomesupplier w-full" style={{ backgroundColor: "white" }}>
                <div className="becomesupplier-container">
                    <div>
                        <div className='custom-navbar'>
                            <div className="header">
                                <a className="supplier-logo" href="/" aria-label="Meesho home">
                                    <img src={meeshoLogo} alt="Meesho" />
                                </a>
                                <nav className="nav">
                                    <a style={{ cursor: "pointer" }} onClick={sellOnline}>Sell Online</a>
                                    <a style={{ cursor: "pointer" }} onClick={howitworks}>How it works</a>
                                    <a style={{ cursor: "pointer" }} onClick={PricingCommision}>Pricing & Commission</a>
                                    <a style={{ cursor: "pointer" }} onClick={Return}>Shipping & Returns</a>
                                    <a style={{ cursor: "pointer" }} onClick={Grow}>Grow Business</a>
                                    <a style={{ cursor: "pointer" }} href="/">Don’t have GST?</a>
                                    <div className='supplierbuttons'>
                                        <Link className="supplier-login" to="/SupplierLogin">
                                            Login
                                        </Link>
                                        <Link className="supplier-start-selling" to="/StartSelling">Start Selling</Link>
                                    </div>
                                </nav>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='sectionbg' >
                    <div className='insidesection flex items-center'>
                        <div className='flex w-[58.33333333%] flex-col'>

                            <div>
                                <div className='h-[100px]'></div>
                                <div>
                                    <h1 className="main-title">
                                        Sell online to Crores of Customers <br /> at
                                        <strong className='titleinside'> 0% Commission</strong>
                                    </h1>
                                    <div className='h-[10px]'></div>
                                    <p className='supplierP'>Become a Meesho seller and grow your business across India</p>
                                    <div className='h-[10px]'></div>
                                    <div className='new-flicker'>
                                        <img src={newtag} alt="" />
                                        <p className='flickerpera'>Don’t have a GSTIN? You can still sell on Meesho.
                                            <a href="/GST"> Know More</a>
                                        </p>
                                    </div>
                                    <div className='h-[30px]'></div>
                                    <div className='startsellingbtn'>
                                        <Link to="/StartSelling">Start Selling</Link>
                                    </div>
                                </div>
                                <div className='h-[100px]'></div>
                            </div>
                        </div>
                        <div className='w-[41.66666667%]'>
                            <div className='rightdiv'>
                                <img src={DesktopPic} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="section2">
                <div className='h-[80px]'></div>
                <div className="flex gap-[16px]">

                    <div className='blocks'>
                        <h3 className='block-title'>Lakhs of</h3>
                        <h4 className='block-title2'>Sellers trust Meesho to sell online</h4>
                    </div>
                    <div className='blocks'>
                        <h3 className='block-title'>Crores of</h3>
                        <h4 className='block-title2'>Customers buying across India</h4>
                    </div>
                    <div className='blocks'>
                        <h3 className='block-title'>Thousands of</h3>
                        <h4 className='block-title2'>Serviceable pincodes across India — we deliver everywhere.</h4>
                    </div>
                    <div className='blocks'>
                        <h3 className='block-title'>Hundreds  of</h3>
                        <h4 className='block-title2'>Categories to sell online</h4>
                    </div>
                </div>

                <div className='h-[80px]'></div>
                <div className="section3">
                    <div className='flex  w-full items-center'>
                        <div className='supplierleft'>
                            <h2 className='headingh2'>Why Suppliers Love Meesho</h2>
                            <p className='supplierleftpera'>All the benefits that come with selling on Meesho are <br /> designed to help you sell more, and make it easier to grow <br />your business.</p>
                        </div>
                        <div className='supplierright '>
                            <div className='supplierblocks'>
                                {
                                    supplierblocks.map((x) => {
                                        return (
                                            <div className='supplierblock' key={x.blocktitle}>
                                                <img src={x.icon} className='blockicon' alt="" />

                                                <div className='blocktitle'>
                                                    {x.blocktitle}

                                                    {x.blocktitle === "Ease of Doing Business" ? (
                                                        <div className="business-benefits">
                                                            {x.blockdesc.map((item, index) => (
                                                                <div className="business-benefit" key={index}>
                                                                    <img src={tick} alt="" />
                                                                    <span>{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className='blockdesc'>{x.blockdesc}</div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='h-[80px]'></div>
                        </div>
                    </div>
                </div>
                <div className='h-[80px]'></div>
            </div>


            <div className="section4">
                <div className="rewards-inner">
                    <h2 className="rewards-title">
                        Exclusive Supplier+ Rewards <br /> for the first 30 days
                    </h2>

                    <article className="reward-card reward-card-a">
                        <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" className="reward-icon">
                            <path d="M18 22 40 6l7 20-22 12z" fill="#ff3d8b" />
                            <path d="M8 38 22 29l5 9-11 8a4 4 0 0 1-6-1l-3-3a4 4 0 0 1 1-4z" fill="none" stroke="#7b6cff" strokeWidth="5" strokeLinejoin="round" />
                            <path d="M40 4l2-3M47 8l4-2M49 15l4 1" stroke="#7b6cff" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <h3 className="reward-heading">Free catalog visibility of ₹600</h3>
                        <p className="reward-text">
                            Run advertisements for your catalogs to increase the visibility of your products and get more orders. Currently, not available for sellers who don’t have a Regular GSTIN.
                        </p>
                    </article>

                    <article className="reward-card reward-card-b">
                        <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" className="reward-icon">
                            <rect x="3" y="17" width="50" height="26" rx="3" stroke="#ff3d8b" strokeWidth="5" />
                            <circle cx="28" cy="30" r="5" fill="#7b6cff" />
                            <circle cx="28" cy="28" r="24" stroke="#7b6cff" strokeWidth="4" />
                            <path d="M12 44 44 12" stroke="#7b6cff" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                        <h3 className="reward-heading">No Order Cancellation Charges</h3>
                        <p className="reward-text">
                            Cancel orders that you can’t fulfil for unforeseen reasons without worrying about penalties
                        </p>
                    </article>
                </div>
            </div>
            <section className="stories">
                <h2 className="stories-title">Experiences suppliers love to talk about</h2>

                <div className="stories-grid">
                    {stories.map((s) => (
                        <article className="story" key={s.name}>
                            <div className="story-media">
                                <img src={s.img} alt={s.name} />
                                <button className="story-play" aria-label={`Play ${s.name}'s story`}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff" aria-hidden="true">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="story-body">
                                <h3 className="story-name">{s.name}</h3>
                                <p className="story-shop">{s.shop}</p>
                                <p className="story-text">{s.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
            <section className="how">
                <h2 className="how-title">How it works</h2>

                <div className="how-panel">
                    {steps.map((s, i) => (
                        <div className="how-step" key={s.title}>
                            <span className="how-num">{i + 1}</span>
                            <h3 className="how-step-title">{s.title}</h3>
                            <p className="how-step-desc">{s.desc}</p>
                            {s.list && (
                                <ul className="how-list">
                                    {s.list.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            <section className="hub">
                <div className="hub-inner">
                    <div className="hub-left">
                        <div className="hub-brand">
                            <img src={meeshologopink} alt="Meesho" className="hub-logo" />

                        </div>
                        <h2 className="hub-title">
                            Learn how to sell and grow <br /> your business on Meesho
                        </h2>
                    </div>

                    <a className="hub-btn" href="/">
                        <span className="hub-play">
                            <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff" aria-hidden="true">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </span>
                        Visit Learning Hub
                    </a>
                </div>
            </section>
            <section className="grow">
                <div className="grow-inner">
                    <h2 className="grow-title">Grow Your Business With Meesho</h2>

                    {growColumns.map((col, i) => (
                        <div className={`grow-col grow-col-${i + 1}`} key={i}>
                            {col.map((c) => (
                                <article className="grow-card" key={c.title}>
                                    <div className="grow-icon">{c.icon}</div>
                                    <h3 className="grow-card-title">{c.title}</h3>
                                    <p className="grow-card-text">{c.text}</p>
                                </article>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
            <section className="cats">
                <div className="cats-inner">
                    <h2 className="cats-title">Popular Categories to Sell Online</h2>

                    <ul className="cats-grid">
                        {categories.map((c, i) => (
                            <li key={c}>
                                <a href="/" className={i === 0 ? "cat-link cat-link-active" : "cat-link"}>
                                    {c}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <button className="cats-more" type="button">
                        View More
                        <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                            <circle cx="6" cy="6" r="5" />
                            <path d="M6 3.5v5M3.5 6h5" />
                        </svg>
                    </button>
                </div>
            </section>
            <section className="support">
                <div className="support-inner">
                    <h2 className="support-title">
                        Meesho Supplier Support <br /> Available 24/7
                    </h2>

                    <div className="support-right">
                        <p className="support-text">
                            Meesho supplier support is available to solve all your doubts and issues before and after you start your online selling business.
                        </p>

                        <div className="support-mail">
                            <span className="support-mail-icon">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="1.3" aria-hidden="true">
                                    <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
                                    <path d="M3 6l9 7 9-7M3 18l6.5-6M21 18l-6.5-6" />
                                </svg>
                            </span>
                            <div>
                                <div className="support-mail-label">You can reach out to</div>
                                <a href="mailto:sell@meesho.com" className="support-mail-link">sell@meesho.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <img src={footerlogo} alt="Meesho" className="footer-logo" />
                            <p className="footer-tagline">
                                Sell your products to crores of customers on Meesho at 0% commission
                            </p>
                            <Link to="/StartSelling" className="footer-cta">Start Selling</Link>
                        </div>

                        <div className="footer-col">
                            <h3 className="footer-heading">Sell on Meesho</h3>
                            <ul className="footer-links">
                                {footerLinks.map((l) => (
                                    <li key={l}><a href="/">{l}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h3 className="footer-heading">Contact Us</h3>
                            <a href="mailto:sell@meesho.com" className="footer-mail">sell@meesho.com</a>
                            <div className="footer-social">
                                <a href="/" aria-label="Instagram">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden="true">
                                        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                                        <circle cx="12" cy="12" r="4" />
                                        <circle cx="17" cy="7" r="0.8" fill="#fff" />
                                    </svg>
                                </a>
                                <a href="/" aria-label="Facebook">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff" aria-hidden="true">
                                        <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.7V13h2.7v8z" />
                                    </svg>
                                </a>
                                <a href="/" aria-label="YouTube">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff" aria-hidden="true">
                                        <path d="M21 8.2a2.5 2.5 0 0 0-1.8-1.8C17.7 6 12 6 12 6s-5.700 0-7.200.4A2.500 2.500 0 0 0 3 8.200C2.600 9.700 2.600 12 2.600 12s0 2.300.4 3.800a2.500 2.500 0 0 0 1.800 1.800C6.300 18 12 18 12 18s5.700 0 7.200-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.500.4-3.800.4-3.800s0-2.300-.4-3.800zM10.200 14.600V9.400l4.400 2.600z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        © 2015-22 Meesho Inc. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div >
    )
}
