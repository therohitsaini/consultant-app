import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './VideoCallingPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { endCall, startCall, toggleMute, toggleVideo } from '../Redux/slices/callSlice';
import { initRingtone, playRingtone, stopRingtone } from '../ringTone/ringingTune';
import { getSocket, socket } from '../Sokect-io/SokectConfig';
import axios from 'axios';
import profileImageDefault from '../../../src/assets/avatar-or-person-sign-profile-picture-portrait-icon-user-profile-symbol.webp';
function VideoCallingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [callerDetails, setCallerDetails] = useState(null);
    const [callerId, setCallerId] = useState(null);
    const [callSession, setCallSession] = useState(null);
    const [callSessionEnded, setCallSessionEnded] = useState(false);
    const { callEnded } = useSelector((state) => state.socket);
    const params = new URLSearchParams(window.location.search);
    const receiverId = params.get("receiverId");
    const callType = params.get("callType") || "video";
    console.log("callType___Current", callType);
    const token = params.get("token") ? decodeURIComponent(params.get("token")) : null;
    const channelNameParam = params.get("channelName");
    const callerIdParam = params.get("callerId");
    const uidParam = params.get("uid");
    const appIdParam = params.get("appId");
    const userId = params.get("userId");
    const shopId = params.get("shopId");
    const userType = params.get("userType")
    console.log("userType", userType);
    const [callAccepted, setCallAccepted] = useState(null);
    const callStartedRef = useRef(false);
    const { inCall, channel, type, muted, videoEnabled } = useSelector((state) => state.call);
    const isVideoCall = callType === "video";
    const { callRejected } = useSelector((state) => state.socket);
    const [bothUserJoined, setBothUserJoined] = useState(false);
    const [time, setTime] = useState({ minutes: 0, seconds: 0 });
    const intervalRef = useRef(null);
    const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [firstTime, setFirstTime] = useState(false);
    console.log("transactionId", transactionId);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "Call is running. Are you sure?";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);


    useEffect(() => {
        localStorage.setItem("userId", userId);
        const callAcceptedFromStorage = JSON.parse(localStorage.getItem("callAccepted") || null);
        setCallAccepted(callAcceptedFromStorage);
    }, [userId]);
    useEffect(() => {
        const callerIdFromStorage = localStorage.getItem("client_u_Identity");
        const finalCallerId = callerIdParam || callerIdFromStorage;
        setCallerId(finalCallerId);
    }, [callerIdParam]);

    // get call session from server

    const getCallSession = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/api/users/find-call-session`,
                {
                    params: {
                        userId,
                        channelName: channelNameParam
                    }
                }
            );
            if (response.status === 200) {
                setCallSession(response.data.data);
                localStorage.setItem("callSession", JSON.stringify(response.data.data));
            }
        } catch (error) {
            console.error("Error fetching call session:", error);
        }
    };
    useEffect(() => {
        getCallSession();
    }, [callType]);


    const menualTimeUpdate = () => {
        if (userType === "client") {
            const id = localStorage.getItem("endFromClient") || null;
            socket.emit("user-connected-time-updated", {
                callerId: callerIdParam,
                receiverId: receiverId,
                channelName: channelNameParam,
                callType: callType,
                startedAt: Date.now(),
                transactionId: id,
            });
            console.log("menualTimeUpdate", transactionId);
        }
    }

    // register user

    useEffect(() => {
        if (!userId) return;
        const socket = getSocket();
        socket.connect();
        socket.on("connect", () => {
            socket.emit("register", userId);
            console.log("✅ User registered from call page:", userId);
        });

        return () => {
            socket.off("connect");
        };
    }, [userId]);

    useEffect(() => {
        if (callRejected) {
            handleEndCall();
        }
    }, [callRejected]);





    useEffect(() => {
        const socket = getSocket();
        const userId = localStorage.getItem("client_u_Identity");

        if (!socket.connected) {
            socket.connect();
            socket.emit("register", userId);
        }
    }, []);



    useEffect(() => {
        if (userType === "consultant") {
            const data = {
                callerId: callerIdParam, receiverId: receiverId, channelName: channelNameParam, callType
            }
            socket.emit("user-is-on", data)
        }
        startTimer(Date.now());
    }, [userType])

    useEffect(() => {
        const socket = getSocket();
        const handleBothUserJoin = (data) => {
            console.log("✅ both-user-join received:", data);
            setBothUserJoined(true);
            setCallAccepted(true);
            startTimer(Date.now());
        };
        socket.on("both-user-join", handleBothUserJoin);
        return () => {
            socket.off("both-user-join", handleBothUserJoin);
        };
    }, []);

    useEffect(() => {
        const socket = getSocket();

        const handleAutoCallEnd = (data) => {
            console.log("🔥 autoCallEnded-no-balance received:", data);
            alert("❌ Balance khatam ho gaya, call end ho gayi");

        };

        socket.on("autoCallEnded-no-balance", handleAutoCallEnd);

        return () => {
            socket.off("autoCallEnded-no-balance", handleAutoCallEnd);
        };
    }, []);

    useEffect(() => {
        const socket = getSocket();
        const handleBothUpdateTime = (data) => {
            console.log("🔥 call-accepted-started received:", data);
            const startedAt = data?.startedAt;
            startTimer(startedAt != null ? startedAt : undefined);
            localStorage.setItem("endFromClient", JSON.stringify(data?.transactionId));
            setTransactionId(data?.transactionId);
            socket.emit("user-connected-time-updated", {
                callerId: callerIdParam,
                receiverId: receiverId,
                channelName: channelNameParam,
                callType: callType,
                startedAt: Date.now(),
                transactionId: data?.transactionId,
            });

        };
        socket.on("call-accepted-started", handleBothUpdateTime);

        return () => {
            socket.off("call-accepted-started", handleBothUpdateTime);
        };
    }, []);

    useEffect(() => {
        //     if (firstTime && userType === "client") {
        const handleFirstTime = () => {
            console.log("firstTime", firstTime);

            const callSession = JSON.parse(localStorage.getItem("callSession"));
            const transactionId_ = callSession?.transtionId;

            const socket = getSocket();

            socket.emit("user-connected-time-updated", {
                callerId: callerIdParam,
                receiverId: receiverId,
                channelName: channelNameParam,
                callType: callType,
                startedAt: Date.now(),
                transactionId:
                    localStorage.getItem("endFromClient") ||
                    transactionId ||
                    transactionId_,
            });

            console.log(
                "transactionId_____handleFirstTime",
                localStorage.getItem("endFromClient") ||
                transactionId ||
                transactionId_
            );
        };
        if (firstTime && userType === "client") {
            handleFirstTime();
        }
    }, [firstTime]);

    useEffect(() => {
        const socket = getSocket();
        const handleBothUpdateTime = (data) => {
            console.log("🔥 user-available received:", data);

            startTimer(Date.now());
        };

        socket.on("user-available-start-timer", handleBothUpdateTime);

        return () => {
            socket.off("user-available-start-timer", handleBothUpdateTime);
        };
    }, []);


    useEffect(() => {
        if (!callerId || !receiverId || !channelNameParam || !callType) return;

        const callKey = `call_started_${channelNameParam}`;
        console.log("callKey", callKey);
        console.log("effect triggered");

        if (sessionStorage.getItem(callKey)) return;

        console.log("calling user");
        console.log("effect triggered");
        sessionStorage.setItem(callKey, "true");

    }, [callerId, receiverId, channelNameParam, callType]);


    useEffect(() => {
        if (callStartedRef.current) return;
        if (token && channelNameParam && uidParam) {
            const appId = appIdParam
            // || "656422a01e774a4ba5b2dc0ac12e5fe5";
            callStartedRef.current = true;
            dispatch(startCall({
                token: token,
                channel: channelNameParam,
                uid: uidParam,
                appId: appId,
                callType: callType
            })).unwrap().then((result) => {
                console.log(`${callType} call started successfully:`, result);
            }).catch((error) => {
                console.error(`${callType} call failed:`, error);
            });
            initRingtone();
            playRingtone();
        }
    }, [dispatch, token, channelNameParam, uidParam, appIdParam, callType]);

    useEffect(() => {
        if (isVideoCall) {
            let isPlaying = false;
            let attempts = 0;
            const maxAttempts = 40;

            const checkAndPlayLocalVideo = () => {
                if (isPlaying) return;

                import('../Redux/slices/callSlice').then((module) => {
                    const track = module.getLocalVideoTrack();
                    if (track && localVideoRef.current) {
                        try {
                            track.play(localVideoRef.current).then(() => {
                                console.log("Local video playing successfully");
                                isPlaying = true;
                                attempts = maxAttempts;
                            }).catch(err => {
                                console.error("Error playing local video:", err);
                            });
                        } catch (error) {
                            console.error("Error playing local video:", error);
                        }
                    } else {
                        if (attempts < 10) {
                            console.log("Waiting for local video track...", {
                                hasTrack: !!track,
                                hasElement: !!localVideoRef.current,
                                inCall: inCall,
                                type: type
                            });
                        }
                    }
                });
            };

            checkAndPlayLocalVideo();
            const interval = setInterval(() => {
                if (!isPlaying) {
                    checkAndPlayLocalVideo();
                }
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                }
            }, 500);

            return () => {
                clearInterval(interval);
                isPlaying = false;
            };
        }
    }, [isVideoCall, inCall, type]);

    useEffect(() => {
        if (isVideoCall && inCall) {
            let attempts = 0;
            const maxAttempts = 20;

            const checkAndPlayRemoteVideo = () => {
                if (!remoteVideoRef.current) {
                    attempts++;
                    if (attempts < maxAttempts) {
                        return;
                    }
                }

                import('../Redux/slices/callSlice').then((module) => {
                    const track = module.getRemoteVideoTrack();
                    if (track && remoteVideoRef.current) {
                        try {
                            track.play(remoteVideoRef.current);
                            console.log("Remote video playing on element");
                            attempts = maxAttempts;
                        } catch (error) {
                            console.error("Error playing remote video:", error);
                        }
                    }
                });
            };

            checkAndPlayRemoteVideo();
            const interval = setInterval(() => {
                checkAndPlayRemoteVideo();
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                }
            }, 500);

            return () => clearInterval(interval);
        }
    }, [isVideoCall, inCall]);

    useEffect(() => {
        const handleRemoteVideoReady = () => {
            setHasRemoteVideo(true);
            if (remoteVideoRef.current) {
                import('../Redux/slices/callSlice').then((module) => {
                    const track = module.getRemoteVideoTrack();
                    if (track) {
                        track.play(remoteVideoRef.current).then(() => {
                            console.log("Remote video played via event");
                        }).catch(err => {
                            console.error("Error playing remote video via event:", err);
                        });
                    }
                });
            }
        };

        const handleRemoteVideoStopped = () => {
            setHasRemoteVideo(false);
        };

        const handleLocalVideoReady = () => {
            console.log("Local video ready event received");
            const tryPlayLocalVideo = () => {
                if (localVideoRef.current) {
                    import('../Redux/slices/callSlice').then((module) => {
                        const track = module.getLocalVideoTrack();
                        if (track) {
                            track.play(localVideoRef.current).then(() => {
                                console.log("Local video played via event successfully");
                            }).catch(err => {
                                console.error("Error playing local video via event:", err);
                                setTimeout(tryPlayLocalVideo, 500);
                            });
                        } else {
                            console.log("Local video track not available, retrying...");
                            setTimeout(tryPlayLocalVideo, 500);
                        }
                    });
                } else {
                    console.log("Local video element not ready, retrying...");
                    setTimeout(tryPlayLocalVideo, 500);
                }
            };
            tryPlayLocalVideo();
        };

        window.addEventListener('remote-video-ready', handleRemoteVideoReady);
        window.addEventListener('remote-video-stopped', handleRemoteVideoStopped);
        window.addEventListener('local-video-ready', handleLocalVideoReady);

        return () => {
            window.removeEventListener('remote-video-ready', handleRemoteVideoReady);
            window.removeEventListener('remote-video-stopped', handleRemoteVideoStopped);
            window.removeEventListener('local-video-ready', handleLocalVideoReady);
        };
    }, []);

    // When user turns camera ON, play local video on the element
    useEffect(() => {
        if (isVideoCall && videoEnabled && localVideoRef.current) {
            import('../Redux/slices/callSlice').then((module) => {
                const track = module.getLocalVideoTrack();
                if (track) {
                    track.play(localVideoRef.current).then(() => {
                        console.log("Local video playing after camera turned on");
                    }).catch(err => console.error("Error playing local video after enable:", err));
                }
            });
        }
    }, [isVideoCall, videoEnabled]);

    // Reset remote video state when call ends
    useEffect(() => {
        if (!inCall) setHasRemoteVideo(false);
    }, [inCall]);


    const getCallingUser = async () => {
        const finalCallerId = callerIdParam || callerId;
        if (!finalCallerId || !receiverId) return;
        try {
            const url = `${process.env.REACT_APP_BACKEND_HOST}/api/call/get-caller-receiver-details/${finalCallerId}/${receiverId}`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data?.success) {
                setCallerDetails(data?.payload);
            }
        } catch (error) {
            console.error("Failed to fetch caller details:", error);
        }
    };

    useEffect(() => {
        getCallingUser();
    }, [callerIdParam, callerId, receiverId]);

    const getProfileImageUrl = () => {
        const imagePath = userType === "client"
            ? callerDetails?.receiver?.profileImage
            : callerDetails?.caller?.profileImage;

        if (imagePath) {
            return `${process.env.REACT_APP_BACKEND_HOST}/${imagePath.replace("\\", "/")}`;
        }
        return profileImageDefault;
    };

    const profileImage = callerDetails?.receiver?.profileImage
        ? `${process.env.REACT_APP_BACKEND_HOST}/${callerDetails.receiver.profileImage.replace("\\", "/")}`
        : null;

    const stopTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        localStorage.removeItem("callStartTime");
        setTime({ minutes: 0, seconds: 0 });
    };

    const handleEndCall = () => {
        const endFromClient = localStorage.getItem("endFromClient") || null;
        if (endFromClient) {
            console.log("transactionId", transactionId);
            stopTimer();
            dispatch(endCall());
            setCallSessionEnded(true);
            localStorage.removeItem("callStartTime");

            socket.emit("call-ended",
                {
                    callerId: callerIdParam,
                    receiverId: receiverId,
                    channelName: channelNameParam,
                    callType: callType,
                    transactionId: endFromClient,
                    shopId: shopId || "690c374f605cb8b946503ccb",
                    endby: "user_cut_call"
                });
            localStorage.removeItem("endFromClient");
            localStorage.removeItem("callAccepted");
            const returnUrl = params.get("returnUrl");
            if (returnUrl) {
                window.top.location.href = decodeURIComponent(returnUrl);
            }
        } else if (callSession) {
            dispatch(endCall());
            stopTimer();
            setCallSessionEnded(true);

            setTimeout(() => {
                socket.emit("call-ended", {
                    callerId: callSession?.callerId,
                    receiverId: receiverId,
                    channelName: channelNameParam,
                    callType: callSession?.callType,
                    // transactionId: callSession?.transtionId,
                    shopId: callSession?.shopId || "690c374f605cb8b946503ccb",
                    dtn_: "CUT FROM CONSULTANT SIDE",
                    endby: "consultant_cut_call" // 👈 backend ke liye clear rakho
                });

                console.log("⏱️ call-ended emitted after 1 second (CONSULTANT)");
            }, 1000);

            localStorage.removeItem("callStartTime");
            localStorage.removeItem("endFromClient");

            const returnUrl = params.get("returnUrl");
            if (returnUrl) {
                window.top.location.href = decodeURIComponent(returnUrl);
            }

        }
        else {
            dispatch(endCall());
            localStorage.removeItem("callStartTime");
            localStorage.removeItem("endFromClient");
            const returnUrl = params.get("returnUrl");
            if (returnUrl) {
                window.top.location.href = decodeURIComponent(returnUrl);
            } else {
                navigate(-1);
            }
            return;
        }

    };

    const handleMuteToggle = () => {
        dispatch(toggleMute());
    };

    const handleVideoToggle = () => {
        if (isVideoCall) {
            dispatch(toggleVideo());
        }
    };
    useEffect(() => {
        if (callEnded?.callId) {
            handleEndCall();
        }
    }, [callEnded]);

    console.log("callEnded", callEnded);
    console.log("callerDetails", callerDetails);

    useEffect(() => {
        const onRemoteLeft = (e) => {
            console.log("🔥 Remote user left — ending call immediately", e?.detail);
            handleEndCall();
            stopRingtone()
        };

        window.addEventListener("remote-user-left", onRemoteLeft);
        return () => {
            window.removeEventListener("remote-user-left", onRemoteLeft);
        };
    }, []);




    const startTimer = (optionalStartTimestamp) => {
        let startTime = optionalStartTimestamp != null
            ? Number(optionalStartTimestamp)
            : parseInt(localStorage.getItem("callStartTime"), 10);
        if (!startTime || isNaN(startTime)) {
            startTime = Date.now();
        }
        localStorage.setItem("callStartTime", String(startTime));

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        const tick = () => {
            const now = Date.now();
            const diff = Math.floor((now - startTime) / 1000);
            setTime({
                minutes: Math.floor(diff / 60),
                seconds: diff % 60,
            });
        };
        tick(); // update immediately
        intervalRef.current = setInterval(tick, 1000);
    };
    // Consultant/receiver timer starts only when we get synced startedAt via socket (call-accepted-started or both-user-join)

    useEffect(() => {
        const timerHandler = (event) => {
            const eventTimestamp = event.detail?.startedAt || Date.now();
            console.log("🔥 Call timer start event received - starting timer:", eventTimestamp);
            startTimer(eventTimestamp);

            if (userType === "client") {
                getSocket().emit("both-update-time", {
                    callerId: callerIdParam,
                    receiverId: receiverId,
                    channelName: channelNameParam,
                    callType: callType,
                    startedAt: eventTimestamp,
                });
            }
            setFirstTime(true);
        };

        const connectedHandler = (event) => {
            const eventTimestamp = event.detail?.at || Date.now();
            console.log("🔥 Call connected event received - starting timer:", eventTimestamp);
            startTimer(eventTimestamp);
            if (userType === "client") {
                getSocket().emit("both-update-time", {
                    callerId: callerIdParam,
                    receiverId: receiverId,
                    channelName: channelNameParam,
                    callType: callType,
                    startedAt: eventTimestamp,
                });
            }
        };

        window.addEventListener("call-timer-start", timerHandler);
        window.addEventListener("call-connected", connectedHandler);

        if (window.callAlreadyConnected) {
            const storedStartTime = localStorage.getItem("callStartTime");
            if (storedStartTime) {
                startTimer(parseInt(storedStartTime, 10));
            } else {
                startTimer();
            }
        }

        return () => {
            window.removeEventListener("call-timer-start", timerHandler);
            window.removeEventListener("call-connected", connectedHandler);
        };
    }, [userType, callerIdParam, receiverId, channelNameParam, callType]);



    return (
        <div className={styles.videoCallContainer}>

            <div className={styles.callHeader}>
                <div className={styles.callHeaderLeft}>
                    <button
                        className={styles.backButton}
                        onClick={handleEndCall}
                        aria-label="End call"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className={styles.callInfo}>

                        <div className={styles.callAvatar}>
                            <img className={styles.callAvatar} src={getProfileImageUrl()} alt="profile" />
                        </div>
                        <div>
                            <div className={styles.callName}>{userType === "client" ? callerDetails?.receiver?.fullname : callerDetails?.caller?.fullname}</div>
                            <div className={styles.callStatus}>
                                {/* {conversation.isOnline ? 'Online' : 'Offline'} */}
                            </div>

                        </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'white' }}> Voice Call</div>
                </div>
                {time && (
                    <div className={styles.callHeaderRight}>
                        <div className={styles.callTimer}>
                            {String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.videoArea}>
                <div className={styles.remoteVideo}>
                    {isVideoCall ? (
                        <>
                            <div
                                ref={remoteVideoRef}
                                data-remote-video
                                className={styles.videoElement}
                                style={{ display: hasRemoteVideo ? 'block' : 'none' }}
                            />
                            {
                                (!inCall || (inCall && !hasRemoteVideo)) && (
                                    <div className={styles.videoPlaceholder}>
                                        <div className={styles.avatarLarge}>
                                            <img className={styles.avatarLarge} src={getProfileImageUrl()} alt="profile" />
                                        </div>
                                        <p className={styles.videoPlaceholderText}>
                                            {!inCall
                                                ? (userType === "client" ? callerDetails?.receiver?.fullname : callerDetails?.caller?.fullname || "Waiting for video...")
                                                : (userType === "client" ? callerDetails?.receiver?.fullname : callerDetails?.caller?.fullname) + " (Camera off)"}
                                        </p>
                                    </div>
                                )}
                        </>
                    ) : (
                        <div className={styles.videoPlaceholder}>
                            <div className={styles.avatarLarge}>
                                <img className={styles.avatarLarge} src={getProfileImageUrl()} alt="profile" />
                            </div>
                            <p className={styles.videoPlaceholderText}>
                                {userType === "client" ? callerDetails?.receiver?.fullname : callerDetails?.caller?.fullname || "Calling..."}
                            </p>

                            {
                                callRejected || callSessionEnded ?
                                    <p className={styles.videoPlaceholderText} style={{ color: 'red' }}>
                                        {callSessionEnded ? "Call Ended" : "Call Rejected"}
                                    </p>
                                    :
                                    <>
                                        <p className={styles.videoPlaceholderText}>
                                            {
                                                time ? <p style={{ color: 'white', fontSize: '12px', }}>
                                                    {time.minutes}: {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
                                                </p>

                                                    : null}


                                        </p>
                                        <p style={{ fontSize: '12px', color: 'white' }}>
                                            {callType === "voice" ? "Voice Call" : "Video Call"}
                                        </p>
                                    </>
                            }

                        </div>
                    )}
                </div>

                {
                    isVideoCall && (
                        <div className={styles.localVideo}>
                            <div
                                ref={localVideoRef}
                                data-local-video
                                className={styles.videoElement}
                                style={{
                                    display: videoEnabled ? 'block' : 'none',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                            <div
                                className={styles.videoPlaceholderSmall}
                                style={{ display: !videoEnabled ? 'flex' : 'none' }}
                            >
                                <div className={styles.avatarSmall}>
                                    You
                                </div>
                                <p className={styles.videoPlaceholderTextSmall}>Camera Off</p>
                            </div>
                        </div>
                    )}
            </div>

            <div className={styles.callControls}>
                <button
                    className={`${styles.controlButton} ${muted ? styles.controlButtonActive : ''}`}
                    title={muted ? "Unmute" : "Mute"}
                    onClick={handleMuteToggle}
                >
                    {muted ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        </svg>
                    )}
                </button>
                {isVideoCall && (
                    <button
                        className={`${styles.controlButton} ${!videoEnabled ? styles.controlButtonActive : ''}`}
                        title={videoEnabled ? "Turn Off Camera" : "Turn On Camera"}
                        onClick={handleVideoToggle}
                    >
                        {!videoEnabled ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 7l-7 5 7 5V7z" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 7l-7 5 7 5V7z" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                        )}
                    </button>
                )}
                <button className={`${styles.controlButton} ${styles.endCallButton}`} onClick={handleEndCall} title="End Call">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default VideoCallingPage;

