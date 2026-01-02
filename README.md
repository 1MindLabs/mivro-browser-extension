# Mivro Browser Extension

This is the browser extension for the Mivro project, built with JavaScript, HTML, and CSS. It enhances the user's online shopping experience by integrating Mivro's features directly into supported e-commerce websites.

**Maintained By**: [Shivansh Karan](https://github.com/SpaceTesla)

## Repository Structure

### Root Directory

- **manifest.json**: Extension configuration with permissions and scripts

### src/ - Source Code

- **background/**: Service worker and API handlers
  - api-handlers.js: Handles API requests and icon fetching
  - background.js: Main service worker with message listeners
- **content/**: Content scripts for web page integration
  - auth-listener.js: Handles authentication from Mivro web app
  - content-main.js: Main content script for e-commerce sites
  - content-script.css: Styling for injected UI components
- **popup/**: Popup UI, pages, and utilities
  - pages/: Chat, marketplace, search, profile pages
  - utils/: Chat handlers, CRUD operations, navigation, textarea handling
  - popup.html, popup.css, popup.js: Main popup interface
- **shared/**: Shared code across extension
  - api/: API client and endpoint configurations
  - auth-storage.js: Authentication credential management
  - constants.js: Shared constants and configurations
- **lib/**: Third-party libraries (Markdown parser)

### assets/ - Icons and Images

- **icons/**: Categorized by type (extension, buttons, navigation, food, misc)
- **images/**: User images and visual assets

## Getting Started

Follow these steps to set up and run the Mivro Browser Extension on your local machine, or you can watch the [demo video](https://youtube.com/watch?v=ToXUq-NSkUg).

### Prerequisites

- [Node.js >= 22.20.0](https://nodejs.org/dist/v22.20.0/node-v22.20.0-x64.msi)
- [Google Chrome](https://www.google.com/chrome) browser
- Mivro Web Application running on `http://localhost:3000` (for development)
- Mivro Backend Server running on `http://localhost:5000` (for API requests)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/1MindLabs/mivro-extension.git
   cd mivro-extension
   ```

2. **Configure Environment** (Optional):

   - Open `config.js` in the root directory
   - For **development**: Keep `IS_PRODUCTION = false` (uses `localhost:3000`)
   - For **production**: Set `IS_PRODUCTION = true` (uses `mivro.1mindlabs.org`)

   ```javascript
   export const IS_PRODUCTION = false;
   export const WEB_URL = IS_PRODUCTION
     ? "https://mivro.1mindlabs.org"
     : "http://localhost:3000";
   export const API_URL = IS_PRODUCTION
     ? "https://mivro-api.1mindlabs.org/api/v1"
     : "http://localhost:5000/api/v1";
   ```

3. **Create Distribution Package** (Optional):

   To create a zip file for distribution or submission to Chrome Web Store:

   ```powershell
   Compress-Archive -Path .\* -DestinationPath mivro-extension.zip -Force
   ```

4. **Load Extension in Chrome**:

   - Open Chrome and navigate to `chrome://extensions`
   - Enable **Developer mode** (toggle in top right corner)
   - Click **Load unpacked** button (top left)
   - Select the `mivro-extension` folder from your file system

5. **Start Required Services**:

   **Backend Server:**

   ```bash
   python app.py
   # Server runs on http://localhost:5000
   ```

   **Website (for authentication):**

   ```bash
   npm run dev
   # Website runs on http://localhost:3000
   ```

### First-Time Setup

1. **Authenticate the Extension**:

   - Click the Mivro extension icon in Chrome toolbar
   - You'll be redirected to `localhost:3000/signin?source=extension`
   - Sign in with your credentials or create a new account
   - The tab will close automatically after successful authentication
   - Extension is now ready to use!

2. **Test the Extension**:

   - Navigate to any supported e-commerce website:
     - [Zepto](https://www.zeptonow.com)
     - [Blinkit](https://www.blinkit.com)
     - [BigBasket](https://www.bigbasket.com)
     - [Swiggy Instamart](https://www.swiggy.com/instamart)
     - [JioMart](https://www.jiomart.com)
     - [Flipkart](https://www.flipkart.com)
     - [Amazon India](https://www.amazon.in)
   - Open any product page
   - The Mivro sidebar will appear on the right side with product analysis

3. **Use the Popup**:
   - Click the extension icon to open the popup
   - Navigate between tabs: Chat, Marketplace, Search, Profile
   - Chat with Savora AI for recipe suggestions
   - View and manage your profile settings

## Documentation

For detailed documentation, visit the [Documentation Repository](https://github.com/1MindLabs/mivro-documentation).

## Contributing

We welcome contributions! Follow the guidelines in our [Contributing Guide](https://github.com/1MindLabs/mivro-documentation/blob/main/CONTRIBUTING.md).
