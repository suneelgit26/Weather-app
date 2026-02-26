// Details - Atmosphere, Solar Radiation, Soil Conditions panels

import { createBarChart } from "./charts.js";

const atmosphereEl = document.getElementById("atmosphere");
const solarEl = document.getElementById("solar-radiation");
const soilEl = document.getElementById("soil-conditions");

// ---- Atmosphere ----
export function renderAtmosphere(hourly, hourlyUnits, current, currentUnits) {
    const now = getCurrentHourIndex(hourly);

    const cloudLow = hourly.cloud_cover_low?.[now];
    const cloudMid = hourly.cloud_cover_mid?.[now];
    const cloudHigh = hourly.cloud_cover_high?.[now];
    const freezing = hourly.freezing_level_height?.[now];
    const cape = hourly.cape?.[now];
    const snowDepth = hourly.snow_depth?.[now];
    const evapActual = hourly.evapotranspiration?.[now];
    const evapRef = hourly.et0_fao_evapotranspiration?.[now];

    let html = `<div class="section-title"><span class="section-icon">\uD83C\uDF0D</span> Atmosphere</div>`;
    html += `<div class="detail-panel-grid">`;

    if (current.pressure_msl != null) {
        html += detailItem("Pressure", `${Math.round(current.pressure_msl)} hPa`);
    }
    if (current.surface_pressure != null) {
        html += detailItem("Surface Pressure", `${Math.round(current.surface_pressure)} hPa`);
    }
    if (current.visibility != null) {
        html += detailItem("Visibility", `${(current.visibility / 1000).toFixed(1)} km`);
    }
    if (cloudLow != null) html += detailItem("Clouds Low", `${cloudLow}%`);
    if (cloudMid != null) html += detailItem("Clouds Mid", `${cloudMid}%`);
    if (cloudHigh != null) html += detailItem("Clouds High", `${cloudHigh}%`);
    if (freezing != null) html += detailItem("Freezing Level", `${Math.round(freezing)} m`);
    if (cape != null) html += detailItem("CAPE", `${Math.round(cape)} J/kg`);
    if (snowDepth != null) html += detailItem("Snow Depth", `${snowDepth.toFixed(2)} m`);
    if (evapActual != null) html += detailItem("Evapotranspiration", `${evapActual.toFixed(2)} mm`);
    if (evapRef != null) html += detailItem("ET\u2080 Reference", `${evapRef.toFixed(2)} mm`);

    html += `</div>`;
    atmosphereEl.innerHTML = html;
    atmosphereEl.classList.remove("hidden");
}

// ---- Solar Radiation ----
export function renderSolar(hourly, hourlyUnits, daily, dailyUnits) {
    const now = getCurrentHourIndex(hourly);

    const shortwave = hourly.shortwave_radiation?.[now];
    const direct = hourly.direct_radiation?.[now];
    const diffuse = hourly.diffuse_radiation?.[now];
    const dni = hourly.direct_normal_irradiance?.[now];
    const dailySum = daily.shortwave_radiation_sum?.[0];

    let html = `<div class="section-title"><span class="section-icon">\u2600\uFE0F</span> Solar Radiation</div>`;
    html += `<div class="detail-panel-grid">`;

    if (shortwave != null) html += detailItem("Shortwave", `${Math.round(shortwave)} W/m\u00B2`);
    if (direct != null) html += detailItem("Direct", `${Math.round(direct)} W/m\u00B2`);
    if (diffuse != null) html += detailItem("Diffuse", `${Math.round(diffuse)} W/m\u00B2`);
    if (dni != null) html += detailItem("DNI", `${Math.round(dni)} W/m\u00B2`);
    if (dailySum != null) html += detailItem("Daily Total", `${dailySum.toFixed(1)} ${dailyUnits?.shortwave_radiation_sum || "MJ/m\u00B2"}`);

    html += `</div>`;

    // Hourly radiation chart (today)
    const todayStart = getCurrentDayStartIndex(hourly);
    const todayEnd = Math.min(todayStart + 24, hourly.time.length);
    const radData = (hourly.shortwave_radiation || []).slice(todayStart, todayEnd);

    if (radData.length > 2 && radData.some((v) => v > 0)) {
        html += `<div class="subsection-label">Today's Radiation</div>`;
        html += `<div id="solar-chart-slot" style="height:60px;margin-top:var(--space-sm)"></div>`;
    }

    solarEl.innerHTML = html;

    // Insert chart
    const chartSlot = solarEl.querySelector("#solar-chart-slot");
    if (chartSlot && radData.length > 2) {
        const labels = [];
        for (let i = todayStart; i < todayEnd; i++) {
            const t = new Date(hourly.time[i]);
            labels.push(t.toLocaleTimeString("en-US", { hour: "numeric" }));
        }
        chartSlot.appendChild(createBarChart(radData, {
            width: 500,
            height: 60,
            color: "#fbbf24",
            labels,
        }));
    }

    solarEl.classList.remove("hidden");
}

