/**
 * Profile page component
 * Displays user profile information and settings
 */
import { getAuth, clearAuth } from "../../shared/auth-storage.js";
import { WEB_URL } from "../../shared/constants.js";

/**
 * Initializes the profile page with user data and click handlers
 */
export async function initializeProfilePage() {
  const auth = await getAuth();

  if (auth) {
    const nameEl = document.getElementById("profile-name");
    const emailEl = document.getElementById("profile-email");
    const avatarEl = document.getElementById("profile-avatar");

    if (emailEl) emailEl.textContent = auth.email;
    if (nameEl) nameEl.textContent = auth.name || auth.email.split("@")[0];
    if (avatarEl)
      avatarEl.textContent = (auth.name || auth.email).charAt(0).toUpperCase();
  }

  const profileOptions = document.querySelectorAll(".profile-option");
  profileOptions.forEach((option) => {
    const textElement = option.querySelector(".profile-text");
    const text = textElement.textContent
      .trim()
      .toLowerCase()
      .replace(/ /g, "-");
    option.addEventListener("click", () => {
      window.open(`${WEB_URL}/${text}`, "_blank");
    });
  });

  const logoutBtn = document.querySelector(".logout");
  logoutBtn?.addEventListener("click", async () => {
    await clearAuth();
    window.close();
  });
}
