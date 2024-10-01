# Contributing to Mivro Browser Extension

Thank you for considering contributing to the Mivro Browser Extension! Below are guidelines for contributing, testing, and working with Chromium-based browsers.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Reporting Issues](#reporting-issues)
4. [Submitting Pull Requests](#submitting-pull-requests)
5. [Style Guide](#style-guide)
6. [Testing in Chromium-Based Browsers](#testing-in-chromium-based-browsers)
7. [Commit Message Guidelines](#commit-message-guidelines)
8. [License](#license)

## Code of Conduct
By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute
1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/mivro-browser-extension.git
   ```
3. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes, ensuring they follow the style guide.
5. Test your changes thoroughly.

## Reporting Issues
If you encounter bugs, have feature requests, or any feedback, feel free to [open an issue](https://github.com/1MindLabs/mivro-browser-extension/issues) with:
- A detailed description of the problem.
- Steps to reproduce the issue (if applicable).
- Screenshots, logs, or code snippets.

## Submitting Pull Requests
1. Ensure your branch is up to date:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Push your feature branch:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a pull request with a clear description of your changes.

## Style Guide
- **JavaScript**: Follow [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript).
- **HTML & CSS**: Maintain clean, readable structure.
- Ensure all files end with a newline.

## Testing in Chromium-Based Browsers

1. **Load the Extension**:
   - Open your Chromium-based browser (e.g., Google Chrome, Microsoft Edge).
   - Navigate to `chrome://extensions/` in the browser.
   - Enable **Developer Mode** in the top-right corner.
   - Click **Load unpacked** and select the directory where the extension code is located (`mivro-browser-extension`).

2. **Refreshing the Extension**:
   - After making changes to the code, return to `chrome://extensions/`.
   - Click the **refresh icon** or **Reload** button on the extension you’re working on.
   - Alternatively, close and reopen the browser tab where the extension is running to apply changes.

3. **Additional Tools**:
   - Use **Chrome DevTools** to debug background scripts, content scripts, and popups:
     - Right-click on your extension’s icon and select **Inspect** to open the DevTools.
   - Consider using [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/nfablnejdlmijabopdfcejmhaahbdeaa) to automatically reload the extension after changes.

## Commit Message Guidelines
- Use the following format:
   ```bash
   <type>(<scope>): <subject>
   ```
- Example:
   ```bash
   feat(popup): add support for new button icons
   ```
   - **Type**: feat, fix, docs, style, refactor, test, chore.
   - **Scope**: Affected part of the code (e.g., popup, content-script).
   - **Subject**: A brief summary of the changes.

## License
By contributing, you agree that your contributions will be licensed under the project's [Apache-2.0 License](LICENSE).