// ---- Soil Conditions ----
export function renderSoil(hourly, hourlyUnits) {
    const now = getCurrentHourIndex(hourly);

    const temps = [
        { depth: "Surface", key: "soil_temperature_0cm" },
        { depth: "6 cm", key: "soil_temperature_6cm" },
        { depth: "18 cm", key: "soil_temperature_18cm" },
        { depth: "54 cm", key: "soil_temperature_54cm" },
    ];

    const moistures = [
        { depth: "0-1 cm", key: "soil_moisture_0_to_1cm" },
        { depth: "1-3 cm", key: "soil_moisture_1_to_3cm" },
        { depth: "3-9 cm", key: "soil_moisture_3_to_9cm" },
        { depth: "9-27 cm", key: "soil_moisture_9_to_27cm" },
        { depth: "27-81 cm", key: "soil_moisture_27_to_81cm" },
    ];

    let html = `<div class="section-title"><span class="section-icon">\uD83C\uDF31</span> Soil Conditions</div>`;

    // Temperature
    html += `<div class="subsection-label">Temperature</div>`;
    html += `<div class="depth-chart">`;
    temps.forEach(({ depth, key }) => {
        const val = hourly[key]?.[now];
        if (val == null) return;
        const unit = hourlyUnits?.[key] || "\u00B0C";
        const pct = Math.min(100, Math.max(5, ((val + 10) / 50) * 100));
        html += `
            <div class="depth-row">
                <span class="depth-label">${depth}</span>
                <div class="depth-bar-track">
                    <div class="depth-bar-fill" style="width:${pct}%;background:linear-gradient(to right,#60a5fa,#f97316)"></div>
                </div>
                <span class="depth-value">${val.toFixed(1)}${unit}</span>
            </div>
        `;
    });
    html += `</div>`;

    // Moisture
    html += `<div class="subsection-label">Moisture</div>`;
    html += `<div class="depth-chart">`;
    moistures.forEach(({ depth, key }) => {
        const val = hourly[key]?.[now];
        if (val == null) return;
        const unit = hourlyUnits?.[key] || "m\u00B3/m\u00B3";
        const pct = Math.min(100, Math.max(5, (val / 0.5) * 100));
        html += `
            <div class="depth-row">
                <span class="depth-label">${depth}</span>
                <div class="depth-bar-track">
                    <div class="depth-bar-fill" style="width:${pct}%;background:linear-gradient(to right,#67e8f9,#3b82f6)"></div>
                </div>
                <span class="depth-value">${val.toFixed(3)} ${unit}</span>
            </div>
        `;
    });
    html += `</div>`;

    soilEl.innerHTML = html;
    soilEl.classList.remove("hidden");
}

// ---- Helpers ----
function detailItem(label, value) {
    return `
        <div class="detail-item">
            <span class="detail-label">${label}</span>
            <span class="detail-value">${value}</span>
        </div>
    `;
}

function getCurrentHourIndex(hourly) {
    const now = new Date();
    for (let i = 0; i < hourly.time.length; i++) {
        if (new Date(hourly.time[i]) >= now) {
            return Math.max(0, i - 1);
        }
    }
    return 0;
}

function getCurrentDayStartIndex(hourly) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < hourly.time.length; i++) {
        if (new Date(hourly.time[i]) >= today) return i;
    }
    return 0;
}
