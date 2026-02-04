export const getDuration = (start, end) => {
    if (!start || !end) return "00:00";
    const diffMs = new Date(end) - new Date(start);
    if (diffMs <= 0) return "00:00";
    const diff = Math.floor(diffMs / 1000);
    const m = String(Math.floor(diff / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    return `${m}:${s}`;
};