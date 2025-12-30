import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AgoraRTC from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let localAudioTrack = null;
let localVideoTrack = null;
let remoteAudioTrack = null;
let remoteVideoTrack = null;

// Export functions to get tracks for video rendering
export const getLocalVideoTrack = () => localVideoTrack;
export const getRemoteVideoTrack = () => remoteVideoTrack;

// Unified call function that handles both voice and video
export const startCall = createAsyncThunk(
    "call/startCall",
    async ({ token, channel, uid, appId, callType = "voice" }, { rejectWithValue }) => {
        try {
            const numericUid = typeof uid === 'string' ? parseInt(uid) : uid;
            const agoraAppId = appId || process.env.REACT_APP_AGORA_APP_ID;
            
            console.log(`Starting ${callType} call:`, { 
                channel, 
                uid: numericUid, 
                appId: agoraAppId,
                tokenLength: token?.length,
                callType 
            });
            
            if (!agoraAppId) {
                throw new Error("Agora App ID is required");
            }
            
            if (!token) {
                throw new Error("Token is required");
            }
            
            if (!channel) {
                throw new Error("Channel name is required");
            }

            // Leave existing connection if any
            if (client.connectionState !== "DISCONNECTED" && client.connectionState !== "DISCONNECTING") {
                console.log("Leaving existing connection...");
                try {
                    await client.leave();
                } catch (leaveError) {
                    console.warn("Error leaving previous connection:", leaveError);
                }
            }

            // Join channel
            console.log("Joining channel...", { 
                appId: agoraAppId, 
                channel, 
                uid: numericUid,
                tokenPreview: token?.substring(0, 20) + "..."
            });
            
            try {
                await client.join(agoraAppId, channel, token, numericUid);
                console.log("Joined channel successfully. Connection state:", client.connectionState);
                console.log("Local UID after join:", client.uid);
            } catch (joinError) {
                console.error("Failed to join channel:", joinError);
                throw new Error(`Failed to join channel: ${joinError.message}`);
            }

            // Create and publish tracks based on call type
            if (callType === "video") {
                console.log("Creating video tracks...");
                try {
                    [localAudioTrack, localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                    console.log("Video tracks created successfully");
                    
                    // Ensure tracks are enabled before publishing
                    if (localAudioTrack) localAudioTrack.setEnabled(true);
                    if (localVideoTrack) localVideoTrack.setEnabled(true);
                    
                    console.log("Publishing video tracks...");
                    await client.publish([localAudioTrack, localVideoTrack]);
                    console.log("Published local audio and video tracks successfully");
                    console.log("Published tracks status:", {
                        audio: localAudioTrack?.isPlaying || false,
                        video: localVideoTrack?.isPlaying || false
                    });
                    
                    // Try to play local video immediately if element exists - Multiple attempts
                    const playLocalVideo = () => {
                        const localVideoElement = document.querySelector('[data-local-video]');
                        if (localVideoElement && localVideoTrack) {
                            localVideoTrack.play(localVideoElement).then(() => {
                                console.log("Local video playing on element successfully");
                            }).catch(err => {
                                console.error("Error playing local video:", err);
                            });
                        }
                    };
                    
                    // Try multiple times with delays
                    setTimeout(playLocalVideo, 100);
                    setTimeout(playLocalVideo, 500);
                    setTimeout(playLocalVideo, 1000);
                    
                    // Dispatch event for component to handle
                    window.dispatchEvent(new Event('local-video-ready'));
                } catch (trackError) {
                    console.error("Error creating/publishing video tracks:", trackError);
                    throw new Error(`Failed to create video tracks: ${trackError.message}`);
                }
            } else {
                console.log("Creating audio track...");
                try {
                    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                    console.log("Audio track created successfully");
                    
                    // Ensure track is enabled before publishing
                    if (localAudioTrack) localAudioTrack.setEnabled(true);
                    
                    console.log("Publishing audio track...");
                    await client.publish([localAudioTrack]);
                    console.log("Published local audio track successfully");
                    console.log("Audio track status:", localAudioTrack?.isPlaying || false);
                } catch (trackError) {
                    console.error("Error creating/publishing audio track:", trackError);
                    throw new Error(`Failed to create audio track: ${trackError.message}`);
                }
            }
            
            // Verify tracks are published and enabled
            const publishedTracks = client.localTracks;
            console.log("Local tracks published:", publishedTracks.length);
            
            // Ensure tracks are enabled
            if (localAudioTrack) {
                localAudioTrack.setEnabled(true);
                console.log("Local audio track enabled:", localAudioTrack.isPlaying);
            }
            if (localVideoTrack) {
                localVideoTrack.setEnabled(true);
                console.log("Local video track enabled:", localVideoTrack.isPlaying);
            }
            
            // Verify connection state
            console.log("Final connection state:", client.connectionState);
            console.log("Channel name:", channel);
            console.log("Local UID:", client.uid);

            // Setup event listeners for remote users
            const handleUserPublished = async (user, mediaType) => {
                console.log(`Remote user published ${mediaType}. User UID:`, user.uid);
                try {
                    if (mediaType === "audio") {
                        remoteAudioTrack = await client.subscribe(user, mediaType);
                        await remoteAudioTrack.play();
                        console.log("Playing remote audio successfully");
                    } else if (mediaType === "video") {
                        remoteVideoTrack = await client.subscribe(user, mediaType);
                        console.log("Remote video track subscribed successfully");
                        
                        // Try to play immediately and also dispatch event
                        const playRemoteVideo = () => {
                            const remoteVideoElement = document.querySelector('[data-remote-video]');
                            if (remoteVideoElement && remoteVideoTrack) {
                                remoteVideoTrack.play(remoteVideoElement).then(() => {
                                    console.log("Playing remote video on element successfully");
                                }).catch(err => {
                                    console.error("Error playing remote video:", err);
                                });
                            }
                        };
                        
                        // Try immediately
                        setTimeout(playRemoteVideo, 100);
                        
                        // Also try after a delay
                        setTimeout(playRemoteVideo, 500);
                        setTimeout(playRemoteVideo, 1000);
                        
                        // Dispatch custom event to notify component
                        window.dispatchEvent(new Event('remote-video-ready'));
                    }
                } catch (error) {
                    console.error(`Error handling remote ${mediaType}:`, error);
                }
            };
            
            // Listen for user-joined event
            client.on("user-joined", (user) => {
                console.log("User joined channel. UID:", user.uid);
            });
            
            // Listen for connection state changes
            client.on("connection-state-change", (curState, revState) => {
                console.log("Connection state changed:", { from: revState, to: curState });
            });

            const handleUserUnpublished = async (user, mediaType) => {
                if (mediaType === "audio") {
                    console.log("Remote user unpublished audio");
                    remoteAudioTrack?.stop();
                    remoteAudioTrack = null;
                } else if (mediaType === "video") {
                    console.log("Remote user unpublished video");
                    remoteVideoTrack?.stop();
                    remoteVideoTrack = null;
                }
            };

            // Remove old listeners and add new ones
            client.off("user-published", handleUserPublished);
            client.off("user-unpublished", handleUserUnpublished);
            client.on("user-published", handleUserPublished);
            client.on("user-unpublished", handleUserUnpublished);

            console.log(`${callType} call setup complete`);
            return { channel, type: callType };
        } catch (error) {
            console.error(`START ${callType.toUpperCase()} CALL FAILED:`, error);
            return rejectWithValue(error.message);
        }
    }
);

// Legacy functions for backward compatibility
export const startVoiceCall = createAsyncThunk(
    "call/startVoice",
    async (params, { dispatch }) => {
        return dispatch(startCall({ ...params, callType: "voice" })).unwrap();
    }
);

export const startVideoCall = createAsyncThunk(
    "call/startVideo",
    async (params, { dispatch }) => {
        return dispatch(startCall({ ...params, callType: "video" })).unwrap();
    }
);

export const endCall = createAsyncThunk(
    "call/end",
    async () => {
        // Stop and cleanup remote tracks
        remoteAudioTrack?.stop();
        remoteAudioTrack = null;
        remoteVideoTrack?.stop();
        remoteVideoTrack = null;

        // Stop and cleanup local tracks
        localAudioTrack?.stop();
        localAudioTrack?.close();
        localAudioTrack = null;

        localVideoTrack?.stop();
        localVideoTrack?.close();
        localVideoTrack = null;

        // Leave channel
        await client.leave();
        console.log("Call ended and cleaned up");
    }
);

const callSlice = createSlice({
    name: "call",
    initialState: {
        inCall: false,
        channel: null,
        type: null,
        muted: false,
        videoEnabled: true,
    },
    reducers: {
        toggleMute: state => {
            state.muted = !state.muted;
            localAudioTrack?.setEnabled(!state.muted);
        },
        toggleVideo: state => {
            state.videoEnabled = !state.videoEnabled;
            localVideoTrack?.setEnabled(state.videoEnabled);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(startCall.pending, (state) => {
                console.log("Call pending...");
            })
            .addCase(startCall.fulfilled, (state, action) => {
                console.log("Call fulfilled:", action.payload);
                state.inCall = true;
                state.channel = action.payload.channel;
                state.type = action.payload.type;
                state.videoEnabled = action.payload.type === "video";
            })
            .addCase(startCall.rejected, (state, action) => {
                console.error("Call rejected:", action.payload);
                state.inCall = false;
                state.channel = null;
                state.type = null;
            })
            .addCase(startVoiceCall.fulfilled, (state, action) => {
                state.inCall = true;
                state.channel = action.payload.channel;
                state.type = "voice";
            })
            .addCase(startVideoCall.fulfilled, (state, action) => {
                state.inCall = true;
                state.channel = action.payload.channel;
                state.type = "video";
                state.videoEnabled = true;
            })
            .addCase(endCall.fulfilled, state => {
                state.inCall = false;
                state.channel = null;
                state.type = null;
                state.muted = false;
                state.videoEnabled = true;
            });
    },
});

export const { toggleMute, toggleVideo } = callSlice.actions;
export default callSlice.reducer;
