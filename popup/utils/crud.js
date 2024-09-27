export async function deleteMessage(userMessageContainer) {
  const userMessageDiv = userMessageContainer.querySelector(".message-user");
  const userMessage = userMessageDiv.innerText;
  const headers = {
    "Content-Type": "application/json",
    "Mivro-Email": "test1@mivro.org",
    "Mivro-Password": "test@1",
  };
  const apiUrl = "http://localhost:5000/api/v1/chat/delete-message";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      delete_message: userMessage,
    }),
  });
  console.log("Response:", response.message);

  if (response.ok) {
    const nextDiv = userMessageContainer.nextElementSibling;
    console.log("Next element to delete:", nextDiv);
    userMessageContainer.remove();
    if (nextDiv) {
      nextDiv.remove();
      console.log("Next element removed successfully.");
    } else {
      console.log("No next element found.");
    }
  } else {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function copyMessage(userMessageContainer) {
  const userMessageDiv = userMessageContainer.querySelector(".message-user");
  const userMessage = userMessageDiv.innerText;

  const nextDiv = userMessageContainer.nextElementSibling;

  if (nextDiv) {
    const botMessageDiv = nextDiv.querySelector(".message-bot");
    const botMessage = botMessageDiv.innerText;
    console.log("Next element to delete:", nextDiv);
    navigator.clipboard.writeText(botMessage);
    console.log("Message copied to clipboard:", userMessage);
  } else {
    console.log("No next element found.");
  }
}
