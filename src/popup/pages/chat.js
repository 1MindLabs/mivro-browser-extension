/**
 * Chat page component
 * Initializes chat interface and message handlers
 */
import { renderMessage } from "../utils/chat.js";
import { loadMessage } from "../utils/loadMessage.js";
import { marked } from "../../lib/marked.esm.js";
import { getAuth } from "../../shared/auth-storage.js";

/**
 * Initializes the chat page
 * @param {HTMLElement} chatDiv - Chat container
 * @returns {Promise<Array>} Chat history
 */
export async function initializeChatPage(chatDiv) {
  const auth = await getAuth();
  if (!auth) return [];

  const history = await loadMessage(auth);

  for (const chat of history) {
    renderMessage(chat.user_message, chatDiv, true);
    renderMessage(marked.parse(chat.bot_response), chatDiv, false);
  }

  return history;
}
