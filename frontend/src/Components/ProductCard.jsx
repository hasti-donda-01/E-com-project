import { useEffect, useState } from 'react';
import { IoMdStar } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

const inr = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function ProductCard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [sort, setSort] = useState('relevance');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const firstResponse = await fetch(`${API_BASE_URL}/product/get?page=1`, {
          signal: controller.signal
        });
        const firstPayload = await firstResponse.json();
        if (!firstResponse.ok || firstPayload.success === false) {
          throw new Error(firstPayload.message || `Could not load products (${firstResponse.status}).`);
        }
        if (!Array.isArray(firstPayload.data)) {
          throw new Error('The products API response did not include a product list.');
        }

        const allProducts = [...firstPayload.data];
        const totalPages = Math.max(1, Number(firstPayload.totalPages) || 1);
        for (let page = 2; page <= totalPages; page += 1) {
          const response = await fetch(`${API_BASE_URL}/product/get?page=${page}`, {
            signal: controller.signal
          });
          const payload = await response.json();
          if (!response.ok || payload.success === false || !Array.isArray(payload.data)) {
            throw new Error(payload.message || `Could not load products (${response.status}).`);
          }
          allProducts.push(...payload.data);
        }
        setProducts(allProducts);

        const categoryResponse = await fetch(`${API_BASE_URL}/category/get`, {
          signal: controller.signal
        });
        const categoryPayload = await categoryResponse.json();
        if (!categoryResponse.ok || categoryPayload.success === false || !Array.isArray(categoryPayload.data)) {
          throw new Error(categoryPayload.message || `Could not load categories (${categoryResponse.status}).`);
        }
        setCategories(categoryPayload.data);
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

  const getCategoryId = (product) =>
    String(product.categoryId?._id || product.categoryId || '');
  const availableCategories = categories
    .filter((category) => products.some((product) => getCategoryId(product) === String(category._id)))
    .filter((category) =>
      String(category.category_name || '').toLowerCase().includes(categorySearch.trim().toLowerCase())
    );

  const filteredProducts = products
    .filter((product) =>
      selectedCategories.length === 0 || selectedCategories.includes(getCategoryId(product))
    )
    .sort((first, second) => {
      if (sort === 'price-low') {
        return Number(first.discountPrice || first.price) - Number(second.discountPrice || second.price);
      }
      if (sort === 'price-high') {
        return Number(second.discountPrice || second.price) - Number(first.discountPrice || first.price);
      }
      if (sort === 'rating') return Number(second.rating || 0) - Number(first.rating || 0);
      return 0;
    });

  const toggleCategory = (categoryId) => {
    setSelectedCategories((selected) =>
      selected.includes(categoryId)
        ? selected.filter((id) => id !== categoryId)
        : [...selected, categoryId]
    );
  };

  return (
    <section className="products-page" aria-label="Products">
      <h1 className="products-page-title">Products For You</h1>
      <div className="productlisting">
        <aside className="productlistleft" aria-label="Product filters">
          <label className="product-sort">
            <span>Sort by: <strong>{sort === 'price-low' ? 'Price: Low to High' : sort === 'price-high' ? 'Price: High to Low' : sort === 'rating' ? 'Rating' : 'Relevance'}</strong></span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
            <span className="product-sort-chevron" aria-hidden="true">⌄</span>
          </label>

          <div className="product-filter">
            <div className="product-filter-heading">
              <h2>FILTERS</h2>
              <p>{loading ? 'Loading products…' : `${products.length} Products`}</p>
            </div>
            <div className="product-category-heading">
              <h3>Category</h3>
              <span aria-hidden="true">⌃</span>
            </div>
            <label className="category-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search"
                value={categorySearch}
                onChange={(event) => setCategorySearch(event.target.value)}
                aria-label="Search categories"
              />
            </label>
            <div className="category-filter-list">
              {availableCategories.map((category) => (
                <label className="category-filter-option" key={category._id}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(String(category._id))}
                    onChange={() => toggleCategory(String(category._id))}
                  />
                  <span>{category.category_name}</span>
                </label>
              ))}
              {!loading && !error && availableCategories.length === 0 && (
                <p className="category-filter-empty">
                  {categorySearch ? 'No matching categories.' : 'No categories found.'}
                </p>
              )}
            </div>
            {selectedCategories.length > 0 && (
              <button
                type="button"
                className="clear-product-filters"
                onClick={() => setSelectedCategories([])}
              >
                Clear filters
              </button>
            )}
          </div>
        </aside>

        <div className="productlistright">
          {loading ? (
            <p className="product-list-message" role="status">Loading products…</p>
          ) : error ? (
            <p className="product-list-message product-list-error" role="alert">{error}</p>
          ) : filteredProducts.length === 0 ? (
            <p className="product-list-message">
              {products.length ? 'No products match these filters.' : 'No products are available yet.'}
            </p>
          ) : (
            <div className="productcontainer">
              {filteredProducts.map((product) => {
                const discount = Number(product.discountPercent) || 0;
                const discountedPrice = Number(product.discountPrice) || Number(product.price);
                const hasDiscount = discount > 0 && discountedPrice < Number(product.price);
                const rating = Number(product.rating);

                return (
                  <div
                    className="product-card-link"
                    key={product._id}
                    role="link"
                    tabIndex={0}
                    aria-label={`View ${product.name}`}
                    onClick={() => navigate(`/product/${product._id}`)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        navigate(`/product/${product._id}`);
                      }
                    }}
                  >
                    <article className="productCard">
                      <div className="subproductcard">
                        <img src={product.image} alt={product.name || 'Product'} loading="lazy" />
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
