// Product detail page with image view, price, specifications, add to cart, and related items
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiCheckCircle, FiHeart, FiRefreshCw, FiShield, FiTruck } from 'react-icons/fi';
import { IoMdStar } from 'react-icons/io';
import { clearCustomerAccessToken, getCustomerAccessToken } from '../utils/customerSession';
import { fetchProductById, fetchProducts } from '../redux/action/productApi';
import { clearCurrentProduct } from '../redux/slice/productSlice';
import { addToCart as addToCartThunk } from '../redux/action/cartApi';
import { addToWishlist as addToWishlistThunk } from '../redux/action/wishlistApi';

// Format number to INR
const inr = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const getCategoryId = (product) =>
  String(product?.categoryId?._id || product?.categoryId || '');

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const resumedCartAction = useRef(false);

  // Redux state for product details and catalog
  const {
    currentProduct: product,
    productDetailStatus,
    productDetailError,
    products: catalogProducts
  } = useSelector((state) => state.product);

  const loading = productDetailStatus === 'loading';
  const error = productDetailError || '';
  const relatedError = '';

  // Local notification and busy states
  const [cartMessage, setCartMessage] = useState('');
  const [cartError, setCartError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState('');
  const [wishlistError, setWishlistError] = useState('');
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  // Fetch product details and catalog for related products
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      if (!catalogProducts || catalogProducts.length === 0) {
        dispatch(fetchProducts(1));
      }
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  // Derive related products from category
  const categoryId = getCategoryId(product);
  const relatedProducts = useMemo(() => {
    if (!product || !catalogProducts || catalogProducts.length === 0) return [];
    return catalogProducts
      .filter((item) => item._id !== product._id)
      .filter((item) => !categoryId || getCategoryId(item) === categoryId)
      .slice(0, 4);
  }, [product, catalogProducts, categoryId]);

  // Add item to cart through Redux thunk
  const addToCart = useCallback(async (buyNow = false) => {
    const customerToken = getCustomerAccessToken();
    if (!customerToken) {
      navigate('/customer-login', {
        state: {
          returnTo: location.pathname,
          ...(buyNow ? { resumeBuyNow: true } : { resumeAddToCart: true })
        }
      });
      return;
    }

    setAddingToCart(true);
    setCartMessage('');
    setCartError('');

    try {
      const resultAction = await dispatch(addToCartThunk({ productId: product._id, quantity: 1 }));
      if (addToCartThunk.fulfilled.match(resultAction)) {
        navigate('/cart', {
          state: {
            cartNotice: buyNow
              ? 'Product added. Review your order to continue.'
              : resultAction.payload?.message || 'Added to your cart.'
          }
        });
      } else {
        const errorMsg = String(resultAction.payload || 'Could not add this product to your cart.');
        if (/token required|jwt expired|jwt malformed|invalid token|invalid signature|required role: customer|user not found|401/i.test(errorMsg)) {
          clearCustomerAccessToken();
          navigate('/customer-login', {
            state: {
              returnTo: location.pathname,
              ...(buyNow ? { resumeBuyNow: true } : { resumeAddToCart: true })
            }
          });
          return;
        }
        throw new Error(errorMsg);
      }
    } catch (addError) {
      setCartError(addError.message || 'Could not add this product to your cart.');
    } finally {
      setAddingToCart(false);
    }
  }, [dispatch, location.pathname, navigate, product]);

  // Save product to wishlist through Redux thunk
  const addToWishlist = useCallback(async () => {
    const customerToken = getCustomerAccessToken();
    if (!customerToken) {
      navigate('/customer-login', {
        state: { returnTo: location.pathname, resumeAddToWishlist: true }
      });
      return;
    }

    setAddingToWishlist(true);
    setWishlistMessage('');
    setWishlistError('');
    try {
      const resultAction = await dispatch(addToWishlistThunk(product._id));
      if (addToWishlistThunk.fulfilled.match(resultAction)) {
        setWishlistMessage(resultAction.payload?.message || 'Added to your wishlist.');
      } else {
        const errorMsg = String(resultAction.payload || 'Could not save this product.');
        if (/token required|jwt expired|jwt malformed|invalid token|invalid signature|required role: customer|user not found|401/i.test(errorMsg)) {
          clearCustomerAccessToken();
          navigate('/customer-login', {
            state: { returnTo: location.pathname, resumeAddToWishlist: true }
          });
          return;
        }
        throw new Error(errorMsg);
      }
    } catch (wishlistAddError) {
      setWishlistError(wishlistAddError.message || 'Could not add this product to your wishlist.');
    } finally {
      setAddingToWishlist(false);
    }
  }, [dispatch, location.pathname, navigate, product]);

  useEffect(() => {
    if (
      product &&
      (location.state?.resumeAddToCart || location.state?.resumeBuyNow) &&
      !resumedCartAction.current
    ) {
      resumedCartAction.current = true;
      navigate(location.pathname, { replace: true, state: null });
      addToCart(Boolean(location.state?.resumeBuyNow));
    }
  }, [addToCart, location.pathname, location.state, navigate, product]);

  useEffect(() => {
    if (product && location.state?.resumeAddToWishlist && !resumedCartAction.current) {
      resumedCartAction.current = true;
      navigate(location.pathname, { replace: true, state: null });
      addToWishlist();
    }
  }, [addToWishlist, location.pathname, location.state, navigate, product]);

  if (loading) {
    return <main className="product-details-page"><p className="product-details-message" role="status">Loading product…</p></main>;
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <p className="product-details-message product-details-error" role="alert">
          {error || 'This product could not be found.'}
        </p>
        <Link className="product-details-back" to="/">← Back to products</Link>
      </main>
    );
  }

  const price = Number(product.discountPrice) || Number(product.price);
  const originalPrice = Number(product.price);
  const discount = Number(product.discountPercent) || 0;
  const hasDiscount = discount > 0 && price < originalPrice;
  const rating = Number(product.rating);
  const hasRating = Number.isFinite(rating) && rating > 0;

  return (
    <main className="product-details-page">
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span>/</span><span>{product.name}</span>
      </nav>

      <div className="product-details-layout">
        <section className="product-gallery" aria-label="Product images">
          <div className="product-thumbnails">
            <button className="product-thumbnail is-selected" type="button" aria-label="Product image">
              <img src={product.image} alt="" />
            </button>
          </div>
          <div className="product-main-image">
            <img src={product.image} alt={product.name || 'Product'} />
          </div>
          <div className="product-detail-actions">
            <button
              className="product-buy-button"
              type="button"
              onClick={() => addToCart(true)}
              disabled={addingToCart || Number(product.stock) < 1}
            >
              {addingToCart ? 'Processing…' : Number(product.stock) < 1 ? 'Out of stock' : 'Buy Now'}
            </button>
            <button
              className="product-add-button"
              type="button"
              onClick={addToCart}
              disabled={addingToCart || Number(product.stock) < 1}
            >
              {addingToCart ? 'Adding…' : Number(product.stock) < 1 ? 'Out of stock' : 'Add to Cart'}
            </button>
            <button
              className="product-wishlist-button"
              type="button"
              onClick={addToWishlist}
              disabled={addingToWishlist}
            >
              <FiHeart aria-hidden="true" />
              {addingToWishlist ? 'Saving…' : 'Add to Wishlist'}
            </button>
          </div>
          {cartMessage && <p className="product-cart-message" role="status">{cartMessage}</p>}
          {cartError && <p className="product-cart-error" role="alert">{cartError}</p>}
          {wishlistMessage && <p className="product-cart-message" role="status">{wishlistMessage}</p>}
          {wishlistError && <p className="product-cart-error" role="alert">{wishlistError}</p>}
        </section>

        <div className="product-details-info">
          <section className="product-info-card">
            <p className="product-brand">{product.brand || 'Meesho'}</p>
            <h1>{product.name}</h1>
            <div className="product-detail-price">
              <strong>{inr(price)}</strong>
              {hasDiscount && (
                <>
                  <del>{inr(originalPrice)}</del>
                  <span>{discount}% off</span>
                </>
              )}
            </div>
            <p className="product-tax-note">Inclusive of all taxes</p>
            {hasRating && (
              <div className="product-detail-rating">
                <span>{rating.toFixed(1)} <IoMdStar aria-hidden="true" /></span>
                <span>Product rating</span>
              </div>
            )}
            {product.description && <p className="product-description">{product.description}</p>}
            <div className="product-delivery">
              <FiTruck aria-hidden="true" />
              <div><strong>Delivery details</strong><span>Delivery options are confirmed at checkout.</span></div>
            </div>
          </section>

          <section className="product-info-card product-highlights">
            <h2>Product Highlights</h2>
            <dl>
              <div><dt>Brand</dt><dd>{product.brand || 'Not specified'}</dd></div>
              <div><dt>Availability</dt><dd>{Number(product.stock) > 0 ? 'In stock' : 'Out of stock'}</dd></div>
              <div><dt>Product code</dt><dd>{String(product._id).slice(-8).toUpperCase()}</dd></div>
            </dl>
          </section>

          <section className="product-info-card product-service-points" aria-label="Shopping benefits">
            <div><FiRefreshCw aria-hidden="true" /><span>7 Days Easy Return</span></div>
            <div><FiShield aria-hidden="true" /><span>Secure shopping</span></div>
            <div><FiCheckCircle aria-hidden="true" /><span>Quality product</span></div>
          </section>
        </div>
      </div>

      <section className="product-related-section">
        <h2>Similar products</h2>
        {relatedError ? (
          <p className="product-related-message product-details-error" role="alert">{relatedError}</p>
        ) : relatedProducts.length ? (
          <div className="product-related-grid">
            {relatedProducts.map((item) => (
              <Link className="product-related-card" to={`/product/${item._id}`} key={item._id}>
                <img src={item.image} alt={item.name || 'Product'} loading="lazy" />
                <span>{item.name}</span>
                <strong>{inr(Number(item.discountPrice) || Number(item.price))}</strong>
              </Link>
            ))}
          </div>
        ) : (
          <p className="product-related-message">No similar products are available yet.</p>
        )}
        <Link className="product-details-back" to="/"><FiArrowLeft aria-hidden="true" /> Back to products</Link>
      </section>
    </main>
  );
}
