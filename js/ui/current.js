// Current Weather - hero card rendering

import { getWeatherInfo } from "../weather-codes.js";
import { createWeatherIcon } from "./icons.js";
import { getTemperatureClass, getUvClass, getUvLabel } from "../theme.js";
import { escapeHtml, formatTime, getWindDir, detailItem } from "./utils.js";

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
            ${detailItem("Humidity", `${current.relative_humidity_2m}${units.relative_humidity_2m}`)}
            ${detailItem("Dew Point", `${Math.round(current.dew_point_2m)}${units.dew_point_2m}`)}
            ${detailItem("Wind", `${current.wind_speed_10m} ${units.wind_speed_10m} ${getWindDir(current.wind_direction_10m)}`)}
            ${detailItem("Gusts", `${current.wind_gusts_10m} ${units.wind_gusts_10m}`)}
            ${detailItem("UV Index", `<span class="${uvClass}">${current.uv_index} (${uvLabel})</span>`)}
            ${detailItem("Visibility", `${(current.visibility / 1000).toFixed(1)} km`)}
            ${detailItem("Pressure", `${Math.round(current.pressure_msl)} hPa`)}
            ${detailItem("Cloud Cover", `${current.cloud_cover}${units.cloud_cover}`)}
            ${detailItem("Precipitation", `${current.precipitation} ${units.precipitation}`)}
        </div>
    `;

    // Insert animated SVG icon
    const slot = currentEl.querySelector("#current-icon-slot");
    if (slot) {
        slot.appendChild(createWeatherIcon(iconId, 100));
    }

    currentEl.classList.remove("hidden");
}
