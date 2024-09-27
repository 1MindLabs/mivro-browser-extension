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
    console.log("Next element to delete:", nextDiv); // Debugging line
    userMessageContainer.remove();
    if (nextDiv) {
      nextDiv.remove();
      console.log("Next element removed successfully."); // Debugging line
    } else {
      console.log("No next element found."); // Debugging line
    }
  } else {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}
