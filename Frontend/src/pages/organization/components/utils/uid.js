// uid.js
// Simple unique ID generator for frontend-only usage

export function uid(prefix = "id") {
    return `${prefix}-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`;
}
