import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://e-com-project-b3ci.onrender.com/api'
).replace(/\/$/, '');

const formatAmount = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const nextAction = (status = '') => {
  switch (status.toLowerCase()) {
    case 'placed': return { label: 'Confirm order', status: 'confirmed' };
    case 'confirmed': return { label: 'Mark shipped', status: 'shipped' };
    case 'shipped': return { label: 'Mark delivered', status: 'delivered' };
    default: return null;
  }
};

export default function SupplierOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const loadOrders = async () => {
      setLoading(true);
      setError('');
      setNeedsLogin(false);
      try {
        const response = await fetch(`${API_BASE_URL}/sellerp/getSellerOrder/me`, {
          credentials: 'include',
          signal: controller.signal
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

  const updateOrder = async (order, action) => {
    if (action.status === 'cancelled' && !window.confirm('Cancel this order?')) return;
    setActionId(order._id);
    setError('');
    setNotice('');
    try {
      const isDecision = action.status === 'confirmed' || action.status === 'cancelled';
      const endpoint = isDecision ? 'acceptRejectOrder' : 'processFulfillment';
      const response = await fetch(`${API_BASE_URL}/sellerp/${endpoint}/${order._id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action.status })
      });
      const payload = await response.json();
      if (!response.ok || payload.success !== true || !payload.data?._id) {
        throw new Error(payload.message || `Could not update order (${response.status}).`);
      }
      setOrders((current) => current.map((item) =>
        item._id === order._id ? payload.data : item
      ));
      setNotice(`Order ${String(order._id).slice(-8).toUpperCase()} marked ${action.status}.`);
    } catch (actionError) {
      setError(actionError.message || 'Could not update this order.');
    } finally {
      setActionId('');
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f4f8] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/SupplierDashboard" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              <FiArrowLeft aria-hidden="true" /> Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="mt-1 text-sm text-slate-500">Review and update your customer orders.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
              disabled={loading}
              onClick={() => {
                setRefreshing(true);
                setRefreshVersion((version) => version + 1);
              }}
            >
              <FiRefreshCw aria-hidden="true" /> {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
            <Link to="/supplier/add-product" className="inline-flex min-h-10 items-center rounded-lg bg-[#9f2089] px-4 text-sm font-semibold text-white hover:bg-[#861b73]">
              Products
            </Link>
          </div>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800" role="alert">
            <p>{error}</p>
            {needsLogin && <Link className="mt-2 inline-block font-semibold underline" to="/SupplierLogin">Sign in again</Link>}
          </div>
        )}
        {notice && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800" role="status">{notice}</p>}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {loading ? (
            <p className="p-8 text-sm text-slate-500" role="status">Loading orders…</p>
          ) : error ? (
            <p className="p-8 text-sm text-slate-500">Orders are unavailable until the server connection is restored.</p>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <h2 className="font-semibold">No orders yet</h2>
              <p className="mt-1 text-sm text-slate-500">New customer orders will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {orders.map((order) => {
                const action = nextAction(order.orderStatus);
                const status = String(order.orderStatus || 'pending');
                const address = order.address;
                return (
                  <article key={order._id} className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Order</p>
                        <p className="mt-1 font-semibold">#{String(order._id).slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-slate-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Date unavailable'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Product</p>
                        <p className="mt-1 font-semibold">{order.product?.name || 'Unavailable product'}</p>
                        <p className="text-xs text-slate-500">Qty {order.quantity || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Customer and delivery</p>
                        <p className="mt-1">{order.userId?.name || 'Customer'}</p>
                        <p className="text-xs text-slate-500">{[address?.city, address?.state].filter(Boolean).join(', ') || 'Address unavailable'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">Amount and status</p>
                        <p className="mt-1 font-semibold">{formatAmount(order.totalAmount)}</p>
                        <p className="text-xs capitalize text-slate-600">{status} · {order.paymentMethod || 'Payment unavailable'}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {action && (
                        <button
                          type="button"
                          className="min-h-10 rounded-lg bg-[#9f2089] px-3 text-sm font-semibold text-white hover:bg-[#861b73] disabled:opacity-60"
                          disabled={actionId === order._id}
                          onClick={() => updateOrder(order, action)}
                        >
                          {actionId === order._id ? 'Updating…' : action.label}
                        </button>
                      )}
                      {status.toLowerCase() === 'placed' && (
                        <button
                          type="button"
                          className="min-h-10 rounded-lg border border-rose-300 px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                          disabled={actionId === order._id}
                          onClick={() => updateOrder(order, { status: 'cancelled' })}
                        >Cancel</button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}