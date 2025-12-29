import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AgoraRTC from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let localAudioTrack = null;
let localVideoTrack = null;

export const startVoiceCall = createAsyncThunk(
    "call/startVoice",
    async ({ token, channel, uid }, { rejectWithValue }) => {
        try {
            console.log("startVoiceCall______", token, channel, uid, process.env.REACT_APP_AGORA_APP_ID)
            await client.join(process.env.REACT_APP_AGORA_APP_ID, channel, token, uid);

            localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            await client.publish([localAudioTrack]);

            return { channel, type: "voice" };
        } catch (error) {
            console.error("START VOICE CALL FAILED", error);
            return rejectWithValue(error.message);
        }
    }   
);


export const startVideoCall = createAsyncThunk(
    "call/startVideo",
    async ({ token, channel, uid }) => {
        await client.join(process.env.REACT_APP_AGORA_APP_ID, channel, token, uid);

        [localAudioTrack, localVideoTrack] =
            await AgoraRTC.createMicrophoneAndCameraTracks();

        await client.publish([localAudioTrack, localVideoTrack]);

        return { channel, type: "video" };
    }
);

export const endCall = createAsyncThunk(
    "call/end",
    async () => {
        localAudioTrack?.stop();
        localAudioTrack?.close();

        localVideoTrack?.stop();
        localVideoTrack?.close();

        await client.leave();
    }
);

const callSlice = createSlice({
    name: "call",
    initialState: {
        inCall: false,
        channel: null,
        type: null,
        muted: false,
    },
    reducers: {
        toggleMute: state => {
            state.muted = !state.muted;
            localAudioTrack?.setEnabled(!state.muted);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(startVoiceCall.fulfilled, (state, action) => {
                state.inCall = true;
                state.channel = action.payload.channel;
                state.type = "voice";
            })
            .addCase(startVideoCall.fulfilled, (state, action) => {
                state.inCall = true;
                state.channel = action.payload.channel;
                state.type = "video";
            })
            .addCase(endCall.fulfilled, state => {
                state.inCall = false;
                state.channel = null;
                state.type = null;
                state.muted = false;
            });
    },
});

export const { toggleMute } = callSlice.actions;
export default callSlice.reducer;
