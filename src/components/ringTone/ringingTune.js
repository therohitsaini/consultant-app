let ringtone;

export const initRingtone = () => {
    // Use a free online ringtone that always works
    ringtone = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-classic-alarm-995.mp3");
    ringtone.loop = true;
    console.log("Using online ringtone");
};

export const playRingtone = async () => {
    if (!ringtone) initRingtone();
    
    try {
        ringtone.currentTime = 0;
        await ringtone.play();
        console.log("🎵 Ringtone playing!");
    } catch (e) {
        console.error("Ringtone error:", e);
        
        // Emergency fallback - use browser beep
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        oscillator.frequency.value = 800;
        oscillator.connect(ctx.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 1000);
    }
};

export const stopRingtone = () => {
    if (ringtone) {
        ringtone.pause();
        ringtone.currentTime = 0;
    }
};