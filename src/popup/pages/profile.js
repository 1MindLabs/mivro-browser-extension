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
  profileOptions.forEach((option, index) => {
    option.addEventListener("click", () => {
      // First 3 items (0,1,2) go to /dashboard
      // Last 2 items (3,4) go to /settings
      const path = index < 3 ? "dashboard" : "settings";
      window.open(`${WEB_URL}/${path}`, "_blank");
    });
  });

  const logoutBtn = document.querySelector(".logout");
  logoutBtn?.addEventListener("click", async () => {
    await clearAuth();
    window.close();
  });
}
