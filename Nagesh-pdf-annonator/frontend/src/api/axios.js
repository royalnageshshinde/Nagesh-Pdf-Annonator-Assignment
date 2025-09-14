import axios from 'axios';
import { BACKEND_BASE } from '../config.js';

const instance = axios.create({
  baseURL: `${BACKEND_BASE}/api`,
  headers: { 'Content-Type': 'application/json' }
});

// Token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('pdf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
