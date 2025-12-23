/**
 * Chat utilities - handles AI chatbot interactions
 */
import { marked } from "../../lib/marked.esm.js";
import { apiFetch } from "../../shared/api/client.js";
import { ENDPOINTS } from "../../shared/api/endpoints.js";
import { MESSAGES } from "../../shared/constants.js";
import { deleteMessage, editMessage } from "./crud.js";
import { getAuth } from "../../shared/auth-storage.js";

/**
 * Gets response from Savora AI chatbot
 * @param {string} userMessage - User's message
 * @param {Object} auth - Authentication {email, password}
 * @returns {Promise<string>} AI response in markdown
 */
export async function getSavoraResponse(userMessage, auth) {
  try {
    const body = JSON.stringify({ type: "text", message: userMessage });

    const response = await apiFetch(ENDPOINTS.AI_SAVORA, {
      method: "POST",
      body,
      auth,
    });

    const data = await response.json();
    return marked.parse(data.response);
  } catch (error) {
    return MESSAGES.ERROR_RESPONSE;
  }
}

/**
 * Renders a message in the chat container
 * @param {string} content - Message content
 * @param {HTMLElement} parent - Parent container element
 * @param {boolean} isUser - Whether message is from user
 * @returns {HTMLDivElement} Message element
 */
export function renderMessage(content, parent, isUser = true) {
  if (!parent || !(parent instanceof HTMLElement)) {
    throw new Error("Invalid parent element");
  }

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", isUser ? "message-user" : "message-bot");
  messageDiv.innerHTML = content;

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container", isUser ? "user" : "bot");

  if (isUser) {
    const deleteButton = createIconButton(
      "delete",
      "./assets/icons/misc/delete.png",
      async () => {
        const auth = await getAuth();
        if (auth) deleteMessage(messageContainer, auth);
      },
    );
    const editButton = createIconButton(
      "edit",
      "./assets/icons/misc/edit.png",
      async () => {
        const auth = await getAuth();
        if (auth) editMessage(messageContainer, auth);
      },
    );

    const crudIconDiv = document.createElement("div");
    crudIconDiv.classList.add("crud-icon-div", "hidden");
    crudIconDiv.append(deleteButton, editButton);

    messageContainer.appendChild(crudIconDiv);
    messageContainer.addEventListener("mouseover", () =>
      crudIconDiv.classList.remove("hidden"),
    );
    messageContainer.addEventListener("mouseout", () =>
      crudIconDiv.classList.add("hidden"),
    );
  }

  messageContainer.appendChild(messageDiv);
  parent.appendChild(messageContainer);
  parent.scrollTop = parent.scrollHeight;

  return messageDiv;
}

/**
 * Creates an icon button
 * @param {string} className - CSS class name
 * @param {string} src - Image source
 * @param {Function} onClick - Click handler
 * @returns {HTMLImageElement} Button element
 */
function createIconButton(className, src, onClick = null) {
  const button = document.createElement("img");
  button.classList.add(`${className}-button`, "img-button");
  button.src = chrome.runtime.getURL(src);
  if (onClick) button.addEventListener("click", onClick);
  return button;
}

/**
 * Handles send button click
 * @param {HTMLInputElement} inputElement - Input element
 * @param {HTMLElement} chatDiv - Chat container
 * @returns {Promise<boolean>} Success status
 */
export async function sendHandler(inputElement, chatDiv) {
  const message = inputElement.value.trim();

  if (!message) {
    return false;
  }

  inputElement.value = "";

  renderMessage(message, chatDiv);

  try {
    const auth = await getAuth();
    const response = await getSavoraResponse(message, auth);
    renderMessage(response, chatDiv, false);
    return true;
  } catch (error) {
    return false;
  }
}
