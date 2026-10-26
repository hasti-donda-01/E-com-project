import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import VerifyOtp from './Components/VerifyOtp';
import ShoppingCart from './Components/ShoppingCart';
import SupplierOrders from './Components/SupplierOrders';
import AdminPanel from './Components/AdminPanel';
import { customerslice } from './redux/slice/customerslice';
import { clearCustomerAccessToken, getCustomerAccessToken, storeCustomerAccessToken } from './utils/customerSession';

vi.mock('axios', () => ({ default: { post: vi.fn() } }));

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body
});

const createStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear()
  };
};

const customerToken = 'customer-test-token';
const cartItem = {
  _id: 'cart-item-1',
  quantity: 1,
  product: { _id: 'product-1', name: 'Cotton Kurti', price: 500, stock: 3, image: '/product.jpg' }
};
const address = {
  _id: 'address-1',
  type: 'Home',
  addressline: '12 Market Road',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411001',
  country: 'India',
  isDefault: true
};

const renderOtp = () => {
  const store = configureStore({ reducer: { customer: customerslice.reducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{
        pathname: '/verify-otp',
        state: { phoneNumber: '9876543210', returnTo: '/cart' }
      }]}>
        <Routes>
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/cart" element={<p>Cart destination</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

const renderCart = () => render(
  <MemoryRouter initialEntries={['/cart']}>
    <Routes><Route path="/cart" element={<ShoppingCart />} /></Routes>
  </MemoryRouter>
);

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: createStorage() });
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: createStorage() });
  vi.restoreAllMocks();
  axios.post.mockReset();
});

afterEach(() => {
  cleanup();
});

describe('customer critical flows', () => {
  it('persists customer tokens and accepts legacy session tokens', () => {
    storeCustomerAccessToken(customerToken);
    expect(getCustomerAccessToken()).toBe(customerToken);
    expect(localStorage.getItem('customerAccessToken')).toBe(customerToken);

    clearCustomerAccessToken();
    sessionStorage.setItem('customerAccessToken', 'legacy-token');
    expect(getCustomerAccessToken()).toBe('legacy-token');
  });

  it('opens OTP verification without requesting a second OTP', async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValue({ data: { success: true, token: customerToken } });
    renderOtp();

    expect(screen.getByText('Enter OTP sent to 9876543210')).toBeTruthy();
    expect(axios.post).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Verify' }));
    expect(screen.getByRole('alert').textContent).toContain('6-digit OTP');
    expect(axios.post).not.toHaveBeenCalled();

    const otpInputs = screen.getAllByRole('textbox').slice(-6);
    fireEvent.paste(otpInputs[0], { clipboardData: { getData: () => '123456' } });
    await user.click(screen.getByRole('button', { name: 'Verify' }));
    expect(await screen.findByText('Cart destination')).toBeTruthy();
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(getCustomerAccessToken()).toBe(customerToken);
  });

  it('shows an empty cart and prevents checkout', async () => {
    localStorage.setItem('customerAccessToken', customerToken);
    globalThis.fetch = vi.fn().mockResolvedValue(jsonResponse({ success: true, data: [] }));
    renderCart();

    expect(await screen.findByText('Your cart is empty')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Continue' }).disabled).toBe(true);
  });

  it('confirms COD only after the backend returns persisted orders', async () => {
    const user = userEvent.setup();
    localStorage.setItem('customerAccessToken', customerToken);
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ success: true, data: [cartItem] }))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: [address] }))
      .mockResolvedValueOnce(jsonResponse({
        success: true,
        orders: [{ _id: 'order-12345678' }]
      }, 201));
    renderCart();

    await user.click(await screen.findByRole('button', { name: 'Continue' }));
    await user.click(await screen.findByRole('button', { name: /Place Order/ }));
    expect(await screen.findByText('Order placed successfully')).toBeTruthy();
    expect(screen.getByText(/order-12345678/)).toBeTruthy();
  });

  it('keeps the cart and reports failed order creation', async () => {
    const user = userEvent.setup();
    localStorage.setItem('customerAccessToken', customerToken);
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ success: true, data: [cartItem] }))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: [address] }))
      .mockResolvedValueOnce(jsonResponse({ success: false, message: 'Stock changed. Try again.' }, 409));
    renderCart();

    await user.click(await screen.findByRole('button', { name: 'Continue' }));
    await user.click(await screen.findByRole('button', { name: /Place Order/ }));
    expect((await screen.findByRole('alert')).textContent).toContain('Stock changed. Try again.');
    expect(screen.getByText(/1\s*item/)).toBeTruthy();
    expect(screen.getAllByText('₹500').length).toBeGreaterThan(0);
    expect(screen.queryByText('Order placed successfully')).toBeNull();
  });
});

describe('seller and admin order flows', () => {
  it('confirms a seller order through the fulfillment API', async () => {
    const user = userEvent.setup();
    const order = {
      _id: 'seller-order-1',
      orderStatus: 'placed',
      totalAmount: 500,
      quantity: 1,
      product: { name: 'Cotton Kurti' },
      userId: { name: 'Customer' },
      address
    };
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ success: true, data: [order] }))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: { ...order, orderStatus: 'confirmed' } }));
    render(<MemoryRouter><SupplierOrders /></MemoryRouter>);

    await user.click(await screen.findByRole('button', { name: 'Confirm order' }));
    expect(await screen.findByText(/confirmed.*Payment unavailable/i)).toBeTruthy();
    expect(globalThis.fetch.mock.calls[1][0]).toContain('/sellerp/acceptRejectOrder/seller-order-1');
    expect(JSON.parse(globalThis.fetch.mock.calls[1][1].body)).toEqual({ status: 'confirmed' });
  });

  it('loads and updates an admin order using the authenticated API', async () => {
    const user = userEvent.setup();
    const order = {
      _id: 'admin-order-1',
      orderStatus: 'placed',
      totalAmount: 500,
      product: { name: 'Cotton Kurti' },
      userId: { name: 'Customer' }
    };
    globalThis.fetch = vi.fn(async (url, options = {}) => {
      if (String(url).endsWith('/admin/session')) {
        return jsonResponse({ success: true, data: { role: 'Admin', name: 'Admin' } });
      }
      if (String(url).includes('/admin/adminDashboard')) {
        return jsonResponse({ success: true, data: {} });
      }
      if (String(url).includes('/admin/getallorder')) {
        return jsonResponse({ success: true, orders: [order], totalOrders: 1, totalPages: 1 });
      }
      if (String(url).includes('/admin/updateorderstatus/')) {
        return jsonResponse({ success: true, data: { ...order, orderStatus: 'confirmed' } });
      }
      throw new Error(`Unexpected request: ${String(url)} ${options.method || 'GET'}`);
    });
    render(<MemoryRouter><AdminPanel /></MemoryRouter>);

    await user.click((await screen.findAllByRole('button', { name: /Orders/ }))[0]);
    const statusSelect = await screen.findByRole('combobox', { name: /New status for order/ });
    await user.selectOptions(statusSelect, 'confirmed');
    await user.click(screen.getByRole('button', { name: 'Update' }));
    expect((await screen.findByRole('status')).textContent).toContain('updated to confirmed');
    expect(globalThis.fetch.mock.calls.some(([url, options]) =>
      String(url).includes('/admin/updateorderstatus/admin-order-1') && options.method === 'PATCH'
    )).toBe(true);
  });
});