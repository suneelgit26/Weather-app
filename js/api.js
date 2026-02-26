const GEO_BASE = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";
const MARINE_BASE = "https://marine-api.open-meteo.com/v1/marine";

export async function searchCities(name) {
    const url = `${GEO_BASE}?name=${encodeURIComponent(name)}&count=5&language=en`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding request failed (${res.status})`);
    const data = await res.json();
    return data.results || [];
}

export async function getWeather(latitude, longitude) {
    const params = new URLSearchParams({
        latitude,
        longitude,
        current: [
            "temperature_2m", "relative_humidity_2m", "apparent_temperature",
            "weather_code", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m",
            "cloud_cover", "pressure_msl", "surface_pressure", "is_day",
            "precipitation", "rain", "showers", "snowfall",
            "visibility", "uv_index", "dew_point_2m",
        ].join(","),
        hourly: [
            "temperature_2m", "relative_humidity_2m", "dew_point_2m",
            "apparent_temperature", "precipitation_probability",
            "precipitation", "rain", "showers", "snowfall",
            "weather_code", "cloud_cover", "cloud_cover_low",
            "cloud_cover_mid", "cloud_cover_high", "visibility",
            "wind_speed_10m", "wind_speed_80m", "wind_speed_120m",
            "wind_direction_10m", "wind_gusts_10m", "uv_index", "is_day",
            "shortwave_radiation", "direct_radiation", "diffuse_radiation",
            "direct_normal_irradiance", "evapotranspiration",
            "et0_fao_evapotranspiration", "snow_depth", "freezing_level_height",
            "cape", "sunshine_duration",
            "soil_temperature_0cm", "soil_temperature_6cm",
            "soil_temperature_18cm", "soil_temperature_54cm",
            "soil_moisture_0_to_1cm", "soil_moisture_1_to_3cm",
            "soil_moisture_3_to_9cm", "soil_moisture_9_to_27cm",
            "soil_moisture_27_to_81cm",
            "pressure_msl", "surface_pressure",
        ].join(","),
        daily: [
            "weather_code", "temperature_2m_max", "temperature_2m_min",
            "apparent_temperature_max", "apparent_temperature_min",
            "sunrise", "sunset", "sunshine_duration",
            "uv_index_max", "uv_index_clear_sky_max",
            "precipitation_sum", "precipitation_hours",
            "precipitation_probability_max",
            "wind_speed_10m_max", "wind_gusts_10m_max",
            "wind_direction_10m_dominant",
            "shortwave_radiation_sum", "et0_fao_evapotranspiration",
        ].join(","),
        forecast_days: "7",
        timezone: "auto",
    });
    const res = await fetch(`${FORECAST_BASE}?${params}`);
    if (!res.ok) throw new Error(`Weather request failed (${res.status})`);
    return res.json();
}

export async function getAirQuality(latitude, longitude) {
    const params = new URLSearchParams({
        latitude,
        longitude,
        current: [
            "european_aqi", "us_aqi", "pm10", "pm2_5",
            "carbon_monoxide", "nitrogen_dioxide",
            "sulphur_dioxide", "ozone", "uv_index",
        ].join(","),
        hourly: [
            "pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide",
            "sulphur_dioxide", "ozone", "european_aqi", "us_aqi",
            "alder_pollen", "birch_pollen", "grass_pollen",
            "mugwort_pollen", "olive_pollen", "ragweed_pollen",
            "dust", "aerosol_optical_depth", "ammonia",
        ].join(","),
        forecast_days: "5",
        timezone: "auto",
    });
    const res = await fetch(`${AIR_QUALITY_BASE}?${params}`);
    if (!res.ok) throw new Error(`Air quality request failed (${res.status})`);
    return res.json();
}

export async function getMarineForecast(latitude, longitude) {
    const params = new URLSearchParams({
        latitude,
        longitude,
        current: [
            "wave_height", "wave_direction", "wave_period",
            "wind_wave_height", "wind_wave_direction", "wind_wave_period",
            "swell_wave_height", "swell_wave_direction", "swell_wave_period",
        ].join(","),
        daily: [
            "wave_height_max", "wave_direction_dominant", "wave_period_max",
            "wind_wave_height_max", "wind_wave_direction_dominant",
            "wind_wave_period_max", "swell_wave_height_max",
            "swell_wave_direction_dominant", "swell_wave_period_max",
        ].join(","),
        forecast_days: "7",
        timezone: "auto",
    });
    const res = await fetch(`${MARINE_BASE}?${params}`);
    if (!res.ok) throw new Error(`Marine request failed (${res.status})`);
    return res.json();
}
