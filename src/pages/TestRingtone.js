import React, { useEffect, useRef } from "react";

export default function TestRingtone({ incomingCall }) {
    const ringtoneRef = useRef(null);

    const playRingtone = () => {
        if (!ringtoneRef.current) return;

        ringtoneRef.current
            .play()
            .then(() => {
                console.log("🔔 Ringtone playing");
            })
            .catch((err) => {
                console.log("❌ Play blocked:", err);
            });
    };
    useEffect(() => {
        if (incomingCall) {
            playRingtone();
        } else {
            stopRingtone();
        }
    }, [incomingCall]);

    const stopRingtone = () => {
        if (!ringtoneRef.current) return;

        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
    };

    return (
        <>
            {/* Audio element */}
            <audio
                ref={ringtoneRef}
                src="/sounds/discord_incoming_call.mp3"
                loop
                preload="auto"
            />

            {/* Buttons */}
            {/* <button onClick={playRingtone}>Play Ring</button>
            <button onClick={stopRingtone}>Stop Ring</button> */}
        </>
    );
}
