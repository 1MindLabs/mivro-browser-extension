/**
 * Content script for Mivro web app authentication callback
 * Listens for auth success messages from the web app and forwards them to the extension
 */

const ALLOWED_ORIGINS = [
  "https://mivro.1mindlabs.org",
  "http://localhost:3000",
];

window.addEventListener("message", (event) => {
  if (!ALLOWED_ORIGINS.includes(event.origin)) {
    return;
  }

  if (event.data && event.data.type === "MIVRO_AUTH_SUCCESS") {
    const { email, password, name } = event.data;

    if (email && password) {
      chrome.runtime.sendMessage(
        {
          type: "AUTH_SUCCESS",
          auth: { email, password, name },
        },
        (response) => {
          if (response && response.success) {
            window.postMessage(
              {
                type: "MIVRO_AUTH_STORED",
                success: true,
              },
              event.origin,
            );

            setTimeout(() => {
              window.close();
            }, 500);
          }
        },
      );
    }
  }
});

window.postMessage(
  {
    type: "MIVRO_EXTENSION_READY",
  },
  window.location.origin,
);
