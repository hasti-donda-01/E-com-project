// Financial reports, earnings releases, and shareholder documents
import { FiDownload, FiFileText } from 'react-icons/fi';
import InvestorFooter from './InvestorFooter';
import InvestorHeader from './InvestorHeader';

// Quarterly financial table columns and row types
const financialColumns = ['Q1', 'Q2', 'Q3', 'Q4'];

const financialRows = [
    'Shareholders’ Letter',
    'Press Release',
    'Financial Results',
    'KPI databook',
    'Earnings call note',
    'Earnings call replay',
    'Earnings call transcript'
];

// Downloadable reports and statutory filings
const documentSections = [
    {
        title: 'Annual Report',
        documents: [
            'Annual Report FY 2025-26',
            'Annual Report FY 2024-25',
            'Annual Report FY 2023-24',
            'Annual Report FY 2022-23'
        ]
    },
    {
        title: 'Annual General Meetings',
        documents: [
            'Voting Results and Scrutinizer’s Report of the 11th Annual General Meeting of the Members of Meesho Limited',
            'Summary Proceedings of the 11th Annual General Meeting of the Members of Meesho Limited held on Friday, September 18, 2026',
            'Newspaper publication of corrigendum to the AGM Notice of the Company',
            'Corrigendum to the Notice of the Annual General Meeting',
            'Draft Articles of Association',
            'Communication sent to the shareholders with Annual Report including AGM notice of the Company for the Financial Year 2025-26',
            'Newspaper publication - Post Dispatch',
            'Business Responsibility and Sustainability Reporting (BRSR) for FY 2025-26',
            'Notice of 11th Annual General Meeting for financial year 2025-26',
            'ESOP Disclosure - Regulation 14 of SEBI (Share Based Employee Benefits and Sweat Equity) Regulations',
            'Newspaper publication - Pre Dispatch'
        ]
    },
    {
        title: 'Postal Ballot',
        documents: [
            'Postal Ballot Outcome dated 12.07.2026',
            'Postal Ballot Notice dated 10.06.2026'
        ]
    },
    {
        title: 'Subsidiaries Financials',
        documents: [
            'Meesho Payments Private Limited FY 2025-26',
            'Meesho Grocery Private Limited FY 2025-26',
            'Meesho Technologies Private Limited FY 2025-26',
            'Meesho Network LLC'
        ]
    }
];

function ReportCard({ quarter, variant }) {
    return (
        <article className={`financial-report-card ${variant}`}>
            <div className="financial-report-art">
                <span className="financial-report-logo">m</span>
                <div className="financial-report-illustration" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                </div>
                <span className="financial-report-caption">DEMOCRATISING<br />INTERNET COMMERCE</span>
            </div>
            <strong>{quarter}</strong>
        </article>
    );
}

export default function InvestorFinancials() {
    return (
        <div className="investor-page">
            <InvestorHeader />
            <main className="investor-financials-page">
                <h1>Financials</h1>

                <section className="financial-report-gallery" aria-label="Quarterly reports">
                    <ReportCard quarter="Q1 FY27" variant="report-pink" />
                    <ReportCard quarter="Q4 FY26" variant="report-orange" />
                    <ReportCard quarter="Q3 FY26" variant="report-map" />
                </section>

                <section className="financial-results" aria-label="Quarterly financial results">
                    <div className="financial-results-tabs">
                        <span aria-hidden="true">‹</span>
                        <strong>Results</strong>
                        <a href="#annual-report">Annual Report</a>
                        <a href="#annual-general-meetings">Annual General Meetings</a>
                        <a href="#postal-ballot">Postal Ballot</a>
                        <a href="#subsidiaries-financials">Subsidiaries Financials</a>
                        <span aria-hidden="true">›</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col"><span className="visually-hidden">Report</span></th>
                                {financialColumns.map((column) => <th scope="col" key={column}>{column}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {financialRows.map((row, index) => (
                                <tr key={row}>
                                    <th scope="row">{row}</th>
                                    {financialColumns.map((column, columnIndex) => (
                                        <td key={`${row}-${column}`}>
                                            {index < 3 && columnIndex === 0
                                                ? <span className="financial-file-label">PDF</span>
                                                : <span className="financial-unavailable">—</span>}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <div className="financial-document-sections">
                    {documentSections.map((section) => {
                        const sectionId = section.title.toLowerCase().replaceAll(' ', '-');
                        return (
                            <section className="financial-document-section" id={sectionId} key={section.title}>
                                <h2>{section.title}</h2>
                                <ul>
                                    {section.documents.map((document) => (
                                        <li key={document}>
                                            <span>{document}</span>
                                            <FiFileText aria-hidden="true" />
                                            <FiDownload aria-hidden="true" />
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        );
                    })}
                </div>
            </main>
            <InvestorFooter />
        </div>
    );
}
