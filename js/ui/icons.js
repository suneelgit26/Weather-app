// Animated SVG weather icon factory

const SVG_NS = "http://www.w3.org/2000/svg";

function svg(w, h) {
    const el = document.createElementNS(SVG_NS, "svg");
    el.setAttribute("viewBox", `0 0 ${w} ${h}`);
    el.setAttribute("fill", "none");
    el.setAttribute("class", "weather-icon-svg");
    return el;
}

function el(tag, attrs = {}) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
}

function createSunIcon() {
    const s = svg(64, 64);
    // Rays
    const raysG = el("g", { class: "wi-sun-rays" });
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        const x1 = 32 + Math.cos(angle) * 18;
        const y1 = 32 + Math.sin(angle) * 18;
        const x2 = 32 + Math.cos(angle) * 25;
        const y2 = 32 + Math.sin(angle) * 25;
        raysG.appendChild(el("line", {
            x1, y1, x2, y2,
            stroke: "#fbbf24", "stroke-width": "2.5", "stroke-linecap": "round"
        }));
    }
    s.appendChild(raysG);
    // Body
    s.appendChild(el("circle", {
        cx: "32", cy: "32", r: "13",
        fill: "#fbbf24", class: "wi-sun-body"
    }));
    return s;
}

function createMoonIcon() {
    const s = svg(64, 64);
    const g = el("g", { class: "wi-moon" });
    g.appendChild(el("circle", { cx: "30", cy: "32", r: "14", fill: "#e2e8f0" }));
    g.appendChild(el("circle", { cx: "38", cy: "26", r: "12", fill: "currentColor", opacity: "0.15" }));
    s.appendChild(g);
    // Stars
    const stars = [[48, 14], [52, 28], [15, 16], [50, 44]];
    stars.forEach(([x, y]) => {
        s.appendChild(el("circle", {
            cx: x, cy: y, r: "1.2", fill: "#e2e8f0", opacity: "0.6"
        }));
    });
    return s;
}

function createCloudIcon() {
    const s = svg(64, 64);
    s.appendChild(el("ellipse", {
        cx: "26", cy: "36", rx: "16", ry: "10",
        fill: "#cbd5e1", class: "wi-cloud-back", opacity: "0.6"
    }));
    s.appendChild(el("ellipse", {
        cx: "34", cy: "34", rx: "18", ry: "12",
        fill: "#e2e8f0", class: "wi-cloud"
    }));
    return s;
}

function createPartlyCloudyDayIcon() {
    const s = svg(64, 64);
    // Sun behind
    const raysG = el("g", { class: "wi-sun-rays" });
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        const x1 = 22 + Math.cos(angle) * 11;
        const y1 = 24 + Math.sin(angle) * 11;
        const x2 = 22 + Math.cos(angle) * 16;
        const y2 = 24 + Math.sin(angle) * 16;
        raysG.appendChild(el("line", {
            x1, y1, x2, y2,
            stroke: "#fbbf24", "stroke-width": "2", "stroke-linecap": "round"
        }));
    }
    s.appendChild(raysG);
    s.appendChild(el("circle", { cx: "22", cy: "24", r: "8", fill: "#fbbf24" }));
    // Cloud in front
    s.appendChild(el("ellipse", {
        cx: "36", cy: "38", rx: "17", ry: "11",
        fill: "#e2e8f0", class: "wi-cloud"
    }));
    return s;
}

function createPartlyCloudyNightIcon() {
    const s = svg(64, 64);
    const moonG = el("g", { class: "wi-moon" });
    moonG.appendChild(el("circle", { cx: "20", cy: "22", r: "9", fill: "#e2e8f0" }));
    moonG.appendChild(el("circle", { cx: "25", cy: "18", r: "8", fill: "currentColor", opacity: "0.15" }));
    s.appendChild(moonG);
    s.appendChild(el("ellipse", {
        cx: "36", cy: "38", rx: "17", ry: "11",
        fill: "#94a3b8", class: "wi-cloud"
    }));
    return s;
}

function createFogIcon() {
    const s = svg(64, 64);
    [20, 30, 40].forEach((y, i) => {
        s.appendChild(el("line", {
            x1: 10 + i * 2, y1: y, x2: 54 - i * 2, y2: y,
            stroke: "#94a3b8", "stroke-width": "4", "stroke-linecap": "round",
            class: "wi-fog-line", opacity: String(0.5 + i * 0.15)
        }));
    });
    return s;
}

function createDrizzleIcon() {
    const s = svg(64, 64);
    s.appendChild(el("ellipse", { cx: "32", cy: "24", rx: "18", ry: "11", fill: "#94a3b8", class: "wi-cloud" }));
    // Light drops
    [[22, 40], [32, 42], [42, 39]].forEach(([x, y]) => {
        s.appendChild(el("line", {
            x1: x, y1: y, x2: x, y2: y + 5,
            stroke: "#60a5fa", "stroke-width": "1.5", "stroke-linecap": "round",
            class: "wi-raindrop"
        }));
    });
    return s;
}

function createRainIcon() {
    const s = svg(64, 64);
    s.appendChild(el("ellipse", { cx: "32", cy: "22", rx: "18", ry: "11", fill: "#7e8fa6", class: "wi-cloud" }));
    [[20, 38], [28, 40], [36, 37], [44, 39]].forEach(([x, y]) => {
        s.appendChild(el("line", {
            x1: x, y1: y, x2: x - 1, y2: y + 8,
            stroke: "#60a5fa", "stroke-width": "2", "stroke-linecap": "round",
            class: "wi-raindrop"
        }));
    });
    return s;
}

