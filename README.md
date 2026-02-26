# Weather App

A clean, mobile-friendly weather application built with vanilla HTML, CSS, and JavaScript. Search any city to see current conditions and a 7-day forecast.

## Features

- **City search** — type a city name and get instant results via the Open-Meteo Geocoding API
- **Current weather** — temperature, conditions, humidity, wind speed, and direction
- **7-day forecast** — daily high/low temperatures, conditions, and precipitation
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
- [Open-Meteo API](https://open-meteo.com/) — free weather data, no API key needed
- GitHub Pages + GitHub Actions for hosting
