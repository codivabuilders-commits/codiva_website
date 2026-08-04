/**
 * Centralized API Base URL configuration.
 * Reads from NEXT_PUBLIC_API_BASE_URL (client & server) or BACKEND_URL (server),
 * with fallback to local express server (http://localhost:5000).
 */
const rawUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BACKEND_URL ||
  'http://localhost:5000';

export const API_BASE_URL = rawUrl.replace(/\/+$/, '');
