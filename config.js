/**
 * Extension Environment Configuration
 *
 * To deploy for production:
 * 1. Change IS_PRODUCTION to true
 * 2. Rebuild/reload the extension
 *
 * For development:
 * 1. Keep IS_PRODUCTION as false
 * 2. Make sure website is running on localhost:3000
 * 3. Make sure API server is running on localhost:5000
 */

export const IS_PRODUCTION = true;

export const WEB_URL = IS_PRODUCTION
  ? "https://mivro.1mindlabs.org"
  : "http://localhost:3000";

export const API_URL = IS_PRODUCTION
  ? "https://mivro-api.1mindlabs.org/api/v1"
  : "http://localhost:5000/api/v1";

export const API_TIMEOUT = 60000;
