// Customer wishlist page - displays saved products with move-to-cart and remove actions
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { clearCustomerAccessToken, getCustomerAccessToken } from '../utils/customerSession';
import { fetchWishlist, moveToCart, removeFromWishlist } from '../redux/action/wishlistApi';
import { clearWishlistNotice } from '../redux/slice/wishlistSlice';

// Format price in INR
const inr = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Wishlist state from Redux
  const { items, status, error: reduxError, notice: reduxNotice } = useSelector((state) => state.wishlist);
  const loading = status === 'loading';

  const [busyId, setBusyId] = useState('');
  const [localError, setLocalError] = useState('');
  const [localNotice, setLocalNotice] = useState('');

  const error = localError || reduxError || '';
  const notice = localNotice || reduxNotice || '';

  // Fetch saved wishlist items on mount
  useEffect(() => {
    const token = getCustomerAccessToken();
    if (!token) {
      navigate('/customer-login', { state: { returnTo: '/wishlist' }, replace: true });
      return;
    }
    dispatch(fetchWishlist());
    return () => {
      dispatch(clearWishlistNotice());
    };
  }, [dispatch, navigate]);

  // Move item to cart or delete from wishlist
  const updateWishlist = async (item, action) => {
    const token = getCustomerAccessToken();
    if (!token) {
      navigate('/customer-login', { state: { returnTo: '/wishlist' }, replace: true });
      return;
    }
    setBusyId(item._id);
    setLocalError('');
    setLocalNotice('');

    try {
      if (action === 'move') {
        const resultAction = await dispatch(moveToCart(item._id));
        if (moveToCart.rejected.match(resultAction)) {
          const errMsg = String(resultAction.payload || 'Could not move product to cart.');
          if (/token required|jwt expired|jwt malformed|invalid token|invalid signature|required role: customer|user not found|401/i.test(errMsg)) {
            clearCustomerAccessToken();
            navigate('/customer-login', { state: { returnTo: '/wishlist' }, replace: true });
            return;
          }
          setLocalError(errMsg);
        } else {
          setLocalNotice('Product moved to your cart.');
        }
      } else {
        const resultAction = await dispatch(removeFromWishlist(item._id));
        if (removeFromWishlist.rejected.match(resultAction)) {
          const errMsg = String(resultAction.payload || 'Could not remove product from wishlist.');
          if (/token required|jwt expired|jwt malformed|invalid token|invalid signature|required role: customer|user not found|401/i.test(errMsg)) {
            clearCustomerAccessToken();
            navigate('/customer-login', { state: { returnTo: '/wishlist' }, replace: true });
            return;
          }
          setLocalError(errMsg);
        } else {
          setLocalNotice('Product removed from your wishlist.');
        }
      }
    } catch (updateError) {
      setLocalError(updateError.message || 'Could not update your wishlist.');
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
