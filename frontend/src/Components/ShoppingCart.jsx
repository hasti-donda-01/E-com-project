import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import meeshoLogo from './Images/meeshologopink.svg';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

const inr = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const requiresCustomerLogin = (response, payload) =>
  (response.status === 400 && payload.message === 'Token Required') ||
  (response.status === 403 && payload.message?.includes('required role: customer')) ||
  (response.status === 404 && payload.message?.toLowerCase() === 'user not found');

export default function ShoppingCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.cartNotice || '');
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const goToLogin = useCallback(() => {
    sessionStorage.removeItem('customerAccessToken');
    navigate('/customer-login', { state: { returnTo: '/cart' } });
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCart = async () => {
      const customerToken = sessionStorage.getItem('customerAccessToken');
      if (!customerToken) {
        goToLogin();
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/cart/getcartofuser`, {
          credentials: 'include',
          headers: { Authorization: `Bearer ${customerToken}` },
          signal: controller.signal
        });
        const payload = await response.json();
        if (requiresCustomerLogin(response, payload)) {
          goToLogin();
          return;
        }
        if (!response.ok || payload.success === false || !Array.isArray(payload.data)) {
          throw new Error(payload.message || `Could not load your cart (${response.status}).`);
        }
        setItems(payload.data.filter((item) => item.product));
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Could not load your cart.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchCart();
    return () => controller.abort();
  }, [goToLogin]);

  const totals = useMemo(() => items.reduce((summary, item) => {
    const product = item.product;
    const quantity = Number(item.quantity) || 1;
    const originalPrice = Number(product.price) || 0;
    const currentPrice = Number(product.discountPrice) || originalPrice;
    summary.totalBill += originalPrice * quantity;
    summary.totalAmount += currentPrice * quantity;
    return summary;
  }, { totalBill: 0, totalAmount: 0 }), [items]);
  const discount = Math.max(0, totals.totalBill - totals.totalAmount);

  const removeItem = async (item) => {
    setUpdatingId(item._id);
    setError('');
    setNotice('');
    try {
      const customerToken = sessionStorage.getItem('customerAccessToken');
      if (!customerToken) {
        goToLogin();
        return;
      }
      const response = await fetch(`${API_BASE_URL}/cart/removeproductfromcart/${item._id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      const payload = await response.json();
      if (requiresCustomerLogin(response, payload)) {
        goToLogin();
        return;
      }
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || `Could not remove this item (${response.status}).`);
      }
      setItems((currentItems) => currentItems.filter((cartItem) => cartItem._id !== item._id));
      setNotice('Item removed from your cart.');
    } catch (removeError) {
      setError(removeError.message || 'Could not remove this item.');
    } finally {
      setUpdatingId('');
    }
  };

  const changeQuantity = async (item, quantity) => {
    if (quantity < 1 || quantity > Number(item.product.stock)) return;
    setUpdatingId(item._id);
    setError('');
    setNotice('');
    try {
      const customerToken = sessionStorage.getItem('customerAccessToken');
      if (!customerToken) {
        goToLogin();
        return;
      }
      const response = await fetch(`${API_BASE_URL}/cart/updatequantity/${item._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({ quantity })
      });
      const payload = await response.json();
      if (requiresCustomerLogin(response, payload)) {
        goToLogin();
        return;
      }
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || `Could not update quantity (${response.status}).`);
      }
      setItems((currentItems) => currentItems.map((cartItem) =>
        cartItem._id === item._id ? { ...cartItem, quantity } : cartItem
      ));
    } catch (quantityError) {
      setError(quantityError.message || 'Could not update quantity.');
    } finally {
      setUpdatingId('');
    }
  };

  const logOut = async () => {
    setLoggingOut(true);
    setError('');
    try {
      const customerToken = sessionStorage.getItem('customerAccessToken');
      if (!customerToken) {
        goToLogin();
        return;
      }
      const response = await fetch(`${API_BASE_URL}/seller/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || `Could not log out (${response.status}).`);
      }
      sessionStorage.removeItem('customerAccessToken');
      navigate('/', { replace: true });
    } catch (logoutError) {
      setError(logoutError.message || 'Could not log out.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <main className="shopping-cart-page">
      <header className="shopping-cart-header">
        <Link to="/" aria-label="Meesho home">
          <img src={meeshoLogo} alt="Meesho" />
        </Link>
        <ol className="checkout-steps" aria-label="Checkout progress">
          <li className="is-current"><span>1</span><strong>Cart</strong></li>
          <li><span>2</span><strong>Address</strong></li>
          <li><span>3</span><strong>Payment</strong></li>
          <li><span>4</span><strong>Summary</strong></li>
        </ol>
        <button type="button" className="cart-logout" onClick={logOut} disabled={loggingOut}>
          {loggingOut ? 'Logging out…' : 'Log Out'}
        </button>
      </header>

      <div className="shopping-cart-content">
        <section className="cart-items-section" aria-label="Shopping cart items">
          <div className="cart-section-heading">
            <h1>Shopping Cart</h1>
            <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>

          {error && <p className="cart-feedback cart-feedback-error" role="alert">{error}</p>}
          {notice && <p className="cart-feedback" role="status">{notice}</p>}

          {loading ? (
            <p className="cart-empty-state" role="status">Loading your cart…</p>
          ) : items.length === 0 ? (
            <div className="cart-empty-state">
              <h2>Your cart is empty</h2>
              <p>Find something you love and add it to your cart.</p>
              <Link to="/">Continue shopping</Link>
            </div>
          ) : (
            <div className="cart-items-grid">
              {items.map((item) => {
                const product = item.product;
                const currentPrice = Number(product.discountPrice) || Number(product.price) || 0;
                return (
                  <article className="cart-item-card" key={item._id}>
                    <Link className="cart-item-image" to={`/product/${product._id}`}>
                      <img src={product.image} alt={product.name || 'Product'} />
                    </Link>
                    <div className="cart-item-details">
                      <h2>{product.name}</h2>
                      {product.brand && <p className="cart-item-brand">{product.brand}</p>}
                      <strong>{inr(currentPrice)}</strong>
                      <div className="cart-item-actions">
                        <div className="cart-quantity-control" aria-label={`Quantity for ${product.name}`}>
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={updatingId === item._id || Number(item.quantity) <= 1}
                            onClick={() => changeQuantity(item, Number(item.quantity) - 1)}
                          ><FiMinus /></button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={updatingId === item._id || Number(item.quantity) >= Number(product.stock)}
                            onClick={() => changeQuantity(item, Number(item.quantity) + 1)}
                          ><FiPlus /></button>
                        </div>
                        <button
                          type="button"
                          className="cart-remove-button"
                          disabled={updatingId === item._id}
                          onClick={() => removeItem(item)}
                        >
                          <FiTrash2 aria-hidden="true" />
                          {updatingId === item._id ? 'Updating…' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="cart-payment-card" aria-label="Payment summary">
          <h2>Total Payment</h2>
          <dl>
            <div><dt>Total Bill</dt><dd>{inr(totals.totalBill)}</dd></div>
            <div><dt>Delivery Charge</dt><dd>{inr(0)}</dd></div>
            <div><dt>Discount</dt><dd>- {inr(discount)}</dd></div>
            <div className="cart-total-row"><dt>Total Amount</dt><dd>{inr(totals.totalAmount)}</dd></div>
          </dl>
          {checkoutMessage && <p className="cart-checkout-message" role="status">{checkoutMessage}</p>}
          <button
            type="button"
            className="cart-continue-button"
            disabled={loading || items.length === 0}
            onClick={() => setCheckoutMessage('Checkout is not available yet. Your cart has been saved.')}
          >
            <FiCheck aria-hidden="true" /> Continue
          </button>
        </aside>
      </div>
    </main>
  );
}
