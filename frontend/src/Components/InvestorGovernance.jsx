import { useRef, useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import InvestorFooter from './InvestorFooter';
import InvestorHeader from './InvestorHeader';
import rohit from './Images/rohit.jpg';
import mukul from './Images/mukul.jpg';
import hari from './Images/hari.jpg';
import kimuska from './Images/kimuska.jpg'
import mohit2 from './Images/mohit2.jpg'

import sanjeev from './Images/sanjeev.jpg'
import vidit from './Images/vidit.jpg'

const boardMembers = [
    [
        { name: 'Vidit Aatrey', role: 'Chairman, Managing Director and CEO', image: vidit },
        { name: 'Sanjeev Kumar', role: 'Whole-time Director and CTO', image: sanjeev }
    ],
    [
        { name: 'Rohit Bhagat', role: 'Independent Director', image: rohit },
        { name: 'Hari Shankar Bhartia', role: 'Independent Director', image: hari },
        { name: 'Kimisuka Narimatsu', role: 'Independent Director', image: kimuska }
    ],
    [
        { name: 'Mukil Arora', role: 'Non-Executive Non-Independent Director', image: mukul },
        { name: 'Mohit Bhatnagar', role: 'Non-Executive Non-Independent Director', image: mohit2 }
    ]
];

const committees = [
    {
        title: 'Audit Committee',
        members: [
            ['Kimisuka Narimatsu', 'Independent Director (Chairperson)'],
            ['Rohit Bhagat', 'Independent Director (Member)'],
            ['Mukil Arora', 'Non-Executive Non-Independent Director (Member)']
        ]
    },
    {
        title: 'Nomination & Remuneration Committee',
        members: [
            ['Rohit Bhagat', 'Independent Director (Chairperson)'],
            ['Mohit Bhatnagar', 'Non-Executive Non-Independent Director (Member)']
        ]
    },
    {
        title: 'Stakeholders’ Relationship Committee',
        members: [
            ['Mohit Bhatnagar', 'Non-Executive Non-Independent Director (Chairperson)'],
            ['Hari Shankar Bhartia', 'Independent Director (Member)'],
            ['Sanjeev Kumar', 'Whole-time Director and CTO (Member)']
        ]
    },
    {
        title: 'Risk Management Committee',
        members: [
            ['Kimisuka Narimatsu', 'Independent Director (Chairperson)'],
            ['Sanjeev Kumar', 'Whole-time Director and CTO (Member)'],
            ['Dhiraj Sinha', 'Chief Financial Officer (Member)']
        ]
    },
    {
        title: 'Corporate Social Responsibility Committee',
        members: [
            ['Hari Shankar Bhartia', 'Independent Director (Chairperson)'],
            ['Vidit Aatrey', 'Chairman and Managing Director'],
            ['Sanjeev Kumar', 'Whole-time Director and CTO']
        ]
    }
];

const documentSections = [
    {
        title: 'Disclosures under Regulation 46 of SEBI (LODR) Regulations, 2015',
        id: 'sebi-disclosures',
        documents: [
            'Details of Company’s Business',
            'Memorandum of Association and Articles of Association',
            'Brief profile of Board of Directors including expertise and qualifications',
            'Terms and conditions of appointment of Independent Directors',
            'Composition of various committees of Board of Directors',
            'Code of Conduct of Board of Directors and Senior Management Personnel',
            'Whistle Blower Policy',
            'Criteria of making payments to non-executive directors',
            'Policy on Materiality of Related Party Transactions and dealing with Related Party Transactions',
            'Policy for determining Material Subsidiaries',
            'Details of familiarization programmes imparted to Independent Directors',
            'Email address for grievance redressal and other relevant details',
            'Contact information of the designated officials responsible for assisting and handling investor grievances',
            'Financial information including quarterly and annual results',
            'A notice of meeting of the Board of Directors where financial results shall be discussed',
            'Annual report, including notice of meeting of the board of directors',
            'Shareholding pattern',
            'Details of agreements entered into with the media companies',
            'Presentations made by the Company for Analysts or institutional investors',
            'Auditor’s certificates and reports',
            'Name and details of the Registrar and Transfer Agent',
            'Items in Regulation 47(1)',
            'Separate audited financial statements of each subsidiary',
            'Secretarial compliance report',
            'Disclosures under Regulation 30 of SEBI (LODR) Regulations',
            'Statements of deviation or variation',
            'Dividend distribution policy',
            'Annual Return',
            'Employee Benefit Scheme Documents'
        ]
    },
    {
        title: 'Policies and Codes',
        id: 'policies-codes',
        documents: [
            'Corporate Social Responsibility Policy',
            'Risk Management Policy',
            'Whistleblower Policy',
            'Code of Practices and Procedures for Fair Disclosure of Unpublished Price Sensitive Information (UPSI)',
            'Nomination and Remuneration Policy',
            'Code of Conduct for Board of Directors and Senior Management',
            'Policy on Familiarisation Programme for Independent Directors',
            'Policy for Determining Material Subsidiaries',
            'Policy on Materiality of Related Party Transactions',
            'Dividend Distribution Policy',
            'Archival Policy',
            'Policy on Disclosure of Material Events and Information',
            'Terms and conditions for Independent Directors’ appointment'
        ]
    },
    {
        title: 'Charter Documents',
        id: 'charter-documents',
        documents: [
            'Articles of Association (AOA)',
            'Memorandum of Association (MOA)',
            'Certificate of Incorporation'
        ]
    },
    {
        title: 'Shareholding Pattern',
        id: 'shareholding-pattern',
        documents: [
            'Shareholding Pattern as on September 30, 2026',
            'Shareholding Pattern as on June 30, 2026',
            'Shareholding Pattern as on March 31, 2026',
            'Shareholding Pattern as on December 31, 2025'
        ]
    },
    {
        title: 'Corporate Governance',
        id: 'corporate-governance',
        documents: [
            'Corporate Governance Report as on September 30, 2026',
            'Corporate Governance Report as on June 30, 2026',
            'Corporate Governance Report as on March 31, 2026',
            'Corporate Governance Report as on December 31, 2025'
        ]
    },
    {
        title: 'Annual Returns',
        id: 'annual-returns',
        documents: [
            'Annual return 2026',
            'Annual return 2025',
            'Annual return 2024',
            'Annual return 2023',
            'Annual return 2022',
            'Annual return 2021'
        ]
    },
    {
        title: 'Statement on Deviation / Variation',
        id: 'deviation-variation',
        documents: [
            'Statement on Deviation / Variation - Q4 FY26',
            'Statement on Deviation / Variation - Q2 FY26'
        ]
    },
    {
        title: 'Other Documents',
        id: 'other-documents',
        documents: [
            'Related Party Transactions entered during the half year ended March 31, 2026',
            'Familiarisation programmes during the financial year 2025-26',
            'Employee Stock Option Plan 2024'
        ]
    }
];

const governanceSections = [
    { label: 'Board', id: 'board' },
    { label: 'Committee Composition', id: 'committee-composition' },
    { label: 'Disclosures under Reg 46 of SEBI LODR', id: 'sebi-disclosures' },
    { label: 'Policies and Code', id: 'policies-codes' },
    { label: 'Charter Documents', id: 'charter-documents' },
    { label: 'Shareholding Pattern', id: 'shareholding-pattern' },
    { label: 'Corporate Governance', id: 'corporate-governance' },
    { label: 'Annual Returns', id: 'annual-returns' },
    { label: 'Statement on Deviation / Variation', id: 'deviation-variation' },
    { label: 'Other Documents', id: 'other-documents' }
];

function DocumentSection({ section }) {
    return (
        <section className="governance-document-section" id={section.id}>
            <h2>{section.title}</h2>
            <ul>
                {section.documents.map((document) => (
                    <li key={document}>
                        <span>{document}</span>
                        <FiFileText aria-hidden="true" />
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function InvestorGovernance() {
    const sectionNavRef = useRef(null);
    const [activeSection, setActiveSection] = useState('board');

    const scrollSectionNav = (direction) => {
        sectionNavRef.current?.scrollBy({
            left: direction * 260,
            behavior: 'smooth'
        });
    };

    return (
        <div className="investor-page investor-governance-layout">
            <InvestorHeader />
            <main className="investor-governance-page">
                <h1>Governance</h1>
                <nav className="governance-section-nav" aria-label="Governance sections">
                    <button
                        type="button"
                        aria-label="Scroll section tabs left"
                        onClick={() => scrollSectionNav(-1)}
                    >
                        ‹
                    </button>
                    <div className="governance-section-nav-links" ref={sectionNavRef}>
                        {governanceSections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className={activeSection === section.id ? 'is-active' : ''}
                                aria-current={activeSection === section.id ? 'location' : undefined}
                                onClick={() => setActiveSection(section.id)}
                            >
                                {section.label}
                            </a>
                        ))}
                    </div>
                    <button
                        type="button"
                        aria-label="Scroll section tabs right"
                        onClick={() => scrollSectionNav(1)}
                    >
                        ›
                    </button>
                </nav>

                <section className="governance-board-section" id="board">
                    <h2>Board</h2>
                    {boardMembers.map((group, index) => (
                        <div className="governance-board-grid" key={`board-group-${index}`}>
                            {group.map((member) => (
                                <article className="governance-board-card" key={member.name}>
                                    <img src={member.image} alt="" loading="lazy" />
                                    <h3>{member.name}</h3>
                                    <p>{member.role}</p>
                                </article>
                            ))}
                        </div>
                    ))}
                </section>

                <section className="governance-committee-section" id="committee-composition">
                    <h2>Committee Composition</h2>
                    {committees.map((committee) => (
                        <section className="governance-committee" key={committee.title}>
                            <h3>{committee.title}</h3>
                            <div className="governance-committee-members">
                                {committee.members.map(([name, role]) => (
                                    <div key={`${committee.title}-${name}`}>
                                        <strong>{name}</strong>
                                        <span>{role}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </section>

                {documentSections.map((section) => (
                    <DocumentSection key={section.id} section={section} />
                ))}
            </main>
            <InvestorFooter />
        </div>
    );
}
