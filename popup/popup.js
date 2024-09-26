import { initializeNavigation } from "./utils/navigation.js";
import { getSavoraResponse, renderMessage, sendHandler } from "./utils/chat.js";
import { initializeTextarea, resetTextarea } from "./utils/textareaHandler.js";
import { loadMessage } from "./utils/loadMessage.js";

import { marked } from "./lib/marked.esm.js";

const chatDiv = document.querySelector(".chat");
const chatNav = document.querySelector("#chat-nav");
const sendButton = document.querySelector(".send");
const inputElement = document.querySelector(".inp");
const chatHeader = document.querySelector(".chat-header");

let uploadedFile = null;
let history = null;

// Handle file upload
document.getElementById("upload-button").addEventListener("click", function () {
  document.getElementById("file-input").click();
});

document
  .getElementById("file-input")
  .addEventListener("change", function (event) {
    uploadedFile = event.target.files[0]; // Get the first uploaded file
    console.log("Uploaded file:", uploadedFile);
  });

document.addEventListener("DOMContentLoaded", async () => {
  initializeNavigation();
  history = await loadMessage();
  console.log("History:", history);
  for (const chat of history) {
    renderMessage(chat.user_message, chatDiv, true);
    renderMessage(marked.parse(chat.bot_response), chatDiv, false);
  }
});

sendButton.addEventListener("click", async () => {
  let isHandeled = await handleSend(inputElement, chatDiv);
  console.log("isHandeled:", isHandeled);
  if (isHandeled && !chatHeader.classList.contains("hide")) {
    chatHeader.classList.add("hide");
  }
});
inputElement.addEventListener("keyup", (event) => {
  let isHandeled = false;
  if (event.key === "Enter" && !event.shiftKey) {
    isHandeled = handleSend(inputElement, chatDiv);
  }
  if (isHandeled && !chatHeader.classList.contains("hide")) {
    chatHeader.classList.add("hide");
  }
});

const textarea = document.querySelector(".input-container textarea");
const maxRows = 3;
const lineHeight = 20; // Line height in pixels (must match the CSS line-height)

initializeTextarea(textarea, maxRows, lineHeight, handleSend, chatDiv);

async function handleSend(inputElement, chatDiv) {
  let condition = await sendHandler(inputElement, chatDiv, uploadedFile);
  console.log("sendHandler:", condition);
  resetTextarea(textarea);
  if (condition) {
    return true;
  } else {
    return false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const messages = [
    "🍽️ Ready to whip up something delicious? Ask Savora!",
    "👩‍🍳 What's cooking today? Let Savora inspire you!",
    "🧑‍🍳 Need recipe magic? Savora has your back!",
    "🌟 Discover your next favorite meal with Savora!",
    "🍲 Craving something special? Ask Savora for a recipe!",
    "🥗 Savora serves up recipes for every craving!",
    "🍕 Hungry for ideas? Let Savora guide you to the perfect dish!",
    "🥘 Unlock a world of flavors with Savora's recipes!",
    "🍔 What's on the menu tonight? Savora knows!",
    "🍝 Let's find your perfect recipe, Savora style!",
    "🥑 Feeling adventurous? Ask Savora for a unique recipe!",
    "🍳 From breakfast to dinner, Savora's got it covered!",
    "🍰 Sweet tooth calling? Savora has dessert ideas too!",
    "🍛 Spice up your day with Savora's top recipes!",
    "🌮 Craving something quick? Let Savora help you out!",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const chatHeader = document.querySelector(".chat-header");
  if (chatHeader) {
    chatHeader.textContent = randomMessage;
  }
});
