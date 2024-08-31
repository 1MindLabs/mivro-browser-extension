# Mivro Browser Extension

This is the browser extension for the Mivro project, built with JavaScript, HTML, and CSS. It enhances the user's online shopping experience by integrating Mivro's features directly into supported e-commerce websites.

**Maintained By**: [Shivansh Karan](https://github.com/SpaceTesla)

## Repository Structure

### Root Directory (`/`)

- **`background.js`**: Handles API requests to the Mivro Python server, acting as a bridge between content scripts and the backend.
- **`utils.js`**: Contains functions for scraping product titles from supported e-commerce websites, which are required for performing database lookup.
- **`manifest.json`**: Defines the extension's configuration, including permissions, background scripts, content scripts, and other metadata necessary for the extension to function within the browser.

### Assets (`assets/`)

This directory contains all the icons and images used by the extension, organized into the following subfolders:

- **`btn-icons/`**: Icons used specifically by the content scripts for various UI elements.
- **`ext-icons/`**: Icons that are shared between content scripts and the popup interface.
- **`food-icons/`**: Icons representing different food categories, used within the content scripts.
- **`nav-icons/`**: Icons utilized within the popup's navigation menu.
- **`oth-icons/`**: Additional images, including the project logo and other backup icons.

### Content Scripts (`content-scripts/`)

This directory contains scripts and styles that interact directly with the web pages on which the extension is active:

- **`content-script.css`**: Contains the styles applied to the extension's UI elements embedded within supported e-commerce sites.
- **`content-script.js`**: Responsible for rendering the extension's interface on web pages and interacting with `background.js` to fetch and display data.

### Popup (`popup/`)

This directory contains files for rendering and managing the extension's popup window, offering users additional functionality:

- **`lib/`**: Includes a Markdown parser used to format content within the chatbot interface.
- **`utils/`**:
  - **`chat.js`**: Facilitates communication with the Gemini AI chatbot through the Python server.
  - **`navigation.js`**: Manages user interactions with the popup’s navigation elements.
  - **`textareaHandler.js`**: Supports the chat UI within the popup, handling user input and interface behavior.
- **`popup.html`**: Defines the structure and layout of the extension's popup window.
- **`popup.css`**: Contains styles for the popup interface.
- **`popup.js`**: Manages user interactions and data flow using the `utils` folder for additional functionalities.

## Getting Started

Follow these steps to set up and run the Mivro Browser Extension on your local machine, or you can watch the [demo video](https://youtube.com/watch?v=ToXUq-NSkUg).

### Prerequisites

- [Node.js >= 20.14.0](https://nodejs.org/dist/v20.14.0/node-v20.14.0-x64.msi).
- [Google Chrome](https://www.google.com/chrome) browser.

### Installation

1. **Fork the Repository**:

   - Go to the [Mivro Browser Extension repository](https://github.com/1MindLabs/mivro-browser-extension) and click "Fork" to create a copy under your GitHub account.

2. **Clone the Repository**:

   ```bash
   git clone https://github.com/<your-username>/browser-extension.git
   ```

3. **Navigate to the Project Directory**:

   ```bash
   cd browser-extension
   ```

4. **Set Up the Extension on Chrome**:
   - Open Chrome and go to `chrome://extensions`.
   - Enable "Developer mode" (top right corner).
   - Click "Load unpacked" (top left corner).
   - Select the `browser-extension` folder.

## Usage

1. **Navigate to any of the following supported websites**:

   - [BigBasket](https://www.bigbasket.com)
   - [Blinkit](https://www.blinkit.com)
   - [Swiggy](https://www.swiggy.com)
   - [Zepto](https://www.zeptonow.com)
   - [Jiomart](https://www.jiomart.com)
   - [Amazon](https://www.amazon.com)
   - [Flipkart](https://www.flipkart.com)

2. **Select and open any product**. The browser extension will appear on the right side of the screen. Click on the extension icon to access detailed information.

3. **If the extension doesn’t appear on the product page**, try refreshing the page or check the Developer Console for errors.

## Documentation

For detailed documentation, please visit the [Documentation Repository](https://github.com/1MindLabs/mivro-documentation).

## Contributing

We welcome contributions! Please follow the guidelines in our [Contributing Guide](https://github.com/1MindLabs/mivro-documentation/blob/main/CONTRIBUTING.md) to get started.

## License

This project is licensed under the [MIT License](https://github.com/1MindLabs/mivro-documentation/blob/main/LICENSE).

## Acknowledgments

- [Open Food Facts](https://world.openfoodfacts.org) for providing access to a comprehensive food product database.
- [All Contributors](https://github.com/1MindLabs/mivro-browser-extension/graphs/contributors) for their valuable contributions to the development and improvement of this project.
