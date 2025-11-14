// indicator.js
import "./style.css";
import { returnWeatherIcon } from "./svg.js";

// ---- Logger Helper ----
const TAG = "indicator.js";
const log = (...args) => console.log(`[${TAG}]`, ...args);
const warn = (...args) => console.warn(`[${TAG}] ⚠️`, ...args);
const error = (...args) => console.error(`[${TAG}] ❌`, ...args);

// ---- Weather Code → Condition Mapping ----
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

function getWeatherCondition(weatherCode) {
  for (const { range, label } of weatherConditions) {
    if (weatherCode >= range[0] && weatherCode <= range[1]) return label;
  }
  warn("Unknown weather code:", weatherCode);
  return "Unknown";
}

// ---- Update Weather Indicator ----
export function updateWeatherIndicator(weatherData, locationData) {
  if (!weatherData?.current_weather) {
    error("Invalid weather data structure:", weatherData);
    return;
  }

  const indicator = document.querySelector("#indicator-icon");
  if (!indicator) {
    error("Indicator element not found!");
    return;
  }

  const { weathercode: code, temperature } = weatherData.current_weather;
  const temp = Math.round(temperature);
  const condition = getWeatherCondition(code);
  const svgIcon = returnWeatherIcon(code);

  // Update indicator display
  indicator.innerHTML = `
    <div class="flex flex-col items-center justify-center w-[90%] h-[85%]">
      <div class="mt-2" style="width: 5rem; height: 5rem;">
        ${svgIcon}
      </div>
      <div class="text-sm font-bold text-white-100">${temp}°C</div>
      <div class="text-sm mb-4 text-white-100">${condition}</div>
    </div>
  `;
}

// ---- Event Listener for Weather Updates ----
document.addEventListener("weatherUpdate", ({ detail }) => {
  const { weather, location } = detail;
  updateWeatherIndicator(weather, location);
});
