// Search UI - city dropdown rendering

const cityResultsEl = document.getElementById("city-results");

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

export function hideCityResults() {
    cityResultsEl.classList.add("hidden");
}

function formatCityName(city) {
    const parts = [city.name];
    if (city.admin1) parts.push(city.admin1);
    if (city.country) parts.push(city.country);
    return parts.join(", ");
}
