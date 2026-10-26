const CUSTOMER_TOKEN_KEY = 'customerAccessToken';

export const getCustomerAccessToken = () =>
  localStorage.getItem(CUSTOMER_TOKEN_KEY) || sessionStorage.getItem(CUSTOMER_TOKEN_KEY);

export const storeCustomerAccessToken = (token) => {
  localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  sessionStorage.removeItem(CUSTOMER_TOKEN_KEY);
};

export const clearCustomerAccessToken = () => {
  localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  sessionStorage.removeItem(CUSTOMER_TOKEN_KEY);
};

export const isCustomerAuthFailure = (response, payload = {}) =>
  (response.status === 400 && /token required|jwt expired|jwt malformed|invalid token|invalid signature/i.test(payload.message || '')) ||
  (response.status === 403 && payload.message?.includes('required role: customer')) ||
  (response.status === 404 && payload.message?.toLowerCase() === 'user not found');