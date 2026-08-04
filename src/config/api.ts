/**
 * Centralized API Base URL configuration.
 * Reads from NEXT_PUBLIC_API_BASE_URL (client & server) or BACKEND_URL (server).
 * Default production Express backend: https://codivabuilders.onrender.com
 * Default local development: http://localhost:5000
 */

const getFallbackUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    return 'https://codivabuilders.onrender.com';
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://codivabuilders.onrender.com'
    : 'http://localhost:5000';
};

const rawUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BACKEND_URL ||
  getFallbackUrl();

export const API_BASE_URL = rawUrl.replace(/\/+$/, '');
