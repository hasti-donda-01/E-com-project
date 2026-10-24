import React, { useEffect, useState, useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import meeshoLogo from './Images/meeshoLogo.svg';
import SupplierProducts from './SupplierProducts';
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
    FiSettings,
    FiTruck,
    FiRotateCcw,
    FiRefreshCw,
    FiMenu,
    FiX,
    FiDollarSign,
    FiExternalLink
} from 'react-icons/fi';

/* ---------- Config & Static Data ---------- */

const kpiMetrics = [
    {
        id: 'orders',
        title: 'Total Orders',
        value: '3,790',
        subtext: '3,691 unit quantity',
        icon: <FiShoppingBag className="text-xl text-blue-500" />,
        iconBg: 'bg-blue-50'
    },
    {
        id: 'revenue',
        title: 'Revenue',
        value: '₹1,96,339',
        subtext: 'From delivered orders',
        icon: <span className="font-bold text-lg text-emerald-500">₹</span>,
        iconBg: 'bg-emerald-50'
    },
    {
        id: 'delivery',
        title: 'Delivery Rate',
        value: '88.3%',
        subtext: '3,346 orders delivered',
        icon: <FiTruck className="text-xl text-emerald-500" />,
        iconBg: 'bg-emerald-50'
    },
    {
        id: 'returns',
        title: 'Return Rate',
        value: '2.2%',
        subtext: '84 customer returns',
        icon: <FiRotateCcw className="text-xl text-rose-500" />,
        iconBg: 'bg-rose-50'
    },
    {
        id: 'rto',
        title: 'RTO Rate',
        value: '9.2%',
        subtext: '347 RTO',
        icon: <FiRefreshCw className="text-xl text-orange-500" />,
        iconBg: 'bg-orange-50'
    },
    {
        id: 'ads',
        title: 'Ads Cost',
        value: '₹22,030',
        subtext: 'Advertisement spend',
        icon: <FiBarChart2 className="text-xl text-purple-600" />,
        iconBg: 'bg-purple-50'
    }
];

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
    {
        title: 'SETTINGS',
        items: [
            { name: 'Settings', path: '/supplier/support', icon: <FiSettings /> }
        ]
    }
];

const adsTrendBars = [
    { amount: 800, height: 35 },
    { amount: 1400, height: 60 },
    { amount: 900, height: 40 },
    { amount: 2300, height: 96, highlight: true },
    { amount: 1650, height: 70 },
    { amount: 1200, height: 50 },
    { amount: 1900, height: 80 },
    { amount: 1350, height: 58 },
    { amount: 2200, height: 92 },
    { amount: 1700, height: 72 }
];

const sampleOrders = [
    {
        id: '#ORD-1001',
        product: 'Women Pure Cotton Floral Printed Anarkali Kurti',
        sku: 'MS-KURTI-01',
        date: '24 Oct 2026',
        amount: 499,
        status: 'Delivered',
        customer: 'Pooja Sharma',
        city: 'Jaipur, RJ'
    },
    {
        id: '#ORD-1002',
        product: 'Banarasi Soft Silk Zari Border Saree with Blouse',
        sku: 'MS-SAREE-44',
        date: '24 Oct 2026',
        amount: 899,
        status: 'Delivered',
        customer: 'Ananya Verma',
        city: 'Lucknow, UP'
    },
    {
        id: '#ORD-1003',
        product: 'Men Regular Fit Casual Denim Indigo Shirt',
        sku: 'MS-MENS-12',
        date: '23 Oct 2026',
        amount: 549,
        status: 'RTO',
        customer: 'Rahul Mehta',
        city: 'Surat, GJ'
    },
    {
        id: '#ORD-1004',
        product: 'Women Quilted Structured Crossbody Handbag',
        sku: 'MS-BAG-08',
        date: '23 Oct 2026',
        amount: 699,
        status: 'Delivered',
        customer: 'Divya Patel',
        city: 'Ahmedabad, GJ'
    },
    {
        id: '#ORD-1005',
        product: 'Ethnic Oxidised Silver Traditional Jhumka Earrings',
        sku: 'MS-JEWEL-19',
        date: '22 Oct 2026',
        amount: 199,
        status: 'Returned',
        customer: 'Sneha Reddy',
        city: 'Hyderabad, TS'
    }
];

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

/* ---------- Left Sidebar Component ---------- */

