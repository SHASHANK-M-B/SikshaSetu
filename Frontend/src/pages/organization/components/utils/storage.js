// storage.js
// Safe localStorage helper — prevents JSON errors & missing keys

export const storage = {
    get(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (err) {
            console.error("storage.get error:", err);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error("storage.set error:", err);
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (err) {
            console.error("storage.remove error:", err);
        }
    }
};
