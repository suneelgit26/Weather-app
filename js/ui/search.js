// Search UI - city dropdown rendering with keyboard navigation

const cityResultsEl = document.getElementById("city-results");
const cityInput = document.getElementById("city-input");
let activeIndex = -1;
let currentCities = [];
let currentOnSelect = null;

export function renderCityResults(cities, onSelect) {
    activeIndex = -1;
    currentCities = cities;
    currentOnSelect = onSelect;
    cityResultsEl.innerHTML = "";

    if (cities.length === 0) {
        cityResultsEl.classList.add("hidden");
        cityInput.setAttribute("aria-expanded", "false");
        return;
    }

    cities.forEach((city, i) => {
        const li = document.createElement("li");
        li.setAttribute("role", "option");
        li.setAttribute("id", `city-option-${i}`);
        li.textContent = formatCityName(city);
        li.addEventListener("click", () => {
            hideCityResults();
            onSelect(city);
        });
        cityResultsEl.appendChild(li);
    });

    cityResultsEl.classList.remove("hidden");
    cityInput.setAttribute("aria-expanded", "true");

    // Attach keyboard handler (remove previous to avoid stacking)
    cityInput.removeEventListener("keydown", handleSearchKeydown);
    cityInput.addEventListener("keydown", handleSearchKeydown);
}

export function hideCityResults() {
    cityResultsEl.classList.add("hidden");
    cityInput.setAttribute("aria-expanded", "false");
    activeIndex = -1;
}

function handleSearchKeydown(e) {
    const items = cityResultsEl.querySelectorAll("li");
    if (items.length === 0 || cityResultsEl.classList.contains("hidden")) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        updateActiveItem(items);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        updateActiveItem(items);
    } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        hideCityResults();
        currentOnSelect(currentCities[activeIndex]);
    } else if (e.key === "Escape") {
        e.preventDefault();
        hideCityResults();
    }
}

function updateActiveItem(items) {
    items.forEach((li, i) => {
        if (i === activeIndex) {
            li.classList.add("is-active");
            li.scrollIntoView({ block: "nearest" });
        } else {
            li.classList.remove("is-active");
        }
    });
    cityInput.setAttribute("aria-activedescendant", activeIndex >= 0 ? `city-option-${activeIndex}` : "");
}

function formatCityName(city) {
    const parts = [city.name];
    if (city.admin1) parts.push(city.admin1);
    if (city.country) parts.push(city.country);
    return parts.join(", ");
}
