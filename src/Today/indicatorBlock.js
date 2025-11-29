import { returnWeatherIcon } from "../svg";

// --------------------------------------------------
// Logger Helper
// --------------------------------------------------
const TAG = "IndicatorBlock.js";
const log = (...args) => console.log(`[${TAG}]`, ...args);
const warn = (...args) => console.warn(`[${TAG}] ⚠️`, ...args);
const error = (...args) => console.error(`[${TAG}] ❌`, ...args);

log("Module loaded successfully.");

// --------------------------------------------------
// Weather Code → Condition Mapping
// --------------------------------------------------
const weatherConditions = [
  { range: [0, 0], label: "Clear" },
  { range: [1, 3], label: "Partly Cloudy" },
  { range: [45, 48], label: "Fog" },
  { range: [51, 67], label: "Rain" },
  { range: [71, 77], label: "Snow" },
  { range: [80, 82], label: "Showers" },
  { range: [85, 86], label: "Snow Showers" },
  { range: [95, 99], label: "Thunderstorm" },
];

let weatherRawData = null;

// --------------------------------------------------
// Listen for all cached data
// --------------------------------------------------
document.addEventListener("allCacheData", (event) => {
  if (!event.detail?.allCacheData) {
    warn("No allCacheData received from weatherManager.");
    return;
  }

  log("Received all cached data from weatherManager.");
  const allCacheData = event.detail.allCacheData;

  log("All cached data:✨✨✨🔥", allCacheData);
  weatherRawData = allCacheData.weatherRawDataCache;
  log("Weather raw data updated from cache:", weatherRawData);
});

// --------------------------------------------------
// Resolve Weather Condition
// --------------------------------------------------
export function getWeatherCondition(weatherCode) {
  log("Determining weather condition for code:", weatherCode);

  for (const { range, label } of weatherConditions) {
    if (weatherCode >= range[0] && weatherCode <= range[1]) {
      log(`Matched weather condition: "${label}"`);
      return label;
    }
  }

  warn("No matching weather condition found for code:", weatherCode);
  return "Unknown";
}

// --------------------------------------------------
// Update Weather Indicator in DOM
// --------------------------------------------------
export function updateWeatherIndicator(weatherData = weatherRawData) {
  log("", weatherData);

  const indicator = document.querySelector("#indicator-icon");

  const { weathercode: code, temperature } = weatherData.current_weather;
  log("Extracted current weather:", { code, temperature });

  const temp = Math.round(temperature);
  const condition = getWeatherCondition(code);
  const svgIcon = returnWeatherIcon(code);

  console.log(`(TEMP, CONDITION, SVGICON) ${temp} ${condition} ${svgIcon}`);

  if (!svgIcon) warn(`No SVG icon returned for weather code: ${code}`);

  indicator.innerHTML = `
    <div class="flex flex-col items-center justify-center w-[90%] h-[85%]">
      <div class="mt-2" style="width: 5rem; height: 5rem;">
        ${svgIcon}
      </div>
      <div class="text-sm font-bold text-white-100">${temp}°C</div>
      <div class="text-sm mb-4 text-white-100">${condition}</div>
    </div>
  `;

  log("Weather indicator successfully updated in DOM:", { temp, condition });
}
