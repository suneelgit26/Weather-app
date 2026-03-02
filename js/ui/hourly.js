// Hourly Forecast - 24h scrollable timeline + temperature chart

import { getWeatherInfo } from "../weather-codes.js";
import { createWeatherIcon } from "./icons.js";
import { createLineChart } from "./charts.js";
import { getCurrentHourIndex } from "./utils.js";

const hourlyEl = document.getElementById("hourly-forecast");

export function renderHourlyForecast(hourly, units) {
    const startIdx = getCurrentHourIndex(hourly);
    const endIdx = Math.min(startIdx + 24, hourly.time.length);
    const slice = { start: startIdx, end: endIdx };

    // Title
    let html = `<div class="section-title"><span class="section-icon">\u23F0</span> Hourly Forecast</div>`;

    // Scrollable timeline
    html += `<div class="hourly-scroll" id="hourly-scroll">`;
    for (let i = slice.start; i < slice.end; i++) {
        const time = new Date(hourly.time[i]);
        const isDay = !!hourly.is_day[i];
        const { iconId } = getWeatherInfo(hourly.weather_code[i], isDay);
        const isNow = i === startIdx;
        const hour = time.toLocaleTimeString("en-US", { hour: "numeric" });
        const precipProb = hourly.precipitation_probability?.[i];

        html += `
            <div class="hourly-item ${isNow ? "is-now" : ""}">
                <span class="hourly-time">${isNow ? "Now" : hour}</span>
                <div class="hourly-icon" data-icon="${iconId}" data-size="32"></div>
                <span class="hourly-temp">${Math.round(hourly.temperature_2m[i])}\u00B0</span>
                ${precipProb != null && precipProb > 0 ? `<span class="hourly-precip">\uD83D\uDCA7 ${precipProb}%</span>` : ""}
            </div>
        `;
    }
    html += `</div>`;

    // Temperature chart
    html += `<div class="hourly-chart-container" id="hourly-chart-slot"></div>`;

    hourlyEl.innerHTML = html;

    // Insert icons
    hourlyEl.querySelectorAll("[data-icon]").forEach((slot) => {
        const icon = createWeatherIcon(slot.dataset.icon, parseInt(slot.dataset.size));
        slot.appendChild(icon);
    });

    // Insert temperature line chart
    const temps = [];
    const labels = [];
    for (let i = slice.start; i < slice.end; i++) {
        temps.push(hourly.temperature_2m[i]);
        const t = new Date(hourly.time[i]);
        labels.push(t.toLocaleTimeString("en-US", { hour: "numeric" }));
    }

    const chartSlot = hourlyEl.querySelector("#hourly-chart-slot");
    if (chartSlot && temps.length > 1) {
        const containerWidth = chartSlot.clientWidth || Math.min(window.innerWidth - 24, 600);
        const chart = createLineChart(temps, {
            width: Math.max(containerWidth, temps.length * 25),
            height: 100,
            color: "#60a5fa",
            labels,
            showDots: true,
            showArea: true,
        });
        chartSlot.appendChild(chart);
    }

    hourlyEl.classList.remove("hidden");
}
