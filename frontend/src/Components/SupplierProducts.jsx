import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiEye, FiPackage, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://e-com-project-b3ci.onrender.com/api').replace(/\/$/, '');

const getErrorMessage = async (response) => {
    try {
        const payload = await response.json();
        return payload.message || `Request failed (${response.status})`;
    } catch {
        return `Request failed (${response.status})`;
    }
};

const inr = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function SupplierProducts({ embedded = false }) {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [viewingProduct, setViewingProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState('');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/sellerp/getmyproducts?page=${page}`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error(await getErrorMessage(response));

            const payload = await response.json();
            if (payload.success === false) throw new Error(payload.message || 'Could not load products.');
            const pageData = Array.isArray(payload.data) ? payload.data : [];
            setProducts(Array.isArray(pageData[0]) ? pageData[0] : []);
            const totalPagesText = String(pageData[1] || '');
            setTotalPages(Math.max(1, Number(totalPagesText.match(/\d+/)?.[0] || 1)));
        } catch (err) {
            setError(err.message || 'Could not load products.');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const deleteProduct = async (product) => {
        if (!window.confirm(`Delete "${product.name}"? This action cannot be undone.`)) return;
        setNotice('');
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/product/delete/${product._id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const payload = await response.json();
            if (!response.ok || !payload.success) {
                throw new Error(payload.message || `Request failed (${response.status})`);
            }
            setNotice(payload.warning || 'Product deleted successfully.');
            if (products.length === 1 && page > 1) setPage((currentPage) => currentPage - 1);
            else await fetchProducts();
        } catch (err) {
            setError(err.message || 'Could not delete the product.');
        }
    };

    const saveProduct = async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const productDetails = {
            name: String(form.get('name') || '').trim(),
            brand: String(form.get('brand') || '').trim(),
            price: Number(form.get('price')),
            stock: Number(form.get('stock'))
        };
        if (!productDetails.name || !productDetails.brand || !(productDetails.price > 0) ||
            !Number.isInteger(productDetails.stock) || productDetails.stock < 0) {
            setEditError('Enter a name, brand, positive price, and whole-number stock of 0 or more.');
            return;
        }

        setSaving(true);
        setEditError('');
        setNotice('');
        try {
            const response = await fetch(`${API_BASE_URL}/product/update/${editingProduct._id}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productDetails)
            });
            const payload = await response.json();
            if (!response.ok || !payload.success) {
                throw new Error(payload.message || `Request failed (${response.status})`);
            }
            setEditingProduct(null);
            setNotice(payload.warning || 'Product updated successfully.');
            await fetchProducts();
        } catch (err) {
            setEditError(err.message || 'Could not update the product.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={embedded ? 'space-y-4' : 'min-h-screen bg-[#f3f4f8] px-4 py-6 text-slate-900 sm:px-6 lg:px-10'}>
            <div className={embedded ? 'space-y-4' : 'mx-auto max-w-6xl space-y-5'}>
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        {!embedded && (
                            <Link
                                to="/SupplierDashboard"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#9f2089]"
                            >
                                <FiArrowLeft /> Back to dashboard
                            </Link>
                        )}
                        <h1 className={`${embedded ? 'text-base' : 'mt-2 text-2xl'} font-extrabold tracking-tight`}>My products</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage the products in your store.</p>
                    </div>
                    <Link
                        to="/supplier/add-product"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9f2089] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#831b71]"
                    >
                        <FiPlus /> Add product
                    </Link>
                </header>

                {notice && (
                    <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {notice}
                    </p>
                )}
                {error && (
                    <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        {error}
                    </p>
                )}

                <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    {loading ? (
                        <p className="p-8 text-center text-sm text-slate-500">Loading products…</p>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                            <FiPackage className="text-3xl text-slate-300" />
                            <p className="font-semibold text-slate-700">No products found</p>
                            <p className="text-sm text-slate-500">Add a product to start managing your listings.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] text-left text-sm">
                                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-5 py-3">Product</th>
                                            <th className="px-5 py-3">Brand</th>
                                            <th className="px-5 py-3">Price</th>
                                            <th className="px-5 py-3">Stock</th>
                                            <th className="px-5 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {products.map((product) => (
                                            <tr key={product._id}>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {product.image ? (
                                                            <img src={product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                                                        ) : (
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                                                                <FiPackage className="text-slate-400" />
                                                            </div>
                                                        )}
                                                        <span className="max-w-xs font-semibold text-slate-800">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-slate-600">{product.brand}</td>
                                                <td className="px-5 py-4 font-semibold">{inr(product.price)}</td>
                                                <td className="px-5 py-4 text-slate-600">{product.stock}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setViewingProduct(product)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            <FiEye /> View
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setError('');
                                                                setEditError('');
                                                                setEditingProduct(product);
                                                            }}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                                                        >
                                                            <FiEdit2 /> Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteProduct(product)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                                                        >
                                                            <FiTrash2 /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => setPage((currentPage) => currentPage - 1)}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
                                <button
                                    type="button"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((currentPage) => currentPage + 1)}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </div>

            {viewingProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setViewingProduct(null);
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="view-product-title"
                        className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >
                        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#9f2089]">Product details</p>
                                <h2 id="view-product-title" className="mt-1 text-xl font-bold text-slate-900">
                                    {viewingProduct.name || 'Product'}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewingProduct(null)}
                                aria-label="Close product details"
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <FiX className="text-lg" />
                            </button>
                        </div>
                        <div className="space-y-4 px-5 py-5 sm:px-7">
                            {viewingProduct.image && (
                                <img src={viewingProduct.image} alt={viewingProduct.name || 'Product'} className="mx-auto h-48 w-full rounded-xl bg-slate-50 object-contain" />
                            )}
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                <dt className="text-slate-500">Brand</dt>
                                <dd className="text-right font-medium text-slate-800">{viewingProduct.brand || '—'}</dd>
                                <dt className="text-slate-500">Price</dt>
                                <dd className="text-right font-medium text-slate-800">{inr(viewingProduct.price)}</dd>
                                <dt className="text-slate-500">Available stock</dt>
                                <dd className="text-right font-medium text-slate-800">{viewingProduct.stock ?? '—'}</dd>
                                <dt className="text-slate-500">Rating</dt>
                                <dd className="text-right font-medium text-slate-800">{viewingProduct.rating ?? '—'}</dd>
                                <dt className="text-slate-500">Category</dt>
                                <dd className="text-right font-medium text-slate-800">
                                    {viewingProduct.category_name || viewingProduct.categoryId?.category_name || '—'}
                                </dd>
                            </dl>
                        </div>
                        <div className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7">
                            <button
                                type="button"
                                onClick={() => setViewingProduct(null)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-product-title"
                        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >
                        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#9f2089]">Product management</p>
                                <h2 id="edit-product-title" className="mt-1 text-xl font-bold text-slate-900">Edit product</h2>
                                <p className="mt-1 text-sm text-slate-500">Update the listing details below.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                aria-label="Close edit form"
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <FiX className="text-lg" />
                            </button>
                        </div>
                        <form onSubmit={saveProduct}>
                            <div className="max-h-[calc(100vh-13rem)] space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                                    {editingProduct.image ? (
                                        <img src={editingProduct.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white text-slate-400">
                                            <FiPackage />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-500">Currently editing</p>
                                        <p className="truncate text-sm font-semibold text-slate-800">{editingProduct.name}</p>
                                    </div>
                                </div>

                                <section>
                                    <h3 className="text-sm font-bold text-slate-800">Product details</h3>
                                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                                            Product name
                                            <input
                                                name="name"
                                                required
                                                maxLength="120"
                                                defaultValue={editingProduct.name}
                                                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#9f2089] focus:ring-2 focus:ring-[#9f2089]/10"
                                            />
                                        </label>
                                        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                                            Brand
                                            <input
                                                name="brand"
                                                required
                                                maxLength="80"
                                                defaultValue={editingProduct.brand}
                                                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#9f2089] focus:ring-2 focus:ring-[#9f2089]/10"
                                            />
                                        </label>
                                    </div>
                                </section>

                                <section className="border-t border-slate-100 pt-5">
                                    <h3 className="text-sm font-bold text-slate-800">Pricing & inventory</h3>
                                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            Price
                                            <div className="relative mt-1.5">
                                                <span className="absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">₹</span>
                                                <input
                                                    name="price"
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    required
                                                    defaultValue={editingProduct.price}
                                                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-3.5 text-sm outline-none transition focus:border-[#9f2089] focus:ring-2 focus:ring-[#9f2089]/10"
                                                />
                                            </div>
                                        </label>
                                        <label className="block text-sm font-medium text-slate-700">
                                            Available stock
                                            <input
                                                name="stock"
                                                type="number"
                                                min="0"
                                                step="1"
                                                required
                                                defaultValue={editingProduct.stock}
                                                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#9f2089] focus:ring-2 focus:ring-[#9f2089]/10"
                                            />
                                        </label>
                                    </div>
                                </section>

                                {editError && (
                                    <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                                        {editError}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-[#9f2089] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#831b71] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? 'Saving changes…' : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}
