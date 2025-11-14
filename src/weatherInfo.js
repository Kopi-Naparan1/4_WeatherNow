// weatherInfo.js
import "./style.css";

// ---- Logger Helper ----
function fileTag() { return "weatherInfo.js"; }
function log(tag, message, ...optional) { console.log(`[${tag}]`, message, ...optional); }
function warn(tag, message, ...optional) { console.warn(`[${tag}] ⚠️`, message, ...optional); }
function error(tag, message, ...optional) { console.error(`[${tag}] ❌`, message, ...optional); }

// ---- Global State ----
let weatherData = null;
let country = null;
let countryCode = null;

// ---- Fetch Coordinates ----
export async function getCityData(city) {
  log(fileTag(), "getCityData() called");

  if (!city || typeof city !== "string") throw new Error(`[${fileTag()}] Invalid city name`);

  try {
    const sanitizedCity = encodeURIComponent(city.trim());
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${sanitizedCity}`;
    const res = await fetch(geoUrl);

    if (!res.ok) throw new Error(`[${fileTag()}] Network error: ${res.status}`);
    const data = await res.json();

    const location = data.results?.[0];
    if (!location) throw new Error(`[${fileTag()}] Location not found`);

    log(fileTag(), "Coordinates fetched successfully:", location);

    return {
      name: location.name,
      lat: location.latitude,
      lon: location.longitude,
      countryCode: location.country_code,
      country: location.country,
    };
  } catch (err) {
    error(fileTag(), "Geocoding failed:", err);
    throw new Error(`[${fileTag()}] Geocoding failed: ${err.message}`);
  }
}

// ---- Fetch Weather Data ----
export async function getWeather(lat, lon) {
  log(fileTag(), "getWeather() called");

  if (lat == null || lon == null) throw new Error(`[${fileTag()}] Invalid coordinates`);

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index,visibility,dew_point_2m,pressure_msl&timezone=auto&forecast_days=1&current_weather=true`;
    const res = await fetch(weatherUrl);

    if (!res.ok) throw new Error(`[${fileTag()}] Weather API error: ${res.status}`);
    const data = await res.json();

    log(fileTag(), "Weather data fetched successfully:", data);
    return data;
  } catch (err) {
    error(fileTag(), "Weather fetch failed:", err);
    throw new Error(`[${fileTag()}] Weather fetch failed: ${err.message}`);
  }
}

// ---- Broadcast Weather Data ----
export function broadcastWeatherData(weatherData, coordinates) {
  log(fileTag(), "broadcastWeatherData() called");

  const event = new CustomEvent("weatherUpdate", {
    detail: { weather: weatherData, location: coordinates },
  });

  document.dispatchEvent(event);
  log(fileTag(), "Weather update event dispatched:", { weatherData, coordinates });
}

// ---- Helper Functions ----
function getSearchInput() {
  const input = document.querySelector("#inputLocation");
  if (!input) warn(fileTag(), "No #inputLocation element found");
  return input;
}

// ---- Main Weather Fetch ----
export async function fetchWeatherForCity(city) {
  const coordinates = await getCityData(city);

  const data = await getWeather(coordinates.lat, coordinates.lon);
  if (!data?.current_weather) throw new Error(`[${fileTag()}] Invalid weather data received`);

  // Update global state
  weatherData = data;
  country = coordinates.country;
  countryCode = coordinates.countryCode;

  return { weatherData, coordinates };
}

// ---- Input Event Listener ----
function setupSearchListener(inputElement) {
  if (!inputElement) return;

  inputElement.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    log(fileTag(), "Enter key pressed — starting weather fetch");

    const outputElement = document.querySelector("#location");
    try {
      const city = e.target.value.trim();
      if (!city) {
        if (outputElement) outputElement.textContent = "Please enter a city";
        warn(fileTag(), "Empty city input");
        return;
      }

      const { weatherData, coordinates } = await fetchWeatherForCity(city);
      broadcastWeatherData(weatherData, coordinates);

      if (outputElement) outputElement.textContent = coordinates.name;
      log(fileTag(), "Weather data successfully broadcasted");
    } catch (err) {
      error(fileTag(), "Weather fetch error:", err);
      if (outputElement) outputElement.textContent = err.message || "Error fetching location";
    }
  });
}

// ---- Getters ----
export function getWeatherData() {
  if (!weatherData) throw new Error(`[${fileTag()}] No weather data selected`);
  return weatherData;
}

export function getCountry() {
  if (!country) throw new Error(`[${fileTag()}] No country selected`);
  return country;
}

export function getCountryCode() {
  if (!countryCode) throw new Error(`[${fileTag()}] No country selected`);
  return countryCode;
}

// ---- Initialize on DOMContentLoaded ----
document.addEventListener("DOMContentLoaded", () => {
  log(fileTag(), "DOMContentLoaded listener registered");
  const input = getSearchInput();
  setupSearchListener(input);
});
