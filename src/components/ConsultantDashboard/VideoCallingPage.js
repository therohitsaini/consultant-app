import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styles from './VideoCallingPage.module.css';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useDispatch, useSelector } from 'react-redux';
import { endCall, startVoiceCall } from '../Redux/slices/callSlice';

function VideoCallingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isAudioCall, setIsAudioCall] = useState(false);
    const [callingUser, setCallingUser] = useState("calling.....");
    const [callerDetails, setCallerDetails] = useState(null);
    const [callerId, setCallerId] = useState(null);
    const dispatch = useDispatch();

    if (navigator.permissions.query({ name: "microphone" }).state === "denied") {
        console.error("Permission denied");
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const consultantId = params.get("consultantId");
        const shopId = params.get("shopId");
        console.log("consultantId:", consultantId);
        console.log("shopId:", shopId);
    }, []);
    useEffect(() => {
        const callerId = localStorage.getItem("client_u_Identity");
        console.log("callerId:", callerId);
        setCallerId(callerId);
    }, []);


    const params = new URLSearchParams(window.location.search);
    console.log("params:", params);
    const receiverId = params.get("receiverId");
    const callType = params.get("callType");
    const token = decodeURIComponent(params.get("token"));
    const channelNameParam = params.get("channelName");
    const callerIdParam = params.get("callerId");
    const uidParam = params.get("uid");
    console.log("receiverId:", receiverId);
    console.log("callType:", callType);
    console.log("token:", token);
    console.log("channelName:", channelNameParam);
    console.log("callerId:", callerIdParam);
    console.log("uid:", uidParam);


    const { inCall, channel, type, muted } = useSelector((state) => state.call);
    useEffect(() => {

        console.log("startVoiceCallButton______", token, channelNameParam, uidParam, process.env.REACT_APP_AGORA_APP_ID)
        dispatch(startVoiceCall({
            token: token, channel: channelNameParam, uid: uidParam, appId: "656422a01e774a4ba5b2dc0ac12e5fe5"
        }));
    }, [token, channelNameParam, uidParam]);









    const conversation = location.state?.conversation || {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'SJ',
        isOnline: true,
        callingUser: callingUser
    };


    const handleEndCall = () => {
        dispatch(endCall());
        navigate(-1);
    };

    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
    };

    const handleVideoToggle = () => {
        setIsVideoOff(!isVideoOff);
    };

    const handleAudioCallToggle = () => {
        setIsAudioCall(!isAudioCall);
    };


    const getCallingUser = async () => {
        const url = `${process.env.REACT_APP_BACKEND_HOST}/api/call/get-caller-receiver-details/${"69328ff18736b56002ef83df"}/${"691eafcff95528ab305eba59"}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        console.log("data:", data);
        if (data?.success) {
            setCallerDetails(data?.payload);
        }
    }
    useEffect(() => {
        getCallingUser();
    }, [callerIdParam, receiverId]);

    const profileImage = `${process.env.REACT_APP_BACKEND_HOST}/${callerDetails?.receiver?.profileImage?.replace("\\", "/")}`;



    return (
        <div className={styles.videoCallContainer}>
            {/* Header */}
            <div className={styles.callHeader}>
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
                        <img className={styles.callAvatar} src={profileImage} alt="profile" />
                    </div>
                    <div>
                        <div className={styles.callName}>{callerDetails?.receiver?.fullname}</div>
                        <div className={styles.callStatus}>
                            {conversation.isOnline ? 'Online' : 'Offline'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Area */}
            <div className={styles.videoArea}>
                {/* Remote Video (Other Person) */}
                <div className={styles.remoteVideo}>
                    <div className={styles.videoPlaceholder}>
                        <div className={styles.avatarLarge}>
                            <img className={styles.avatarLarge} src={profileImage} alt="profile" />
                        </div>
                        <p className={styles.videoPlaceholderText}>{callerDetails?.receiver?.fullname}</p>
                        <p className={styles.videoPlaceholderText}>{conversation.callingUser}</p>
                        <p className={styles.videoPlaceholderText}>{inCall ? "In Call" : "Not in Call"}</p>
                        <p className={styles.videoPlaceholderText}>{channel}</p>
                        <p className={styles.videoPlaceholderText}>{type}</p>
                        <p className={styles.videoPlaceholderText}>{muted ? "Muted" : "Unmuted"}</p>
                    </div>
                    {/* <p onClick={startVoiceCallButton} className={styles.videoPlaceholderText}>startVoiceCallButton:</p> */}

                </div>

                {/* Local Video (You) */}
                <div className={styles.localVideo}>
                    <div className={styles.videoPlaceholderSmall}>
                        <div className={styles.avatarSmall}>
                            You
                        </div>
                    </div>
                </div>
            </div>

            {/* Call Controls */}
            <div className={styles.callControls}>
                <button
                    className={`${styles.controlButton} ${isMuted ? styles.controlButtonActive : ''}`}
                    title={isMuted ? "Unmute" : "Mute"}
                    onClick={handleMuteToggle}
                >
                    {isMuted ? (
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
                <button
                    className={`${styles.controlButton} ${isVideoOff ? styles.controlButtonActive : ''}`}
                    title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
                    onClick={handleVideoToggle}
                >
                    {isVideoOff ? (
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
                <button
                    className={`${styles.controlButton} ${isAudioCall ? styles.controlButtonActive : ''}`}
                    title={isAudioCall ? "Switch to Video Call" : "Switch to Audio Call"}
                    onClick={handleAudioCallToggle}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                </button>
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

