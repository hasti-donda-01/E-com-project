import { useEffect, useState } from 'react';
import { IoMdStar } from 'react-icons/io';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

const inr = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const attributeFilterGroups = [
  ['gender', 'Gender'],
  ['color', 'Color'],
  ['fabric', 'Fabric'],
  ['size', 'Size'],
  ['occasion', 'Occasion'],
  ['combo', 'Combo'],
  ['meeshoDeal', 'Meesho Deal'],
  ['meeshoMall', 'Meesho Mall'],
  ['fitShape', 'Fit / Shape'],
  ['countryOfOrigin', 'Country of Origin'],
  ['material', 'Material'],
  ['bottomLength', 'Bottom Length'],
  ['printPatternType', 'Print or Pattern Type'],
  ['ornamentation', 'Ornamentation'],
  ['bottomPatternType', 'Bottom Pattern Type'],
  ['surfaceStyling', 'Surface Styling'],
  ['neckType', 'Neck Type'],
  ['loomType', 'Loom Type'],
  ['compatibleModels', 'Compatible Models'],
  ['waistRise', 'Waist Rise'],
  ['bottomType', 'Bottom Type'],
  ['dialDesign', 'Dial Design'],
  ['type', 'Type']
];

const getAttributeValues = (product, key) => {
  const attributes = product.attributes instanceof Map
    ? Object.fromEntries(product.attributes)
    : product.attributes || {};
  const value = attributes[key] ?? product[key];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (value === undefined || value === null || value === '') return [];
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
};

const normalizeFilterValue = (value) => String(value).trim().toLowerCase();

