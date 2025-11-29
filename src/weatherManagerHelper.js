// weatherManagerHelper.js

import { getDailyWeatherData } from "./API.js";
import { getAllCacheData } from "./weatherManager.js";

// --------------------------------------------------
// Logger Helper
// --------------------------------------------------
const TAG = "WeatherManagerHelper";
const log = (...args) => console.log(`[${TAG}] ✅`, ...args);
const warn = (...args) => console.warn(`[${TAG}] ⚠️`, ...args);
const error = (...args) => console.error(`[${TAG}] ❌`, ...args);

// --------------------------------------------------
// DOM Helpers
// --------------------------------------------------
export function getSearchInputElement() {
  log("Locating the search input field for the user.");
  const inputElement = document.querySelector("#inputLocation");

  if (!inputElement) {
    warn(
      "Cannot find the input field (#inputLocation). User cannot enter a city."
    );
  } else {
    log("Search input field located successfully.");
  }

  return inputElement;
}

// --------------------------------------------------
// Event Broadcasting
// --------------------------------------------------
export function broadcastSearchedLocation(location) {
  log(`Broadcasting the searched location: "${location}" to all listeners.`);
  const event = new CustomEvent("searchedLocation", {
    detail: { searchedLocation: location },
  });
  document.dispatchEvent(event);
}

export function broadcastAllCacheData(allCacheData) {
  const payload = {
    weatherRawDataCache: allCacheData?.weatherRawDataCache || null,
    cityRawDataCache: allCacheData?.cityRawDataCache || null,
    countryRawDataCache: allCacheData?.countryRawDataCache || null,
    populationRawDataCache: allCacheData?.populationRawDataCache || null,
    dailyWeatherDataCache: allCacheData?.dailyWeatherDataCache || null,
    error: allCacheData?.error || null,
  };

  log("Broadcasting all current cached data to listeners.", payload);
  const event = new CustomEvent("allCacheData", {
    detail: { allCacheData: payload },
  });
  document.dispatchEvent(event);
}

// --------------------------------------------------
// Input Event Listener
// --------------------------------------------------
export function setupSearchedLocation() {
  const inputElement = getSearchInputElement();
  if (!inputElement) return;

  inputElement.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    let city = e.target.value.trim();
    city = titleCase(city);
    const outputElement = document.querySelector("#location");

    if (!city) {
      log("The search input is empty. Prompting user to enter a city.");
      if (outputElement) outputElement.textContent = "Please enter a city";
      return;
    }

    try {
      log(`Fetching weather data for "${city}"...`);
      const weatherManager = getAllCacheData();
      await weatherManager.fetchAllData(city);

      log(`Successfully retrieved data for "${city}".`);

      // Broadcast updates
      broadcastSearchedLocation(city);
      broadcastAllCacheData(weatherManager);

      if (outputElement) {
        outputElement.textContent = city;
        e.target.value = "";
      }
    } catch (err) {
      error(
        "Failed to fetch weather data. Please check the city name or network connection.",
        err
      );
      broadcastAllCacheData({ error: err.message });
      if (outputElement) {
        outputElement.textContent = "Error fetching location";
      }
    }
  });
}

function titleCase(str) {
  const smallWords = [
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "for",
    "in",
    "nor",
    "of",
    "on",
    "or",
    "the",
    "to",
    "up",
    "yet",
    "so",
  ];

  const words = str.toLowerCase().split(" ");

  return words
    .map((word, index) => {
      // Always capitalize first or last word
      if (index === 0 || index === words.length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      // Capitalize if not a small word
      if (!smallWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      // Keep small words lowercase
      return word;
    })
    .join(" ");
}
