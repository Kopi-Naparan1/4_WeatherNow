const TAG = "API.js";

const log = (...args) => console.log(`[${TAG}] ✅`, ...args);
const warn = (...args) => console.warn(`[${TAG}] ⚠️`, ...args);
const error = (...args) => console.error(`[${TAG}] ❌`, ...args);

const API_KEY = import.meta.env?.VITE_API_KEY || process.env.API_KEY;
const DAILY_API_KEY =
  import.meta.env?.VITE_DAILY_API_KEY || process.env.DAILY_API_KEY;

if (!DAILY_API_KEY) {
  warn(
    "Daily API key not found! Make sure VITE_DAILY_API_KEY or DAILY_API_KEY is set."
  );
}
if (!API_KEY) {
  warn("No API key found! Make sure VITE_API_KEY or API_KEY is set.");
}
console.log("API keys:", API_KEY, "and", DAILY_API_KEY);
// -----------------------------
// Country API
// -----------------------------
export async function getCountryRawData(country) {
  log("getCountryRawData() called with:", country);
  if (!country) throw new Error(`[${TAG}] Country name not provided`);

  try {
    const res = await fetch(
      `https://api.api-ninjas.com/v1/country?name=${encodeURIComponent(country)}`,
      { headers: { "X-Api-Key": API_KEY } }
    );

    if (!res.ok) throw new Error(`[${TAG}] HTTP ${res.status}`);
    const data = await res.json();

    if (!data?.[0]) {
      warn("No country info returned for:", country);
      return null;
    }

    log("Country data fetched:", data[0]);
    return data[0];
  } catch (err) {
    error("Country API error:", err);
    return null;
  }
}

// -----------------------------
// Population API
// -----------------------------
export async function getPopulationRawData(country) {
  log("getPopulationRawData() called with:", country);
  if (!country) throw new Error(`[${TAG}] Country name not provided`);

  try {
    const res = await fetch(
      `https://api.api-ninjas.com/v1/population?country=${encodeURIComponent(country)}`,
      { headers: { "X-Api-Key": API_KEY } }
    );

    if (!res.ok) throw new Error(`[${TAG}] HTTP ${res.status}`);
    const data = await res.json();

    if (!data?.historical_population) {
      warn("No population data returned for:", country);
      return { historical_population: [] };
    }

    log("Population data fetched");
    return data;
  } catch (err) {
    error("Population API error:", err);
    return { historical_population: [{ year: "N/A", population: "N/A" }] };
  }
}

// -----------------------------
// City / Coordinates API
// -----------------------------
export async function getCityRawData(city) {
  log("getCityRawData() called with:", city);
  if (!city || typeof city !== "string")
    throw new Error(`[${TAG}] Invalid city name`);

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}`;
    const res = await fetch(geoUrl);

    if (!res.ok) throw new Error(`[${TAG}] Network error: ${res.status}`);
    const data = await res.json();

    const location = data.results?.[0];
    if (!location) {
      warn("Location not found for:", city);
      return null;
    }

    log("Coordinates fetched:", location);
    return {
      name: location.name,
      lat: location.latitude,
      lon: location.longitude,
      countryCode: location.country_code,
      country: location.country,
    };
  } catch (err) {
    error("Geocoding failed:", err);
    return null;
  }
}

// -----------------------------
// Weather API
// -----------------------------
export async function getWeatherRawData(lat, lon) {
  log("getWeatherRawData() called with:", lat, lon);
  if (lat == null || lon == null)
    throw new Error(`[${TAG}] Invalid coordinates`);

  try {
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index,visibility,dew_point_2m,pressure_msl` +
      `&timezone=auto&forecast_days=1&current_weather=true`;

    const res = await fetch(weatherUrl);

    if (!res.ok) throw new Error(`[${TAG}] Weather API error: ${res.status}`);
    const data = await res.json();

    log("Weather data fetched");
    return data;
  } catch (err) {
    error("Weather fetch failed:", err);
    return null;
  }
}

export async function getDailyWeatherData(lat, lon) {
  log("getDailyWeatherData() called with:", lat, lon);

  if (lat == null || lon == null)
    throw new Error(`[${TAG}] Invalid coordinates`);

  try {
    const url = `https://pro.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=${DAILY_API_KEY}
    `;

    const res = await fetch(url);

    if (!res.ok) throw new Error(`[${TAG}] Weather API error: ${res.status}`);

    const data = await res.json();
    console.log("getDailyWeatherData()", data);
    return data;
  } catch (err) {
    error("Weather fetch failed:", err);
    return null;
  }
}
