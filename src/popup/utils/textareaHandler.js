/**
 * Textarea handler
 * Manages auto-resize functionality for message input
 */

/**
 * Initializes textarea with auto-resize functionality
 * @param {HTMLTextAreaElement} textarea - Textarea element
 * @param {number} maxRows - Maximum number of rows
 * @param {number} lineHeight - Line height in pixels
 * @param {Function} handleSend - Send handler function
 * @param {HTMLElement} chatDiv - Chat container element
 */
export function initializeTextarea(
  textarea,
  maxRows,
  lineHeight,
  handleSend,
  chatDiv,
) {
  textarea.addEventListener("input", () =>
    resizeTextarea(textarea, maxRows, lineHeight),
  );

  textarea.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend(textarea, chatDiv);
    }
  });
}

/**
 * Resizes textarea based on content
 * @param {HTMLTextAreaElement} textarea - Textarea element
 * @param {number} maxRows - Maximum number of rows
 * @param {number} lineHeight - Line height in pixels
 */
function resizeTextarea(textarea, maxRows, lineHeight) {
  textarea.style.height = "auto";
  const newHeight = Math.min(textarea.scrollHeight, maxRows * lineHeight);
  textarea.style.height = newHeight + "px";

  if (textarea.scrollHeight > maxRows * lineHeight) {
    textarea.style.overflowY = "scroll";
  } else {
    textarea.style.overflowY = "hidden";
  }
}

/**
 * Resets textarea to initial state
 * @param {HTMLTextAreaElement} textarea - Textarea element
 */
export function resetTextarea(textarea) {
  textarea.value = "";
  textarea.style.height = "auto";
  textarea.style.overflowY = "hidden";
}
