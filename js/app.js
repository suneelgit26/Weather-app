import { searchCities, getWeather, getAirQuality, getMarineForecast } from "./api.js";
import { applyTheme, initThemeToggle } from "./theme.js";
import { renderCityResults, hideCityResults } from "./ui/search.js";
import { renderCurrentWeather } from "./ui/current.js";
import { renderHourlyForecast } from "./ui/hourly.js";
import { renderDailyForecast } from "./ui/daily.js";
import { renderAirQuality } from "./ui/air-quality.js";
import { renderMarine } from "./ui/marine.js";
import { renderAtmosphere, renderSolar, renderSoil } from "./ui/details.js";

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");

// Initialize theme toggle
initThemeToggle();

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = cityInput.value.trim();
    if (!query) return;
    await handleSearch(query);
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) {
        hideCityResults();
    }
});

async function handleSearch(query) {
    clearError();
    hideCityResults();
    showLoading();
    try {
        const cities = await searchCities(query);
        hideLoading();
        if (cities.length === 0) {
            showError(`No results found for "${query}".`);
            return;
        }
        if (cities.length === 1) {
            await loadWeather(cities[0]);
        } else {
            renderCityResults(cities, loadWeather);
        }
    } catch (err) {
        hideLoading();
        showError("Failed to search. Please check your connection and try again.");
        console.error(err);
    }
}

async function loadWeather(city) {
    clearError();
    showLoading();

    try {
        // Fire all 3 API calls in parallel
        const [weatherResult, airResult, marineResult] = await Promise.allSettled([
            getWeather(city.latitude, city.longitude),
            getAirQuality(city.latitude, city.longitude),
            getMarineForecast(city.latitude, city.longitude),
        ]);

        hideLoading();

        // Weather data is required
        if (weatherResult.status === "rejected") {
            showError("Failed to load weather data. Please try again.");
            console.error(weatherResult.reason);
            return;
        }

        const weather = weatherResult.value;
        const airQuality = airResult.status === "fulfilled" ? airResult.value : null;
        const marine = marineResult.status === "fulfilled" ? marineResult.value : null;

        const cityName = [city.name, city.country].filter(Boolean).join(", ");

        // Apply dynamic theme based on current conditions
        applyTheme(weather.current.weather_code, weather.current.is_day);

        // Render all sections
        renderCurrentWeather(weather.current, weather.current_units, weather.daily, cityName);
        renderHourlyForecast(weather.hourly, weather.hourly_units);
        renderDailyForecast(weather.daily, weather.daily_units);
        renderAirQuality(airQuality);
        renderMarine(marine);
        renderAtmosphere(weather.hourly, weather.hourly_units, weather.current, weather.current_units);
        renderSolar(weather.hourly, weather.hourly_units, weather.daily, weather.daily_units);
        renderSoil(weather.hourly, weather.hourly_units);

        cityInput.value = city.name;
    } catch (err) {
        hideLoading();
        showError("Failed to load weather data. Please try again.");
        console.error(err);
    }
}

function showLoading() {
    loadingEl.classList.remove("hidden");
}

function hideLoading() {
    loadingEl.classList.add("hidden");
}

function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
}

function clearError() {
    errorEl.classList.add("hidden");
}
