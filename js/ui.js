import { getWeatherInfo } from "./weather-codes.js";

const currentWeatherEl = document.getElementById("current-weather");
const forecastGridEl = document.getElementById("forecast-grid");
const forecastSection = document.getElementById("forecast");
const cityResultsEl = document.getElementById("city-results");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");

export function showLoading() {
    loadingEl.classList.remove("hidden");
}

export function hideLoading() {
    loadingEl.classList.add("hidden");
}

export function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
}

export function clearError() {
    errorEl.classList.add("hidden");
}

export function hideCityResults() {
    cityResultsEl.classList.add("hidden");
}

export function renderCityResults(cities, onSelect) {
    cityResultsEl.innerHTML = "";
    if (cities.length === 0) {
        cityResultsEl.classList.add("hidden");
        return;
    }
    cities.forEach((city) => {
        const li = document.createElement("li");
        li.setAttribute("role", "option");
        li.textContent = formatCityName(city);
        li.addEventListener("click", () => {
            cityResultsEl.classList.add("hidden");
            onSelect(city);
        });
        cityResultsEl.appendChild(li);
    });
    cityResultsEl.classList.remove("hidden");
}

export function renderCurrentWeather(current, units, cityName) {
    const { emoji, label } = getWeatherInfo(current.weather_code);
    currentWeatherEl.innerHTML = `
        <div class="current-main">
            <h2>${escapeHtml(cityName)}</h2>
            <div class="current-temp">
                <span class="weather-emoji">${emoji}</span>
                <span class="temp-value">${Math.round(current.temperature_2m)}${units.temperature_2m}</span>
            </div>
            <p class="weather-label">${label}</p>
        </div>
        <div class="current-details">
            <div class="detail-item">
                <span class="detail-label">Humidity</span>
                <span class="detail-value">${current.relative_humidity_2m}${units.relative_humidity_2m}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Wind</span>
                <span class="detail-value">${current.wind_speed_10m} ${units.wind_speed_10m}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Direction</span>
                <span class="detail-value">${getWindDirection(current.wind_direction_10m)}</span>
            </div>
        </div>
    `;
    currentWeatherEl.classList.remove("hidden");
}

export function renderForecast(daily, units) {
    forecastGridEl.innerHTML = "";
    daily.time.forEach((date, i) => {
        const { emoji } = getWeatherInfo(daily.weather_code[i]);
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <p class="forecast-day">${formatDay(date)}</p>
            <span class="weather-emoji">${emoji}</span>
            <p class="forecast-temps">
                <span class="temp-high">${Math.round(daily.temperature_2m_max[i])}°</span>
                <span class="temp-low">${Math.round(daily.temperature_2m_min[i])}°</span>
            </p>
            <p class="forecast-precip">\u{1F4A7} ${daily.precipitation_sum[i]} ${units.precipitation_sum}</p>
        `;
        forecastGridEl.appendChild(card);
    });
    forecastSection.classList.remove("hidden");
}

function formatCityName(city) {
    const parts = [city.name];
    if (city.admin1) parts.push(city.admin1);
    if (city.country) parts.push(city.country);
    return parts.join(", ");
}

function formatDay(dateString) {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", { weekday: "short" });
}

function getWindDirection(degrees) {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return dirs[index];
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
