import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiUploadCloud, FiX, FiCheckCircle, FiAlertCircle, FiStar } from 'react-icons/fi';

/* ---------- Config ---------- */

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://e-com-project-b3ci.onrender.com/api').replace(/\/$/, '');
const API_URL = `${API_BASE_URL}/product/create`; // POST multipart/form-data
const CATEGORIES_URL = `${API_BASE_URL}/category/get`;
const MAX_IMAGE_MB = 5;

const initialForm = {
    name: '',
    brand: '',
    categoryId: '',
    price: '',
    discount: '',
    stock: '',
    rating: ''
};

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
        hasError
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-slate-200 focus:border-[#4f46e5] focus:ring-indigo-100'
    }`;

/* ---------- Small building blocks ---------- */

function Card({ title, hint, children }) {
    return (
        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
            <div className="mt-4">{children}</div>
        </section>
    );
}

function Field({ label, htmlFor, error, hint, children }) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1 block text-sm font-semibold text-slate-700">
                {label} <span className="text-rose-500">*</span>
            </label>
            {children}
            {error ? (
                <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">
                    {error}
                </p>
            ) : (
                hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
            )}
        </div>
    );
}

/* ---------- Page ---------- */

export default function AddProduct() {
    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState(null); // { file, url }
    const [categories, setCategories] = useState(null); // null = loading, [] = no available categories
    const [categoryError, setCategoryError] = useState('');
    const [categoryLoadAttempt, setCategoryLoadAttempt] = useState(0);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const fileRef = useRef(null);
    const imageRef = useRef(image);

    useEffect(() => {
        imageRef.current = image;
    }, [image]);

    // The categories endpoint is paginated, so gather all pages for the selector.
    useEffect(() => {
        const controller = new AbortController();
        const loadCategories = async () => {
            setCategories(null);
            setCategoryError('');
            try {
                const firstResponse = await fetch(`${CATEGORIES_URL}?page=1`, {
                    signal: controller.signal,
                    credentials: 'include'
                });
                if (!firstResponse.ok) {
                    const detail = await firstResponse.json().catch(() => ({}));
                    throw new Error(detail.message || `Could not load categories (${firstResponse.status}).`);
                }

                const firstPage = await firstResponse.json();
                if (firstPage.success === false || !Array.isArray(firstPage.data)) {
                    throw new Error(firstPage.message || 'The categories response was invalid.');
                }

                const allCategories = [...firstPage.data];
                const totalPages = Number(firstPage.totalPages) || 1;
                for (let page = 2; page <= totalPages; page += 1) {
                    const response = await fetch(`${CATEGORIES_URL}?page=${page}`, {
                        signal: controller.signal,
                        credentials: 'include'
                    });
                    if (!response.ok) {
                        const detail = await response.json().catch(() => ({}));
                        throw new Error(detail.message || `Could not load categories (${response.status}).`);
                    }
                    const payload = await response.json();
                    if (payload.success === false || !Array.isArray(payload.data)) {
                        throw new Error(payload.message || 'The categories response was invalid.');
                    }
                    allCategories.push(...payload.data);
                }

                setCategories(
                    allCategories
                        .filter((category) => category.isActive !== false)
                        .map((category) => ({
                            id: String(category._id ?? category.id),
                            name: category.category_name ?? category.name
                        }))
                        .filter((category) => category.id && category.name)
                );
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setCategories([]);
                    setCategoryError(err.message || 'Could not load categories.');
                }
            }
        };

        loadCategories();
        return () => controller.abort();
    }, [categoryLoadAttempt]);

    // Free the preview URL when leaving the page
    useEffect(() => () => imageRef.current && URL.revokeObjectURL(imageRef.current.url), []);

    const setField = (key) => (e) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        setErrors((er) => ({ ...er, [key]: undefined }));
    };

    /* ----- Image ----- */
    const pickImage = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setErrors((er) => ({ ...er, image: 'Choose an image file (JPG, PNG or WebP).' }));
            return;
        }
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
            setErrors((er) => ({ ...er, image: `Image must be smaller than ${MAX_IMAGE_MB} MB.` }));
            return;
        }
        if (image) URL.revokeObjectURL(image.url);
        setImage({ file, url: URL.createObjectURL(file) });
        setErrors((er) => ({ ...er, image: undefined }));
    };

    const removeImage = () => {
        if (image) URL.revokeObjectURL(image.url);
        setImage(null);
    };

    /* ----- Live price summary ----- */
    const summary = useMemo(() => {
        const price = parseFloat(form.price) || 0;
        const discount = Math.min(Math.max(parseFloat(form.discount) || 0, 0), 100);
        const final = price - (price * discount) / 100;
        return { price, discount, final, rating: parseFloat(form.rating) || 0 };
    }, [form.price, form.discount, form.rating]);

    /* ----- Validation & submit ----- */
    const validate = () => {
        const e = {};
        const price = parseFloat(form.price);
        const discount = parseFloat(form.discount);
        const rating = parseFloat(form.rating);

        if (!form.name.trim()) e.name = 'Enter the product name.';
        if (!form.brand.trim()) e.brand = 'Enter the brand.';
        if (!form.categoryId.trim()) e.categoryId = 'Choose a category.';
        if (!(price > 0)) e.price = 'Enter a price greater than 0.';
        if (form.discount === '' || Number.isNaN(discount) || discount < 0 || discount > 100)
            e.discount = 'Enter a discount between 0 and 100.';
        if (form.stock === '' || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
            e.stock = 'Enter stock as a whole number (0 or more).';
        if (form.rating === '' || Number.isNaN(rating) || rating < 0 || rating > 5)
            e.rating = 'Enter a rating between 0 and 5.';
        if (!image) e.image = 'Add a product image.';
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setResult(null);

        const found = validate();
        setErrors(found);
        if (Object.keys(found).length) {
            setTimeout(() => {
                document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 0);
            return;
        }

        const body = new FormData();
        body.append('name', form.name.trim());
        body.append('price', form.price);
        body.append('brand', form.brand.trim());
        body.append('stock', form.stock);
        body.append('discount', form.discount);
        body.append('rating', form.rating);
        body.append('categoryId', form.categoryId.trim());
        body.append('image', image.file);

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_URL, {
                method: 'POST',
                body,
                credentials: 'include',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            let response;
            try {
                response = await res.json();
            } catch {
                throw new Error(`The server returned an invalid response (${res.status}).`);
            }
            if (!res.ok) {
                throw new Error(response.message || `Request failed (${res.status})`);
            }
            if (!response.success) {
                throw new Error(response.message || 'The server did not confirm that the product was saved.');
            }
            setResult({ type: 'success', text: response.message || 'Product added successfully.' });
            removeImage();
            setForm(initialForm);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setResult({ type: 'error', text: `Couldn’t save the product. ${err.message}` });
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------- Render ---------- */

    return (
        <div className="min-h-screen bg-[#f3f4f8] text-slate-900 antialiased">
            <div className="mx-auto max-w-4xl space-y-5 px-4 py-5 sm:px-6 lg:py-8">
                <div>
                    <Link
                        to="/SupplierDashboard"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#9f2089]"
                    >
                        <FiArrowLeft /> Back to dashboard
                    </Link>
                    <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Add product</h1>
                    <p className="mt-1 text-sm text-slate-500">All fields are required.</p>
                </div>

                {result && (
                    <div
                        role="status"
                        className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
                            result.type === 'success'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                : 'border-rose-200 bg-rose-50 text-rose-800'
                        }`}
                    >
                        {result.type === 'success' ? (
                            <FiCheckCircle className="mt-0.5 shrink-0 text-lg" />
                        ) : (
                            <FiAlertCircle className="mt-0.5 shrink-0 text-lg" />
                        )}
                        <span>{result.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                    <div className="space-y-4">
                        <Card title="Product details">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Field label="Name" htmlFor="name" error={errors.name}>
                                        <input
                                            id="name"
                                            value={form.name}
                                            onChange={setField('name')}
                                            placeholder="e.g. Women Cotton Floral Printed Kurti"
                                            className={inputClass(errors.name)}
                                        />
                                    </Field>
                                </div>

                                <Field label="Brand" htmlFor="brand" error={errors.brand}>
                                    <input
                                        id="brand"
                                        value={form.brand}
                                        onChange={setField('brand')}
                                        placeholder="e.g. Meera Ethnic"
                                        className={inputClass(errors.brand)}
                                    />
                                </Field>

                                <Field
                                    label="Category"
                                    htmlFor="categoryId"
                                    error={errors.categoryId}
                                    hint={categoryError || (categories?.length === 0 ? 'No categories are available yet.' : undefined)}
                                >
                                    <select
                                        id="categoryId"
                                        value={form.categoryId}
                                        onChange={setField('categoryId')}
                                        disabled={categories === null || Boolean(categoryError) || categories.length === 0}
                                        className={inputClass(errors.categoryId)}
                                    >
                                        <option value="">
                                            {categories === null
                                                ? 'Loading categories…'
                                                : categoryError
                                                    ? 'Categories could not be loaded'
                                                    : categories.length === 0
                                                        ? 'No categories available'
                                                        : 'Select a category'}
                                        </option>
                                        {(categories || []).map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {categoryError && (
                                        <button
                                            type="button"
                                            onClick={() => setCategoryLoadAttempt((attempt) => attempt + 1)}
                                            className="mt-1 text-xs font-semibold text-[#9f2089] hover:underline"
                                        >
                                            Retry loading categories
                                        </button>
                                    )}
                                </Field>
                            </div>
                        </Card>

                        <Card title="Pricing & stock">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Field label="Price (₹)" htmlFor="price" error={errors.price}>
                                    <input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={setField('price')}
                                        placeholder="999"
                                        className={inputClass(errors.price)}
                                    />
                                </Field>

                                <Field label="Discount (%)" htmlFor="discount" error={errors.discount} hint="Use 0 for no discount.">
                                    <input
                                        id="discount"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={form.discount}
                                        onChange={setField('discount')}
                                        placeholder="10"
                                        className={inputClass(errors.discount)}
                                    />
                                </Field>

                                <Field label="Stock (units)" htmlFor="stock" error={errors.stock}>
                                    <input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={form.stock}
                                        onChange={setField('stock')}
                                        placeholder="50"
                                        className={inputClass(errors.stock)}
                                    />
                                </Field>

                                <Field label="Rating (0–5)" htmlFor="rating" error={errors.rating}>
                                    <input
                                        id="rating"
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={form.rating}
                                        onChange={setField('rating')}
                                        placeholder="4.2"
                                        className={inputClass(errors.rating)}
                                    />
                                </Field>
                            </div>
                        </Card>

                        <Card title="Image" hint={`One image, up to ${MAX_IMAGE_MB} MB.`}>
                            {image ? (
                                <div className="relative w-44 overflow-hidden rounded-2xl border border-slate-200">
                                    <img src={image.url} alt="Product preview" className="aspect-square w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        aria-label="Remove image"
                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        pickImage(e.dataTransfer.files[0]);
                                    }}
                                    className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
                                        errors.image
                                            ? 'border-rose-300 bg-rose-50/40'
                                            : 'border-slate-200 hover:border-[#4f46e5] hover:bg-indigo-50/40'
                                    }`}
                                >
                                    <FiUploadCloud className="text-3xl text-[#4f46e5]" />
                                    <span className="text-sm font-semibold text-slate-700">Click to upload or drag an image here</span>
                                    <span className="text-xs text-slate-400">JPG, PNG or WebP</span>
                                </button>
                            )}
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    pickImage(e.target.files[0]);
                                    e.target.value = '';
                                }}
                            />
                            {errors.image && (
                                <p className="mt-2 text-xs font-medium text-rose-600" role="alert">
                                    {errors.image}
                                </p>
                            )}
                        </Card>
                    </div>

                    {/* Preview + submit */}
                    <aside className="lg:sticky lg:top-6 lg:self-start">
                        <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xs">
                            <h3 className="text-base font-bold">Listing preview</h3>

                            <div className="overflow-hidden rounded-2xl border border-slate-100">
                                {image ? (
                                    <img src={image.url} alt="" className="aspect-square w-full object-cover" />
                                ) : (
                                    <div className="flex aspect-square w-full items-center justify-center bg-slate-50 text-xs text-slate-400">
                                        Image appears here
                                    </div>
                                )}
                                <div className="space-y-1 p-3.5">
                                    <p className="text-[11px] font-semibold text-slate-400">{form.brand || 'Brand'}</p>
                                    <p className="line-clamp-2 text-sm font-semibold">{form.name || 'Product name'}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-extrabold">{inr(summary.final)}</span>
                                        {summary.discount > 0 && (
                                            <>
                                                <span className="text-xs text-slate-400 line-through">{inr(summary.price)}</span>
                                                <span className="text-xs font-bold text-emerald-600">{summary.discount}% off</span>
                                            </>
                                        )}
                                    </div>
                                    {summary.rating > 0 && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                                            {summary.rating.toFixed(1)} <FiStar className="text-[10px]" />
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-xl bg-[#9f2089] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#831b71] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? 'Saving…' : 'Add product'}
                            </button>
                            <Link
                                to="/supplier/products"
                                className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </Link>
                        </div>
                    </aside>
                </form>
            </div>
        </div>
    );
}