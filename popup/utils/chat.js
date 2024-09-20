import { marked } from "../lib/marked.esm.js";

export async function getSavoraResponse(userMessage) {
  console.log(`User message is: ${userMessage}`);
  const apiUrl = "http://127.0.0.1:5000/api/v1/ai/savora";

  try {
    const headers = {
      "Content-Type": "application/json",
      "Mivro-Email": "test1@mivro.org",
      "Mivro-Password": "test@1",
    };

    console.log("Headers:", headers);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        type: "text",
        message: userMessage,
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return marked.parse(data.response);
  } catch (error) {
    console.error("Error fetching Savora response:", error);
    throw error;
  }
}

export function renderMessage(content, parent, isUser = true) {
  if (!parent || !(parent instanceof HTMLElement)) {
    throw new Error("Invalid parent element");
  }

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.classList.add(isUser ? "message-user" : "message-bot");
  messageDiv.innerHTML = content;
  parent.appendChild(messageDiv);

  parent.scrollTop = parent.scrollHeight;

  return messageDiv;
}

export async function sendHandler(inputElement, chatDiv) {
  const message = inputElement.value.trim();
  console.log(`Message to send: ${message}`);

  if (!message) {
    console.log("No message to send");
    return false;
  }

  inputElement.value = "";
  renderMessage(message, chatDiv);

  try {
    const response = await getSavoraResponse(message);
    renderMessage(response, chatDiv, false);
    return true;
  } catch (error) {
    console.error("Error getting Savora response:", error);
    return false;
  }
}
