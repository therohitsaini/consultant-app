import axios from "axios";
import { checkMicPermission } from "../ConsultantCards/ConsultantCards";
import { socket } from "../Sokect-io/SokectConfig";
import { checkUserStatus } from "./CheckUserStatus";

export const checkUserBalance = async ({
  userId,
  consultantId,
  type,
  shop,
}) => {
  if (!userId || !consultantId) {
    window.top.location.href = `https://${shop}/account/login`;

    return;
  }
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_HOST}/api/users/shopify/users/checked-balance/${userId}/${consultantId}`,
      {
        params: {
          callType: type,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    return false;
  }
};

export const openCallPage = async ({ receiverId, type, userId, shop }) => {
  try {
    const balance = await checkUserBalance({
      userId,
      consultantId: receiverId,
      type,
      shop,
    });
    if (!balance) {
      alert("You have insufficient balance");
      return;
    }
    const userStatus = await checkUserStatus(receiverId, shop);
    console.log("userStatus", userStatus);
    if (!userStatus) {
      alert("This user is not available to talk with you");
      return;
    }
    const hasMicPermission = await checkMicPermission();
    if (!hasMicPermission) {
      alert("Please grant microphone permission");
      return;
    }
    const channelName = `channel-${userId.slice(-6)}-${receiverId.slice(-6)}`;
    const uid = Math.floor(Math.random() * 1000000);

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/call/generate-token`;
    const res = await axios.post(
      url,
      {
        channelName,
        uid,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = res.data;
    if (!data.token) {
      throw new Error("Token missing from API");
    }

    socket.emit("call-user", {
      callerId: userId,
      receiverId,
      channelName,
      callType: type || "voice",
      shop,
    });

    const tokenEncoded = encodeURIComponent(data.token);
    const returnUrl = `https://${shop}/apps/consultant-theme`;
    console.log("returnUrl", process.env.REACT_APP_FRONTEND_URL);
    const callUrl =
      `${"https://test-consultation-app.zend-apps.com"}/video/calling/page` +
      `?callerId=${userId}` +
      `&receiverId=${receiverId}` +
      `&callType=${type || "voice"}` +
      `&uid=${uid}` +
      `&channelName=${channelName}` +
      `&token=${tokenEncoded}` +
      `&userId=${userId}` +
      `&userType=${"client"}` +
      `&returnUrl=${encodeURIComponent(returnUrl)}`;
    // window.top.location.href = callUrl;
    window.open(callUrl, "_blank");
  } catch (error) {
    console.error("🔥 API ERROR:", error.message);
    alert("Call failed. Please try again.");
  }
};
