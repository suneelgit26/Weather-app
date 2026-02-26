// Theme engine - dynamic backgrounds based on weather + day/night

const GRADIENTS = {
    clear: {
        day: "linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)",
        night: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    },
    partly_cloudy: {
        day: "linear-gradient(135deg, #89b4d6 0%, #4a8abf 100%)",
        night: "linear-gradient(135deg, #1a1a3e 0%, #2d3a5c 100%)",
    },
    cloudy: {
        day: "linear-gradient(135deg, #a8b8c8 0%, #667eaa 100%)",
        night: "linear-gradient(135deg, #2c3e50 0%, #3a4a5c 100%)",
    },
    fog: {
        day: "linear-gradient(135deg, #c9d6df 0%, #9caab7 100%)",
        night: "linear-gradient(135deg, #3a4452 0%, #4a5568 100%)",
    },
    drizzle: {
        day: "linear-gradient(135deg, #8e9eab 0%, #6a7f94 100%)",
        night: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
    },
    rain: {
        day: "linear-gradient(135deg, #616d7e 0%, #7b8fa1 100%)",
        night: "linear-gradient(135deg, #1a1a2e 0%, #2d3748 100%)",
    },
    snow: {
        day: "linear-gradient(135deg, #d1dce6 0%, #a8bbd0 100%)",
        night: "linear-gradient(135deg, #2c3e50 0%, #536878 100%)",
    },
    thunderstorm: {
        day: "linear-gradient(135deg, #373b44 0%, #4a6078 100%)",
        night: "linear-gradient(135deg, #0d1117 0%, #1a1a2e 100%)",
    },
};

function getWeatherCategory(code) {
    if (code <= 1) return "clear";
    if (code === 2) return "partly_cloudy";
    if (code === 3) return "cloudy";
    if (code >= 45 && code <= 48) return "fog";
    if (code >= 51 && code <= 57) return "drizzle";
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow";
    if (code >= 95) return "thunderstorm";
    return "cloudy";
}

export function applyTheme(weatherCode, isDay) {
    const category = getWeatherCategory(weatherCode);
    const timeOfDay = isDay ? "day" : "night";
    const gradient = GRADIENTS[category]?.[timeOfDay] || GRADIENTS.clear.day;

    document.body.style.background = gradient;
    document.documentElement.dataset.theme = isDay ? "day" : "night";

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.content = isDay ? "#56CCF2" : "#0f0c29";
    }
}

export function initThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    const saved = localStorage.getItem("theme-override");
    if (saved) {
        document.documentElement.dataset.theme = saved;
        btn.textContent = saved === "night" ? "\u2600\uFE0F" : "\uD83C\uDF19";
    }

    btn.addEventListener("click", () => {
        const current = document.documentElement.dataset.theme;
        const next = current === "night" ? "day" : "night";
        document.documentElement.dataset.theme = next;
        localStorage.setItem("theme-override", next);
        btn.textContent = next === "night" ? "\u2600\uFE0F" : "\uD83C\uDF19";
    });
}

export function getTemperatureClass(temp) {
    if (temp < 0) return "temp-freezing";
    if (temp < 10) return "temp-cold";
    if (temp < 20) return "temp-mild";
    if (temp < 30) return "temp-warm";
    if (temp < 40) return "temp-hot";
    return "temp-extreme";
}

export function getUvClass(uv) {
    if (uv <= 2) return "uv-low";
    if (uv <= 5) return "uv-moderate";
    if (uv <= 7) return "uv-high";
    if (uv <= 10) return "uv-very-high";
    return "uv-extreme";
}

export function getUvLabel(uv) {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
}

export function getAqiInfo(aqi) {
    if (aqi <= 50) return { label: "Good", cssClass: "aqi-good" };
    if (aqi <= 100) return { label: "Moderate", cssClass: "aqi-moderate" };
    if (aqi <= 150) return { label: "Unhealthy (Sensitive)", cssClass: "aqi-unhealthy-sensitive" };
    if (aqi <= 200) return { label: "Unhealthy", cssClass: "aqi-unhealthy" };
    if (aqi <= 300) return { label: "Very Unhealthy", cssClass: "aqi-very-unhealthy" };
    return { label: "Hazardous", cssClass: "aqi-hazardous" };
}

export function getAqiColor(aqi) {
    if (aqi <= 50) return "#22c55e";
    if (aqi <= 100) return "#eab308";
    if (aqi <= 150) return "#f97316";
    if (aqi <= 200) return "#ef4444";
    if (aqi <= 300) return "#7c3aed";
    return "#7f1d1d";
}
