import { checkMicPermission } from "../ConsultantCards/ConsultantCards";
import { socket } from "../Sokect-io/SokectConfig";




export const openCallPage = async ({ receiverId, type, userId, shop }) => {
    console.log("openCallPage_________________", receiverId, type, userId, shop);
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
    console.log("data", data)
    if (data.token) {
        socket.emit("call-user", {
            callerId: userId,
            receiverId: receiverId,
            channelName,
            callType: type || "voice",
        });
        const tokenEncoded = encodeURIComponent(data.token);
        const appIdParam = data.appId ? `&appId=${data.appId}` : '';
        const returnUrl = `https://${shop}/apps/consultant-theme`;
        const returnUrlEncoded = process.env.REACT_FRONTEND_URL
        console.log("returnUrlEncoded", returnUrlEncoded);
        const callUrl =
            `${process.env.REACT_FRONTEND_URL}/video/calling/page` +
            `?callerId=${userId}` +
            `&receiverId=${receiverId}` +
            `&callType=${type || "voice"}` +
            `&uid=${uid}` +
            `&channelName=${channelName}` +
            `&token=${tokenEncoded}` +
            appIdParam +
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