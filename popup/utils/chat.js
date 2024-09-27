import { marked } from "../lib/marked.esm.js";
import { deleteMessage, copyMessage } from "./crud.js";

export async function getSavoraResponse(userMessage, uploadedFile) {
  console.log(`User message is: ${userMessage}`);
  console.log("Uploaded file:", uploadedFile);

  const apiUrl = "http://127.0.0.1:5000/api/v1/ai/savora";

  try {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append("media", uploadedFile);
      formData.append("message", userMessage);
      formData.append("type", "media");

      const headers = {
        "Mivro-Email": "test1@mivro.org",
        "Mivro-Password": "test@1",
      };

      const response = await fetch(apiUrl, {
        headers: headers,
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return marked.parse(data.response);
    }
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
    return "Sorry, I am unable to respond at the moment.";
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

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");
  messageContainer.classList.add(isUser ? "user" : "bot");

  if (isUser == true) {
    const editButton = document.createElement("img");
    editButton.classList.add("edit-button");
    editButton.classList.add("img-button");
    editButton.src = chrome.runtime.getURL("./assets/oth-icons/edit.png");

    const deleteButton = document.createElement("img");
    deleteButton.classList.add("delete-button");
    deleteButton.classList.add("img-button");
    deleteButton.src = chrome.runtime.getURL("./assets/oth-icons/delete.png");
    deleteButton.addEventListener("click", () => {
      deleteMessage(messageContainer);
    });

    const copyButton = document.createElement("img");
    copyButton.classList.add("copy-button");
    copyButton.classList.add("img-button");
    copyButton.src = chrome.runtime.getURL("./assets/oth-icons/copy.png");
    copyButton.addEventListener("click", () => {
      copyMessage(messageContainer);
    });

    const crudIconDiv = document.createElement("div");
    crudIconDiv.classList.add("crud-icon-div");
    crudIconDiv.classList.add("hidden");

    crudIconDiv.appendChild(copyButton);
    crudIconDiv.appendChild(deleteButton);
    crudIconDiv.appendChild(editButton);

    messageContainer.appendChild(crudIconDiv);

    messageContainer.addEventListener("mouseover", () => {
      crudIconDiv.classList.remove("hidden");
    });

    messageContainer.addEventListener("mouseout", () => {
      crudIconDiv.classList.add("hidden");
    });
  }
  messageContainer.appendChild(messageDiv);
  parent.appendChild(messageContainer);

  parent.scrollTop = parent.scrollHeight;

  return messageDiv;
}

export async function sendHandler(inputElement, chatDiv, uploadedFile) {
  const message = inputElement.value.trim();
  console.log(`Message to send: ${message}`);

  if (!message) {
    console.log("No message to send");
    return false;
  }

  inputElement.value = "";
  uploadedFile
    ? renderMessage(
        `<span class = "file-name">${uploadedFile.name}<span><br>${message}`,
        chatDiv
      )
    : renderMessage(message, chatDiv);

  try {
    const response = await getSavoraResponse(message, uploadedFile);
    renderMessage(response, chatDiv, false);
    uploadedFile = null;
    return true;
  } catch (error) {
    console.error("Error getting Savora response:", error);
    return false;
  }
}
