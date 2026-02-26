// Reusable SVG chart primitives

const SVG_NS = "http://www.w3.org/2000/svg";

function createSvg(viewW, viewH, className = "") {
    const s = document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", `0 0 ${viewW} ${viewH}`);
    s.setAttribute("preserveAspectRatio", "none");
    s.setAttribute("class", `chart-svg ${className}`.trim());
    return s;
}

function svgEl(tag, attrs = {}) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
}

// Monotone cubic interpolation for smooth curves
function monotoneCubicPath(points) {
    if (points.length < 2) return "";
    if (points.length === 2) return `M${points[0].x},${points[0].y}L${points[1].x},${points[1].y}`;

    const n = points.length;
    const dx = [], dy = [], m = [];

    for (let i = 0; i < n - 1; i++) {
        dx[i] = points[i + 1].x - points[i].x;
        dy[i] = points[i + 1].y - points[i].y;
        m[i] = dy[i] / dx[i];
    }

    const tangents = [m[0]];
    for (let i = 1; i < n - 1; i++) {
        if (m[i - 1] * m[i] <= 0) {
            tangents[i] = 0;
        } else {
            tangents[i] = (m[i - 1] + m[i]) / 2;
        }
    }
    tangents[n - 1] = m[n - 2];

    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < n - 1; i++) {
        const seg = dx[i] / 3;
        const cp1x = points[i].x + seg;
        const cp1y = points[i].y + tangents[i] * seg;
        const cp2x = points[i + 1].x - seg;
        const cp2y = points[i + 1].y - tangents[i + 1] * seg;
        path += `C${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i + 1].x},${points[i + 1].y}`;
    }
    return path;
}

/**
 * Create a line chart with optional gradient fill below
 * @param {number[]} data - array of values
 * @param {object} options - { width, height, color, labels, showDots, showArea, padding }
 * @returns {SVGElement}
 */
export function createLineChart(data, options = {}) {
    const {
        width = 600,
        height = 120,
        color = "#60a5fa",
        labels = [],
        showDots = false,
        showArea = true,
        padding = { top: 10, right: 10, bottom: 20, left: 10 },
    } = options;

    const s = createSvg(width, height);
    s.style.width = "100%";
    s.style.height = "100%";
    s.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((v, i) => ({
        x: padding.left + (i / (data.length - 1)) * plotW,
        y: padding.top + plotH - ((v - min) / range) * plotH,
    }));

    const pathD = monotoneCubicPath(points);

    // Gradient definition
    const defs = svgEl("defs");
    const grad = svgEl("linearGradient", { id: "lineGrad_" + Math.random().toString(36).slice(2), x1: "0", y1: "0", x2: "0", y2: "1" });
    const stop1 = svgEl("stop", { offset: "0%", "stop-color": color, "stop-opacity": "0.3" });
    const stop2 = svgEl("stop", { offset: "100%", "stop-color": color, "stop-opacity": "0.02" });
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    s.appendChild(defs);

    // Area fill
    if (showArea && points.length > 1) {
        const areaD = pathD +
            `L${points[points.length - 1].x},${padding.top + plotH}` +
            `L${points[0].x},${padding.top + plotH}Z`;
        s.appendChild(svgEl("path", {
            d: areaD,
            fill: `url(#${grad.id})`,
            class: "chart-area"
        }));
    }

    // Line
    s.appendChild(svgEl("path", { d: pathD, stroke: color, class: "chart-line" }));

    // Dots
    if (showDots) {
        points.forEach(p => {
            s.appendChild(svgEl("circle", {
                cx: p.x, cy: p.y, r: "2.5",
                fill: color, class: "chart-dot"
            }));
        });
    }

    // Labels
    if (labels.length > 0) {
        const step = Math.max(1, Math.floor(labels.length / 8));
        labels.forEach((lbl, i) => {
            if (i % step !== 0 && i !== labels.length - 1) return;
            const x = padding.left + (i / (data.length - 1)) * plotW;
            const txt = svgEl("text", {
                x, y: height - 2, "text-anchor": "middle", class: "chart-label"
            });
            txt.textContent = lbl;
            s.appendChild(txt);
        });
    }

    return s;
}

/**
 * Create a bar chart
 * @param {number[]} data
 * @param {object} options - { width, height, color, labels, barColor }
 * @returns {SVGElement}
 */
