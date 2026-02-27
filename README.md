# Weather App

A comprehensive, mobile-friendly weather dashboard built with vanilla HTML, CSS, and JavaScript. Search any city to get detailed current conditions, forecasts, air quality, marine data, and more.

## Features

- **City search** — type a city name and get instant results via the Open-Meteo Geocoding API
- **Current weather** — temperature, feels-like, humidity, dew point, wind, gusts, UV index, visibility, pressure, cloud cover, precipitation, sunrise/sunset
- **Hourly forecast** — 24-hour scrollable timeline with animated icons, temperature chart, and precipitation probability
- **7-day forecast** — expandable daily rows with temperature range bars, detailed conditions, wind, UV, solar radiation, and more
- **Air quality** — US/EU AQI with arc gauge, pollutant breakdown (PM2.5, PM10, O₃, NO₂, SO₂, CO), pollen levels, and 24h AQI trend sparkline
- **Marine conditions** — wave height, period, direction, wind waves, and swell data with daily max forecast
- **Atmosphere details** — pressure, cloud layers, freezing level, CAPE, snow depth, evapotranspiration
- **Solar radiation** — shortwave, direct, diffuse, DNI with hourly radiation bar chart
- **Soil conditions** — temperature and moisture at multiple depths with visual bar indicators
- **Dark mode** — manual toggle plus automatic dynamic theming based on weather conditions and day/night
- **Animated SVG icons** — custom weather icons with rain, snow, lightning, cloud drift, and sun ray animations
- **SVG charts** — line charts, bar charts, sparklines, arc gauges, and temperature range bars
- **Glass-morphism UI** — frosted glass cards with backdrop blur and smooth entrance animations
- **Responsive design** — works on mobile, tablet, and desktop
- **No API key required** — powered by the free [Open-Meteo](https://open-meteo.com/) API

## Running Locally

ES modules require an HTTP server (they won't work with `file://`). The simplest way:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Deployment

The app deploys automatically to GitHub Pages on every push to `main` via GitHub Actions. To enable:

1. Go to **Settings > Pages** in your repository
2. Set **Source** to **GitHub Actions**

## Tech Stack

- HTML5, CSS3, vanilla JavaScript (ES modules)
- [Open-Meteo API](https://open-meteo.com/) — weather, air quality, and marine data, no API key needed
- GitHub Pages + GitHub Actions for hosting
