// Enhanced 7-Day Forecast

import { getWeatherInfo } from "../weather-codes.js";
import { createWeatherIcon } from "./icons.js";
import { createTemperatureBar } from "./charts.js";
import { getUvClass, getUvLabel } from "../theme.js";

const dailyEl = document.getElementById("daily-forecast");

export function renderDailyForecast(daily, units) {
    const weekLow = Math.min(...daily.temperature_2m_min);
    const weekHigh = Math.max(...daily.temperature_2m_max);

    let html = `<div class="section-title"><span class="section-icon">\uD83D\uDCC5</span> 7-Day Forecast</div>`;
    html += `<div class="daily-list" id="daily-list">`;

    daily.time.forEach((dateStr, i) => {
        const date = new Date(dateStr + "T00:00:00");
        const dayName = i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });
        const { label, iconId } = getWeatherInfo(daily.weather_code[i], true);
        const uvMax = daily.uv_index_max?.[i];
        const uvClass = uvMax != null ? getUvClass(uvMax) : "";
        const uvLbl = uvMax != null ? getUvLabel(uvMax) : "";
        const precipProb = daily.precipitation_probability_max?.[i];
        const sunrise = daily.sunrise?.[i] ? formatTime(daily.sunrise[i]) : "--";
        const sunset = daily.sunset?.[i] ? formatTime(daily.sunset[i]) : "--";

        html += `
            <div class="daily-row" data-idx="${i}">
                <span class="daily-day">${dayName}</span>
                <div class="daily-icon" data-icon="${iconId}" data-size="32"></div>
                <div class="daily-temp-bar-wrapper">
                    <span class="daily-temp-low">${Math.round(daily.temperature_2m_min[i])}\u00B0</span>
                    <div id="daily-bar-${i}" class="daily-temp-bar-slot"></div>
                    <span class="daily-temp-high">${Math.round(daily.temperature_2m_max[i])}\u00B0</span>
                </div>
                <div class="daily-extra">
                    ${precipProb != null ? `<span>\uD83D\uDCA7 ${precipProb}%</span>` : ""}
                </div>
            </div>
            <div class="daily-details hidden" id="daily-details-${i}">
                <div class="daily-details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Condition</span>
                        <span class="detail-value">${label}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Feels Like</span>
                        <span class="detail-value">${Math.round(daily.apparent_temperature_max[i])}\u00B0 / ${Math.round(daily.apparent_temperature_min[i])}\u00B0</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Sunrise</span>
                        <span class="detail-value">${sunrise}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Sunset</span>
                        <span class="detail-value">${sunset}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Sunshine</span>
                        <span class="detail-value">${(daily.sunshine_duration[i] / 3600).toFixed(1)} hrs</span>
                    </div>
                    ${uvMax != null ? `
                    <div class="detail-item">
                        <span class="detail-label">UV Max</span>
                        <span class="detail-value ${uvClass}">${uvMax} (${uvLbl})</span>
                    </div>` : ""}
                    <div class="detail-item">
                        <span class="detail-label">Precipitation</span>
                        <span class="detail-value">${daily.precipitation_sum[i]} ${units.precipitation_sum}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Precip Hours</span>
                        <span class="detail-value">${daily.precipitation_hours[i]} hrs</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Wind Max</span>
                        <span class="detail-value">${daily.wind_speed_10m_max[i]} ${units.wind_speed_10m_max} ${getWindDir(daily.wind_direction_10m_dominant[i])}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Gusts Max</span>
                        <span class="detail-value">${daily.wind_gusts_10m_max[i]} ${units.wind_gusts_10m_max}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Solar Radiation</span>
                        <span class="detail-value">${daily.shortwave_radiation_sum[i]} ${units.shortwave_radiation_sum}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">ET\u2080</span>
                        <span class="detail-value">${daily.et0_fao_evapotranspiration[i]} ${units.et0_fao_evapotranspiration}</span>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    dailyEl.innerHTML = html;

    // Insert icons
    dailyEl.querySelectorAll("[data-icon]").forEach((slot) => {
        slot.appendChild(createWeatherIcon(slot.dataset.icon, parseInt(slot.dataset.size)));
    });

    // Insert temperature bars
    daily.time.forEach((_, i) => {
        const barSlot = dailyEl.querySelector(`#daily-bar-${i}`);
        if (barSlot) {
            barSlot.appendChild(createTemperatureBar(
                daily.temperature_2m_min[i],
                daily.temperature_2m_max[i],
                weekLow, weekHigh
            ));
        }
    });

    // Expand/collapse on click
    dailyEl.querySelectorAll(".daily-row").forEach((row) => {
        row.addEventListener("click", () => {
            const idx = row.dataset.idx;
            const details = dailyEl.querySelector(`#daily-details-${idx}`);
            if (details) {
                details.classList.toggle("hidden");
                row.classList.toggle("expanded");
            }
        });
    });

    dailyEl.classList.remove("hidden");
}

function getWindDir(degrees) {
    if (degrees == null) return "";
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
