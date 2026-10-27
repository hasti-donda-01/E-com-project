// User profile menu dropdown (shows login button or user account details)
import { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCustomerAccessToken, getCustomerAccessToken } from '../utils/customerSession';
import { fetchCustomerSession, logoutCustomer } from '../redux/action/customerApi';

export default function ProfileMenu({ variant = 'customer' }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // User session state from Redux
    const { user, sessionStatus } = useSelector((state) => state.customer);
    const loading = sessionStatus === 'loading';
    const [signingOut, setSigningOut] = useState(false);
    const [error, setError] = useState('');

    // Check if user is already logged in
    useEffect(() => {
        dispatch(fetchCustomerSession());
    }, [dispatch]);

    // Logout handler
    const handleSignOut = async () => {
        if (signingOut) return;
        setError('');
        setSigningOut(true);
        try {
            const isAdmin = String(user?.role).toLowerCase() === 'admin';
            const resultAction = await dispatch(logoutCustomer());
            if (logoutCustomer.rejected.match(resultAction)) {
                throw new Error(resultAction.payload || 'Could not sign out. Please try again.');
            }
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
