// Customer order history page - shows past orders, delivery status, and items
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw } from 'react-icons/fi';
import { getCustomerAccessToken, clearCustomerAccessToken, isCustomerAuthFailure } from '../utils/customerSession';

const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

export default function CustomerOrders() {
    // Orders data and product cache state
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [needsLogin, setNeedsLogin] = useState(false);
    const [refreshVersion, setRefreshVersion] = useState(0);
    const navigate = useNavigate();

    // Fetch customer's orders from server
    useEffect(() => {
        const controller = new AbortController();
        const loadOrders = async () => {
            setLoading(true);
            setError('');
            setNeedsLogin(false);
            try {
                const token = getCustomerAccessToken();
                const response = await fetch(`${API_BASE_URL}/customer/orders`, {
                    credentials: 'include',
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                    signal: controller.signal,
                });
                const payload = await response.json();
                if (
                    response.status === 400 &&
                    /token required|jwt expired|jwt malformed|invalid token/i.test(payload.message || '')
                ) {
                    setNeedsLogin(true);
                }
                if (!response.ok || payload.success === false || !Array.isArray(payload.data)) {
                    throw new Error(payload.message || `Could not load orders (${response.status}).`);
                }
                setOrders(payload.data);

                // Fetch product details for each order that doesn't have populated product
                const productIds = [...new Set(
                    payload.data.map(o => {
                        // product could be a populated object or just an ID string
                        if (o.product && typeof o.product === 'object' && o.product.image) return null;
                        return typeof o.product === 'string' ? o.product : o.product?._id || null;
                    }).filter(Boolean)
                )];

                if (productIds.length > 0) {
                    const productMap = {};
                    await Promise.all(
                        productIds.map(async (pid) => {
                            try {
                                const pRes = await fetch(`${API_BASE_URL}/product/getp/${pid}`, {
                                    signal: controller.signal,
                                });
                                const pData = await pRes.json();
                                if (pRes.ok && pData.success !== false && pData.data) {
                                    productMap[pid] = pData.data;
                                }
                            } catch { /* ignore individual failures */ }
                        })
                    );
                    setProducts(productMap);
                }
            } catch (loadError) {
                if (loadError.name !== 'AbortError') {
                    setError(loadError.message || 'Could not load orders.');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        };
        loadOrders();
        return () => controller.abort();
    }, [refreshVersion]);

    // Helper: get product info from order (supports both populated and ID-only)
    const getProduct = (order) => {
        if (order.product && typeof order.product === 'object' && order.product.image) {
            return order.product; // already populated from backend
        }
        const pid = typeof order.product === 'string' ? order.product : order.product?._id;
        return products[pid] || {};
    };

    if (loading) {
        return <p style={{ padding: 32, fontSize: 14, color: '#64748b' }} role="status">Loading orders…</p>;
    }

    if (error) {
        return (
            <div style={{ margin: 16, borderRadius: 8, border: '1px solid #fecdd3', background: '#fff1f2', padding: 16, fontSize: 14, color: '#9f1239' }} role="alert">
                <p>{error}</p>
                {needsLogin && (
                    <button style={{ marginTop: 8, fontSize: 14, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#9f1239' }} onClick={() => navigate('/customer-login')}>Sign in again</button>
                )}
            </div>
        );
    }

    return (
        <main style={{ minHeight: '100vh', background: '#f3f4f8', padding: '24px 16px' }}>
            <div style={{ maxWidth: 960, margin: '0 auto' }}>
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700 }}>My Orders</h1>
                    <button
                        type="button"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff',
                            padding: '6px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer'
                        }}
                        disabled={loading}
                        onClick={() => {
                            setRefreshing(true);
                            setRefreshVersion(v => v + 1);
                        }}
                    >
                        <FiRefreshCw aria-hidden="true" /> {refreshing ? 'Refreshing…' : 'Refresh'}
                    </button>
                </header>
                {orders.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b' }}>You haven't placed any orders yet.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 20
                    }}>
                        {orders.map(order => {
                            const product = getProduct(order);
                            const image = product.image || '';
                            const name = product.name || 'Order Item';
                            const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '';
                            const status = order.orderStatus || 'pending';
                            const amount = Number(order.totalAmount).toLocaleString('en-IN');
                            const statusColors = {
                                placed: { bg: '#dbeafe', color: '#1e40af' },
                                confirmed: { bg: '#d1fae5', color: '#065f46' },
                                shipped: { bg: '#fef3c7', color: '#92400e' },
                                delivered: { bg: '#d1fae5', color: '#065f46' },
                                cancelled: { bg: '#fee2e2', color: '#991b1b' },
                                pending: { bg: '#f1f5f9', color: '#475569' },
                            };
                            const sColor = statusColors[status] || statusColors.pending;

                            return (
                                <article
                                    key={order._id}
                                    style={{
                                        borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
                                        overflow: 'hidden', display: 'flex', flexDirection: 'column',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        transition: 'box-shadow 0.2s, transform 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    onClick={() => product._id && navigate(`/product/${product._id}`)}
                                >
                                    {/* Product Image */}
                                    <div style={{
                                        width: '100%', height: 200, background: '#f8fafc',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span style={{ fontSize: 48, color: '#cbd5e1' }}>📦</span>
                                        )}
                                    </div>

                                    {/* Card Body */}
                                    <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{
                                            fontSize: 16, fontWeight: 600, marginBottom: 4,
                                            overflow: 'hidden', textOverflow: 'ellipsis',
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                                        }} title={name}>
                                            {name}
                                        </h3>
                                        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 2 }}>
                                            Order #{String(order._id).slice(-8).toUpperCase()}
                                        </p>
                                        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
                                            {orderDate}
                                        </p>
                                        {/* Delivery Address */}
                                        {order.address && typeof order.address === 'object' && (
                                            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4, lineHeight: 1.4 }}>
                                                📍 {[order.address.addressline, order.address.addressline2, order.address.city, order.address.state, order.address.pincode].filter(Boolean).join(', ')}
                                            </p>
                                        )}
                                        {/* Delivered date */}
                                        {order.orderStatus === 'delivered' && (
                                            <p style={{ fontSize: 12, color: '#065f46', fontWeight: 500, marginBottom: 4 }}>
                                                ✅ Delivered{order.deliveredAt ? ` on ${new Date(order.deliveredAt).toLocaleDateString('en-IN')}` : ''}
                                            </p>
                                        )}
                                        {/* Quantity */}
                                        {order.quantity > 1 && (
                                            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                                                Qty: {order.quantity}
                                            </p>
                                        )}
                                        {/* Payment method */}
                                        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                                            💳 {order.paymentMethod || 'N/A'} • {order.paymentStatus || 'pending'}
                                        </p>
                                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 18, fontWeight: 700, color: '#4f46e5' }}>₹{amount}</span>
                                            <span style={{
                                                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                                                borderRadius: 6, padding: '4px 10px',
                                                background: sColor.bg, color: sColor.color,
                                                letterSpacing: 0.5
                                            }}>
                                                {status}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
