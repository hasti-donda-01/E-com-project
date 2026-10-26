import { useState } from 'react';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';
import InvestorFooter from './InvestorFooter';
import InvestorHeader from './InvestorHeader';
import stakeholderAmit from './Images/amit.jpg';
import stakeholderMohit from './Images/mohit.jpg';
import stakeholderSuman from './Images/suman.jpg';
import appPreview from './Images/mallimg.jpg';

const stakeholders = [
    { name: 'Users', detail: 'Everyday entrepreneurs', image: stakeholderAmit },
    { name: 'Sellers', detail: 'Small businesses', image: stakeholderMohit },
    { name: 'Logistics Providers', detail: 'Delivery partners', image: stakeholderSuman },
    { name: 'Content Creators', detail: 'Creator community', image: stakeholderAmit }
];

const experiences = {
    Consumer: {
        description: 'Discover quality products across fashion, home, beauty and more at affordable prices.',
        features: ['Assisted Shopping', 'Entertainment', 'Hyper personalisation + Value Retail', 'Vernacular'],
        imageAlt: 'Preview of the Meesho shopping experience'
    },
    Seller: {
        description: 'Grow your business online with tools that help you reach customers across India.',
        features: ['Easy onboarding', 'Manage your catalogue', 'Track your orders', 'Business insights'],
        imageAlt: 'Preview of tools for Meesho sellers'
    }
};

export default function Inverster() {
    const [activeExperience, setActiveExperience] = useState('Consumer');
    const experience = experiences[activeExperience];

    return (
        <div className="investor-page">
            <InvestorHeader />
            <main>
                <section className="investor-intro" id="home">
                    <p className="investor-eyebrow">MEESHO INVESTOR RELATIONS</p>
                    <h1>Meesho is democratising internet commerce for everyone</h1>
                    <p>
                        For every Indian household and small business, Meesho is building
                        accessible and affordable commerce for a billion Indians.
                    </p>
                </section>

                <section className="investor-presentation" id="financials" aria-label="Company presentation">
                    <div className="investor-presentation-cover">
                        <span className="investor-presentation-mark">m</span>
                        <div>
                            <p>MEESHO</p>
                            <h2>Company<br />Presentation</h2>
                            <span>July 2026</span>
                        </div>
                        <div className="investor-presentation-phone">
                            <img src={appPreview} alt="Meesho app preview" />
                        </div>
                    </div>
                    <div className="investor-presentation-controls">
                        <button type="button" aria-label="Previous presentation slide"><FiChevronLeft /></button>
                        <span>1</span><span>/</span><span>5</span>
                        <button type="button" aria-label="Next presentation slide"><FiChevronRight /></button>
                        <a href="#stakeholders"><FiDownload aria-hidden="true" /> Presentation</a>
                    </div>
                </section>

                <section className="investor-stakeholders" id="governance">
                    <div className="investor-section-heading">
                        <p className="investor-eyebrow">OUR COMMUNITY</p>
                        <h2>Built With Our Stakeholders</h2>
                    </div>
                    <div className="investor-stakeholder-grid">
                        {stakeholders.map((stakeholder) => (
                            <article className="investor-stakeholder-card" key={stakeholder.name}>
                                <img src={stakeholder.image} alt="" loading="lazy" />
                                <div>
                                    <h3>{stakeholder.name}</h3>
                                    <p>{stakeholder.detail}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="investor-experience" id="announcements">
                    <div className="investor-section-heading">
                        <p className="investor-eyebrow">COMMERCE FOR EVERYONE</p>
                        <h2>Our App Experience</h2>
                    </div>
                    <div className="investor-experience-tabs" role="tablist" aria-label="App experience">
                        {Object.keys(experiences).map((name) => (
                            <button
                                key={name}
                                type="button"
                                role="tab"
                                aria-selected={activeExperience === name}
                                className={activeExperience === name ? 'is-active' : ''}
                                onClick={() => setActiveExperience(name)}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                    <div className="investor-experience-panel" id="resources">
                        <ul>
                            {experience.features.map((feature) => (
                                <li key={feature}>
                                    <span aria-hidden="true">✦</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <div className="investor-phone-preview">
                            <div className="investor-phone-speaker" />
                            <img src={appPreview} alt={experience.imageAlt} loading="lazy" />
                        </div>
                        <p className="investor-experience-description">{experience.description}</p>
                    </div>
                </section>

                <section className="investor-download-banner">
                    <div>
                        <p className="investor-eyebrow">MADE FOR INDIA</p>
                        <h2>Discover commerce that works for everyone</h2>
                        <p>Explore how Meesho is creating opportunities across India.</p>
                    </div>
                    <a href="/"><span>Explore Meesho</span><FiArrowRight aria-hidden="true" /></a>
                </section>
            </main>
            <InvestorFooter />
        </div>
    );
}
