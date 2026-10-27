// Investor contacts and registrar information page (compliance officer, office address, and RTA)
import InvestorFooter from './InvestorFooter';
import InvestorHeader from './InvestorHeader';

export default function InvestorResources() {
    return (
        <div className="investor-page investor-resources-layout">
            <InvestorHeader />
            <main className="investor-resources-page">
                <div className="investor-resources-content">
                    <h1>Resources</h1>
                    <h2>Contact Us</h2>
                    <div className="investor-contact-grid">
                        <div className="investor-contact-column">
                            <section className="investor-contact-block">
                                <h3>Queries and Grievance Redressal</h3>
                                <p><strong>Rahul Bhardwaj</strong></p>
                                <p>Company Secretary &amp; Compliance Officer</p>
                                <a href="mailto:cs@meesho.com">cs@meesho.com</a>
                            </section>

                            <section className="investor-contact-block">
                                <h3>Investor Relations</h3>
                                <a href="mailto:investorrelations@meesho.com">investorrelations@meesho.com</a>
                            </section>

                            <section className="investor-contact-block">
                                <h3>Registered Office Address</h3>
                                <p><strong>Meesho Limited</strong></p>
                                <p>(Formerly known as Fashnear Technologies Private Limited)</p>
                                <p>CIN: U74140KA2015PTC082263</p>
                                <p>3rd Floor, Tower D, Helios Business Park,</p>
                                <p>Kadubeesanahalli, Bengaluru, Karnataka 560103</p>
                                <p>India</p>
                            </section>

                            <div className="investor-resource-links">
                                <a href="https://www.bseindia.com/" target="_blank" rel="noreferrer">Secretarial Compliance</a>
                                <span>|</span>
                                <a href="https://www.nseindia.com/" target="_blank" rel="noreferrer">SEBI SCORES Portal</a>
                            </div>
                        </div>

                        <section className="investor-contact-block investor-rta-block">
                            <h3>Registrar &amp; Transfer Agent</h3>
                            <p><strong>KFin Technologies Limited</strong></p>
                            <p>Selenium Tower B, Plot No. 31 &amp; 32, Financial District,</p>
                            <p>Nanakramguda, Serilingampally, Hyderabad 500032, Telangana, India</p>
                            <p><a href="tel:+914067162222">+91 40 6716 2222 / 1800 309 4001</a></p>
                            <p><a href="mailto:einward.ris@kfintech.com">einward.ris@kfintech.com</a></p>
                            <p><a href="https://www.kfintech.com/" target="_blank" rel="noreferrer">https://www.kfintech.com</a></p>
                            <p>Website: <a href="https://www.kfintech.com/" target="_blank" rel="noreferrer">https://www.kfintech.com</a></p>
                            <p>Contact Person: Mr. S. V. Raju</p>
                            <p>SEBI Registration Number: INR000000221</p>
                        </section>
                    </div>
                </div>
            </main>
            <InvestorFooter />
        </div>
    );
}
