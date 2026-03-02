import { createWeatherIcon } from "./icons.js";

const ICON_DATA = [
    {
        id: "clear-day",
        name: "Clear Day",
        conditions: "Clear sky, Mainly clear (daytime)",
    },
    {
        id: "clear-night",
        name: "Clear Night",
        conditions: "Clear sky, Mainly clear (nighttime)",
    },
    {
        id: "partly-cloudy-day",
        name: "Partly Cloudy Day",
        conditions: "Partly cloudy (daytime)",
    },
    {
        id: "partly-cloudy-night",
        name: "Partly Cloudy Night",
        conditions: "Partly cloudy (nighttime)",
    },
    {
        id: "cloudy",
        name: "Overcast",
        conditions: "Overcast skies",
    },
    {
        id: "fog",
        name: "Fog",
        conditions: "Fog, Depositing rime fog",
    },
    {
        id: "drizzle",
        name: "Drizzle",
        conditions: "Light drizzle, Moderate drizzle, Slight rain showers",
    },
    {
        id: "rain",
        name: "Rain",
        conditions: "Dense drizzle, Slight rain, Moderate rain, Moderate rain showers",
    },
    {
        id: "heavy-rain",
        name: "Heavy Rain",
        conditions: "Heavy rain, Violent rain showers",
    },
    {
        id: "snow",
        name: "Snow",
        conditions: "Slight snow, Moderate snow, Snow grains, Slight snow showers",
    },
    {
        id: "heavy-snow",
        name: "Heavy Snow",
        conditions: "Heavy snow, Heavy snow showers",
    },
    {
        id: "sleet",
        name: "Sleet",
        conditions: "Freezing drizzle, Heavy freezing drizzle, Freezing rain, Heavy freezing rain",
    },
    {
        id: "thunderstorm",
        name: "Thunderstorm",
        conditions: "Thunderstorm, Thunderstorm with slight hail, Thunderstorm with heavy hail",
    },
    {
        id: "wind",
        name: "Wind",
        conditions: "Wind speed and gust indicators",
    },
    {
        id: "unknown",
        name: "Unknown",
        conditions: "Fallback for unmapped weather codes",
    },
];

export function renderIconGuide() {
    const container = document.getElementById("icon-guide");
    if (!container) return;

    let html = '<div class="section-title">Weather Icon Guide</div>';
    html += '<div class="icon-guide-grid">';

    for (const icon of ICON_DATA) {
        html += `<div class="icon-guide-item" data-icon-id="${icon.id}">
            <div class="icon-guide-icon"></div>
            <div class="icon-guide-name">${icon.name}</div>
            <div class="icon-guide-conditions">${icon.conditions}</div>
        </div>`;
    }

    html += "</div>";
    container.innerHTML = html;
    container.classList.remove("hidden");

    // Insert live animated SVG icons into their slots
    container.querySelectorAll(".icon-guide-item").forEach((item) => {
        const iconId = item.dataset.iconId;
        const slot = item.querySelector(".icon-guide-icon");
        slot.appendChild(createWeatherIcon(iconId, 64));
    });
}
