import axios from "axios";
import { checkMicPermission } from "../ConsultantCards/ConsultantCards";
import { socket } from "../Sokect-io/SokectConfig";


export const checkUserBalance = async ({ userId, consultantId, type }) => {
    if (!userId || !consultantId) {
        alert("Login to start the call");
        return
    }
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/users/shopify/users/checked-balance/${userId}/${consultantId}`,
            {

                params: {
                    callType: type
                }
            }
        );
        return response.data.data;
    } catch (error) {
        return false;
    }
}


export const openCallPage = async ({ receiverId, type, userId, shop }) => {
    try {
        console.log("receiverId", receiverId);
        console.log("type", type);
        console.log("userId", userId);
        console.log("shop", shop);

        const balance = await checkUserBalance({ userId, consultantId: receiverId, type });
        console.log("balance", balance);

        if (!balance) {
            alert("You have insufficient balance");
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
        console.log("url____generate-token", url);

        console.log("BEFORE FETCH");
        const res = await axios.post(url, {
            channelName,
            uid
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log("BEFORE FETCH");
        console.log("STATUS:", res.data);

        const data = res.data;
        console.log("data____generate-token", data);

        if (!data.token) {
            throw new Error("Token missing from API");
        }

        socket.emit("call-user", {
            callerId: userId,
            receiverId,
            channelName,
            callType: type || "voice",
        });

        const tokenEncoded = encodeURIComponent(data.token);
        const returnUrl = `https://${shop}/apps/consultant-theme`;

        const callUrl =
            `https://test-consultation-app.zend-apps.com/video/calling/page` +
            `?callerId=${userId}` +
            `&receiverId=${receiverId}` +
            `&callType=${type || "voice"}` +
            `&uid=${uid}` +
            `&channelName=${channelName}` +
            `&token=${tokenEncoded}` +
            `&userId=${userId}` +
            `&returnUrl=${encodeURIComponent(returnUrl)}`;

        console.log("callUrl", callUrl);
        window.open(callUrl, "_blank");


    } catch (error) {
        console.error("🔥 API ERROR:", error.message);
        alert("Call failed. Please try again.");
    }
};
