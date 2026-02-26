// =============================================
// STREAK STORE — localStorage-backed client state
// =============================================

export interface TakenState {
    date: string;        // YYYY-MM-DD
    takenIds: string[];  // dose IDs marked taken today
}

const KEY = "medichain_streak";
const NOTE_KEY = "medichain_notifications";

function today(): string {
    return new Date().toISOString().slice(0, 10);
}

export function getStoredTaken(): TakenState {
    if (typeof window === "undefined") return { date: today(), takenIds: [] };
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return { date: today(), takenIds: [] };
        const parsed: TakenState = JSON.parse(raw);
        // Reset if it's a new day
        if (parsed.date !== today()) return { date: today(), takenIds: [] };
        return parsed;
    } catch {
        return { date: today(), takenIds: [] };
    }
}

export function markDoseTaken(doseId: string): TakenState {
    const current = getStoredTaken();
    if (current.takenIds.includes(doseId)) return current;
    const updated: TakenState = { ...current, takenIds: [...current.takenIds, doseId] };
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
}

export function getNotificationsEnabled(): boolean {
    if (typeof window === "undefined") return true;
    const v = localStorage.getItem(NOTE_KEY);
    return v === null ? true : v === "true";
}

export function setNotificationsEnabled(enabled: boolean): void {
    localStorage.setItem(NOTE_KEY, String(enabled));
}
