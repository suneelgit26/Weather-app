import { searchCities, getWeather } from "./api.js";
import {
    renderCityResults,
    renderCurrentWeather,
    renderForecast,
    showLoading,
    hideLoading,
    showError,
    clearError,
    hideCityResults,
} from "./ui.js";

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");

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
        const data = await getWeather(city.latitude, city.longitude);
        hideLoading();
        const cityName = [city.name, city.country].filter(Boolean).join(", ");
        renderCurrentWeather(data.current, data.current_units, cityName);
        renderForecast(data.daily, data.daily_units);
        cityInput.value = city.name;
    } catch (err) {
        hideLoading();
        showError("Failed to load weather data. Please try again.");
        console.error(err);
    }
}