function SidebarNav({ onNavigate }) {
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
                                        className={`flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                                            isCurrent
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

            <div className="pt-6 border-t border-slate-100 px-3 text-xs text-slate-400 flex items-center justify-between">
                <span className="font-medium text-slate-500">Meesho Seller Hub</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Active
                </span>
            </div>
        </div>
    );
}

/* ---------- Main Component ---------- */

export default function SupplierDashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderFilter, setOrderFilter] = useState('All');
    const location = useLocation();

    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    const filteredOrders = useMemo(() => {
        if (orderFilter === 'All') return sampleOrders;
        return sampleOrders.filter((o) => o.status === orderFilter);
    }, [orderFilter]);

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
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9f2089] text-xs font-bold text-white">
                        MS
                    </div>
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
                        <SidebarNav onNavigate={() => setDrawerOpen(false)} />
                    </div>
                </aside>
            </div>

            {/* Desktop Left Sidebar: Matching User Screenshot */}
            <aside className="hidden lg:block w-68 shrink-0 border-r border-slate-200/80 bg-white min-h-screen sticky top-0 h-screen overflow-y-auto shadow-2xs">
                <SidebarNav />
            </aside>

            {/* Main Content Area */}
           <main className="flex-1 min-w-0 space-y-7 overflow-y-auto p-4 sm:p-6 lg:px-[50px] lg:py-10">
                {/* Header Subtitle */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400">
                            Your Meesho analytics at a glance
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
                        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9f2089] text-xs font-bold text-white shadow-2xs">
                                MS
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-slate-900 leading-tight">Meera Ethnic Hub</p>
                                <p className="text-[10px] text-slate-400">GST: 24AAACG1234F1Z8</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------- 6 KPI Cards (2x3 Grid) ---------- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kpiMetrics.map((kpi) => (
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
                                            cx="50"
                                            cy="50"
                                            r="36"
                                            fill="transparent"
                                            stroke="#f1f5f9"
                                            strokeWidth="14"
                                        />
                                        {/* Delivered: 88.3% (Green) */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="36"
                                            fill="transparent"
                                            stroke="#10b981"
                                            strokeWidth="14"
                                            strokeDasharray="200 226"
                                            strokeDashoffset="0"
                                            strokeLinecap="round"
                                        />
                                        {/* RTO: 9.2% (Orange) */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="36"
                                            fill="transparent"
                                            stroke="#f97316"
                                            strokeWidth="14"
                                            strokeDasharray="21 226"
                                            strokeDashoffset="-202"
                                            strokeLinecap="round"
                                        />
                                        {/* Returns: 2.2% (Rose) */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="36"
                                            fill="transparent"
                                            stroke="#f43f5e"
                                            strokeWidth="14"
                                            strokeDasharray="5 226"
                                            strokeDashoffset="-223"
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    {/* Donut Center */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-slate-900">3,790</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
                                    </div>
                                </div>

                                {/* Donut Legend */}
                                <div className="space-y-3 text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-3 w-3 rounded-full bg-[#10b981]"></span>
                                        <span className="text-slate-600 font-medium">Delivered:</span>
                                        <span className="text-slate-900 font-bold">3,346 (88.3%)</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-3 w-3 rounded-full bg-[#f97316]"></span>
                                        <span className="text-slate-600 font-medium">RTO:</span>
                                        <span className="text-slate-900 font-bold">347 (9.2%)</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-3 w-3 rounded-full bg-[#f43f5e]"></span>
                                        <span className="text-slate-600 font-medium">Returns:</span>
                                        <span className="text-slate-900 font-bold">84 (2.2%)</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-3 w-3 rounded-full bg-slate-300"></span>
                                        <span className="text-slate-600 font-medium">Others:</span>
                                        <span className="text-slate-900 font-bold">13 (0.3%)</span>
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

                    {/* 2. Advertisement Cost Trend (Bar Chart) */}
                    <div className="rounded-[22px] border border-slate-100 bg-white p-6 shadow-2xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Advertisement Cost Trend
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Daily ads spending over time
                                    </p>
                                </div>
                            </div>

                            {/* Chart Container */}
                            <div className="mt-8 flex items-end gap-3 h-48">
                                {/* Dedicated Y-Axis */}
                                <div className="flex flex-col justify-between h-40 text-[10px] text-slate-400 text-right pr-2 shrink-0">
                                    <span>₹2400</span>
                                    <span>₹1800</span>
                                    <span>₹1200</span>
                                    <span>₹600</span>
                                    <span>₹0</span>
                                </div>

                                {/* Bars Area with Grid */}
                                <div className="relative flex-1 h-40 flex items-end justify-between gap-2 border-b border-slate-200/80">
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                        <div className="border-b border-dashed border-slate-100 w-full"></div>
                                        <div className="border-b border-dashed border-slate-100 w-full"></div>
                                        <div className="border-b border-dashed border-slate-100 w-full"></div>
                                        <div className="border-b border-dashed border-slate-100 w-full"></div>
                                        <div></div>
                                    </div>

                                    {adsTrendBars.map((bar, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative flex-1 flex flex-col items-center h-full justify-end z-10"
                                        >
                                            <div className="pointer-events-none absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap shadow-md">
                                                {inr(bar.amount)}
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
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                            <span>Total Spend: ₹22,030</span>
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
                                    <div className="flex justify-between text-emerald-600 font-semibold">
                                        <span>0% Commission:</span>
                                        <span>₹0.00</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-indigo-200/50 font-bold text-gray-900">
                                        <span>Payout to Bank:</span>
                                        <span className="text-[#4f46e5]">{inr(selectedOrder.amount)}</span>
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
