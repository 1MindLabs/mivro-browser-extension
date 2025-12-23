/**
 * Authentication storage utilities for Chrome extension
 */

const KEY = "mivro_auth";

/**
 * Stores authentication credentials in Chrome storage
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User display name
 * @returns {Promise<void>}
 */
export function storeAuth(email, password, name) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [KEY]: { email, password, name } }, resolve);
  });
}

/**
 * Retrieves authentication credentials from Chrome storage
 * @returns {Promise<Object|null>} Auth object with email, password, and name or null
 */
export function getAuth() {
  return new Promise((resolve) => {
    chrome.storage.local.get([KEY], (result) => {
      resolve(result[KEY] || null);
    });
  });
}

/**
 * Removes authentication credentials from Chrome storage
 * @returns {Promise<void>}
 */
export function clearAuth() {
  return new Promise((resolve) => {
    chrome.storage.local.remove([KEY], resolve);
  });
}

/**
 * Checks if user is authenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export async function isAuthenticated() {
  return (await getAuth()) !== null;
}
