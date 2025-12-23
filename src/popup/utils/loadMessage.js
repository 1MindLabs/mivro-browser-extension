/**
 * Message loader utility
 * Fetches and displays chat message history
 */
import { apiFetch } from "../../shared/api/client.js";
import { ENDPOINTS } from "../../shared/api/endpoints.js";

/**
 * Loads chat message history
 * @param {Object} auth - Authentication {email, password}
 * @returns {Promise<Array>} Chat messages
 */
export async function loadMessage(auth) {
  try {
    const response = await apiFetch(ENDPOINTS.CHAT_LOAD, {
      method: "GET",
      auth,
    });
    return await response.json();
  } catch (error) {
    return [];
  }
}
