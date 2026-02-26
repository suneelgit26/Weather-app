const GEO_BASE = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";

export async function searchCities(name) {
    const url = `${GEO_BASE}?name=${encodeURIComponent(name)}&count=5&language=en`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding request failed (${res.status})`);
    const data = await res.json();
    return data.results || [];
}

export async function getWeather(latitude, longitude) {
    const params = new URLSearchParams({
        latitude,
        longitude,
        current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
        forecast_days: "7",
        timezone: "auto",
    });
    const res = await fetch(`${WEATHER_BASE}?${params}`);
    if (!res.ok) throw new Error(`Weather request failed (${res.status})`);
    return res.json();
}
