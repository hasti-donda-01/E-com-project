// Supplier dashboard overview - revenue chart, order status table, KPIs, and sidebar navigation
import { useEffect, useState, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import meeshoLogo from './Images/meeshoLogo.svg';
import SupplierProducts from './SupplierProducts';
import ProfileMenu from './ProfileMenu';
import {
    FiHome,
    FiPlus,
    FiTrendingUp,
    FiFileText,
    FiTag,
    FiCreditCard,
    FiBarChart2,
    FiShoppingBag,
    FiPackage,
    FiTruck,
    FiRotateCcw,
    FiRefreshCw,
    FiMenu,
    FiX,
    FiExternalLink
} from 'react-icons/fi';

// Navigation sidebar sections and links
const sidebarSections = [
    {
        title: 'MEESHO DASHBOARD',
        items: [
            { name: 'Overview', path: '/SupplierDashboard', icon: <FiHome />, active: true },
            { name: 'Upload Data', path: '/supplier/add-product', icon: <FiPlus /> }
        ]
    },
    {
        title: 'ANALYTICS',
        items: [
            { name: 'Estimated P&L', path: '/PricingCommision', icon: <FiTrendingUp /> },
            { name: 'Advertisement Cost', path: '/Grow', icon: <FiFileText /> },
            { name: 'Sku Pricing', path: '/supplier/products', icon: <FiTag /> },
            { name: 'Pending Payments', path: '/PricingCommision', icon: <FiCreditCard /> },
            { name: 'SKU Performance', path: '/Grow', icon: <FiBarChart2 /> }
        ]
    },
    {
        title: 'OPERATIONS',
        items: [
            { name: 'Orders', path: '/supplier/orders', icon: <FiShoppingBag /> },
            { name: 'Sort Labels', path: '/supplier/orders', icon: <FiPackage /> }
        ]
    },
];

// Helper to compute summary stats from order list
function computeStats(orders) {
    const total = orders.length;
    const delivered = orders.filter(o => (o.orderStatus || '').toLowerCase() === 'delivered').length;
    const cancelled = orders.filter(o => (o.orderStatus || '').toLowerCase() === 'cancelled').length;
    const returned = orders.filter(o => (o.orderStatus || '').toLowerCase() === 'returned').length;
    const others = Math.max(0, total - delivered - cancelled - returned);

    const revenue = orders
        .filter(o => (o.orderStatus || '').toLowerCase() === 'delivered')
        .reduce((sum, o) => {
            const amt = Number(o.totalAmount) || Number(o.product?.price) || Number(o.product?.discountPrice) || 0;
            return sum + amt;
        }, 0);

    const deliveryRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : '0.0';
    const returnRate = total > 0 ? ((returned / total) * 100).toFixed(1) : '0.0';
    const rtoRate = total > 0 ? ((cancelled / total) * 100).toFixed(1) : '0.0';

    return { total, delivered, cancelled, returned, others, revenue, deliveryRate, returnRate, rtoRate };
}

// Build bar chart from order revenue grouped by date (last 10 days)
function buildBarData(orders) {
    const dayMap = {};
    [...orders]
        .filter((order) => (order.orderStatus || '').toLowerCase() === 'delivered')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .forEach(o => {
        const day = new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        const amt = Number(o.totalAmount) || Number(o.product?.price) || Number(o.product?.discountPrice) || 0;
        dayMap[day] = (dayMap[day] || 0) + amt;
    });
    const entries = Object.entries(dayMap).slice(-10);
    if (entries.length === 0) return [];
    const maxVal = Math.max(...entries.map(([, v]) => v), 1);
    return entries.map(([label, amount], i) => ({
        label,
        amount,
        height: Math.max(4, Math.round((amount / maxVal) * 96)),
        highlight: i === entries.length - 1
    }));
}

// Map a raw API order to the display shape used by the orders table
function mapOrder(o) {
    const statusRaw = (o.orderStatus || '').toLowerCase();
    let status = 'Pending';
    if (statusRaw === 'delivered') status = 'Delivered';
    else if (statusRaw === 'cancelled') status = 'RTO';
    else if (statusRaw === 'returned') status = 'Returned';
    else if (statusRaw === 'shipped') status = 'Shipped';
    else if (statusRaw === 'placed') status = 'Placed';
    else if (statusRaw === 'confirmed') status = 'Confirmed';

    const address = o.address;
    const city = address ? `${address.city || ''}, ${address.state || ''}`.replace(/^, |, $/, '') : '';

    return {
        id: `#${String(o._id).slice(-8).toUpperCase()}`,
        _id: o._id,
        product: o.product?.name || 'Unknown Product',
        sku: o.product?._id ? String(o.product._id).slice(-8).toUpperCase() : '—',
        date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: Number(o.totalAmount) || Number(o.product?.price) || Number(o.product?.discountPrice) || 0,
        status,
        customer: o.userId?.name || 'Customer',
        city,
    };
}

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

/* ---------- Left Sidebar Component ---------- */

function SidebarNav({ onNavigate, sellerSession }) {
    const isBlocked = sellerSession?.status === 'blocked' || sellerSession?.isActive === false;
    const isApproved = Boolean(sellerSession?.isApproved);
    const isRejected = Boolean(sellerSession?.isRejected);
    const isPending = sellerSession && !isApproved && !isRejected;

    return (
        <div className="flex h-full flex-col justify-between py-7 px-5 bg-white select-none">
            <div className="space-y-6">
                {sidebarSections.map((sec, idx) => (
                    <div key={sec.title} className={idx > 0 ? 'pt-5 border-t border-slate-100' : ''}>
                        <p className="px-3.5 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {sec.title}
                        </p>
                        <nav className="space-y-1">
                            {sec.items.map((item) => {
                                const isCurrent = item.name === 'Overview';
                                return (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        onClick={onNavigate}
                                        className={({ isActive }) => `flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                                                isActive || isCurrent
                                                ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold shadow-2xs'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                            <span className={`text-lg shrink-0 ${isCurrent ? 'text-[#4f46e5]' : 'text-slate-400'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="truncate">{item.name}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-slate-100 px-3 text-xs text-slate-400 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-500">Seller Status</span>
                    {isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                            Blocked
                        </span>
                    ) : isRejected ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                            Rejected
                        </span>
                    ) : isPending ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Pending Approval
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Approved
                        </span>
                    )}
                </div>
                {sellerSession?.storeName && (
                    <span className="text-[11px] font-semibold text-slate-600 truncate">
                        🏪 {sellerSession.storeName}
                    </span>
                )}
            </div>
        </div>
    );
}

// Main dashboard component
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://e-com-project-b3ci.onrender.com/api').replace(/\/$/, '');

export default function SupplierDashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderFilter, setOrderFilter] = useState('All');
    const [sellerSession, setSellerSession] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState('');
    useEffect(() => {
        const loadSession = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/seller/session`, {
                    credentials: 'include'
                });
                const payload = await res.json();
                if (res.ok && payload.success) {
                    setSellerSession(payload.data);
                }
            } catch {
                // Ignore network error on session check
            }
        };
        loadSession();
    }, []);

    // Fetch seller's real orders
    useEffect(() => {
        const controller = new AbortController();
        const loadOrders = async () => {
            setOrdersLoading(true);
            setOrdersError('');
            try {
                const res = await fetch(`${API_BASE_URL}/sellerp/getSellerOrder/me`, {
                    credentials: 'include',
                    signal: controller.signal
                });
                const payload = await res.json();
                if (res.ok && payload.success && Array.isArray(payload.data)) {
                    setOrders(payload.data);
                } else {
                    setOrdersError(payload.message || 'Could not load orders.');
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setOrdersError('Could not connect to server.');
                }
            } finally {
                if (!controller.signal.aborted) setOrdersLoading(false);
            }
        };
        loadOrders();
        return () => controller.abort();
    }, []);

    // Compute stats from live orders
    const stats = useMemo(() => computeStats(orders), [orders]);
    const barData = useMemo(() => buildBarData(orders), [orders]);
    const mappedOrders = useMemo(() => orders.map(mapOrder), [orders]);

    const filteredOrders = useMemo(() => {
        if (orderFilter === 'All') return mappedOrders;
        return mappedOrders.filter((o) => o.status === orderFilter);
    }, [orderFilter, mappedOrders]);

    const isBlocked = sellerSession?.status === 'blocked' || sellerSession?.isActive === false;
    const isApproved = Boolean(sellerSession?.isApproved);
    const isRejected = Boolean(sellerSession?.isRejected);
    const isPending = sellerSession && !isApproved && !isRejected;

    return (
        <div className="min-h-screen bg-[#f3f4f8] text-slate-900 font-sans antialiased flex flex-col lg:flex-row">
            {/* Mobile Header Bar */}
            <div className="lg:hidden flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 z-20">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-gray-700 hover:bg-gray-100"
                        aria-label="Open sidebar menu"
                    >
                        <FiMenu />
                    </button>
                    <img src={meeshoLogo} alt="Meesho" className="h-6 object-contain" />
                </div>
                <div className="flex items-center gap-2">
                    <ProfileMenu variant="dashboard" />
                </div>
            </div>

            {/* Mobile Drawer */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
                    drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                    onClick={() => setDrawerOpen(false)}
                />
                <aside
                    className={`fixed bottom-0 left-0 top-0 w-68 bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ${
                        drawerOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
                        <img src={meeshoLogo} alt="Meesho" className="h-6 object-contain" />
                        <button
                            onClick={() => setDrawerOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
                        >
                            <FiX className="text-lg" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <SidebarNav onNavigate={() => setDrawerOpen(false)} sellerSession={sellerSession} />
                    </div>
                </aside>
            </div>

            {/* Desktop Left Sidebar */}
            <aside className="hidden lg:block w-68 shrink-0 border-r border-slate-200/80 bg-white min-h-screen sticky top-0 h-screen overflow-y-auto shadow-2xs">
                <SidebarNav sellerSession={sellerSession} />
            </aside>

            {/* Main Content Area */}
           <main className="flex-1 min-w-0 space-y-7 overflow-y-auto p-4 sm:p-6 lg:px-[50px] lg:py-10">
                {/* Header Subtitle */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            {sellerSession?.storeName ? `${sellerSession.storeName} Dashboard` : 'Supplier Dashboard'}
                        </h1>
                        <p className="text-xs font-semibold text-slate-400">
                            Your Meesho analytics and store performance at a glance
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <Link
                            to="/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#9f2089]"
                        >
                            <span>Customer Store</span>
                            <FiExternalLink className="text-xs" />
                        </Link>
                        <div className="pl-3 border-l border-slate-200">
                            <ProfileMenu variant="dashboard" />
                        </div>
                    </div>
                </div>

                {ordersError && (
                    <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700" role="alert">
                        {ordersError}
                    </p>
                )}

                {/* ---------- Seller Account Approval / Block Status Banners ---------- */}
                {isPending && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-5 shadow-xs flex items-start gap-3.5">
                        <span className="text-2xl shrink-0 mt-0.5">⏳</span>
                        <div className="flex-1">
                            <h2 className="text-sm font-bold text-amber-900">
                                Seller Account Under Admin Review
                            </h2>
                            <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                                Welcome to Meesho Seller Hub! Your seller application is currently pending admin approval. You can review your dashboard, but adding products and fulfilling orders will be enabled once your account is approved.
                            </p>
                        </div>
                        <span className="shrink-0 bg-amber-200/70 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                            Pending Approval
                        </span>
                    </div>
                )}

                {isRejected && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/95 p-5 shadow-xs flex items-start gap-3.5">
                        <span className="text-2xl shrink-0 mt-0.5">✕</span>
                        <div className="flex-1">
                            <h2 className="text-sm font-bold text-rose-900">
                                Seller Application Rejected
                            </h2>
                            <p className="mt-1 text-xs text-rose-700 leading-relaxed">
                                Your seller registration could not be approved at this time.
                                {sellerSession?.rejectionReason && (
                                    <span className="block mt-1 font-semibold text-rose-800">
                                        Reason: {sellerSession.rejectionReason}
                                    </span>
                                )}
                            </p>
                            <p className="mt-2 text-xs text-rose-600">
                                Please review your store details and business credentials or contact Meesho administrator support.
                            </p>
                        </div>
                        <span className="shrink-0 bg-rose-200 text-rose-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                            Rejected
                        </span>
                    </div>
                )}

                {isBlocked && (
                    <div className="rounded-2xl border border-red-300 bg-red-50 p-5 shadow-xs flex items-start gap-3.5">
                        <span className="text-2xl shrink-0 mt-0.5">🚫</span>
                        <div className="flex-1">
                            <h2 className="text-sm font-bold text-red-900">
                                Seller Account Suspended
                            </h2>
                            <p className="mt-1 text-xs text-red-700 leading-relaxed">
                                This seller account has been blocked by the admin. Product catalog listings, payments, and fulfillment operations are currently suspended. Please contact support to resolve account suspension.
                            </p>
                        </div>
                        <span className="shrink-0 bg-red-200 text-red-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                            Blocked
                        </span>
                    </div>
                )}

                {isApproved && !isBlocked && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 shadow-2xs flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                                ✓
                            </span>
                            <span className="text-xs font-semibold text-emerald-900">
                                Verified & Approved Seller Account — Your store is live on Meesho marketplace!
                            </span>
                        </div>
                        <Link
                            to="/supplier/add-product"
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                        >
                            + Add New Product →
                        </Link>
                    </div>
                )}

                {/* ---------- 6 KPI Cards (2x3 Grid) ---------- */}
                {ordersLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-[22px] border border-slate-100 bg-white p-6 shadow-2xs animate-pulse">
                                <div className="h-4 w-28 bg-slate-100 rounded mb-4" />
                                <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
                                <div className="h-3 w-24 bg-slate-100 rounded" />
                            </div>
                        ))}
                    </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            id: 'orders', title: 'Total Orders',
                            value: stats.total.toLocaleString('en-IN'),
                            subtext: `${stats.delivered} delivered orders`,
                            icon: <FiShoppingBag className="text-xl text-blue-500" />, iconBg: 'bg-blue-50'
                        },
                        {
                            id: 'revenue', title: 'Revenue',
                            value: inr(stats.revenue),
                            subtext: 'From delivered orders',
                            icon: <span className="font-bold text-lg text-emerald-500">₹</span>, iconBg: 'bg-emerald-50'
                        },
                        {
                            id: 'delivery', title: 'Delivery Rate',
                            value: `${stats.deliveryRate}%`,
                            subtext: `${stats.delivered} orders delivered`,
                            icon: <FiTruck className="text-xl text-emerald-500" />, iconBg: 'bg-emerald-50'
                        },
                        {
                            id: 'returns', title: 'Return Rate',
                            value: `${stats.returnRate}%`,
                            subtext: `${stats.returned} customer returns`,
                            icon: <FiRotateCcw className="text-xl text-rose-500" />, iconBg: 'bg-rose-50'
                        },
                        {
                            id: 'rto', title: 'RTO Rate',
                            value: `${stats.rtoRate}%`,
                            subtext: `${stats.cancelled} RTO / Cancelled`,
                            icon: <FiRefreshCw className="text-xl text-orange-500" />, iconBg: 'bg-orange-50'
                        },
                        {
                            id: 'pending', title: 'Pending Orders',
                            value: stats.others.toLocaleString('en-IN'),
                            subtext: 'Placed / confirmed / shipped',
                            icon: <FiBarChart2 className="text-xl text-purple-600" />, iconBg: 'bg-purple-50'
                        }
                    ].map((kpi) => (
                        <div
                            key={kpi.id}
                            className="rounded-[22px] border border-slate-100 bg-white p-6 shadow-2xs hover:shadow-xs transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">
                                    {kpi.title}
                                </span>
                                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.iconBg}`}>
                                    {kpi.icon}
                                </div>
                            </div>

                            <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                                {kpi.value}
                            </h3>

                            <p className="mt-1.5 text-xs text-slate-400 font-medium">
                                {kpi.subtext}
                            </p>
                        </div>
                    ))}
                </div>
                )}

                {/* ---------- Bottom Two Analytics Cards ---------- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 1. Order Status Distribution (Donut Chart) */}
                    <div className="rounded-[22px] border border-slate-100 bg-white p-6 shadow-2xs flex flex-col justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Order Status Distribution
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Clear view of delivered, returned, RTO, and other order statuses
                            </p>

                            {/* Donut Chart Container */}
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-8">
                                <div className="relative flex items-center justify-center">
                                    <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50" cy="50" r="36"
                                            fill="transparent" stroke="#f1f5f9" strokeWidth="14"
                                        />
                                        {/* Delivered (Green) */}
                                        <circle
                                            cx="50" cy="50" r="36"
                                            fill="transparent" stroke="#10b981" strokeWidth="14"
                                            strokeDasharray={`${(stats.total > 0 ? (stats.delivered / stats.total) * 226 : 0).toFixed(1)} 226`}
                                            strokeDashoffset="0"
                                            strokeLinecap="round"
                                        />
                                        {/* RTO / Cancelled (Orange) */}
                                        <circle
                                            cx="50" cy="50" r="36"
                                            fill="transparent" stroke="#f97316" strokeWidth="14"
                                            strokeDasharray={`${(stats.total > 0 ? (stats.cancelled / stats.total) * 226 : 0).toFixed(1)} 226`}
                                            strokeDashoffset={`-${(stats.total > 0 ? (stats.delivered / stats.total) * 226 : 0).toFixed(1)}`}
                                            strokeLinecap="round"
                                        />
                                        {/* Returns (Rose) */}
                                        <circle
                                            cx="50" cy="50" r="36"
                                            fill="transparent" stroke="#f43f5e" strokeWidth="14"
                                            strokeDasharray={`${(stats.total > 0 ? (stats.returned / stats.total) * 226 : 0).toFixed(1)} 226`}
                                            strokeDashoffset={`-${(stats.total > 0 ? ((stats.delivered + stats.cancelled) / stats.total) * 226 : 0).toFixed(1)}`}
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    {/* Donut Center */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-slate-900">{stats.total.toLocaleString('en-IN')}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
                                    </div>
                                </div>

                                {/* Donut Legend */}
                                <div className="space-y-3 text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-3 w-3 rounded-full bg-[#10b981]"></span>
                                        <span className="text-slate-600 font-medium">Delivered:</span>
                                        <span className="text-slate-900 font-bold">{stats.delivered} ({stats.deliveryRate}%)</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-3 w-3 rounded-full bg-[#f97316]"></span>
                                        <span className="text-slate-600 font-medium">RTO / Cancelled:</span>
                                        <span className="text-slate-900 font-bold">{stats.cancelled} ({stats.rtoRate}%)</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-3 w-3 rounded-full bg-[#f43f5e]"></span>
                                        <span className="text-slate-600 font-medium">Returns:</span>
                                        <span className="text-slate-900 font-bold">{stats.returned} ({stats.returnRate}%)</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-3 w-3 rounded-full bg-slate-300"></span>
                                        <span className="text-slate-600 font-medium">Pending:</span>
                                        <span className="text-slate-900 font-bold">{stats.others} orders</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                            <span>High fulfillment rate on Meesho</span>
                            <Link to="/supplier/orders" className="text-[#4f46e5] font-bold hover:underline">
                                View Breakdown →
                            </Link>
                        </div>
                    </div>

                    {/* 2. Order Revenue Trend (Bar Chart) */}
                    <div className="rounded-[22px] border border-slate-100 bg-white p-6 shadow-2xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Order Revenue Trend
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Daily order revenue from your store
                                    </p>
                                </div>
                            </div>

                            {/* Chart Container */}
                            <div className="mt-8 flex items-end gap-3 h-48">
                                {/* Dedicated Y-Axis */}
                                {(() => {
                                    const maxAmt = barData.length > 0 ? Math.max(...barData.map(b => b.amount)) : 2400;
                                    const step = Math.ceil(maxAmt / 4 / 100) * 100 || 100;
                                    return (
                                        <div className="flex flex-col justify-between h-40 text-[10px] text-slate-400 text-right pr-2 shrink-0">
                                            <span>{inr(step * 4)}</span>
                                            <span>{inr(step * 3)}</span>
                                            <span>{inr(step * 2)}</span>
                                            <span>{inr(step)}</span>
                                            <span>₹0</span>
                                        </div>
                                    );
                                })()}

                                {/* Bars Area with Grid */}
                                <div className="relative flex-1 h-40 flex items-end justify-between gap-2 border-b border-slate-200/80">
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                        <div className="border-b border-dashed border-slate-100 w-full"></div>
                                        <div className="border-b border-dashed border-slate-100 w-full"></div>
                                        <div className="border-b border-dashed border-slate-100 w-full"></div>
                                        <div className="border-b border-dashed border-slate-100 w-full"></div>
                                        <div></div>
                                    </div>

                                    {barData.length === 0 ? (
                                        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                                            No order data yet
                                        </div>
                                    ) : (
                                    barData.map((bar, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative flex-1 flex flex-col items-center h-full justify-end z-10"
                                        >
                                            <div className="pointer-events-none absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap shadow-md">
                                                {bar.label}: {inr(bar.amount)}
                                            </div>

                                            <div
                                                style={{ height: `${bar.height}%` }}
                                                className={`w-full max-w-[20px] rounded-t-sm transition-all ${
                                                    bar.highlight
                                                        ? 'bg-[#1d4ed8] shadow-xs'
                                                        : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
                                                }`}
                                            ></div>
                                        </div>
                                    ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                            <span>Total Revenue: {inr(stats.revenue)}</span>
                            <Link to="/Grow" className="text-[#4f46e5] font-bold hover:underline">
                                Campaign Reports →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ---------- Product Management ---------- */}
                <SupplierProducts embedded />

                {/* ---------- Recent Orders Table Section ---------- */}
                <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-2xs overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Recent Delivered & Return Orders
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Real-time tracking of order fulfillment and delivery status
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {['All', 'Delivered', 'RTO', 'Returned'].map((tab) => {
                                const isActive = orderFilter === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setOrderFilter(tab)}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                            isActive
                                                ? 'bg-[#4f46e5] text-white shadow-2xs'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="overflow-x-auto mt-2">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100 font-semibold">
                                <tr>
                                    <th className="px-4 py-3.5 whitespace-nowrap">Order ID</th>
                                    <th className="px-4 py-3.5 whitespace-nowrap">Product & SKU</th>
                                    <th className="px-4 py-3.5 whitespace-nowrap">Date</th>
                                    <th className="px-4 py-3.5 whitespace-nowrap">Customer</th>
                                    <th className="px-4 py-3.5 whitespace-nowrap">Amount</th>
                                    <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                                    <th className="px-4 py-3.5 text-right whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3.5 font-bold text-[#4f46e5] whitespace-nowrap">
                                            {order.id}
                                        </td>
                                        <td className="px-4 py-3.5 max-w-[260px]">
                                            <p className="font-semibold text-slate-900 truncate">{order.product}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">{order.sku}</p>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap text-xs">
                                            {order.date}
                                        </td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <p className="font-medium text-slate-800 text-xs">{order.customer}</p>
                                            <p className="text-[10px] text-slate-400">{order.city}</p>
                                        </td>
                                        <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                                            {inr(order.amount)}
                                        </td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                                    order.status === 'Delivered'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : order.status === 'RTO'
                                                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <h3 className="text-sm font-bold text-gray-900">
                                    Order Summary: {selectedOrder.id}
                                </h3>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-700 text-lg"
                                >
                                    <FiX />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="p-3.5 rounded-xl bg-gray-50 space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-gray-400">Product</p>
                                    <p className="font-semibold text-gray-900">{selectedOrder.product}</p>
                                    <p className="text-gray-500">SKU: {selectedOrder.sku}</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-gray-50 space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-gray-400">Customer</p>
                                    <p className="font-semibold text-gray-900">{selectedOrder.customer}</p>
                                    <p className="text-gray-500">{selectedOrder.city}</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Amount:</span>
                                        <span className="font-bold text-gray-900">{inr(selectedOrder.amount)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-indigo-200/50 pt-1 text-gray-600">
                                        <span>Order status:</span>
                                        <span className="font-semibold text-gray-900">{selectedOrder.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="rounded-xl bg-[#4f46e5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338ca]"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
