/**
 * Background API handlers
 * Handles SVG icon fetching and product information requests
 */
import { ENDPOINTS } from "../shared/api/endpoints.js";
import { API_URL } from "../../config.js";

/**
 * Fetches an SVG from a given URL and sends it as a response
 * @param {string} url - The URL of the SVG to fetch
 * @param {function} sendResponse - The function to call with the SVG data
 */
export function fetchSvg(url, sendResponse) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      sendResponse({ svg: data });
    })
    .catch((error) => {
      sendResponse({ error: error.toString() });
    });
}

/**
 * Fetches product information from the API
 * @param {function} sendResponse - Response callback
 * @param {string} product - Product keyword to search
 * @param {Object} auth - Authentication {email, password}
 */
export function fetchProductInfo(sendResponse, product, auth) {
  const url = new URL(`${API_URL}${ENDPOINTS.SEARCH_TEXT}`);
  url.searchParams.append("search_query", product);
  url.searchParams.append("page", "1");
  url.searchParams.append("page_size", "1");

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Mivro-Email": auth.email,
      "Mivro-Password": auth.password,
    },
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`)))
    .then((data) => {
      // console.log('API Response:', data);
      const productInfo =
        data.products && data.products.length > 0 ? data.products[0] : null;
      sendResponse({ productInfo: productInfo });
    })
    .catch((error) => {
      console.error("API Error:", error);
      sendResponse({ error: error.toString() });
    });
}
