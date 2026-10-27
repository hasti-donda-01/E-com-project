// Customer sign-up / login screen with phone number
import { useState } from 'react'
import meeshologo from './Images/meeshoLogo.svg'
import { useDispatch, useSelector } from 'react-redux'
import { addCustomer } from '../redux/action/customerApi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CiSearch } from 'react-icons/ci'

export default function CutomerSignUp() {
    // Phone number input state
    const [phoneNumber, setPhoneNumber] = useState('')
    // Search query state
    const [searchTerm, setSearchTerm] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const location = useLocation();

    // Redux auth state
    const { status, error, message } = useSelector((state) => state.customer)

    // Handle catalog search
    const handleSearch = (event) => {
        event.preventDefault();
        const query = searchTerm.trim();
        navigate(query ? `/?search=${encodeURIComponent(query)}#products-catalog` : '/');
    };

    // Request OTP and navigate to OTP verification screen
    const submitData = async () => {
        try {
            await dispatch(addCustomer({ phone: phoneNumber })).unwrap()
            navigate('/verify-otp', {
                state: {
                    phoneNumber,
                    returnTo: location.state?.returnTo,
                    resumeAddToCart: location.state?.resumeAddToCart,
                    resumeBuyNow: location.state?.resumeBuyNow,
                    resumeAddToWishlist: location.state?.resumeAddToWishlist
                }
            })
        } catch {
            // Error message is displayed from Redux state
        }
    }
    return (
        <div>
            <div className='customerheader'>
                <div className='customerheader1'>
                    <div className='customerheader2'>
                        <div className='customerheader3'>
                            <a href='/'>
                                <img src={meeshologo} alt='meeshoLogo' />
                            </a>
                        </div>

                        <div className='customerheader4'>
                            <form className='customerheader5' role="search" onSubmit={handleSearch}>
                                <div className='customerheader6'>
                                    <button
                                        type="submit"
                                        aria-label="Search products"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            color: '#666'
                                        }}
                                    >
                                        <CiSearch size={20} aria-hidden="true" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Try Saree, Kurti or Search by Product Code"
                                    className='customerheader7'
                                    style={{ outline: 'none' }}
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    aria-label="Search products"
                                />
                            </form>

                            <div className='customerheader8'>
                                <Link to="/Becomesupplier" className='customerheader9' style={{ textDecoration: 'none' }}>
                                    <span className='customerheader10'>
                                        Become a Supplier
                                    </span>
                                </Link>
                                <div className='customerheader11'>

                                </div>
                                <Link to="/Inverster" className='customerheader9' style={{ textDecoration: 'none' }}>
                                    <span className='customerheader10'>
                                        Investor Relations
                                    </span>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="eOwSMC">
                <div className="sc-kFkjun lgbbvF AuthWrapperstyled__StyledCard-sc-1plclw5-1 kxEhGu" color="white"><div className="sc-kFkjun ghANen AuthWrapperstyled__StyledImgWrapper-sc-1plclw5-8 dRTrGm" color="white"><picture><source srcSet="https://images.meesho.com/images/marketing/1661417516766.webp" type="image/webp" className="lazyload" /><img src="https://images.meesho.com/images/marketing/1661417516766.webp" width="433" height="200" className="lazyload AuthWrapperstyled__StyledPerfImage-sc-1plclw5-9 kSgJsB" alt="banner" /></picture></div><div className="sc-kFkjun ghANen AuthWrapperstyled__StyledCard2-sc-1plclw5-3 VMhsx" color="white"><div className="sc-kFkjun isIvud" color="white"><h6 font-size="20px" font-weight="bold" color="greyBase" className="sc-dOfePm bzKJDM">Login or sign up to continue</h6><div className="sc-kFkjun cuomGy Authstyled__StyledCard-sc-2hunyy-2 icAkSj" color="white"><div className="CountryDropdown__StyledWrapper-sc-xzyn0c-0 eIhKkE"><span font-size="12px" font-weight="book" color="greyT2" className="sc-dOfePm czKNKx">Country</span><span font-size="16px" font-weight="demi" color="greyBase" className="sc-dOfePm fJsHQf">🇮🇳 +91</span><div className="sc-jXuTBK kUFBUY"></div></div>                <div className="Input__InputContainer-sc-1goybxj-0 gcwUCC"><input placeholder=" phone number" type="tel" maxLength="10" autoComplete="off" className="Input__InputField-sc-1goybxj-1 chAFGe" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value.replace(/\D/g, '').slice(0, 10))} /></div></div>

                    <button type="submit" className="sc-cRHGzb heoOeY Authstyled__StyledButton-sc-2hunyy-1 gJbiA-D" color="#ffffff" font-size="15px" onClick={submitData} disabled={status === 'loading'}><div className="sc-jOTjWM knCwk"><span font-size="18px" font-weight="demi" color="#ffffff" className="sc-dOfePm lgUtFF">{status === 'loading' ? 'Saving...' : 'Continue'}</span></div></button>
                    {error && <p role="alert">{error}</p>}
                    {message && <p role="status">{message}</p>}

                </div><span font-size="12px" font-weight="demi" color="greyT2" className="sc-dOfePm fsmGU AuthWrapperstyled__StyledCaption-sc-1plclw5-4 bsTzl" width="1920">By continuing, you agree to Meesho’s&nbsp;<a href="https://www.meesho.com/legal/terms-conditions"><span font-size="12px" font-weight="demi" className="sc-dOfePm kcOfNW AuthWrapperstyled__StyledCaptionLink-sc-1plclw5-7 guLGkI" color="pinkBase">Terms &amp; Conditions &nbsp;</span></a>and &nbsp;<a href="https://www.meesho.com/legal/privacy"><span font-size="12px" font-weight="demi" className="sc-dOfePm kcOfNW AuthWrapperstyled__StyledCaptionLink-sc-1plclw5-7 guLGkI" color="pinkBase">Privacy Policy</span></a></span></div></div>
            </main>
        </div>
    )
}
