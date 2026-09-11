import { API_URL } from './constants';
import { useAuthStore } from '../store/auth';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', Bearer );
  }
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(${API_URL}, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(API Error : );
  }

  return response.json();
}
