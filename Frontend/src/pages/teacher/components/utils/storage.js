// Simple JSON storage helpers

export const save = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const load = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};
