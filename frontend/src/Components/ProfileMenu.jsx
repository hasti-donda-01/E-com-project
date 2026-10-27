// User profile menu dropdown (shows login button or user account details)
import { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { clearCustomerAccessToken, getCustomerAccessToken, isCustomerAuthFailure } from '../utils/customerSession';

const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

export default function ProfileMenu({ variant = 'customer' }) {
    // User profile state
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signingOut, setSigningOut] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        const controller = new AbortController();

        const loadSession = async () => {
            try {
                const customerToken = getCustomerAccessToken();
                const response = await fetch(`${API_BASE_URL}/seller/session`, {
                    credentials: 'include',
                    headers: customerToken
                        ? { Authorization: `Bearer ${customerToken}` }
                        : undefined,
                    signal: controller.signal
                });
                if (response.ok) {
                    const payload = await response.json();
                    if (!payload.success || !payload.data) {
                        throw new Error('The account session response was invalid.');
                    }
                    setUser(payload.data);
                } else if (isCustomerAuthFailure(response, await response.json().catch(() => ({})))) {
                    clearCustomerAccessToken();
                } else if (![400, 401, 403].includes(response.status)) {
                    throw new Error(`Could not check account session (${response.status}).`);
                }
            } catch (sessionError) {
                if (sessionError.name !== 'AbortError') {
                    setError('Account status is temporarily unavailable.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        loadSession();
        return () => controller.abort();
    }, []);

    // Logout handler
    const handleSignOut = async () => {
        if (signingOut) return;
        setError('');
        setSigningOut(true);
        try {
            const customerToken = getCustomerAccessToken();
            const response = await fetch(`${API_BASE_URL}/seller/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: customerToken
                    ? { Authorization: `Bearer ${customerToken}` }
                    : undefined
            });
            const payload = await response.json();
            if (!response.ok || payload.success === false) {
                throw new Error(payload.message || `Sign out failed (${response.status}).`);
            }
            const isAdmin = String(user?.role).toLowerCase() === 'admin';
            if (String(user?.role).toLowerCase() === 'customer') {
                clearCustomerAccessToken();
            }
            setUser(null);
            navigate(isAdmin ? '/admin' : '/', { replace: true });
        } catch (signOutError) {
            setError(signOutError.message || 'Could not sign out. Please try again.');
        } finally {
            setSigningOut(false);
        }
    };

    if (!user && !loading && variant !== 'customer') return null;

    return (
        <div className={`account-menu account-menu-${variant}`}>
            <button
                className="account-menu-trigger"
                type="button"
                aria-haspopup="true"
                aria-label="Open profile menu"
            >
                <CgProfile aria-hidden="true" />
            </button>
            <div className="account-menu-dropdown">
                {user ? (
                    <>
                        <h3>
                            {String(user.role).toLowerCase() === 'customer'
                                ? 'Your account'
                                : `Hello, ${user.name || 'there'}`}
                        </h3>
                        {String(user.role).toLowerCase() === 'customer' && user.phone && (
                            <p className="account-menu-help">Mobile number: {user.phone}</p>
                        )}
                        {error && <p className="account-menu-error" role="alert">{error}</p>}
                        <button
                            className="account-menu-signout"
                            type="button"
                            onClick={handleSignOut}
                            disabled={signingOut}
                        >
                            {signingOut ? 'Signing out…' : 'Sign out'}
                        </button>
                        <button
                            className="account-menu-link"
                            type="button"
                            onClick={() => navigate('/customer/orders')}
                        >
                            My Orders
                        </button>
                        
                    </>
                ) : (
                    <>
                        <h3>Hello User</h3>
                        <p className="account-menu-help">To access your Meesho Account</p>
                        {error && <p className="account-menu-error" role="alert">{error}</p>}
                        <button
                            className="signupbtn"
                            type="button"
                            onClick={() => navigate('/customer-signup')}
                        >
                            Login / Sign up
                        </button>
                        <button
                            className="account-menu-link"
                            type="button"
                            onClick={() => navigate('/wishlist')}
                        >
                            Wishlist
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