export function createBarChart(data, options = {}) {
    const {
        width = 600,
        height = 80,
        color = "#60a5fa",
        labels = [],
        padding = { top: 5, right: 5, bottom: 18, left: 5 },
    } = options;

    const s = createSvg(width, height);
    s.style.width = "100%";
    s.style.height = "100%";
    s.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;
    const max = Math.max(...data, 0.1);
    const barW = plotW / data.length * 0.7;
    const gap = plotW / data.length * 0.3;

    data.forEach((v, i) => {
        const barH = (v / max) * plotH;
        const x = padding.left + i * (barW + gap) + gap / 2;
        const y = padding.top + plotH - barH;
        s.appendChild(svgEl("rect", {
            x, y, width: barW, height: Math.max(barH, 1),
            rx: "2", fill: color, opacity: "0.8"
        }));
    });

    if (labels.length > 0) {
        const step = Math.max(1, Math.floor(labels.length / 8));
        labels.forEach((lbl, i) => {
            if (i % step !== 0) return;
            const x = padding.left + i * (barW + gap) + gap / 2 + barW / 2;
            const txt = svgEl("text", {
                x, y: height - 2, "text-anchor": "middle", class: "chart-label"
            });
            txt.textContent = lbl;
            s.appendChild(txt);
        });
    }

    return s;
}

/**
 * Create a semicircle arc gauge
 * @param {number} value - current value
 * @param {number} max - maximum value
 * @param {string} color - fill color
 * @returns {SVGElement}
 */
export function createArcGauge(value, max, color = "#22c55e") {
    const s = createSvg(140, 80);
    s.style.width = "100%";
    s.style.height = "100%";
    s.setAttribute("preserveAspectRatio", "xMidYMax meet");

    const cx = 70, cy = 70, r = 55;
    const circumference = Math.PI * r; // semicircle

    // Track
    s.appendChild(svgEl("path", {
        d: `M${cx - r},${cy} A${r},${r} 0 0,1 ${cx + r},${cy}`,
        fill: "none", stroke: "currentColor", "stroke-opacity": "0.1",
        "stroke-width": "10", "stroke-linecap": "round"
    }));

    // Fill
    const pct = Math.min(value / max, 1);
    const offset = circumference * (1 - pct);
    s.appendChild(svgEl("path", {
        d: `M${cx - r},${cy} A${r},${r} 0 0,1 ${cx + r},${cy}`,
        fill: "none", stroke: color, "stroke-width": "10", "stroke-linecap": "round",
        "stroke-dasharray": circumference,
        "stroke-dashoffset": offset,
        class: "gauge-fill",
        style: `--gauge-circumference: ${circumference}`
    }));

    return s;
}

/**
 * Create a sparkline (compact inline chart)
 * @param {number[]} data
 * @param {string} color
 * @returns {SVGElement}
 */
export function createSparkline(data, color = "#60a5fa") {
    const w = 120, h = 30;
    const s = createSvg(w, h, "sparkline-animated");
    s.style.width = "100%";
    s.style.height = h + "px";
    s.setAttribute("preserveAspectRatio", "none");

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pad = 2;

    const points = data.map((v, i) => ({
        x: pad + (i / (data.length - 1)) * (w - pad * 2),
        y: pad + (h - pad * 2) - ((v - min) / range) * (h - pad * 2),
    }));

    s.appendChild(svgEl("polyline", {
        points: points.map(p => `${p.x},${p.y}`).join(" "),
        fill: "none", stroke: color, "stroke-width": "1.5", "stroke-linejoin": "round"
    }));

    return s;
}

/**
 * Create a horizontal temperature range bar
 * @param {number} dayLow - this day's low
 * @param {number} dayHigh - this day's high
 * @param {number} weekLow - week's overall low
 * @param {number} weekHigh - week's overall high
 * @returns {HTMLElement}
 */
export function createTemperatureBar(dayLow, dayHigh, weekLow, weekHigh) {
    const range = weekHigh - weekLow || 1;
    const leftPct = ((dayLow - weekLow) / range) * 100;
    const widthPct = ((dayHigh - dayLow) / range) * 100;

    const wrapper = document.createElement("div");
    wrapper.className = "daily-temp-bar";

    const fill = document.createElement("div");
    fill.className = "daily-temp-fill";
    fill.style.left = leftPct + "%";
    fill.style.width = Math.max(widthPct, 4) + "%";
    wrapper.appendChild(fill);

    return wrapper;
}
