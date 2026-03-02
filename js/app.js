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

// ============================================
// Tab Navigation
// ============================================
const stickyHeader = document.getElementById("sticky-header");
const tabBar = document.getElementById("tab-bar");
const tabIndicator = document.getElementById("tab-indicator");
const bottomNav = document.getElementById("bottom-nav");
const tabs = tabBar.querySelectorAll(".tab");
const bottomNavItems = bottomNav.querySelectorAll(".bottom-nav-item");
const tabPanels = document.querySelectorAll(".tab-panel");

function switchTab(tabName) {
    // Update top tabs
    tabs.forEach((t) => {
        const isActive = t.dataset.tab === tabName;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", String(isActive));
    });

    // Update bottom nav
    bottomNavItems.forEach((item) => {
        item.classList.toggle("active", item.dataset.tab === tabName);
    });

    // Update panels
    tabPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === `panel-${tabName}`);
    });

    // Move tab indicator
    updateTabIndicator();

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateTabIndicator() {
    const activeTab = tabBar.querySelector(".tab.active");
    if (!activeTab || !tabIndicator) return;
    const barRect = tabBar.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    tabIndicator.style.left = `${tabRect.left - barRect.left}px`;
    tabIndicator.style.width = `${tabRect.width}px`;
}

// Tab click listeners
tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

bottomNavItems.forEach((item) => {
    item.addEventListener("click", () => switchTab(item.dataset.tab));
});

// Keyboard navigation on tab bar
tabBar.addEventListener("keydown", (e) => {
    const tabArr = [...tabs];
    const idx = tabArr.indexOf(document.activeElement);
    if (idx < 0) return;
    if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = tabArr[(idx + 1) % tabArr.length];
        next.focus();
        switchTab(next.dataset.tab);
    } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = tabArr[(idx - 1 + tabArr.length) % tabArr.length];
        prev.focus();
        switchTab(prev.dataset.tab);
    }
});

// Initialize indicator position after layout
requestAnimationFrame(updateTabIndicator);
window.addEventListener("resize", updateTabIndicator);

// ============================================
// Scroll Elevation
// ============================================
let ticking = false;
window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            stickyHeader.classList.toggle("elevated", window.scrollY > 0);
            ticking = false;
        });
        ticking = true;
    }
});

// ============================================
// Ripple Effect
// ============================================
document.addEventListener("click", (e) => {
    const target = e.target.closest(".ripple-target");
    if (!target) return;
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    target.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
});

// ============================================
// Skeleton Loading
// ============================================
const skeletonTemplates = {
    "current-weather": `
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:20px 0">
            <div class="skeleton" style="width:120px;height:16px"></div>
            <div class="skeleton" style="width:80px;height:80px;border-radius:50%"></div>
            <div class="skeleton" style="width:100px;height:40px"></div>
            <div class="skeleton" style="width:160px;height:14px"></div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%;margin-top:12px">
                <div class="skeleton" style="height:50px"></div>
                <div class="skeleton" style="height:50px"></div>
                <div class="skeleton" style="height:50px"></div>
                <div class="skeleton" style="height:50px"></div>
                <div class="skeleton" style="height:50px"></div>
                <div class="skeleton" style="height:50px"></div>
            </div>
        </div>`,
    "hourly-forecast": `
        <div class="section-title"><span class="skeleton" style="width:140px;height:14px;display:inline-block"></span></div>
        <div style="display:flex;gap:8px;overflow:hidden">
            ${Array(8).fill('<div class="skeleton" style="flex:0 0 58px;height:100px;border-radius:12px"></div>').join("")}
        </div>`,
    "daily-forecast": `
        <div class="section-title"><span class="skeleton" style="width:120px;height:14px;display:inline-block"></span></div>
        ${Array(7).fill('<div class="skeleton" style="height:44px;margin-bottom:8px"></div>').join("")}`,
    "air-quality": `
        <div class="section-title"><span class="skeleton" style="width:100px;height:14px;display:inline-block"></span></div>
        <div style="display:flex;gap:16px;align-items:center;margin-bottom:12px">
            <div class="skeleton" style="width:110px;height:65px;border-radius:50%"></div>
            <div style="flex:1"><div class="skeleton" style="width:60px;height:28px;margin-bottom:8px"></div><div class="skeleton" style="width:100px;height:14px"></div></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px">
            ${Array(6).fill('<div class="skeleton" style="height:50px"></div>').join("")}
        </div>`,
    "marine": `
        <div class="section-title"><span class="skeleton" style="width:130px;height:14px;display:inline-block"></span></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px">
            ${Array(6).fill('<div class="skeleton" style="height:60px"></div>').join("")}
        </div>`,
    "atmosphere": `
        <div class="section-title"><span class="skeleton" style="width:110px;height:14px;display:inline-block"></span></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px">
            ${Array(8).fill('<div class="skeleton" style="height:50px"></div>').join("")}
        </div>`,
    "solar-radiation": `
        <div class="section-title"><span class="skeleton" style="width:120px;height:14px;display:inline-block"></span></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px">
            ${Array(5).fill('<div class="skeleton" style="height:50px"></div>').join("")}
        </div>
        <div class="skeleton" style="height:60px;margin-top:12px"></div>`,
    "soil-conditions": `
        <div class="section-title"><span class="skeleton" style="width:110px;height:14px;display:inline-block"></span></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px">
            ${Array(4).fill('<div class="skeleton" style="height:50px"></div>').join("")}
        </div>`,
};

function showSkeletons() {
    for (const [id, template] of Object.entries(skeletonTemplates)) {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = template;
            el.classList.remove("hidden");
        }
    }
}

// ============================================
// Search & Weather Loading
// ============================================
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
    showSkeletons();

    // Switch to Weather tab when loading new city
    switchTab("weather");

    try {
        // Fire all 3 API calls in parallel
        const [weatherResult, airResult, marineResult] = await Promise.allSettled([
            getWeather(city.latitude, city.longitude),
            getAirQuality(city.latitude, city.longitude),
            getMarineForecast(city.latitude, city.longitude),
        ]);

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
