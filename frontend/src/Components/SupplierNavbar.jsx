import { Link, useNavigate } from 'react-router-dom';
import meeshoLogo from './Images/meeshoLogo.svg'
import ProfileMenu from './ProfileMenu';

export default function SupplierNavbar() {
    let navigate = useNavigate()
    const GST = () => {
        navigate('/GST')
    }
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
                        <a style={{ cursor: "pointer" }} onClick={GST}>Don’t have GST?</a>
                        <div className='supplierbuttons'>
                            <ProfileMenu variant="supplier" />
                            <Link className="supplier-login" to="/SupplierLogin">
                                Login
                            </Link>
                            <Link className="supplier-start-selling" to="/signuppage">Start Selling</Link>
                        </div>
                    </nav>
                </div>
                <div>
                </div>
            </div>
        </div>
    )
}
