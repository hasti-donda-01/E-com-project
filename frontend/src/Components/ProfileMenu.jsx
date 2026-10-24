import { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

export default function ProfileMenu({ variant = 'customer' }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signingOut, setSigningOut] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        const loadSession = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/seller/session`, {
                    credentials: 'include',
                    signal: controller.signal
                });
                if (response.ok) {
                    const payload = await response.json();
                    if (!payload.success || !payload.data) {
                        throw new Error('The account session response was invalid.');
                    }
                    setUser(payload.data);
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

    const handleSignOut = async () => {
        if (signingOut) return;
        setError('');
        setSigningOut(true);
        try {
            const response = await fetch(`${API_BASE_URL}/seller/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            const payload = await response.json();
            if (!response.ok || payload.success === false) {
                throw new Error(payload.message || `Sign out failed (${response.status}).`);
            }
            const isAdmin = String(user?.role).toLowerCase() === 'admin';
            setUser(null);
            navigate(isAdmin ? '/admin' : '/', { replace: true });
        } catch (signOutError) {
            setError(signOutError.message || 'Could not sign out. Please try again.');
        } finally {
            setSigningOut(false);
        }
    };

    if (!user && !loading && variant !== 'customer') return null;

    const displayName = variant === 'customer'
        ? 'Profile'
        : user?.name || (loading ? 'Checking account…' : 'Profile');

    return (
        <div className={`account-menu account-menu-${variant}`}>
            <button
                className="account-menu-trigger"
                type="button"
                aria-haspopup="true"
                aria-label="Open profile menu"
            >
                <CgProfile aria-hidden="true" />
                <span>{displayName}</span>
            </button>
            <div className="account-menu-dropdown">
                {user ? (
                    <>
                        <h3>Hello, {user.name || 'there'}</h3>
                        {error && <p className="account-menu-error" role="alert">{error}</p>}
                        <button
                            className="account-menu-signout"
                            type="button"
                            onClick={handleSignOut}
                            disabled={signingOut}
                        >
                            {signingOut ? 'Signing out…' : 'Sign out'}
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
                            Sign Up
                        </button>
                        <div className="profile-dropdown-items">My Orders</div>
                        <div className="profile-dropdown-items">Delete Account</div>
                    </>
                )}
            </div>
        </div>
    );
}
