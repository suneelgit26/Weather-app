# Weather App

A modern, native-feeling weather dashboard built with vanilla HTML, CSS, and JavaScript. Inspired by Apple Weather and Google Material 3 design patterns. Search any city to get detailed current conditions, forecasts, air quality, marine data, and more.

## Features

### Weather Data
- **City search** — type a city name and get instant results via the Open-Meteo Geocoding API
- **Current weather** — large hero temperature display, feels-like, humidity, dew point, wind, gusts, UV index, visibility, pressure, cloud cover, precipitation, sunrise/sunset
- **Hourly forecast** — 24-hour scrollable strip with animated icons, temperature chart, and precipitation probability
- **7-day forecast** — expandable daily rows with colored temperature range bars, detailed conditions, wind, UV, solar radiation, and more
- **Air quality** — US/EU AQI with arc gauge, pollutant breakdown (PM2.5, PM10, O₃, NO₂, SO₂, CO), pollen levels, and 24h AQI trend sparkline
- **Marine conditions** — wave height, period, direction, wind waves, and swell data with daily max forecast
- **Atmosphere details** — pressure, cloud layers, freezing level, CAPE, snow depth, evapotranspiration
- **Solar radiation** — shortwave, direct, diffuse, DNI with hourly radiation bar chart
- **Soil conditions** — temperature and moisture at multiple depths with visual bar indicators

### SPA-Style Navigation
- **Sticky app bar** — inline search with pill-shaped input, theme toggle, scroll-based elevation shadow
- **Tab navigation** — 3 tabs (Weather, Air & Sea, Environment) with animated indicator bar
- **Bottom navigation** — mobile-only fixed bottom bar with Material 3 pill-shaped active indicator
- **Tab transitions** — smooth fade-in animations when switching between tabs
- **Skeleton loading** — per-section shimmer placeholders while data loads

### Design & UX
- **Native mobile feel** — Apple Weather-inspired large temperature hero (3.8rem thin weight), near edge-to-edge cards, compact 8px spacing grid
- **Material 3 touches** — ripple effect on interactive elements, pill indicator in bottom nav, vibrant accent colors
- **Glass-morphism UI** — frosted glass cards with backdrop blur, borderless on mobile for clean native look
- **Dark mode** — manual toggle plus automatic dynamic theming based on weather conditions and day/night
- **Animated SVG icons** — custom weather icons with rain, snow, lightning, cloud drift, and sun ray animations
- **SVG charts** — line charts, bar charts, sparklines, arc gauges, and temperature range bars

### Responsive & Accessible
- **5-tier responsive layout** — optimized breakpoints at 380px (small phones), 480px (phones), 639px (mobile nav), 640px (tablets), and 1024px (desktop)
- **Edge-to-edge cards** — 6px side margins on mobile with borderless cards for maximum content density
- **Keyboard accessible** — search dropdown navigable with arrow keys/Enter/Escape, daily rows expandable with Enter/Space, tab bar with ArrowLeft/ArrowRight, focus-visible outlines throughout
- **Touch optimized** — 44px+ touch targets, safe area insets for notch devices, disabled hover effects on touch screens
- **Reduced motion support** — respects `prefers-reduced-motion` for users who prefer minimal animation
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