export default function ProductCard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [attributeFilters, setAttributeFilters] = useState({});
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minimumRating, setMinimumRating] = useState('');
  const [minimumDiscount, setMinimumDiscount] = useState('');
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
        setCategories(categoryPayload.data.filter((category) => category.isActive !== false));
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

  const routeCategoryId = searchParams.get('category');
  const activeCategoryIds = routeCategoryId ? [routeCategoryId] : selectedCategories;
  const getCategoryId = (product) =>
    String(product.categoryId?._id || product.categoryId || '');
  const availableCategories = categories
    .filter((category) => products.some((product) => getCategoryId(product) === String(category._id)))
    .filter((category) =>
      String(category.category_name || '').toLowerCase().includes(categorySearch.trim().toLowerCase())
    );

  const allPrices = products
    .map((product) => Number(product.discountPrice) || Number(product.price))
    .filter((price) => Number.isFinite(price) && price > 0);
  const priceBounds = {
    min: allPrices.length ? Math.floor(allPrices.reduce((min, price) => Math.min(min, price), Infinity)) : 0,
    max: allPrices.length ? Math.ceil(allPrices.reduce((max, price) => Math.max(max, price), -Infinity)) : 10000
  };

  const filteredProducts = products
    .filter((product) =>
      activeCategoryIds.length === 0 || activeCategoryIds.includes(getCategoryId(product))
    )
    .filter((product) => {
      const currentPrice = Number(product.discountPrice) || Number(product.price) || 0;
      return (!minPrice || currentPrice >= Number(minPrice)) &&
        (!maxPrice || currentPrice <= Number(maxPrice));
    })
    .filter((product) => !minimumRating || Number(product.rating || 0) >= Number(minimumRating))
    .filter((product) => !minimumDiscount || Number(product.discountPercent || 0) >= Number(minimumDiscount))
    .filter((product) => attributeFilterGroups.every(([key]) => {
      const selectedValues = attributeFilters[key] || [];
      if (selectedValues.length === 0) return true;
      const productValues = getAttributeValues(product, key).map(normalizeFilterValue);
      return selectedValues.some((value) => productValues.includes(normalizeFilterValue(value)));
    }))
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
    const currentSelection = routeCategoryId ? [routeCategoryId] : selectedCategories;
    setSelectedCategories(
      currentSelection.includes(categoryId)
        ? currentSelection.filter((id) => id !== categoryId)
        : [...currentSelection, categoryId]
    );
    if (routeCategoryId) setSearchParams({}, { replace: true });
  };

  const toggleAttributeFilter = (key, value) => {
    setAttributeFilters((current) => {
      const selected = current[key] || [];
      const next = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      return { ...current, [key]: next };
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setAttributeFilters({});
    setMinPrice('');
    setMaxPrice('');
    setMinimumRating('');
    setMinimumDiscount('');
    if (routeCategoryId) setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = activeCategoryIds.length > 0 ||
    Object.values(attributeFilters).some((values) => values.length > 0) ||
    Boolean(minPrice || maxPrice || minimumRating || minimumDiscount);

  const renderAttributeFilterGroup = ([key, label]) => {
    const values = [...new Set(products.flatMap((product) => getAttributeValues(product, key)))]
      .sort((first, second) => first.localeCompare(second));
    return (
      <details className="product-filter-group" key={key}>
        <summary>{label}</summary>
        {values.length ? (
          <div className="attribute-filter-list">
            {values.map((value) => (
              <label className="category-filter-option" key={value}>
                <input
                  type="checkbox"
                  checked={(attributeFilters[key] || []).includes(value)}
                  onChange={() => toggleAttributeFilter(key, value)}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="category-filter-empty">No filter values available yet.</p>
        )}
      </details>
    );
  };

  return (
    <section className="products-page" id="products-catalog" aria-label="Products">
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
              <p>{loading ? 'Loading products…' : `${filteredProducts.length} Products`}</p>
            </div>
            <details className="product-filter-group" open>
              <summary>Category</summary>
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
                {(showAllCategories ? availableCategories : availableCategories.slice(0, 6)).map((category) => (
                  <label className="category-filter-option" key={category._id}>
                    <input
                      type="checkbox"
                      checked={activeCategoryIds.includes(String(category._id))}
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
              {availableCategories.length > 6 && (
                <button
                  type="button"
                  className="show-more-filters"
                  onClick={() => setShowAllCategories((show) => !show)}
                >
                  {showAllCategories ? 'Show Less' : 'Show More'}
                </button>
              )}
            </details>

            <details className="product-filter-group">
              <summary>Gender</summary>
              <div className="gender-filter-options">
                {['Boys', 'Girls', 'Men', 'Women'].map((gender) => (
                  <label key={gender}>
                    <input
                      type="checkbox"
                      checked={(attributeFilters.gender || []).includes(gender)}
                      onChange={() => toggleAttributeFilter('gender', gender)}
                    />
                    <span>{gender}</span>
                  </label>
                ))}
              </div>
            </details>

            {attributeFilterGroups.slice(1, 4).map(renderAttributeFilterGroup)}

            <details className="product-filter-group">
              <summary>Price</summary>
              <div className="price-filter-fields">
                <label>
                  Min
                  <input
                    type="number"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    placeholder={String(priceBounds.min)}
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                  />
                </label>
                <span>to</span>
                <label>
                  Max
                  <input
                    type="number"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    placeholder={String(priceBounds.max)}
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                  />
                </label>
              </div>
            </details>

            <details className="product-filter-group">
              <summary>Rating</summary>
              <div className="attribute-filter-list">
                {[4, 3, 2, 1].map((rating) => (
                  <label className="category-filter-option" key={rating}>
                    <input
                      type="radio"
                      name="minimum-rating"
                      checked={minimumRating === String(rating)}
                      onChange={() => setMinimumRating(String(rating))}
                    />
                    <span>{rating}+ stars</span>
                  </label>
                ))}
                {minimumRating && (
                  <button type="button" className="show-more-filters" onClick={() => setMinimumRating('')}>
                    Clear rating
                  </button>
                )}
              </div>
            </details>

            <details className="product-filter-group">
              <summary>Discount</summary>
              <div className="attribute-filter-list">
                {[10, 20, 30, 50].map((discount) => (
                  <label className="category-filter-option" key={discount}>
                    <input
                      type="radio"
                      name="minimum-discount"
                      checked={minimumDiscount === String(discount)}
                      onChange={() => setMinimumDiscount(String(discount))}
                    />
                    <span>{discount}% or more</span>
                  </label>
                ))}
                {minimumDiscount && (
                  <button type="button" className="show-more-filters" onClick={() => setMinimumDiscount('')}>
                    Clear discount
                  </button>
                )}
              </div>
            </details>

            {attributeFilterGroups.slice(4).map(renderAttributeFilterGroup)}
            {hasActiveFilters && (
              <button type="button" className="clear-product-filters" onClick={clearAllFilters}>
                Clear all filters
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
