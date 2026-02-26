// Marine Conditions - wave, swell, wind wave data

const marineEl = document.getElementById("marine");

export function renderMarine(data) {
    if (!data || !data.current) {
        marineEl.classList.add("hidden");
        return;
    }

    const current = data.current;
    const units = data.current_units || {};

    let html = `<div class="section-title"><span class="section-icon">\uD83C\uDF0A</span> Marine Conditions</div>`;

    html += `<div class="marine-grid">`;

    // Main wave data
    const items = [
        { val: current.wave_height, unit: units.wave_height, label: "Wave Height", icon: "\uD83C\uDF0A" },
        { val: current.wave_period, unit: units.wave_period, label: "Wave Period", icon: "\u23F1\uFE0F" },
        { val: current.wave_direction, unit: "\u00B0", label: "Wave Direction", isDirection: true },
        { val: current.wind_wave_height, unit: units.wind_wave_height, label: "Wind Wave", icon: "\uD83D\uDCA8" },
        { val: current.wind_wave_period, unit: units.wind_wave_period, label: "Wind Wave Period" },
        { val: current.swell_wave_height, unit: units.swell_wave_height, label: "Swell Height" },
        { val: current.swell_wave_period, unit: units.swell_wave_period, label: "Swell Period" },
        { val: current.swell_wave_direction, unit: "\u00B0", label: "Swell Direction", isDirection: true },
    ];

    items.forEach(({ val, unit, label, isDirection, icon }) => {
        if (val == null) return;
        const display = isDirection
            ? `<span class="marine-direction">${getCompassDir(val)} <span class="direction-arrow" style="transform: rotate(${val}deg)">\u2191</span></span>`
            : `${typeof val === "number" ? val.toFixed(1) : val} <span class="marine-unit">${unit || ""}</span>`;

        html += `
            <div class="marine-item">
                ${icon ? `<div style="font-size:1.3rem">${icon}</div>` : ""}
                <div class="marine-value">${display}</div>
                <div class="marine-label">${label}</div>
            </div>
        `;
    });

    html += `</div>`;

    // Daily max
    if (data.daily?.wave_height_max) {
        html += `<div class="subsection-label" style="margin-top:var(--space-md)">Daily Max Wave Height</div>`;
        html += `<div class="detail-grid">`;
        data.daily.time.forEach((dateStr, i) => {
            const d = new Date(dateStr + "T00:00:00");
            const day = i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" });
            html += `
                <div class="detail-item">
                    <span class="detail-label">${day}</span>
                    <span class="detail-value">${data.daily.wave_height_max[i]} ${data.daily_units?.wave_height_max || "m"}</span>
                </div>
            `;
        });
        html += `</div>`;
    }

    marineEl.innerHTML = html;
    marineEl.classList.remove("hidden");
}

function getCompassDir(deg) {
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
}