function createHeavyRainIcon() {
    const s = svg(64, 64);
    s.appendChild(el("ellipse", { cx: "32", cy: "20", rx: "19", ry: "12", fill: "#64748b", class: "wi-cloud" }));
    [[18, 36], [25, 38], [32, 35], [39, 37], [46, 36]].forEach(([x, y]) => {
        s.appendChild(el("line", {
            x1: x, y1: y, x2: x - 2, y2: y + 10,
            stroke: "#3b82f6", "stroke-width": "2.5", "stroke-linecap": "round",
            class: "wi-raindrop-heavy"
        }));
    });
    return s;
}

function createSnowIcon() {
    const s = svg(64, 64);
    s.appendChild(el("ellipse", { cx: "32", cy: "22", rx: "18", ry: "11", fill: "#cbd5e1", class: "wi-cloud" }));
    [[22, 38], [32, 40], [42, 37], [27, 44]].forEach(([x, y]) => {
        s.appendChild(el("circle", {
            cx: x, cy: y, r: "2.5", fill: "#e2e8f0", class: "wi-snowflake"
        }));
    });
    return s;
}

function createHeavySnowIcon() {
    const s = svg(64, 64);
    s.appendChild(el("ellipse", { cx: "32", cy: "20", rx: "19", ry: "12", fill: "#94a3b8", class: "wi-cloud" }));
    [[18, 36], [26, 40], [34, 37], [42, 41], [22, 46], [38, 46]].forEach(([x, y]) => {
        s.appendChild(el("circle", {
            cx: x, cy: y, r: "2.8", fill: "#e2e8f0", class: "wi-snowflake"
        }));
    });
    return s;
}

function createThunderstormIcon() {
    const s = svg(64, 64);
    s.appendChild(el("ellipse", { cx: "32", cy: "20", rx: "20", ry: "12", fill: "#475569", class: "wi-cloud" }));
    // Lightning bolt
    const bolt = el("polygon", {
        points: "30,32 34,38 31,38 35,48 28,40 32,40 28,32",
        fill: "#fbbf24", class: "wi-lightning"
    });
    s.appendChild(bolt);
    // Rain
    [[20, 36], [42, 38]].forEach(([x, y]) => {
        s.appendChild(el("line", {
            x1: x, y1: y, x2: x - 1, y2: y + 7,
            stroke: "#60a5fa", "stroke-width": "2", "stroke-linecap": "round",
            class: "wi-raindrop"
        }));
    });
    return s;
}

function createSleetIcon() {
    const s = svg(64, 64);
    s.appendChild(el("ellipse", { cx: "32", cy: "22", rx: "18", ry: "11", fill: "#94a3b8", class: "wi-cloud" }));
    // Mix of rain and snow
    [[22, 38], [38, 37]].forEach(([x, y]) => {
        s.appendChild(el("line", {
            x1: x, y1: y, x2: x, y2: y + 7,
            stroke: "#60a5fa", "stroke-width": "2", "stroke-linecap": "round",
            class: "wi-raindrop"
        }));
    });
    [[30, 40], [44, 42]].forEach(([x, y]) => {
        s.appendChild(el("circle", {
            cx: x, cy: y, r: "2.5", fill: "#e2e8f0", class: "wi-snowflake"
        }));
    });
    return s;
}

function createWindIcon() {
    const s = svg(64, 64);
    [24, 32, 40].forEach((y, i) => {
        const width = 30 - i * 4;
        s.appendChild(el("path", {
            d: `M${14 + i * 3},${y} Q${14 + i * 3 + width * 0.7},${y - 3} ${14 + i * 3 + width},${y + 2}`,
            stroke: "#94a3b8", "stroke-width": "2.5", "stroke-linecap": "round",
            fill: "none", class: "wi-wind-line"
        }));
    });
    return s;
}

function createUnknownIcon() {
    const s = svg(64, 64);
    s.appendChild(el("circle", { cx: "32", cy: "32", r: "16", fill: "none", stroke: "#94a3b8", "stroke-width": "2" }));
    const txt = el("text", {
        x: "32", y: "38", "text-anchor": "middle", fill: "#94a3b8",
        "font-size": "20", "font-weight": "bold", "font-family": "inherit"
    });
    txt.textContent = "?";
    s.appendChild(txt);
    return s;
}

// Icon type mapping
const ICON_MAP = {
    "clear-day": createSunIcon,
    "clear-night": createMoonIcon,
    "partly-cloudy-day": createPartlyCloudyDayIcon,
    "partly-cloudy-night": createPartlyCloudyNightIcon,
    "cloudy": createCloudIcon,
    "fog": createFogIcon,
    "drizzle": createDrizzleIcon,
    "rain": createRainIcon,
    "heavy-rain": createHeavyRainIcon,
    "snow": createSnowIcon,
    "heavy-snow": createHeavySnowIcon,
    "sleet": createSleetIcon,
    "thunderstorm": createThunderstormIcon,
    "wind": createWindIcon,
    "unknown": createUnknownIcon,
};

export function createWeatherIcon(iconId, size = 64) {
    const factory = ICON_MAP[iconId] || ICON_MAP["unknown"];
    const icon = factory();
    icon.style.width = size + "px";
    icon.style.height = size + "px";
    return icon;
}
