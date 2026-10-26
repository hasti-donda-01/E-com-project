import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { clearCustomerAccessToken, getCustomerAccessToken, isCustomerAuthFailure } from '../utils/customerSession';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

const inr = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const loadWishlist = async () => {
      const token = getCustomerAccessToken();
      if (!token) {
        navigate('/customer-login', { state: { returnTo: '/wishlist' }, replace: true });
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/wish/get`, {
          credentials: 'include',
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
        const payload = await response.json();
        if (isCustomerAuthFailure(response, payload)) {
          clearCustomerAccessToken();
          navigate('/customer-login', { state: { returnTo: '/wishlist' }, replace: true });
          return;
        }
        if (!response.ok || payload.success === false || !Array.isArray(payload.data)) {
          throw new Error(payload.message || `Could not load your wishlist (${response.status}).`);
        }
        setItems(payload.data.filter((item) => item.product));
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Could not load your wishlist.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadWishlist();
    return () => controller.abort();
  }, [navigate]);

  const updateWishlist = async (item, action) => {
    const token = getCustomerAccessToken();
    if (!token) {
      navigate('/customer-login', { state: { returnTo: '/wishlist' }, replace: true });
      return;
    }
    setBusyId(item._id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(
        action === 'move'
          ? `${API_BASE_URL}/wish/movetocart/${item._id}`
          : `${API_BASE_URL}/wish/remove/${item._id}`,
        {
          method: action === 'move' ? 'POST' : 'DELETE',
          credentials: 'include',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const payload = await response.json();
      if (isCustomerAuthFailure(response, payload)) {
        clearCustomerAccessToken();
        navigate('/customer-login', { state: { returnTo: '/wishlist' }, replace: true });
        return;
      }
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || `Could not update your wishlist (${response.status}).`);
      }
      setItems((currentItems) => currentItems.filter((currentItem) => currentItem._id !== item._id));
      setNotice(action === 'move' ? 'Product moved to your cart.' : 'Product removed from your wishlist.');
    } catch (updateError) {
      setError(updateError.message || 'Could not update your wishlist.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <main className="wishlist-page">
      <header className="wishlist-heading">
        <h1>My Wishlist</h1>
        {!loading && <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>}
      </header>
      {error && <p className="wishlist-feedback wishlist-error" role="alert">{error}</p>}
      {notice && <p className="wishlist-feedback" role="status">{notice}</p>}
      {loading ? (
        <p className="wishlist-empty" role="status">Loading your wishlist…</p>
      ) : items.length === 0 ? (
        <section className="wishlist-empty">
          <h2>Your wishlist is empty</h2>
          <p>Save products you like and they will appear here.</p>
          <Link to="/">Explore products</Link>
        </section>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => {
            const product = item.product;
            const price = Number(product.discountPrice) || Number(product.price) || 0;
            return (
              <article className="wishlist-card" key={item._id}>
                <Link className="wishlist-product-image" to={`/product/${product._id}`}>
                  <img src={product.image} alt={product.name || 'Product'} />
                </Link>
                <div className="wishlist-product-info">
                  <Link className="wishlist-product-name" to={`/product/${product._id}`}>
                    {product.name}
                  </Link>
                  {product.brand && <span className="wishlist-brand">{product.brand}</span>}
                  <strong>{inr(price)}</strong>
                  <div className="wishlist-actions">
                    <button
                      type="button"
                      onClick={() => updateWishlist(item, 'move')}
                      disabled={busyId === item._id || Number(product.stock) < 1}
                    >
                      <FiShoppingCart aria-hidden="true" />
                      {busyId === item._id ? 'Please wait…' : 'Move to Cart'}
                    </button>
                    <button
                      className="wishlist-remove"
                      type="button"
                      aria-label={`Remove ${product.name} from wishlist`}
                      onClick={() => updateWishlist(item, 'remove')}
                      disabled={busyId === item._id}
                    >
                      <FiTrash2 aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
