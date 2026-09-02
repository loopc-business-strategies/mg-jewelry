import axios from 'axios';
import { STORAGE_KEY, defaultPrefs } from '../utils/marketConfig';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultPrefs, ...JSON.parse(stored) }.language || 'en';
  } catch { /* ignore */ }
  return defaultPrefs.language;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const lang = getStoredLanguage();
  const url = config.url || '';
  if (url.includes('/products') || url.includes('/search')) {
    config.params = { ...config.params, lang };
  }

  return config;
});

api.interceptors.response.use(
  (res) => {
    if (res.data?.success === true && 'data' in res.data) {
      res.data = res.data.data;
    }
    return res;
  },
  (err) => {
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/admin')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(err);
  }
);

export default api;
