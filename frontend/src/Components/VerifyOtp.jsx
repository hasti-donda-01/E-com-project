import { useState, useRef, useEffect } from 'react'
import meeshologo from './Images/meeshoLogo.svg'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addCustomer, verifyCustomer } from '../redux/action/customerApi'

export default function VerifyOtp() {

    const location = useLocation()
    const navigate = useNavigate()
    const [phoneNumber, setPhoneNumber] = useState(location.state?.phoneNumber || '')
    const [showOtp, setShowOtp] = useState(Boolean(location.state?.phoneNumber))
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [otpError, setOtpError] = useState('')
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const [seconds, setSeconds] = useState(60)
    const inputRefs = useRef([])


    const dispatch = useDispatch()
    const { status, error, message } = useSelector((state) => state.customer)

    // countdown for "Resend OTP in N s"
    useEffect(() => {
        if (!showOtp || seconds <= 0) return
        const timer = setTimeout(() => setSeconds((s) => s - 1), 1000)
        return () => clearTimeout(timer)
    }, [showOtp, seconds])

    // focus first box when OTP screen opens
    useEffect(() => {
        if (showOtp) inputRefs.current[0]?.focus()
    }, [showOtp])

    const submitData = async () => {
        try {
            // works if addCustomer is a createAsyncThunk
            await dispatch(addCustomer({ phone: phoneNumber })).unwrap()
            setOtp(['', '', '', '', '', ''])
            setSeconds(60)
            setShowOtp(true)
            // navigate('/')
        } catch {
            // error is shown from redux state below
        }
    }

    const handleOtpChange = (value, index) => {
        const digit = value.replace(/\D/g, '').slice(-1)
        const next = [...otp]
        next[index] = digit
        setOtp(next)
        setOtpError('')
        if (digit && index < 5) inputRefs.current[index + 1]?.focus()
    }

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpPaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (!pasted) return
        const next = ['', '', '', '', '', '']
        pasted.split('').forEach((d, i) => (next[i] = d))
        setOtp(next)
        inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }

    const resendOtp = async () => {
        if (seconds > 0) return
        try {
            await dispatch(addCustomer({ phone: phoneNumber })).unwrap()
            setSeconds(60)
        } catch {
            // The rejected request message is displayed from Redux state.
        }
    }

    const verifyOtp = async () => {
        const code = otp.join('')
        if (code.length !== 6) {
            setOtpError('Enter the 6-digit OTP sent to your phone.')
            return
        }
        setOtpError('')
        try {
            await dispatch(verifyCustomer({ phone: phoneNumber, otp: code })).unwrap()
            navigate(location.state?.returnTo || '/', {
                state: location.state?.resumeAddToCart
                    ? { resumeAddToCart: true }
                    : location.state?.resumeBuyNow
                        ? { resumeBuyNow: true }
                        : location.state?.resumeAddToWishlist
                            ? { resumeAddToWishlist: true }
                            : null,
                replace: true
            })
        } catch {
            // The rejected request message is displayed from Redux state.
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
                            <div placeholder="Try Saree, Kurti or Search by Product Code" className='customerheader5'>
                                <div className='customerheader6'>
                                    <input type="text" placeholder="Try Saree, Kurti or Search by Product Code" className='customerheader7' />
                                </div>
                            </div>

                            <div className='customerheader8' style={{ color: "white" }}>
                                <div className='customerheader9'>
                                    <span className='customerheader10'>
                                        Become a Supplier
                                    </span>
                                </div>
                                <div className='customerheader11'>

                                </div>
                                <div className='customerheader9'>
                                    <span className='customerheader10'>
                                        Investor Relations
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="eOwSMC">
                <div className="sc-kFkjun lgbbvF AuthWrapperstyled__StyledCard-sc-1plclw5-1 kxEhGu" color="white"><div className="sc-kFkjun ghANen AuthWrapperstyled__StyledImgWrapper-sc-1plclw5-8 dRTrGm" color="white"><picture><source srcSet="https://images.meesho.com/images/marketing/1661417516766.webp" type="image/webp" className="lazyload" /><img src="https://images.meesho.com/images/marketing/1661417516766.webp" width="433" height="200" className="lazyload AuthWrapperstyled__StyledPerfImage-sc-1plclw5-9 kSgJsB" alt="banner" /></picture></div><div className="sc-kFkjun ghANen AuthWrapperstyled__StyledCard2-sc-1plclw5-3 VMhsx" color="white"><div className="sc-kFkjun isIvud" color="white">

                    {!showOtp ? (
                        <>
                            <h6 color="greyBase" className="sc-dOfePm bzKJDM">Login or sign up to continue</h6><div className="sc-kFkjun cuomGy Authstyled__StyledCard-sc-2hunyy-2 icAkSj" color="white"><div className="CountryDropdown__StyledWrapper-sc-xzyn0c-0 eIhKkE"><span color="greyT2" className="sc-dOfePm czKNKx">Country</span><span color="greyBase" className="sc-dOfePm fJsHQf">🇮🇳 +91</span><div className="sc-jXuTBK kUFBUY"></div></div>                <div className="Input__InputContainer-sc-1goybxj-0 gcwUCC"><input placeholder=" phone number" type="tel" maxLength="10" autoComplete="off" className="Input__InputField-sc-1goybxj-1 chAFGe" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value.replace(/\D/g, '').slice(0, 10))} /></div></div>

                            <button type="submit" className="sc-cRHGzb heoOeY Authstyled__StyledButton-sc-2hunyy-1 gJbiA-D" color="#ffffff" onClick={submitData} disabled={status === 'loading'}><div className="sc-jOTjWM knCwk"><span color="#ffffff" className="sc-dOfePm lgUtFF">{status === 'loading' ? 'Saving...' : 'Continue'}</span></div></button>
                            {error && <p role="alert">{error}</p>}
                            {message && <p role="status">{message}</p>}
                        </>
                    ) : (
                        <>
                            <h6 color="greyBase" className="sc-dOfePm bzKJDM">Enter OTP sent to {phoneNumber}</h6>

                                <button
                                    type="button"
                                className="sc-dOfePm kcOfNW AuthWrapperstyled__StyledCaptionLink-sc-1plclw5-7 guLGkI"
                                    style={{ display: 'block', marginTop: 16, fontSize: 15, fontWeight: 600, letterSpacing: 0.3, cursor: 'pointer', border: 0, background: 'none', padding: 0 }}
                                onClick={() => setShowOtp(false)}
                            >
                                CHANGE NUMBER
                                </button>

                            <div style={{ display: 'flex', gap: 16, marginTop: 52 }} onPaste={handleOtpPaste}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => (inputRefs.current[i] = el)}
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={1}
                                        autoComplete={i === 0 ? 'one-time-code' : 'off'}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, i)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                                        onFocus={() => setFocusedIndex(i)}
                                        onBlur={() => setFocusedIndex(-1)}
                                        style={{
                                            width: 30, border: 'none', outline: 'none', background: 'transparent',
                                            borderBottom: focusedIndex === i ? '2px solid #9f2089' : '1px solid #353543',
                                            textAlign: 'center', fontSize: 22, fontWeight: 600,
                                            color: '#353543', padding: '4px 0', borderRadius: 0
                                        }}
                                    />
                                ))}
                            </div>

                            <p style={{ margin: '28px 0 24px', fontSize: 12, color: '#8b8ba7' }}>
                                {seconds > 0 ? (
                                    <>Resend OTP in {seconds} s</>
                                ) : (
                                    <button type="button" style={{ color: '#9f2089', fontWeight: 600, cursor: 'pointer', border: 0, background: 'none', padding: 0 }} onClick={resendOtp}>
                                        Resend OTP
                                    </button>
                                )}
                            </p>

                            <button type="button" className="sc-cRHGzb heoOeY Authstyled__StyledButton-sc-2hunyy-1 gJbiA-D" color="#ffffff" onClick={verifyOtp} disabled={status === 'loading'}><div className="sc-jOTjWM knCwk"><span color="#ffffff" className="sc-dOfePm lgUtFF">{status === 'loading' ? 'Verifying…' : 'Verify'}</span></div></button>
                            {otpError && <p role="alert">{otpError}</p>}
                            {error && <p role="alert">{error}</p>}
                        </>
                    )}

                </div><span color="greyT2" className="sc-dOfePm fsmGU AuthWrapperstyled__StyledCaption-sc-1plclw5-4 bsTzl" width="1920">By continuing, you agree to Meesho’s&nbsp;<a href="https://www.meesho.com/legal/terms-conditions"><span className="sc-dOfePm kcOfNW AuthWrapperstyled__StyledCaptionLink-sc-1plclw5-7 guLGkI" color="pinkBase">Terms &amp; Conditions &nbsp;</span></a>and &nbsp;<a href="https://www.meesho.com/legal/privacy"><span className="sc-dOfePm kcOfNW AuthWrapperstyled__StyledCaptionLink-sc-1plclw5-7 guLGkI" color="pinkBase">Privacy Policy</span></a></span></div></div>
            </main>
        </div>
    )
}