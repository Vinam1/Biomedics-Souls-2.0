/**
 * API Service for Biomedics Souls
 * Base service for communicating with the PHP Backend
 */

const API_BASE_URL = '/api';

export async function apiFetch<T>(action: string, options: RequestInit & { params?: Record<string, string> } = {}): Promise<T> {
  const url = new URL(`${window.location.origin}${API_BASE_URL}`);
  url.searchParams.append('action', action);
  
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  // If it's a GET request and there are params in options, we should add them to the URL
  if (options.method === 'GET' || !options.method) {
    // Note: This is a simple implementation, actual data fetching might need more robust query string handling
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

export const endpoints = {
  products: {
    getAll: () => apiFetch<any[]>('getProducts'),
    getById: (id: string | number) => apiFetch<any>('getProduct', {
      method: 'GET',
      params: { id: String(id) }
    }),
    save: (product: any) => apiFetch<any>('saveProduct', {
      method: 'POST',
      body: JSON.stringify(product)
    }),
    delete: (id: string | number) => apiFetch<any>('deleteProduct', {
      method: 'DELETE',
      params: { id: String(id) }
    })
  },
  categories: {
    getAll: () => apiFetch<any[]>('getCategories')
  },
  users: {
    getById: (id: string) => apiFetch<any>('getUser', {
      method: 'GET',
      params: { id }
    }),
    save: (user: any) => apiFetch<any>('saveUser', {
      method: 'POST',
      body: JSON.stringify(user)
    })
  },
  orders: {
    create: (order: any) => apiFetch<any>('createOrder', {
      method: 'POST',
      body: JSON.stringify(order)
    }),
    getByUser: (userId: string) => apiFetch<any[]>('getOrders', {
        method: 'GET',
        params: { userId }
    })
  }
};
