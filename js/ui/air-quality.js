// Air Quality - AQI gauge, pollutants, pollen

import { getAqiInfo, getAqiColor } from "../theme.js";
import { createArcGauge, createSparkline } from "./charts.js";

const aqEl = document.getElementById("air-quality");

export function renderAirQuality(data) {
    if (!data || !data.current) {
        aqEl.classList.add("hidden");
        return;
    }

    const current = data.current;
    const units = data.current_units || {};
    const usAqi = current.us_aqi;
    const euAqi = current.european_aqi;
    const aqiVal = usAqi ?? euAqi ?? 0;
    const { label: aqiLabel, cssClass } = getAqiInfo(aqiVal);
    const aqiColor = getAqiColor(aqiVal);

    let html = `<div class="section-title"><span class="section-icon">\uD83C\uDF2C\uFE0F</span> Air Quality</div>`;

    // AQI Header with gauge
    html += `
        <div class="aqi-header">
            <div class="aqi-gauge-container" id="aqi-gauge-slot"></div>
            <div class="aqi-info">
                <div class="aqi-value ${cssClass}">${aqiVal}</div>
                <div class="aqi-label ${cssClass}">${aqiLabel}</div>
                ${usAqi != null ? `<div class="aqi-sublabel">US AQI: ${usAqi}</div>` : ""}
                ${euAqi != null ? `<div class="aqi-sublabel">EU AQI: ${euAqi}</div>` : ""}
            </div>
        </div>
    `;

    // Pollutants
    const pollutants = [
        { key: "pm2_5", name: "PM2.5" },
        { key: "pm10", name: "PM10" },
        { key: "ozone", name: "O\u2083" },
        { key: "nitrogen_dioxide", name: "NO\u2082" },
        { key: "sulphur_dioxide", name: "SO\u2082" },
        { key: "carbon_monoxide", name: "CO" },
    ];

    html += `<div class="pollutant-grid">`;
    pollutants.forEach(({ key, name }) => {
        const val = current[key];
        if (val == null) return;
        const unit = units[key] || "";
        html += `
            <div class="pollutant-item">
                <div class="pollutant-name">${name}</div>
                <div class="pollutant-value">${typeof val === "number" ? val.toFixed(1) : val}</div>
                <div class="pollutant-unit">${unit}</div>
            </div>
        `;
    });
    html += `</div>`;

    // Pollen section
    const pollenTypes = [
        { key: "grass_pollen", name: "Grass" },
        { key: "birch_pollen", name: "Birch" },
        { key: "alder_pollen", name: "Alder" },
        { key: "ragweed_pollen", name: "Ragweed" },
        { key: "mugwort_pollen", name: "Mugwort" },
        { key: "olive_pollen", name: "Olive" },
    ];

    // Check hourly for pollen data
    const hourly = data.hourly || {};
    const hasPollenData = pollenTypes.some(({ key }) => {
        const arr = hourly[key];
        return arr && arr.some((v) => v != null && v > 0);
    });

    if (hasPollenData) {
        html += `
            <div class="pollen-section">
                <div class="subsection-label">Pollen</div>
                <div class="pollen-grid">
        `;
        pollenTypes.forEach(({ key, name }) => {
            const arr = hourly[key];
            if (!arr) return;
            // Use current hour value or first non-null
            const val = arr.find((v) => v != null && v > 0) ?? 0;
            const level = getPollenLevel(val);
            html += `
                <div class="pollen-item">
                    <div class="pollen-name">${name}</div>
                    <div class="pollen-value">${Math.round(val)}</div>
                    <div class="badge ${level.badge}">${level.label}</div>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    // AQI trend sparkline
    if (data.hourly?.us_aqi || data.hourly?.european_aqi) {
        html += `<div style="margin-top: var(--space-md)"><div class="subsection-label">24h AQI Trend</div><div id="aqi-sparkline-slot"></div></div>`;
    }

    aqEl.innerHTML = html;

    // Insert gauge
    const gaugeSlot = aqEl.querySelector("#aqi-gauge-slot");
    if (gaugeSlot) {
        gaugeSlot.appendChild(createArcGauge(aqiVal, 300, aqiColor));
    }

    // Insert sparkline
    const sparkSlot = aqEl.querySelector("#aqi-sparkline-slot");
    if (sparkSlot) {
        const aqiData = (data.hourly.us_aqi || data.hourly.european_aqi || []).slice(0, 48).filter((v) => v != null);
        if (aqiData.length > 2) {
            sparkSlot.appendChild(createSparkline(aqiData, aqiColor));
        }
    }

    aqEl.classList.remove("hidden");
}

function getPollenLevel(val) {
    if (val <= 0) return { label: "None", badge: "" };
    if (val < 20) return { label: "Low", badge: "badge-good" };
    if (val < 80) return { label: "Moderate", badge: "badge-moderate" };
    return { label: "High", badge: "badge-poor" };
}
