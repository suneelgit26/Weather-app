const WEATHER_CODES = {
    0:  { label: "Clear sky",              emoji: "\u2600\uFE0F",   icon: "clear" },
    1:  { label: "Mainly clear",           emoji: "\uD83C\uDF24\uFE0F",  icon: "clear" },
    2:  { label: "Partly cloudy",          emoji: "\u26C5",      icon: "partly-cloudy" },
    3:  { label: "Overcast",               emoji: "\u2601\uFE0F",   icon: "cloudy" },
    45: { label: "Fog",                    emoji: "\uD83C\uDF2B\uFE0F",  icon: "fog" },
    48: { label: "Depositing rime fog",    emoji: "\uD83C\uDF2B\uFE0F",  icon: "fog" },
    51: { label: "Light drizzle",          emoji: "\uD83C\uDF26\uFE0F",  icon: "drizzle" },
    53: { label: "Moderate drizzle",       emoji: "\uD83C\uDF26\uFE0F",  icon: "drizzle" },
    55: { label: "Dense drizzle",          emoji: "\uD83C\uDF27\uFE0F",  icon: "rain" },
    56: { label: "Freezing drizzle",       emoji: "\uD83C\uDF27\uFE0F",  icon: "sleet" },
    57: { label: "Heavy freezing drizzle", emoji: "\uD83C\uDF27\uFE0F",  icon: "sleet" },
    61: { label: "Slight rain",            emoji: "\uD83C\uDF27\uFE0F",  icon: "rain" },
    63: { label: "Moderate rain",          emoji: "\uD83C\uDF27\uFE0F",  icon: "rain" },
    65: { label: "Heavy rain",             emoji: "\uD83C\uDF27\uFE0F",  icon: "heavy-rain" },
    66: { label: "Freezing rain",          emoji: "\uD83C\uDF27\uFE0F",  icon: "sleet" },
    67: { label: "Heavy freezing rain",    emoji: "\uD83C\uDF27\uFE0F",  icon: "sleet" },
    71: { label: "Slight snow",            emoji: "\uD83C\uDF28\uFE0F",  icon: "snow" },
    73: { label: "Moderate snow",          emoji: "\uD83C\uDF28\uFE0F",  icon: "snow" },
    75: { label: "Heavy snow",             emoji: "\u2744\uFE0F",   icon: "heavy-snow" },
    77: { label: "Snow grains",            emoji: "\u2744\uFE0F",   icon: "snow" },
    80: { label: "Slight rain showers",    emoji: "\uD83C\uDF26\uFE0F",  icon: "drizzle" },
    81: { label: "Moderate rain showers",  emoji: "\uD83C\uDF27\uFE0F",  icon: "rain" },
    82: { label: "Violent rain showers",   emoji: "\u26C8\uFE0F",   icon: "heavy-rain" },
    85: { label: "Slight snow showers",    emoji: "\uD83C\uDF28\uFE0F",  icon: "snow" },
    86: { label: "Heavy snow showers",     emoji: "\uD83C\uDF28\uFE0F",  icon: "heavy-snow" },
    95: { label: "Thunderstorm",           emoji: "\u26C8\uFE0F",   icon: "thunderstorm" },
    96: { label: "Thunderstorm with slight hail", emoji: "\u26C8\uFE0F", icon: "thunderstorm" },
    99: { label: "Thunderstorm with heavy hail",  emoji: "\u26C8\uFE0F", icon: "thunderstorm" },
};

export function getWeatherInfo(code, isDay = true) {
    const info = WEATHER_CODES[code] || { label: "Unknown", emoji: "\u2753", icon: "unknown" };
    const base = info.icon;

    let iconId = base;
    if (base === "clear") {
        iconId = isDay ? "clear-day" : "clear-night";
    } else if (base === "partly-cloudy") {
        iconId = isDay ? "partly-cloudy-day" : "partly-cloudy-night";
    }

    return { label: info.label, emoji: info.emoji, iconId };
}
