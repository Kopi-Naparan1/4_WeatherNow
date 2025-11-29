// weatherManager.js

import {
  getCityRawData,
  getCountryRawData,
  getPopulationRawData,
  getWeatherRawData,
  getDailyWeatherData,
} from "./API.js";

import { broadcastAllCacheData } from "./weatherManagerHelper.js";

// --------------------------------------------------
// Logger Helper
// --------------------------------------------------
const TAG = "WeatherManager";
const log = (...args) => console.log(`[${TAG}] ✅`, ...args);
const warn = (...args) => console.warn(`[${TAG}] ⚠️`, ...args);
const errorLog = (...args) => console.error(`[${TAG}] ❌`, ...args); // renamed to avoid shadowing

// --------------------------------------------------
// Weather Data Manager Class
// --------------------------------------------------
class WeatherDataManager {
  constructor() {
    this.cityRawDataCache = null;
    this.weatherRawDataCache = null;
    this.countryRawDataCache = null;
    this.populationRawDataCache = null;
    this.dailyWeatherDataCache = null;

    log("Initialized WeatherDataManager with empty caches.");
  }

  async fetchAllData(searchedLocation) {
    if (!searchedLocation) {
      warn("No searched location provided");
      return null;
    }

    try {
      log(`Fetching all data for: "${searchedLocation}"`);

      // 1️⃣ Fetch city data first
      const cityData = await getCityRawData(searchedLocation);
      if (!cityData) throw new Error("City data not found");

      // 2️⃣ Fetch weather, country, and population in parallel
      const [weatherRes, countryRes, populationRes, dailyWeatherDataRes] =
        await Promise.allSettled([
          getWeatherRawData(cityData.lat, cityData.lon),
          getCountryRawData(cityData.country),
          getPopulationRawData(cityData.country),
          getDailyWeatherData(cityData.lat, cityData.lon),
        ]);

      // 3️⃣ Handle any errors in parallel requests
      const failed = [
        weatherRes,
        countryRes,
        populationRes,
        dailyWeatherDataRes,
      ]
        .filter((r) => r.status === "rejected")
        .map((r) => r.reason);

      if (failed.length > 0) {
        throw new Error(
          `Some data fetch failed: ${failed.map((e) => e.message).join(", ")}`
        );
      }

      // 4️⃣ Update caches
      this.cityRawDataCache = cityData;
      this.weatherRawDataCache = weatherRes.value;
      this.countryRawDataCache = countryRes.value;
      this.populationRawDataCache = populationRes.value;
      this.dailyWeatherDataCache = dailyWeatherDataRes.value;

      log("All caches updated successfully. ✨🔥", {
        city: cityData,
        weather: weatherRes.value,
        country: countryRes.value,
        population: populationRes.value,
        daily: dailyWeatherDataRes.value,
      });

      // 5️⃣ Broadcast updated caches to listeners
      broadcastAllCacheData(this);

      // 6️⃣ Return structured data for immediate use
      return {
        cityData,
        weatherData: weatherRes.value,
        countryData: countryRes.value,
        populationData: populationRes.value,
        dailyWeatherData: dailyWeatherDataRes.value,
      };
    } catch (err) {
      errorLog("Failed to fetch all data:", err);
      // Always broadcast an error payload
      broadcastAllCacheData({ error: err.message });
      throw err;
    }
  }
}

// --------------------------------------------------
// Singleton Export
// --------------------------------------------------
const weatherManager = new WeatherDataManager();

export function getAllCacheData() {
  log("Providing current cached weather and location data.");
  return weatherManager;
}
