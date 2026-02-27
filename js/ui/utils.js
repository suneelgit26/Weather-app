// Shared UI utility functions

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Format an ISO date string to a localized time (e.g. "6:30 AM")
 */
export function formatTime(isoStr) {
    try {
        const d = new Date(isoStr);
        return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } catch {
        return isoStr;
    }
}

/**
 * Convert wind direction degrees to compass abbreviation
 */
export function getWindDir(degrees) {
    if (degrees == null) return "";
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(degrees / 45) % 8];
}

/**
 * Find the index in hourly.time closest to the current time
 */
export function getCurrentHourIndex(hourly) {
    const now = new Date();
    for (let i = 0; i < hourly.time.length; i++) {
        if (new Date(hourly.time[i]) >= now) {
            return Math.max(0, i - 1);
        }
    }
    return 0;
}

/**
 * Find the index of the start of today in hourly data
 */
export function getCurrentDayStartIndex(hourly) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < hourly.time.length; i++) {
        if (new Date(hourly.time[i]) >= today) return i;
    }
    return 0;
}

/**
 * Generate HTML for a detail item (label + value)
 */
export function detailItem(label, value) {
    return `
        <div class="detail-item">
            <span class="detail-label">${label}</span>
            <span class="detail-value">${value}</span>
        </div>
    `;
}
