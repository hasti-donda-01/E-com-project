
import { useEffect, useState } from 'react';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

const menuItems = [
  { name: 'Dashboard', icon: '▦' },
  { name: 'Products', icon: '□' },
  { name: 'Categories', icon: '▤' },
  { name: 'Orders', icon: '▣' },
  { name: 'Sellers', icon: '♙' },
  { name: 'Customers', icon: '♧' },
  { name: 'Reports', icon: '▥' },
  { name: 'Settings', icon: '⚙' },
];

const orders = [
  { id: 'ORD101', customer: 'Priya Sharma', product: 'Women Kurti', amount: 599, status: 'Delivered' },
  { id: 'ORD102', customer: 'Riya Patel', product: 'Cotton Saree', amount: 899, status: 'Pending' },
  { id: 'ORD103', customer: 'Neha Singh', product: 'Handbag', amount: 449, status: 'Shipped' },
  { id: 'ORD104', customer: 'Aarav Shah', product: 'Casual Shirt', amount: 699, status: 'Cancelled' },
];

export default function AdminPanel() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');
  const [categoryLoadAttempt, setCategoryLoadAttempt] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModalMode, setCategoryModalMode] = useState('');
  const [categoryForm, setCategoryForm] = useState({ category_name: '', description: '' });
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryActionLoading, setCategoryActionLoading] = useState(false);
  const [categoryActionError, setCategoryActionError] = useState('');
  const [categoryNotice, setCategoryNotice] = useState('');
  const [sellers, setSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(false);
  const [sellersError, setSellersError] = useState('');
  const [sellerLoadAttempt, setSellerLoadAttempt] = useState(0);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [productLoadAttempt, setProductLoadAttempt] = useState(0);
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const checkAdminSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/session`, {
          credentials: 'include',
          signal: controller.signal
        });
        if (!response.ok) {
          setAdminUser(null);
          return;
        }
        const payload = await response.json();
        setAdminUser(payload.success && payload.data?.role?.toLowerCase() === 'admin' ? payload.data : null);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setAuthError('Could not connect to the server. Check the API URL and try again.');
        }
      } finally {
        if (!controller.signal.aborted) setAuthLoading(false);
      }
    };

    checkAdminSession();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (activePage !== 'Categories') return undefined;

    const controller = new AbortController();
    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError('');

      try {
        const response = await fetch(`${API_BASE_URL}/category/get`, {
          signal: controller.signal
        });
        let payload;
        try {
          payload = await response.json();
        } catch {
          throw new Error(`The categories API returned an invalid response (${response.status}).`);
        }
        if (!response.ok || payload.success === false) {
          throw new Error(payload.message || `Could not load categories (${response.status}).`);
        }
        if (!Array.isArray(payload.data)) {
          throw new Error('The categories API response did not include a category list.');
        }

        setCategories(payload.data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setCategoriesError(error.message || 'Could not load categories.');
        }
      } finally {
        if (!controller.signal.aborted) setCategoriesLoading(false);
      }
    };

    loadCategories();
    return () => controller.abort();
  }, [activePage, categoryLoadAttempt]);

  useEffect(() => {
    if (activePage !== 'Sellers') return undefined;

    const controller = new AbortController();
    const loadSellers = async () => {
      setSellersLoading(true);
      setSellersError('');
      try {
        const readSellerPage = async (page) => {
          const response = await fetch(`${API_BASE_URL}/admin/getallsellers?page=${page}`, {
            credentials: 'include',
            signal: controller.signal
          });
          const payload = await response.json();
          if (
            page === 1 &&
            response.status === 404 &&
            payload.message?.toLowerCase() === 'page not found'
          ) {
            return { sellers: [], totalPages: 0 };
          }
          if (!response.ok || payload.success === false || !Array.isArray(payload.data)) {
            throw new Error(payload.message || `Could not load sellers (${response.status}).`);
          }

          if (Array.isArray(payload.data[0])) {
            const legacyTotalPages = Number(payload.data[1]?.match(/\d+/)?.[0]) || 1;
            return { sellers: payload.data[0], totalPages: legacyTotalPages };
          }

          return {
            sellers: payload.data,
            totalPages: Math.max(1, Number(payload.pagination?.totalPages) || 1)
          };
        };

        const firstPage = await readSellerPage(1);
        const allSellers = [...firstPage.sellers];
        for (let page = 2; page <= firstPage.totalPages; page += 1) {
          const nextPage = await readSellerPage(page);
          allSellers.push(...nextPage.sellers);
        }
        setSellers(allSellers);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSellersError(error.message || 'Could not load sellers.');
        }
      } finally {
        if (!controller.signal.aborted) setSellersLoading(false);
      }
    };

    loadSellers();
    return () => controller.abort();
  }, [activePage, sellerLoadAttempt]);

  useEffect(() => {
    if (activePage !== 'Products') return undefined;

    const controller = new AbortController();
    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError('');

      try {
        const firstResponse = await fetch(`${API_BASE_URL}/admin/getallproducts?page=1`, {
          credentials: 'include',
          signal: controller.signal
        });
        let firstPayload;
        try {
          firstPayload = await firstResponse.json();
        } catch {
          throw new Error(`The products API returned an invalid response (${firstResponse.status}).`);
        }
        if (!firstResponse.ok || firstPayload.success === false || !Array.isArray(firstPayload.data)) {
          throw new Error(firstPayload.message || `Could not load products (${firstResponse.status}).`);
        }

        const allProducts = [...firstPayload.data];
        const totalPages = Math.max(1, Number(firstPayload.pagination?.totalPages) || 1);
        for (let page = 2; page <= totalPages; page += 1) {
          const response = await fetch(`${API_BASE_URL}/admin/getallproducts?page=${page}`, {
            credentials: 'include',
            signal: controller.signal
          });
          let payload;
          try {
            payload = await response.json();
          } catch {
            throw new Error(`The products API returned an invalid response (${response.status}).`);
          }
          if (!response.ok || payload.success === false || !Array.isArray(payload.data)) {
            throw new Error(payload.message || `Could not load products (${response.status}).`);
          }
          allProducts.push(...payload.data);
        }

        setProducts(allProducts);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setProductsError(error.message || 'Could not load products.');
        }
      } finally {
        if (!controller.signal.aborted) setProductsLoading(false);
      }
    };

    loadProducts();
    return () => controller.abort();
  }, [activePage, productLoadAttempt]);

  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.product} ${order.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const filteredCategories = categories.filter((category) =>
    `${category.category_name || ''} ${category.description || ''} ${category.isActive === false ? 'inactive' : 'active'}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const filteredSellers = sellers.filter((seller) =>
    `${seller.name || ''} ${seller.email || ''} ${seller.phone || ''} ${seller.storeName || ''} ${seller.category || ''} ${seller.businessType || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const filteredProducts = products.filter((product) =>
    `${product.name || ''} ${product.brand || ''} ${product.category_name || product.categoryId?.category_name || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openCategoryModal = (category, mode) => {
    setSelectedCategory(category);
    setCategoryModalMode(mode);
    setCategoryActionError('');
    setCategoryImage(null);
    setCategoryForm({
      category_name: category?.category_name || '',
      description: category?.description || ''
    });
  };

  const closeCategoryModal = () => {
    if (categoryActionLoading) return;
    setSelectedCategory(null);
    setCategoryModalMode('');
    setCategoryActionError('');
  };

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setAuthError('');
    setLoginLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail.trim(), password: adminPassword })
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || `Login failed (${response.status}).`);
      }
      if (payload.data?.role?.toLowerCase() !== 'admin') {
        throw new Error('This account does not have administrator access.');
      }
      setAdminUser(payload.data);
      setAdminPassword('');
    } catch (error) {
      setAuthError(error.message || 'Could not sign in.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    setAuthError('');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || `Logout failed (${response.status}).`);
      }
      setAdminUser(null);
      setActivePage('Dashboard');
      setCategories([]);
      setCategoryNotice('');
    } catch (error) {
      setAuthError(error.message || 'Could not sign out.');
    }
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    if (categoryModalMode !== 'create' && !selectedCategory) return;
    const categoryName = categoryForm.category_name.trim();
    if (!categoryName) {
      setCategoryActionError('Category name is required.');
      return;
    }
    if (categoryModalMode === 'create' && !categoryImage) {
      setCategoryActionError('Choose an image for the category.');
      return;
    }

    setCategoryActionLoading(true);
    setCategoryActionError('');
    setCategoryNotice('');
    try {
      const isCreating = categoryModalMode === 'create';
      const body = isCreating ? new FormData() : JSON.stringify({
        category_name: categoryName,
        description: categoryForm.description.trim()
      });
      if (isCreating) {
        body.append('category_name', categoryName);
        body.append('description', categoryForm.description.trim());
        body.append('category_Image', categoryImage);
      }
      const response = await fetch(
        isCreating
          ? `${API_BASE_URL}/category/create`
          : `${API_BASE_URL}/category/update/${selectedCategory._id}`,
        {
          method: 'POST',
          headers: isCreating
            ? {}
            : { 'Content-Type': 'application/json' },
          credentials: 'include',
          body
        }
      );
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || `Could not ${isCreating ? 'create' : 'update'} category (${response.status}).`);
      }
      setCategoryNotice(payload.message || `Category ${isCreating ? 'created' : 'updated'} successfully.`);
      setSelectedCategory(null);
      setCategoryModalMode('');
      setCategoryLoadAttempt((attempt) => attempt + 1);
    } catch (error) {
      setCategoryActionError(error.message || 'Could not update category.');
    } finally {
      setCategoryActionLoading(false);
    }
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete category "${category.category_name}"? This action cannot be undone.`)) return;
    setCategoriesError('');
    setCategoryNotice('');
    try {
      const response = await fetch(`${API_BASE_URL}/category/delete/${category._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const payload = await response.json();
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || `Could not delete category (${response.status}).`);
      }
      setCategories((current) => current.filter((item) => item._id !== category._id));
      setCategoryNotice(payload.message || 'Category deleted successfully.');
    } catch (error) {
      setCategoriesError(error.message || 'Could not delete category.');
    }
  };

  if (authLoading) {
    return (
      <main className="admin-auth-page">
        <p>Checking admin session…</p>
      </main>
    );
  }

  if (!adminUser) {
    return (
      <main className="admin-auth-page">
        <form className="admin-login-card" onSubmit={handleAdminLogin}>
          <div className="admin-logo">
            <h1>meesho</h1>
            <p>ADMIN PANEL</p>
          </div>
          <h2>Admin sign in</h2>
          <p className="admin-login-help">Sign in with your administrator account to manage categories.</p>
          {authError && <p className="admin-category-error" role="alert">{authError}</p>}
          <label>
            Email address
            <input
              type="email"
              autoComplete="username"
              required
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
            />
          </label>
          <button className="admin-primary-btn" type="submit" disabled={loginLoading}>
            {loginLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h1>meesho</h1>
          <p>ADMIN PANEL</p>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <div>
            <h4>{adminUser.name || 'Administrator'}</h4>
            <p>{adminUser.email}</p>
          </div>
        </div>

        <p className="admin-menu-title">MAIN MENU</p>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? 'admin-nav-item active'
                  : 'admin-nav-item'
              }
              onClick={() => {
                setActivePage(item.name);
                setSearch('');
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
              {item.name === 'Orders' && (
                <span className="menu-count">4</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <p>Meesho Admin</p>
          <small>Marketplace Management</small>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h2>{activePage}</h2>
            <p>Home / {activePage}</p>
          </div>

          <div className="admin-top-actions">
            <button
              className="admin-notification"
              aria-label="Notifications"
            >
              ♧
            </button>
            <div className="admin-avatar">{adminUser.name?.charAt(0)?.toUpperCase() || 'A'}</div>
            <button className="admin-logout-btn" type="button" onClick={handleAdminLogout}>
              Sign out
            </button>
          </div>
        </header>

        {authError && <p className="admin-category-error" role="alert">{authError}</p>}

        {activePage === 'Dashboard' && (
          <>
            <section className="admin-welcome">
              <div>
                <h2>Welcome back, Admin! 👋</h2>
                <p>Here is what is happening with your store today.</p>
              </div>

              <span className="admin-date">
                {new Date().toLocaleDateString('en-IN')}
              </span>
            </section>

            <section className="admin-stats">
              <div className="admin-stat-card">
                <div className="stat-icon pink">₹</div>
                <p>Total Revenue</p>
                <h2>₹2,45,600</h2>
                <small className="stat-positive">↑ 12.5% this month</small>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon purple">▣</div>
                <p>Total Orders</p>
                <h2>1,248</h2>
                <small className="stat-positive">↑ 8.2% this month</small>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon orange">□</div>
                <p>Total Products</p>
                <h2>356</h2>
                <small>Listed products</small>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon green">♙</div>
                <p>Total Sellers</p>
                <h2>84</h2>
                <small>Registered sellers</small>
              </div>
            </section>

            <section className="admin-content-card">
              <div className="admin-card-heading">
                <div>
                  <h3>Recent Orders</h3>
                  <p>Track your latest customer orders.</p>
                </div>

                <button
                  className="admin-primary-btn"
                  onClick={() => setActivePage('Orders')}
                >
                  View All Orders →
                </button>
              </div>

              <OrderTable data={orders} />
            </section>
          </>
        )}

        {activePage !== 'Dashboard' && (
          <section className="admin-content-card">
            <div className="admin-card-heading">
              <div>
                <h3>{activePage} Management</h3>
                <p>Manage your marketplace {activePage.toLowerCase()}.</p>
              </div>
            </div>

            {activePage === 'Products' ? (
              <>
                <div className="admin-category-toolbar">
                  <input
                    className="admin-search"
                    type="search"
                    placeholder="Search products, brands or categories..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search products"
                  />
                  <button
                    className="admin-primary-btn"
                    type="button"
                    onClick={() => setProductLoadAttempt((attempt) => attempt + 1)}
                    disabled={productsLoading}
                  >
                    {productsLoading ? 'Loading…' : 'Refresh'}
                  </button>
                </div>

                {productsError && (
                  <div className="admin-category-error" role="alert">
                    <span>{productsError}</span>
                    <button
                      className="admin-category-retry"
                      type="button"
                      onClick={() => setProductLoadAttempt((attempt) => attempt + 1)}
                    >
                      Try again
                    </button>
                  </div>
                )}

                <div className="admin-table-wrapper">
                  <table className="admin-table admin-product-table">
                    <thead>
                      <tr>
                        <th>PRODUCT</th>
                        <th>BRAND</th>
                        <th>CATEGORY</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>CREATED</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsLoading && products.length === 0 ? (
                        <tr><td colSpan="6" className="admin-empty">Loading products…</td></tr>
                      ) : productsError && products.length === 0 ? (
                        <tr><td colSpan="6" className="admin-empty">Products could not be loaded.</td></tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="admin-empty">
                            {products.length === 0 ? 'No products found.' : 'No products match your search.'}
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr key={product._id}>
                            <td className="admin-product-name">
                              {product.image ? (
                                <img className="admin-product-image" src={product.image} alt="" loading="lazy" />
                              ) : (
                                <span className="admin-product-image-placeholder">—</span>
                              )}
                              <span>{product.name || 'Unnamed product'}</span>
                            </td>
                            <td>{product.brand || '—'}</td>
                            <td>{product.category_name || product.categoryId?.category_name || 'Uncategorized'}</td>
                            <td>
                              {Number.isFinite(Number(product.price))
                                ? `₹${Number(product.price).toLocaleString('en-IN')}`
                                : '—'}
                            </td>
                            <td>{Number.isFinite(Number(product.stock)) ? product.stock : '—'}</td>
                            <td>
                              {product.createdAt
                                ? new Date(product.createdAt).toLocaleDateString('en-IN')
                                : '—'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {!productsLoading && !productsError && products.length > 0 && (
                  <p className="admin-category-count">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                )}
              </>
            ) : activePage === 'Categories' ? (
              <>
                <div className="admin-category-toolbar">
                  <input
                    className="admin-search"
                    type="search"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search categories"
                  />
                  <button
                    className="admin-primary-btn"
                    type="button"
                    onClick={() => setCategoryLoadAttempt((attempt) => attempt + 1)}
                    disabled={categoriesLoading}
                  >
                    {categoriesLoading ? 'Loading…' : 'Refresh'}
                  </button>
                  <button
                    className="admin-primary-btn"
                    type="button"
                    onClick={() => openCategoryModal(null, 'create')}
                  >
                    + Add category
                  </button>
                </div>

                {categoryNotice && (
                  <p className="admin-category-notice" role="status">{categoryNotice}</p>
                )}

                {categoriesError && (
                  <div className="admin-category-error" role="alert">
                    <span>{categoriesError}</span>
                    <button
                      className="admin-category-retry"
                      type="button"
                      onClick={() => setCategoryLoadAttempt((attempt) => attempt + 1)}
                    >
                      Try again
                    </button>
                  </div>
                )}

                <div className="admin-table-wrapper">
                  <table className="admin-table admin-category-table">
                    <thead>
                      <tr>
                        <th>IMAGE</th>
                        <th>CATEGORY</th>
                        <th>DESCRIPTION</th>
                        <th>STATUS</th>
                        <th>CREATED</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriesLoading && categories.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="admin-empty">Loading categories…</td>
                        </tr>
                      ) : categoriesError && categories.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="admin-empty">Categories could not be loaded.</td>
                        </tr>
                      ) : filteredCategories.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="admin-empty">
                            {categories.length === 0 ? 'No categories found.' : 'No matching categories.'}
                          </td>
                        </tr>
                      ) : (
                        filteredCategories.map((category) => (
                          <tr key={category._id}>
                            <td>
                              {category.category_Image ? (
                                <img
                                  className="admin-category-image"
                                  src={category.category_Image}
                                  alt=""
                                  loading="lazy"
                                />
                              ) : (
                                <span className="admin-category-image-placeholder" aria-label="No image">—</span>
                              )}
                            </td>
                            <td className="admin-category-name">{category.category_name || 'Unnamed category'}</td>
                            <td className="admin-category-description">{category.description || '—'}</td>
                            <td>
                              <span className={`admin-category-status ${category.isActive === false ? 'inactive' : 'active'}`}>
                                {category.isActive === false ? 'Inactive' : 'Active'}
                              </span>
                            </td>
                            <td>
                              {category.createdAt
                                ? new Date(category.createdAt).toLocaleDateString('en-IN')
                                : '—'}
                            </td>
                            <td>
                              <div className="admin-category-actions">
                                <button
                                  className="admin-category-action view"
                                  type="button"
                                  onClick={() => openCategoryModal(category, 'view')}
                                >
                                  View
                                </button>
                                <button
                                  className="admin-category-action edit"
                                  type="button"
                                  onClick={() => openCategoryModal(category, 'edit')}
                                >
                                  Edit
                                </button>
                                <button
                                  className="admin-category-action delete"
                                  type="button"
                                  onClick={() => deleteCategory(category)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {!categoriesLoading && !categoriesError && categories.length > 0 && (
                  <p className="admin-category-count">
                    Showing {filteredCategories.length} of {categories.length} categories
                  </p>
                )}
              </>
            ) : activePage === 'Sellers' ? (
              <>
                <div className="admin-category-toolbar">
                  <input
                    className="admin-search"
                    type="search"
                    placeholder="Search sellers, stores or contact details..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search sellers"
                  />
                  <button
                    className="admin-primary-btn"
                    type="button"
                    onClick={() => setSellerLoadAttempt((attempt) => attempt + 1)}
                    disabled={sellersLoading}
                  >
                    {sellersLoading ? 'Loading…' : 'Refresh'}
                  </button>
                </div>

                {sellersError && (
                  <div className="admin-category-error" role="alert">
                    <span>{sellersError}</span>
                    <button
                      className="admin-category-retry"
                      type="button"
                      onClick={() => setSellerLoadAttempt((attempt) => attempt + 1)}
                    >
                      Try again
                    </button>
                  </div>
                )}

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>SELLER</th>
                        <th>STORE</th>
                        <th>CONTACT</th>
                        <th>BUSINESS</th>
                        <th>VERIFICATION</th>
                        <th>ACCOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellersLoading && sellers.length === 0 ? (
                        <tr><td colSpan="6" className="admin-empty">Loading sellers…</td></tr>
                      ) : sellersError && sellers.length === 0 ? (
                        <tr><td colSpan="6" className="admin-empty">Sellers could not be loaded.</td></tr>
                      ) : filteredSellers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="admin-empty">
                            {sellers.length === 0 ? 'No sellers found.' : 'No sellers match your search.'}
                          </td>
                        </tr>
                      ) : (
                        filteredSellers.map((seller) => (
                          <tr key={seller._id}>
                            <td>
                              <strong>{seller.name || '—'}</strong>
                              <div>{seller.email || '—'}</div>
                            </td>
                            <td>
                              <strong>{seller.storeName || '—'}</strong>
                              <div>{seller.category || '—'}</div>
                            </td>
                            <td>{seller.phone || '—'}</td>
                            <td>{seller.businessType || '—'}</td>
                            <td>
                              <span className={`admin-category-status ${seller.isApproved ? 'active' : seller.isRejected ? 'inactive' : ''}`}>
                                {seller.isApproved ? 'Approved' : seller.isRejected ? 'Rejected' : 'Pending'}
                              </span>
                            </td>
                            <td>{seller.accountStatus || (seller.isActive ? 'Active' : 'Inactive')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {!sellersLoading && !sellersError && sellers.length > 0 && (
                  <p className="admin-category-count">
                    Showing {filteredSellers.length} of {sellers.length} sellers
                  </p>
                )}
              </>
            ) : activePage === 'Orders' ? (
              <>
                <input
                  className="admin-search"
                  type="text"
                  placeholder="Search orders, customers or products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <OrderTable data={filteredOrders} />
              </>
            ) : (
              <div className="admin-placeholder">
                <div className="placeholder-icon">▦</div>
                <h3>{activePage}</h3>
                <p>
                  Your {activePage.toLowerCase()} management page will appear
                  here. Connect your backend API to display real data.
                </p>

                {['Categories', 'Sellers', 'Customers'].includes(
                  activePage
                ) && (
                  <button
                    className="admin-primary-btn"
                    onClick={() =>
                      alert(`Connect the ${activePage} API here.`)
                    }
                  >
                    + Add {activePage === 'Categories'
                      ? 'Category'
                      : activePage.slice(0, -1)}
                  </button>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {categoryModalMode && (
        <div className="admin-category-modal-backdrop" onMouseDown={closeCategoryModal}>
          <section
            className="admin-category-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-category-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="admin-category-modal-heading">
              <div>
                <p>
                  {categoryModalMode === 'create'
                    ? 'NEW CATEGORY'
                    : categoryModalMode === 'edit'
                      ? 'CATEGORY SETTINGS'
                      : 'CATEGORY DETAILS'}
                </p>
                <h2 id="admin-category-modal-title">
                  {categoryModalMode === 'create'
                    ? 'Add category'
                    : categoryModalMode === 'edit'
                      ? 'Edit category'
                      : selectedCategory.category_name}
                </h2>
              </div>
              <button type="button" aria-label="Close" onClick={closeCategoryModal}>×</button>
            </div>

            {categoryModalMode === 'view' ? (
              <div className="admin-category-details">
                {selectedCategory.category_Image && (
                  <img src={selectedCategory.category_Image} alt={selectedCategory.category_name} />
                )}
                <p><strong>Name</strong><span>{selectedCategory.category_name || '—'}</span></p>
                <p><strong>Description</strong><span>{selectedCategory.description || '—'}</span></p>
                <p><strong>Status</strong><span>{selectedCategory.isActive === false ? 'Inactive' : 'Active'}</span></p>
                <p>
                  <strong>Created</strong>
                  <span>{selectedCategory.createdAt ? new Date(selectedCategory.createdAt).toLocaleString('en-IN') : '—'}</span>
                </p>
              </div>
            ) : (
              <form className="admin-category-edit-form" onSubmit={saveCategory}>
                <label>
                  Category name
                  <input
                    required
                    maxLength="100"
                    value={categoryForm.category_name}
                    onChange={(event) => setCategoryForm((current) => ({ ...current, category_name: event.target.value }))}
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows="4"
                    value={categoryForm.description}
                    onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))}
                  />
                </label>
                {categoryModalMode === 'create' && (
                  <label>
                    Category image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      required
                      onChange={(event) => setCategoryImage(event.target.files?.[0] || null)}
                    />
                    <span className="admin-category-file-hint">Choose a JPG, PNG, or WebP image.</span>
                  </label>
                )}
                {categoryActionError && <p className="admin-category-error" role="alert">{categoryActionError}</p>}
                <div className="admin-category-modal-actions">
                  <button type="button" onClick={closeCategoryModal} disabled={categoryActionLoading}>Cancel</button>
                  <button className="admin-primary-btn" type="submit" disabled={categoryActionLoading}>
                    {categoryActionLoading ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </form>
            )}
            {categoryModalMode === 'view' && (
              <div className="admin-category-modal-actions">
                <button type="button" onClick={closeCategoryModal}>Close</button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function OrderTable({ data }) {
  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>CUSTOMER</th>
            <th>PRODUCT</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {data.map((order) => (
            <tr key={order.id}>
              <td className="order-id">{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.product}</td>
              <td>₹{order.amount}</td>
              <td>
                <span
                  className={`order-status ${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan="5" className="admin-empty">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
