
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import meeshoLogo from './Images/meeshoLogo.svg'
import PeopleIcon from './Images/PeopleIcon.svg'
import pincode from './Images/pincode.svg'
import mapicon from './Images/mapicon.svg'
import categories from './Images/categories.svg'
import { MdCheckCircle } from "react-icons/md"
import store from './Images/store.svg'

export default function StartSelling() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirm_password: '',
        storeName: '',
        storeDesc: '',
        category: '',
        businessType: '',
        gstin: '',
        panNumber: '',
        role: 'seller'
    })

    const [touched, setTouched] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('')
    const [seconds, setSeconds] = useState(0)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [registeredUserId, setRegisteredUserId] = useState('')
    const [step, setStep] = useState(1)

    const navigate = useNavigate()

    const API_BASE_URL = (
        import.meta.env.VITE_API_URL ||
        'https://e-com-project-b3ci.onrender.com/api'
    ).replace(/\/$/, '')

    const REGISTER_URL = `${API_BASE_URL}/seller/create`
    const VERIFY_OTP_URL = `${API_BASE_URL}/seller/verifyOTP`

    const toLogin = () => {
        navigate('/SupplierLogin')
    }

    useEffect(() => {
        if (seconds <= 0) return

        const t = setTimeout(() => setSeconds(s => s - 1), 1000)
        return () => clearTimeout(t)
    }, [seconds])

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const mobileValid = /^[6-9]\d{9}$/.test(formData.phone)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)

    let mobileError = ''

    if (touched && formData.phone === '') {
        mobileError = 'This field is required.'
    } else if (touched && !mobileValid) {
        mobileError = 'Enter a valid 10-digit mobile number.'
    }

    const STATS = [
        { icon: PeopleIcon, title: '11 lakh+', text: 'Suppliers are selling commission-free' },
        { icon: pincode, title: '19000+', text: 'Pincodes supported for delivery' },
        { icon: mapicon, title: 'Crore of', text: 'Customers buy across India' },
        { icon: categories, title: '700 +', text: 'Categories to sell' },
    ]

    const handleSendOtp = async () => {
        setMessage('')

        if (
            !formData.name ||
            !emailValid ||
            !mobileValid ||
            !formData.address ||
            !formData.password ||
            !formData.confirm_password
        ) {
            setMessage('Please complete all required personal details first.')
            return
        }

        if (formData.password !== formData.confirm_password) {
            setMessage('Password and confirm password do not match.')
            return
        }

        if (seconds > 0 || loading) return

        setLoading(true)

        try {
            const res = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok || data.success === false) {
                setMessage(data.message || 'Unable to register supplier.')
                return
            }

            // The controller returns data.data as the populated seller.
            const userId = data.data?.userId?._id

            if (!userId) {
                setMessage(
                    'Registration response did not include the user ID. Check your backend response and route.'
                )
                return
            }

            setRegisteredUserId(userId)
            setOtpSent(true)
            setStep(3)
            setSeconds(60)
            setMessage('OTP sent to your email address. Please check your inbox.')
        } catch {
            setMessage('Unable to connect to the server. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleContinueToBusiness = () => {
        setTouched(true)
        setMessage('')

        if (!formData.name.trim() || !emailValid || !mobileValid || !formData.address.trim() ||
            !formData.password || !formData.confirm_password) {
            setMessage('Please complete all required personal details first.')
            return
        }

        if (formData.password !== formData.confirm_password) {
            setMessage('Password and confirm password do not match.')
            return
        }

        setStep(2)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')

        if (!otpSent || otp.length !== 4 || !registeredUserId) {
            setMessage('Enter the 4-digit OTP sent to your email.')
            return
        }

        setLoading(true)

        try {
            const res = await fetch(VERIFY_OTP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sellerId: registeredUserId,
                    OTP: otp
                })
            })

            const data = await res.json()

            if (!res.ok || data.success === false) {
                setMessage(data.message || 'OTP verification failed.')
                return
            }

            setMessage('Email verified successfully! You can now log in.')
            setTimeout(() => navigate('/SupplierLogin'), 1200)
        } catch {
            setMessage('Unable to verify OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="signup-page">
            <div className="signup-container">
                <header className="signup-header">
                    <img src={meeshoLogo} alt="Meesho" className="signup-logo" />

                    <div className="signup-header-right">
                        <span>Already a user?</span>
                        <a
                            href="/SupplierLogin"
                            onClick={(e) => {
                                e.preventDefault()
                                toLogin()
                            }}
                            className="outline-btn"
                        >
                            Login
                        </a>
                    </div>
                </header>

                <main className="signup-body">
                    <form className="signup-left" onSubmit={handleSubmit}>
                        <div className="signup-form-heading">
                            <p className="signup-eyebrow">SELL ON MEESHO</p>
                            <h1 className="welcome-title">Create your seller account</h1>
                            <p className="welcome-sub">Enter your details to start selling to customers across India.</p>
                        </div>

                        <ol className="signup-stepper" aria-label="Registration progress">
                            {['Personal details', 'Business details', 'Email verification'].map((label, index) => {
                                const stepNumber = index + 1
                                const isComplete = step > stepNumber
                                const isCurrent = step === stepNumber
                                return (
                                    <li
                                        key={label}
                                        className={`signup-stepper-item ${isCurrent ? 'is-current' : ''} ${isComplete ? 'is-complete' : ''}`}
                                        aria-current={isCurrent ? 'step' : undefined}
                                    >
                                        <span>{isComplete ? <MdCheckCircle /> : stepNumber}</span>
                                        <span>{label}</span>
                                    </li>
                                )
                            })}
                        </ol>

                        {step === 1 && (
                            <>
                                <section className="signup-form-section">
                                    <div className="signup-section-heading">
                                        <span className="signup-step">1</span>
                                        <div>
                                            <h2>Personal details</h2>
                                            <p>These details will be used to secure your account.</p>
                                        </div>
                                    </div>
                                    <div className="signup-fields-grid">
                                        <label className="signup-field signup-field-wide">
                                            Full name <span>*</span>
                                            <input
                                                className="text-input"
                                                name="name"
                                                autoComplete="name"
                                                placeholder="Enter your full name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>

                                        <label className="signup-field">
                                            Email address <span>*</span>
                                            <input
                                                className="text-input"
                                                type="email"
                                                name="email"
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>

                                        <label className="signup-field">
                                            Mobile number <span>*</span>
                                            <input
                                                className={`text-input ${mobileError ? 'has-error' : ''}`}
                                                type="tel"
                                                inputMode="numeric"
                                                autoComplete="tel"
                                                maxLength={10}
                                                name="phone"
                                                placeholder="10-digit mobile number"
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        phone: e.target.value.replace(/\D/g, '')
                                                    })
                                                }}
                                                onBlur={() => setTouched(true)}
                                                required
                                            />
                                            {mobileError && <span className="signup-inline-error">{mobileError}</span>}
                                        </label>

                                        <label className="signup-field signup-field-wide">
                                            Business address <span>*</span>
                                            <input
                                                className="text-input"
                                                name="address"
                                                autoComplete="street-address"
                                                placeholder="Enter your business address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>

                                        <label className="signup-field">
                                            Create password <span>*</span>
                                            <input
                                                className="text-input"
                                                type="password"
                                                name="password"
                                                autoComplete="new-password"
                                                placeholder="Create a password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>

                                        <label className="signup-field">
                                            Confirm password <span>*</span>
                                            <input
                                                className="text-input"
                                                type="password"
                                                name="confirm_password"
                                                autoComplete="new-password"
                                                placeholder="Re-enter your password"
                                                value={formData.confirm_password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>
                                    </div>
                                </section>
                                {message && <p role="alert" className="signup-message">{message}</p>}
                                <div className="signup-submit-area">
                                    <button
                                        type="button"
                                        className="send-otp-btn"
                                        onClick={handleContinueToBusiness}
                                    >
                                        Continue to business details
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <section className="signup-form-section">
                                    <div className="signup-section-heading">
                                        <span className="signup-step">2</span>
                                        <div>
                                            <h2>Business details</h2>
                                            <p>Optional for now — you can complete these later.</p>
                                        </div>
                                    </div>
                                    <div className="signup-fields-grid">
                                        <label className="signup-field">
                                            Store name
                                            <input
                                                className="text-input"
                                                name="storeName"
                                                placeholder="Your store name"
                                                value={formData.storeName}
                                                onChange={handleChange}
                                            />
                                        </label>

                                        <label className="signup-field">
                                            Business type
                                            <select
                                                className="text-input"
                                                name="businessType"
                                                value={formData.businessType}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select business type</option>
                                                <option value="Individual">Individual</option>
                                                <option value="Proprietorship">Proprietorship</option>
                                                <option value="Partnership">Partnership</option>
                                                <option value="Private Limited">Private Limited</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </label>

                                        <label className="signup-field">
                                            Product category
                                            <select
                                                className="text-input"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select a category</option>
                                                <option value="Fashion">Fashion</option>
                                                <option value="Women Ethnic">Women Ethnic</option>
                                                <option value="Men">Men</option>
                                                <option value="Kids">Kids</option>
                                                <option value="Home & Kitchen">Home &amp; Kitchen</option>
                                                <option value="Beauty">Beauty</option>
                                                <option value="Accessories">Accessories</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </label>

                                        <label className="signup-field">
                                            GSTIN <span className="signup-optional">(optional)</span>
                                            <input
                                                className="text-input"
                                                name="gstin"
                                                placeholder="Enter GSTIN"
                                                value={formData.gstin}
                                                onChange={handleChange}
                                            />
                                        </label>

                                        <label className="signup-field">
                                            PAN number <span className="signup-optional">(optional)</span>
                                            <input
                                                className="text-input"
                                                name="panNumber"
                                                placeholder="Enter PAN number"
                                                value={formData.panNumber}
                                                onChange={handleChange}
                                            />
                                        </label>

                                        <label className="signup-field signup-field-wide">
                                            Store description
                                            <textarea
                                                className="text-input signup-textarea"
                                                name="storeDesc"
                                                placeholder="Briefly describe the products you sell"
                                                rows={3}
                                                value={formData.storeDesc}
                                                onChange={handleChange}
                                            />
                                        </label>
                                    </div>
                                </section>

                                <div className="signup-submit-area">
                                    {message && (
                                        <p role="alert" className="signup-message">{message}</p>
                                    )}
                                    <button
                                        type="button"
                                        className="send-otp-btn"
                                        disabled={loading || seconds > 0}
                                        onClick={handleSendOtp}
                                    >
                                        {loading
                                            ? 'Please wait...'
                                            : seconds > 0
                                                ? `Resend in ${seconds}s`
                                                : 'Create account & send email OTP'}
                                    </button>
                                    <button
                                        type="button"
                                        className="signup-back-btn"
                                        disabled={loading}
                                        onClick={() => {
                                            setMessage('')
                                            setStep(1)
                                        }}
                                    >
                                        Back to personal details
                                    </button>
                                    <p className="signup-required-note">Business details are optional. Fields marked * are required.</p>
                                </div>
                            </>
                        )}

                        {step === 3 && otpSent && (
                            <div className="signup-otp-panel">
                                <div className="signup-section-heading">
                                    <span className="signup-step"><MdCheckCircle /></span>
                                    <div>
                                        <h2>Verify your email</h2>
                                        <p>Enter the 4-digit code sent to <strong>{formData.email}</strong>.</p>
                                    </div>
                                </div>
                                <input
                                    className="text-input otp-input"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={4}
                                    placeholder="• • • •"
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(e.target.value.replace(/\D/g, ''))
                                    }
                                    required
                                />
                                {message && <p role="alert" className="signup-message">{message}</p>}
                                <button
                                    type="submit"
                                    className="create-btn"
                                    disabled={loading || otp.length !== 4}
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </div>
                        )}

                        <div className="signup-bottom">
                            <p className="terms">
                                By clicking you agree to our{' '}
                                <a href="https://www.meesho.com/legal/terms-conditions">
                                    Terms &amp; Conditions
                                </a>{' '}
                                and{' '}
                                <a href="https://www.meesho.com/legal/privacy">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </form>

                    <section className="signup-right">
                        <div className="signup-promo-heading">
                            <span className="signup-eyebrow">YOUR BUSINESS, YOUR WAY</span>
                        <h2 className="section-title grow-title">
                            Grow your business faster by selling on Meesho
                        </h2>
                        </div>

                        <div className="stats-grid">
                            {STATS.map((s) => (
                                <div className="stat" key={s.title}>
                                    <img src={s.icon} alt="" />
                                    <div>
                                        <div className="stat-title">{s.title}</div>
                                        <div className="stat-text">{s.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="divider" />

                        <h2 className="section-title need-title">
                            All you need to sell on Meesho is:
                        </h2>

                        <ul className="checklist">
                            <li className="check-row">
                                <MdCheckCircle />
                                <span className="check-label">Tax Details</span>
                            </li>

                            <li className="sub-row">
                                <span className="dot" />
                                <span className="sub-label">Enrolment ID/UIN</span>
                                <span className="pill">For Non-GST sellers</span>
                                <span className="new-badge">New!</span>
                            </li>

                            <li className="sub-row">
                                <span className="dot" />
                                <span className="sub-label">GSTIN</span>
                                <span className="sub-note">
                                    Regular &amp; Composition GST sellers
                                </span>
                            </li>

                            <li className="check-row bank-row">
                                <MdCheckCircle />
                                <span className="check-label">Bank Account</span>
                            </li>
                        </ul>
                    </section>
                </main>

                <div className="dots-bg" aria-hidden="true" />
                <img src={store} alt="" className="store-art" />
            </div>
        </div>
    )
}
