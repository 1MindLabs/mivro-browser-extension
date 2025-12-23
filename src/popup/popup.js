/**
 * Main popup entry point - initializes UI, navigation, and chat functionality
 */
import { initializeNavigation } from "./utils/navigation.js";
import { sendHandler } from "./utils/chat.js";
import { initializeTextarea, resetTextarea } from "./utils/textareaHandler.js";
import { initializeChatPage } from "./pages/chat.js";
import { initializeProfilePage } from "./pages/profile.js";
import { initializeSearchPage } from "./pages/search.js";
import { isAuthenticated } from "../shared/auth-storage.js";
import { UI_CONFIG, WEB_URL } from "../shared/constants.js";

const chatDiv = document.querySelector(".chat");
const chatSendButton = document.querySelector(".chat .send");
const chatInputElement = document.querySelector(".chat .inp");

let chatInitialized = false;

document.addEventListener("DOMContentLoaded", async () => {
  if (!(await isAuthenticated())) {
    window.open(`${WEB_URL}/signin?source=extension`, "_blank");
    window.close();
    return;
  }

  initializeNavigation();
  initializeProfilePage();
  initializeSearchPage();
  setupChatTabListener();
});

chatSendButton?.addEventListener("click", async () => {
  await handleSend(chatInputElement, chatDiv);
});

chatInputElement?.addEventListener("keyup", async (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    await handleSend(chatInputElement, chatDiv);
  }
});

const chatTextarea = document.querySelector(".chat .input-container textarea");
if (chatTextarea) {
  initializeTextarea(
    chatTextarea,
    UI_CONFIG.MAX_TEXTAREA_ROWS,
    UI_CONFIG.TEXTAREA_LINE_HEIGHT,
    handleSend,
    chatDiv,
  );
}

/**
 * Sets up listener for Chat tab to initialize chat on first click
 */
function setupChatTabListener() {
  const navItems = document.querySelectorAll(".nav-list li");
  const chatNavItem = navItems[0];

  chatNavItem.addEventListener("click", async () => {
    if (!chatInitialized) {
      chatInitialized = true;
      await initializeChatPage(chatDiv);
    }
  });
}

/**
 * Handles sending a message
 * @param {HTMLInputElement} inputElement - Input element
 * @param {HTMLElement} chatDiv - Chat container
 * @returns {Promise<boolean>} Success status
 */
async function handleSend(inputElement, chatDiv) {
  const condition = await sendHandler(inputElement, chatDiv);

  resetTextarea(chatTextarea);

  return condition;
}
