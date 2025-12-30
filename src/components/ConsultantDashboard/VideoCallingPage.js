import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './VideoCallingPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { endCall, startCall, toggleMute, toggleVideo } from '../Redux/slices/callSlice';
import { initRingtone, playRingtone } from '../ringTone/ringingTune';

function VideoCallingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // Refs for video elements
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // State
    const [callerDetails, setCallerDetails] = useState(null);
    const [callerId, setCallerId] = useState(null);

    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const receiverId = params.get("receiverId");
    const callType = params.get("callType") || "voice";
    const token = params.get("token") ? decodeURIComponent(params.get("token")) : null;
    const channelNameParam = params.get("channelName");
    const callerIdParam = params.get("callerId");
    const uidParam = params.get("uid");
    const appIdParam = params.get("appId");



    // Redux state
    const { inCall, channel, type, muted, videoEnabled } = useSelector((state) => state.call);

    // Determine if this is a video call from URL or Redux state
    const isVideoCall = type === "video" || callType === "video";

    // Initialize caller ID
    useEffect(() => {
        const callerIdFromStorage = localStorage.getItem("client_u_Identity");
        const finalCallerId = callerIdParam || callerIdFromStorage;
        setCallerId(finalCallerId);
    }, [callerIdParam]);

    // Start call when component mounts
    useEffect(() => {
        if (token && channelNameParam && uidParam) {
            const appId = appIdParam || "656422a01e774a4ba5b2dc0ac12e5fe5";
            console.log(`Starting ${callType} call:`, { token, channel: channelNameParam, uid: uidParam, appId });

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

    // Setup local video track when call type is video - Always show for both caller and receiver
    useEffect(() => {
        if (isVideoCall) {
            let isPlaying = false;
            let attempts = 0;
            const maxAttempts = 40; // Check for 20 seconds

            const checkAndPlayLocalVideo = () => {
                if (isPlaying) return; // Already playing, stop checking

                import('../Redux/slices/callSlice').then((module) => {
                    const track = module.getLocalVideoTrack();
                    if (track && localVideoRef.current) {
                        try {
                            track.play(localVideoRef.current).then(() => {
                                console.log("Local video playing successfully");
                                isPlaying = true;
                                attempts = maxAttempts; // Stop checking once playing
                            }).catch(err => {
                                console.error("Error playing local video:", err);
                                // Keep trying
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

            // Check immediately and periodically
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

    // Setup remote video track - check more aggressively
    useEffect(() => {
        if (isVideoCall && inCall) {
            let attempts = 0;
            const maxAttempts = 20; // Check for 10 seconds (20 * 500ms)

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
                            attempts = maxAttempts; // Stop checking once playing
                        } catch (error) {
                            console.error("Error playing remote video:", error);
                        }
                    }
                });
            };

            // Check immediately and then periodically
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

    // Listen for custom events when videos are ready
    useEffect(() => {
        const handleRemoteVideoReady = () => {
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
                                // Retry after delay
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
        window.addEventListener('local-video-ready', handleLocalVideoReady);

        return () => {
            window.removeEventListener('remote-video-ready', handleRemoteVideoReady);
            window.removeEventListener('local-video-ready', handleLocalVideoReady);
        };
    }, []);


    // Fetch caller details
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

    const profileImage = callerDetails?.receiver?.profileImage
        ? `${process.env.REACT_APP_BACKEND_HOST}/${callerDetails.receiver.profileImage.replace("\\", "/")}`
        : null;

    // Handlers
    const handleEndCall = () => {
        dispatch(endCall());
        const returnUrl = params.get("returnUrl");
        if (returnUrl) {
            window.top.location.href = decodeURIComponent(returnUrl);
        } else {
            navigate(-1);
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
                            {/* {conversation.isOnline ? 'Online' : 'Offline'} */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Area */}
            <div className={styles.videoArea}>
                {/* Remote Video (Other Person) - Full Screen */}
                <div className={styles.remoteVideo}>
                    {isVideoCall ? (
                        <>
                            <div
                                ref={remoteVideoRef}
                                data-remote-video
                                className={styles.videoElement}
                            />
                            {/* Fallback placeholder if remote video not available yet */}
                            {!inCall && (
                                <div className={styles.videoPlaceholder}>
                                    {profileImage && (
                                        <div className={styles.avatarLarge}>
                                            <img className={styles.avatarLarge} src={profileImage} alt="profile" />
                                        </div>
                                    )}
                                    <p className={styles.videoPlaceholderText}>
                                        {callerDetails?.receiver?.fullname || "Waiting for video..."}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.videoPlaceholder}>
                            {profileImage && (
                                <div className={styles.avatarLarge}>
                                    <img className={styles.avatarLarge} src={profileImage} alt="profile" />
                                </div>
                            )}
                            <p className={styles.videoPlaceholderText}>
                                {callerDetails?.receiver?.fullname || "Calling..."}
                            </p>
                            <p className={styles.videoPlaceholderText}>
                                {inCall ? "In Call" : "Connecting..."}
                            </p>
                            <p className={styles.videoPlaceholderText}>
                                {type === "voice" ? "Voice Call" : "Video Call"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Local Video (You) - Small Corner Overlay - Always show for video calls */}
                {isVideoCall && (
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

            {/* Call Controls */}
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

