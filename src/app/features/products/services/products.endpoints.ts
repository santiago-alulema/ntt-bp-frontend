export const PRODUCTS_ENDPOINTS = {
    BASE: '/bp/products',
    BY_ID: (id: string) => `/bp/products/${encodeURIComponent(id)}`,
    VERIFICATION: (id: string) =>
        `/bp/products/verification/${encodeURIComponent(id)}`,
};