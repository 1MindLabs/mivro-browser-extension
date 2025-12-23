/**
 * Background service worker for Mivro extension
 */
import { fetchSvg, fetchProductInfo } from "./api-handlers.js";
import { ICON_PATHS } from "../shared/constants.js";
import { getAuth, storeAuth } from "../shared/auth-storage.js";

const iconPathMap = {
  fetchIconM: ICON_PATHS.BUTTON_M,
  fetchIconMivro: ICON_PATHS.MISC_MIVRO,
  fetchIconClose: ICON_PATHS.BUTTON_CLOSE,
  fetchIconShare: ICON_PATHS.BUTTON_SHARE,
  fetchIconHeart: ICON_PATHS.BUTTON_HEART,
  fetchHeartFilledSvg: ICON_PATHS.BUTTON_HEART_FILLED,
  fetchHeartSvg: ICON_PATHS.BUTTON_HEART,
  fetchIconFlag: ICON_PATHS.BUTTON_FLAG,
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "AUTH_SUCCESS" && msg.auth) {
    storeAuth(msg.auth.email, msg.auth.password, msg.auth.name)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (iconPathMap[msg.text]) {
    fetchSvg(chrome.runtime.getURL(iconPathMap[msg.text]), sendResponse);
    return true;
  }

  if (msg.text === "fetchProductInfo") {
    getAuth().then((auth) => {
      if (auth) {
        fetchProductInfo(sendResponse, msg.product, auth);
      } else {
        sendResponse({ error: "Authentication required" });
      }
    });
    return true;
  }

  sendResponse({ error: `Unknown message text: ${msg.text}` });
  return false;
});
