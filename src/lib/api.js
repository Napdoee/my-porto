// Centralized API configuration for Napdoee
// Handles development (Vite proxy) and production (Railway backend) environments

/**
 * Get the base API URL from environment variables
 * - Development: '' (empty string) - uses Vite proxy to forward /api/* to localhost:3001
 * - Production: 'https://your-backend.railway.app' - full backend URL
 */
const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Get full API URL for a given endpoint
 * @param {string} endpoint - API endpoint starting with /api/
 * @returns {string} - Full URL (or relative URL in dev)
 *
 * @example
 * // Development: getApiUrl('/api/settings') -> '/api/settings'
 * // Production: getApiUrl('/api/settings') -> 'https://backend.railway.app/api/settings'
 */
export function getApiUrl(endpoint) {
  return `${API_URL}${endpoint}`;
}

/**
 * Wrapper around fetch() that automatically prepends the API URL
 * Use this instead of fetch() for all API calls
 *
 * @param {string} endpoint - API endpoint starting with /api/
 * @param {RequestInit} options - Standard fetch options
 * @returns {Promise<Response>} - Fetch response promise
 *
 * @example
 * const response = await apiFetch('/api/settings');
 * const data = await response.json();
 */
export async function apiFetch(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  return fetch(url, options);
}
