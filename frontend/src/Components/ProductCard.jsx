import { useEffect, useState } from 'react';
import { IoMdStar } from 'react-icons/io';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

const inr = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/product/get`, {
          signal: controller.signal
        });
        const payload = await response.json();
        if (!response.ok || payload.success === false) {
          throw new Error(payload.message || `Could not load products (${response.status}).`);
        }
        if (!Array.isArray(payload.data)) {
          throw new Error('The products API response did not include a product list.');
        }
        setProducts(payload.data);
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Could not load products.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProducts();
    return () => controller.abort();
  }, []);

  return (
    <section className="productlisting" aria-label="Products">
      <div className="productlistright">
        {loading ? (
          <p className="product-list-message" role="status">Loading products…</p>
        ) : error ? (
          <p className="product-list-message product-list-error" role="alert">{error}</p>
        ) : products.length === 0 ? (
          <p className="product-list-message">No products are available yet.</p>
        ) : (
          <div className="productcontainer">
            {products.map((product) => {
              const discount = Number(product.discountPercent) || 0;
              const discountedPrice = Number(product.discountPrice) || Number(product.price);
              const hasDiscount = discount > 0 && discountedPrice < Number(product.price);
              const rating = Number(product.rating);

              return (
                <article className="productCard" key={product._id}>
                  <div className="subproductcard">
                    <img
                      src={product.image}
                      alt={product.name || 'Product'}
                      loading="lazy"
                    />
                  </div>
                  <div className="aboutcard">
                    <p className="productnamepera" title={product.name}>
                      {product.name}
                    </p>
                    <div className="productdesc">
                      <h2 className="productprice">
                        {inr(hasDiscount ? discountedPrice : product.price)}
                      </h2>
                      {hasDiscount && (
                        <>
                          <p className="pricewithoutdescount">{inr(product.price)}</p>
                          <span className="productdescount">{discount}% off</span>
                        </>
                      )}
                    </div>
                    {Number.isFinite(rating) && rating > 0 && (
                      <div className="product-rating">
                        <span className="rating">
                          {rating.toFixed(1)} <IoMdStar aria-hidden="true" />
                        </span>
                        <span className="review">Customer rating</span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
