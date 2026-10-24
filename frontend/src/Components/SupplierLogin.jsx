import React, { useState } from 'react'
import meeshoLogo from './Images/meeshoLogo.svg'
import { useNavigate } from 'react-router-dom'

const PURPLE = '#3d1fc4'
const PINK = '#9f2089'


const EyeIcon = ({ off }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
        {off && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
)

function FloatingInput({ id, type = 'text', label, value, onChange, rightSlot }) {
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)
    const floated = focused || value !== ''



    return (
        <div
            style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', height: 48 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder=" "
                style={{
                    position: 'relative', zIndex: 1, width: '100%', height: '100%', boxSizing: 'border-box',
                    border: `1px solid ${focused || hovered ? PURPLE : '#d1d5db'}`,
                    borderRadius: 2, background: 'transparent', outline: 'none',
                    padding: `0 ${rightSlot ? 100 : 16}px 0 16px`,
                    fontSize: 15, color: '#111827', fontFamily: 'inherit'
                }}
            />

            <label
                htmlFor={id}
                style={{
                    position: 'absolute', left: 0, zIndex: 2, maxWidth: '80%',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    padding: floated ? '0 4px' : '0 16px',
                    transform: floated ? 'translate(10px, -24px)' : 'none',
                    background: floated ? '#fff' : 'transparent',
                    fontSize: floated ? 12 : 15,
                    color: focused ? PURPLE : '#6b7280',
                    transition: 'all 0.2s ease-out',
                    pointerEvents: 'none'
                }}
            >
                {label}
            </label>

            {rightSlot && (
                <div style={{ position: 'absolute', right: 20, zIndex: 3 }}>{rightSlot}</div>
            )}
        </div>
    )
}

export default function SupplierLogin() {
    const [emailOrPhone, setEmailOrPhone] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [hoverLogin, setHoverLogin] = useState(false)
    const [hoverCreate, setHoverCreate] = useState(false)
    const [hoverForgot, setHoverForgot] = useState(false)

    const canSubmit = emailOrPhone.trim() !== '' && password !== ''

    let navigate = useNavigate()

    const signuppage = () => {
        navigate('/signuppage')

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!canSubmit) return
        console.log({ emailOrPhone, password })
        // TODO: call your login API here
    }
    const toLogin = () => {
        navigate('/SupplierDashboard')
        
    }
    return (
        <section style={{ minHeight: '100vh', background: '#eeebff', fontFamily: 'inherit' }}>
            {/* Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 0 30px' }}>
                <img src={meeshoLogo} style={{ width: 120 }} alt="Meesho Logo" />
            </div>

            <div>
                <div style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', width: 440, maxWidth: '95%' }}>
                    {/* Card */}
                    <div style={{ background: '#fff', borderRadius: 2, padding: 24, display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ margin: '0 0 22px', padding: 0, fontSize: 21, fontWeight: 600, lineHeight: '30px', color: '#1f1f2e' }}>
                            Login to your supplier panel
                        </h1>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 0 }}>
                            <div style={{ marginBottom: 22 }}>
                                <FloatingInput
                                    id="emailOrPhone"
                                    label="Email Id or mobile number"
                                    value={emailOrPhone}
                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                />
                            </div>

                            <FloatingInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                rightSlot={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8, background: 'none',
                                            border: 'none', padding: 0, cursor: 'pointer',
                                            fontSize: 15, fontWeight: 600, color: PURPLE, fontFamily: 'inherit'
                                        }}
                                    >
                                        <EyeIcon off={showPassword} />
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                }
                            />

                            <a

                                onMouseEnter={() => setHoverForgot(true)}
                                onMouseLeave={() => setHoverForgot(false)}
                                style={{
                                    marginTop: 14, width: 'fit-content', fontSize: 14, fontWeight: 500, lineHeight: '20px',
                                    color: PURPLE, textDecoration: hoverForgot ? 'underline' : 'none'
                                }}
                            >
                                Forgot password?
                            </a>

                            <button
                                type="submit"
                                disabled={!canSubmit}
                                onClick={toLogin}
                                onMouseEnter={() => setHoverLogin(true)}
                                onMouseLeave={() => setHoverLogin(false)}
                                style={{
                                    marginTop: 24, height: 48, width: '100%', border: 'none', borderRadius: 2,
                                    fontSize: 15, fontWeight: 600, color: '#fff', fontFamily: 'inherit',
                                    transition: 'background 0.2s',
                                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                                    background: canSubmit ? (hoverLogin ? '#8a1b76' : PINK) : '#c7cbd1'
                                }}
                            >
                                Log in
                            </button>
                        </form>
                    </div>

                    {/* New user (inset to line up with the inputs) */}
                    <div style={{ padding: '0 24px' }}>
                        <p style={{ margin: '24px 0 18px', textAlign: 'center', fontSize: 14, lineHeight: '20px', color: '#4b5563' }}>
                            New to Meesho?
                        </p>

                        <a
                            onClick={signuppage}
                            onMouseEnter={() => setHoverCreate(true)}
                            onMouseLeave={() => setHoverCreate(false)}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                height: 48, width: '100%', boxSizing: 'border-box', borderRadius: 2,
                                border: `1px solid ${PURPLE}`, fontSize: 15, fontWeight: 600,
                                color: PURPLE, textDecoration: 'none',
                                background: hoverCreate ? 'rgba(255,255,255,0.6)' : 'transparent'
                            }}
                        >
                            Create your supplier account
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}