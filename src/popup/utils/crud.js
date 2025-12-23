/**
 * Message CRUD operations
 * Delete and edit functionality for chat messages
 */
import { marked } from "../../lib/marked.esm.js";
import { apiFetch } from "../../shared/api/client.js";
import { ENDPOINTS } from "../../shared/api/endpoints.js";

/**
 * Deletes a user message and its response
 * @param {HTMLElement} userMessageContainer - Message container
 * @param {Object} auth - Authentication {email, password}
 */
export async function deleteMessage(userMessageContainer, auth) {
  const userMessage =
    userMessageContainer.querySelector(".message-user").innerText;

  try {
    await apiFetch(ENDPOINTS.CHAT_DELETE, {
      method: "DELETE",
      body: JSON.stringify({ delete_message: userMessage }),
      auth,
    });

    userMessageContainer.remove();
    userMessageContainer.nextElementSibling?.remove();
  } catch (error) {
    return;
  }
}

/**
 * Edits a user message and gets new response
 * @param {HTMLElement} userMessageContainer - Message container
 * @param {Object} auth - Authentication {email, password}
 */
export async function editMessage(userMessageContainer, auth) {
  const messageDiv = userMessageContainer.querySelector(".message-user");
  const oldMessage = messageDiv.innerText;

  const newMessage = prompt("Edit your message:", oldMessage);
  if (!newMessage || newMessage === oldMessage) return;

  try {
    const response = await apiFetch(ENDPOINTS.CHAT_UPDATE, {
      method: "PUT",
      body: JSON.stringify({
        old_message: oldMessage,
        new_message: newMessage,
      }),
      auth,
    });

    messageDiv.innerText = newMessage;
    const nextDiv = userMessageContainer.nextElementSibling;
    if (nextDiv) {
      nextDiv.remove();
    }

    if (response && response.response) {
      const botContainer = document.createElement("div");
      botContainer.classList.add("message-container", "bot");

      const botMessage = document.createElement("div");
      botMessage.classList.add("message", "message-bot");
      botMessage.innerHTML = marked.parse(response.response);

      botContainer.appendChild(botMessage);
      userMessageContainer.insertAdjacentElement("afterend", botContainer);

      userMessageContainer.parentElement.scrollTop =
        userMessageContainer.parentElement.scrollHeight;
    }
  } catch (error) {
    return;
  }
}
