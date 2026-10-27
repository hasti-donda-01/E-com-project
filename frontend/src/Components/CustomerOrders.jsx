import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw } from 'react-icons/fi';
import { getCustomerAccessToken, clearCustomerAccessToken, isCustomerAuthFailure } from '../utils/customerSession';

const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

export default function CustomerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [needsLogin, setNeedsLogin] = useState(false);
    const [refreshVersion, setRefreshVersion] = useState(0);
    const navigate = useNavigate();
    // OrderCard component to display each order as a product-like card
    const OrderCard = ({ order }) => {
        const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '';
        const status = order.orderStatus || 'pending';
        const amount = Number(order.totalAmount).toLocaleString('en-IN');
        // Assuming order may have product details (image, name). Use fallback if not present.
        const product = order.product || {};
        const image = product.image || '';
        const name = product.name || 'Order Item';
        return (
            <article className="rounded-lg border bg-white p-4 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
                {image && (<img src={image} alt={name} className="w-full h-40 object-cover mb-3 rounded" loading="lazy" />)}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-2" title={name}>{name}</h3>
                    <p className="text-sm text-gray-500 mb-1">Order #{String(order._id).slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-400 mb-2">{orderDate}</p>
                </div>
                <div className="mt-auto flex justify-between items-center">
                    <span className="font-medium text-indigo-600">₹{amount}</span>
                    <span className="text-xs uppercase font-medium rounded px-2 py-1 bg-gray-100 text-gray-700">{status}</span>
                </div>
            </article>
        );
    };

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

    if (loading) {
        return <p className="p-8 text-sm text-slate-500" role="status">Loading orders…</p>;
    }

    if (error) {
        return (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800" role="alert">
                <p>{error}</p>
                {needsLogin && (
                    <button className="mt-2 text-sm underline" onClick={() => navigate('/customer-login')}>Sign in again</button>
                )}
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f3f4f8] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            <div className="mx-auto max-w-4xl">
                <header className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Orders</h1>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold hover:bg-slate-50"
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
                    <p className="text-center text-slate-500">You haven't placed any orders yet.</p>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map(order => (
                        <OrderCard key={order._id} order={order} />
                    ))}
                </div>
                )}
            </div>
        </main>
    );
}
