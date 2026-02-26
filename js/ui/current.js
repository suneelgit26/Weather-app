// Current Weather - hero card rendering

import { getWeatherInfo } from "../weather-codes.js";
import { createWeatherIcon } from "./icons.js";
import { getTemperatureClass, getUvClass, getUvLabel } from "../theme.js";

const currentEl = document.getElementById("current-weather");

export function renderCurrentWeather(current, units, daily, cityName) {
    const isDay = !!current.is_day;
    const { label, iconId } = getWeatherInfo(current.weather_code, isDay);
    const tempClass = getTemperatureClass(current.temperature_2m);
    const uvClass = getUvClass(current.uv_index);
    const uvLabel = getUvLabel(current.uv_index);

    const sunrise = daily.sunrise?.[0] ? formatTime(daily.sunrise[0]) : "--";
    const sunset = daily.sunset?.[0] ? formatTime(daily.sunset[0]) : "--";

    currentEl.innerHTML = `
        <div class="current-hero">
            <div class="current-city">${escapeHtml(cityName)}</div>
            <div class="current-icon" id="current-icon-slot"></div>
            <div class="current-temp ${tempClass}">${Math.round(current.temperature_2m)}${units.temperature_2m}</div>
            <div class="current-feels">Feels like ${Math.round(current.apparent_temperature)}${units.apparent_temperature}</div>
            <div class="current-condition">${label}</div>
            <div class="current-sun">
                <span>\u2600\uFE0F ${sunrise}</span>
                <span>\uD83C\uDF19 ${sunset}</span>
            </div>
        </div>
        <div class="detail-grid">
            <div class="detail-item">
                <span class="detail-label">Humidity</span>
                <span class="detail-value">${current.relative_humidity_2m}${units.relative_humidity_2m}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Dew Point</span>
                <span class="detail-value">${Math.round(current.dew_point_2m)}${units.dew_point_2m}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Wind</span>
                <span class="detail-value">${current.wind_speed_10m} ${units.wind_speed_10m} ${getWindDir(current.wind_direction_10m)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Gusts</span>
                <span class="detail-value">${current.wind_gusts_10m} ${units.wind_gusts_10m}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">UV Index</span>
                <span class="detail-value ${uvClass}">${current.uv_index} (${uvLabel})</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Visibility</span>
                <span class="detail-value">${(current.visibility / 1000).toFixed(1)} km</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Pressure</span>
                <span class="detail-value">${Math.round(current.pressure_msl)} hPa</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Cloud Cover</span>
                <span class="detail-value">${current.cloud_cover}${units.cloud_cover}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Precipitation</span>
                <span class="detail-value">${current.precipitation} ${units.precipitation}</span>
            </div>
        </div>
    `;

    // Insert animated SVG icon
    const slot = currentEl.querySelector("#current-icon-slot");
    if (slot) {
        slot.appendChild(createWeatherIcon(iconId, 100));
    }

    currentEl.classList.remove("hidden");
}

function getWindDir(degrees) {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(degrees / 45) % 8];
}

function formatTime(isoStr) {
    try {
        const d = new Date(isoStr);
        return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } catch {
        return isoStr;
    }
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
