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
- **Tab transitions** — smooth entrance animations re-triggered on every tab switch
- **Skeleton loading** — per-section shimmer placeholders while data loads

### Design & UX
- **Native mobile feel** — Apple Weather-inspired large temperature hero (4.5rem thin weight), true edge-to-edge full-width cards, 12px spacing grid
- **Material 3 touches** — ripple effect on interactive elements, pill indicator in bottom nav, vibrant accent colors
- **Glass-morphism UI** — frosted glass cards with backdrop blur, borderless on mobile for clean native look
- **Dark mode** — manual toggle plus automatic dynamic theming based on weather conditions and day/night
- **Animated SVG icons** — custom weather icons with rain, snow, lightning, cloud drift, and sun ray animations
- **SVG charts** — line charts, bar charts, sparklines, arc gauges, and temperature range bars

### Responsive & Accessible
- **5-tier responsive layout** — optimized breakpoints at 380px (small phones), 480px (phones), 639px (mobile nav), 640px (tablets), and 1024px (desktop)
- **True edge-to-edge cards** — full viewport-width cards on mobile (border-radius: 0, negative margins) for native app feel
- **Keyboard accessible** — search dropdown navigable with arrow keys/Enter/Escape, daily rows expandable with Enter/Space, tab bar with ArrowLeft/ArrowRight, focus-visible outlines throughout
- **Touch optimized** — 44px+ touch targets, safe area insets for notch devices, disabled hover effects on touch screens, 16px input font to prevent iOS auto-zoom
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

## Changelog

### v1.4.2 (2026-03-02) — Mobile UX Polish & Bug Fixes

- **Fix: iOS zoom stuck after search** — set search input to 16px font-size (prevents iOS Safari auto-zoom on focus) and blur input after search completes to dismiss keyboard
- **Fix: Tab navigation broken** — cards in Air/Sea and Environment tabs were invisible after search because CSS animations inside `display:none` parents never complete; now re-triggers entrance animations on every tab switch
- **Fix: Mobile zoom/scroll issues** — added `overflow-x: hidden` on body and `overflow: hidden` on mobile cards to prevent horizontal scrollbar
- **True edge-to-edge cards** — cards now have `border-radius: 0`, `margin: 0 -6px`, and no box-shadow on mobile for native app feel
- **Bigger hero temperature** — increased to 4.5rem (was 3.8rem) with more padding and breathing room
- **Readable text sizes** — bumped all labels above Apple's 11pt minimum (detail labels 0.68rem, section titles 0.72rem, bottom nav 0.68rem)
- **Rebalanced spacing** — `--space-sm: 6px` (was 4px), `--space-lg: 12px` (was 8px) for less cramped layout
- **Better touch targets** — daily rows 44px min-height, bottom nav icons 24px, pollutant/pollen items 8px padding

### v1.4.0 (2026-03-02) — Native Mobile UI Redesign

- **Apple Weather-inspired hero** — large thin-weight temperature (4.5rem), compact city name, small weather icon, vertical layout
- **Clean hourly strip** — transparent item backgrounds with subtle separator lines, hidden scrollbar
- **Compact daily rows** — 4-column grid, no gap between rows, border separators
- **Material 3 bottom nav** — pill-shaped active indicator behind icon, 60px height
- **Compact app bar** — 44px height, 34px buttons, subtle search background
- **Minimal section titles** — small uppercase labels with reduced opacity

### v1.3.0 (2026-02-28) — SPA Navigation & Mobile Redesign

- **SPA tab architecture** — transformed from single-page scroll to 3-tab layout (Weather, Air & Sea, Environment)
- **Sticky header** — app bar + tab bar stick to top with scroll-based elevation shadow
- **Bottom navigation** — mobile-only fixed nav bar replacing top tabs on screens under 640px
- **Tab indicator** — animated underline that follows the active tab
- **Skeleton loading** — per-section shimmer placeholders shown during API calls
- **Mobile responsiveness** — added 480px and 380px breakpoints with tighter spacing and smaller elements
- **Post-search redesign** — results pages optimized for mobile viewing

### v1.2.0 (2026-02-27) — Dashboard Expansion & iPhone Support

- **iPhone support** — safe area insets for notch devices, Apple mobile web app meta tags, small screen optimizations
- **Style & modularity improvements** — refactored CSS into separate files (style.css, theme.css, components.css, animations.css), improved code organization
- **Keyboard accessibility** — arrow key navigation in search dropdown and tab bar, Enter/Space for daily row expand, Escape to close dropdowns
- **Reduced motion** — respects `prefers-reduced-motion` media query
- **Fix: daily forecast expand/collapse** — resolved broken click handler for expandable daily detail rows

### v1.1.0 (2026-02-26) — Comprehensive Dashboard

- **Full weather dashboard** — added air quality (AQI + pollutants + pollen), marine conditions (waves + swell), atmosphere details, solar radiation charts, soil temperature/moisture at depth
- **Dynamic theming** — automatic background gradient and dark mode based on weather code and day/night
- **Animated SVG icons** — rain drops, snowflakes, lightning flash, cloud drift, sun rays, fog, wind lines
- **SVG charts** — monotone cubic line charts, bar charts, sparklines, arc gauges, temperature range bars
- **GitHub Pages deployment** — automated CI/CD via GitHub Actions workflow

### v1.0.0 (2026-02-26) — Initial Release

- **Weather app launch** — city search via Open-Meteo Geocoding API, current conditions, and 7-day forecast
- **Vanilla stack** — HTML5, CSS3, JavaScript ES modules, no build tools or frameworks
