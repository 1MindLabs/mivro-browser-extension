/**
 * Shared API configuration and utilities
 */

import { API_URL, API_TIMEOUT } from "../../../config.js";

/**
 * Makes an API request with authentication
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @param {Object} options.auth - Authentication {email, password}
 * @returns {Promise<Response>}
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const headers = { "Content-Type": "application/json" };

    if (options.auth) {
      headers["Mivro-Email"] = options.auth.email;
      headers["Mivro-Password"] = options.auth.password;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
