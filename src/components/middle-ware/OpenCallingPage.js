import axios from "axios";
import { checkMicPermission } from "../ConsultantCards/ConsultantCards";
import { socket } from "../Sokect-io/SokectConfig";


const checkUserBalance = async ({ userId, consultantId, type }) => {
    if (!userId || !consultantId) {
        alert("Login to start the call");
        return
    }
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/users/shopify/users/checked-balance/${userId}/${consultantId}`,);
        return response.data.data;
    } catch (error) {
        return false;
    }
}


export const openCallPage = async ({ receiverId, type, userId, shop }) => {
    const balance = await checkUserBalance({ userId, consultantId: receiverId, type: type });
    if (!balance) {
        alert("You have insufficient balance to consult with this consultant");
        return;
    }
    const hasMicPermission = await checkMicPermission();
    if (!hasMicPermission) {
        alert("Please grant microphone permission to start the call");
        return;
    }
    const channelName = `channel-${userId.slice(-6)}-${receiverId.slice(-6)}`;
    const uid = Math.floor(Math.random() * 1000000);
    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/call/generate-token`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ channelName, uid }),
    });
    const data = await res.json();
    if (data.token) {

        socket.emit("call-user", {
            callerId: userId,
            receiverId,
            channelName: channelName,
            callType: type || "voice",
        });

        const tokenEncoded = encodeURIComponent(data.token);
        const appIdParam = data.appId ? `&appId=${data.appId}` : '';
        const returnUrl = `https://${shop}/apps/consultant-theme`;
        const returnUrlEncoded = process.env.REACT_FRONTEND_URL
        const callUrl =
            `${"https://focusing-monkey-home-calendar.trycloudflare.com"}/video/calling/page` +
            `?callerId=${userId}` +
            `&receiverId=${receiverId}` +
            `&callType=${type || "voice"}` +
            `&uid=${uid}` +
            `&channelName=${channelName}` +
            `&token=${tokenEncoded}` +
            appIdParam +
            `&userId=${userId}` +
            `&returnUrl=${encodeURIComponent(returnUrl)}`;
        console.log("callUrl", callUrl);
        window.top.location.href = callUrl;
    }

    // if (type === "voice") {
    //     await dispatch(
    //         startVoiceCall({
    //             token: data.token,
    //             channel: "123",
    //             uid: 1,
    //             appId: "AGORA_APP_ID",
    //         })
    //     );
    // }

    // if (type === "video") {
    //     await dispatch(
    //         startVideoCall({
    //             token: data.token,
    //             channel: "123",
    //             uid: 1,
    //             appId: "AGORA_APP_ID",
    //         })
    //     );
    // }

    // navigate("/call");
};