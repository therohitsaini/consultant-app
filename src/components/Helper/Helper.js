export const getDuration = (start, end) => {
    if (!start || !end) return "00:00";
    const diffMs = new Date(end) - new Date(start);
    if (diffMs <= 0) return "00:00";
    const diff = Math.floor(diffMs / 1000);
    const m = String(Math.floor(diff / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    return `${m}:${s}`;
};


export const formatAmountHelper = (num) => {
    if (!num) return "0";
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return Number(num.toFixed(2)).toString();
};