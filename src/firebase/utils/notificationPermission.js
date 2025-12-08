/**
 * Check and handle notification permission
 * @param {Function} onGranted - Callback function to call when permission is granted
 * @returns {Promise<boolean>} - Returns true if permission granted, false otherwise
 */
export async function checkAndRequestNotificationPermission(onGranted) {
  try {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return false;
    }

    if (Notification.permission === "granted") {
      console.log("✅ Notifications already allowed.");
      if (onGranted && typeof onGranted === "function") {
        onGranted();
      }
      return true;
    } else if (Notification.permission === "denied") {
      alert(
        "Notifications are blocked. Please allow notifications in your browser settings and refresh the page."
      );
      return false;
    } else {
      // default: "default" → not asked yet
      return await requestNotificationPermission(onGranted);
    }
  } catch (error) {
    console.error("❌ Error checking notification permission:", error);
    return false;
  }
}

/**
 * Request notification permission
 * @param {Function} onGranted - Callback function to call when permission is granted
 * @returns {Promise<boolean>} - Returns true if permission granted, false otherwise
 */
export async function requestNotificationPermission(onGranted) {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("✅ Notifications permission granted.");
      // Call callback if provided
      if (onGranted && typeof onGranted === "function") {
        onGranted();
      }
      return true;
    } else {
      alert("Please allow notifications and try again.");
      return false;
    }
  } catch (error) {
    console.error("❌ Error requesting notification permission:", error);
    return false;
  }
}

/**
 * Check current notification permission status
 * @returns {string} - Returns "granted", "denied", or "default"
 */
export function getNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("⚠️ This browser does not support notifications");
    return "unsupported";
  }
  return Notification.permission;
}

/**
 * Check if notification permission is already granted
 * @returns {boolean} - Returns true if permission is already granted
 */
export function isNotificationPermissionGranted() {
  return getNotificationPermission() === "granted";
}

