import { returnWeatherIcon } from "../svg";
import { buildHourlyContext, composeHourlyAdvice } from "./hourlyAdvice";

const TAG = "./src/Hourly/indicator.js";
const log = (...args) => console.log(`[${TAG}]`, ...args);
const warn = (...args) => console.warn(`[${TAG}] ⚠️`, ...args);
const error = (...args) => console.error(`[${TAG}] ❌`, ...args);

let weatherRawData;
let countryRawData;
let populationRawData;

// 1
function getHourlyData(weatherData) {
  if (!weatherData || !weatherData.hourly) {
    error("Hourly data is missing or incomplete:", weatherData);

    return null;
  }

  const hourlyData = weatherData.hourly;
  log("Extracted hourly data:", hourlyData);
  return hourlyData;
}

// 2
function synthesizeHourlyData(hourlyData) {
  if (!hourlyData || hourlyData.length === 0) {
    error("Hourly data is missing or incomplete:", hourlyData);

    return null;
  }

  let temperature = hourlyData.temperature_2m;
  let precipitation = hourlyData.precipitation;
  let precipitationProbability = hourlyData.precipitation_probability;
  let time = hourlyData.time;
  let weatherCode = hourlyData.weather_code;
  let uvIndex = hourlyData.uv_index;
  let humidity = hourlyData.relative_humidity_2m;
  let windDirection = hourlyData.wind_direction_10m;
  let windSpeed = hourlyData.wind_speed_10m;

  let synthesizedData = {
    temperature,
    precipitation,
    precipitationProbability,
    time,
    weatherCode,
    uvIndex,
    humidity,
    windDirection,
    windSpeed,
  };

  return synthesizedData;
}

// 3
function makeIndividualWrapper(synthesizedData) {
  let {
    temperature,
    precipitation,
    precipitationProbability,
    time,
    weatherCode,
    uvIndex,
    humidity,
    windDirection,
    windSpeed,
  } = synthesizedData;

  const container = document.querySelector("#hourly-indicators");
  if (!synthesizedData || !synthesizedData.time) {
    error("Synthesized data is missing or incomplete:", synthesizedData);
    return;
  }

  const len = synthesizedData.time.length;
  broadcastSynthesizedData(synthesizedData);
  container.innerHTML = "";
  for (let i = 0; i < len; i++) {
    let svgIcon = returnWeatherIcon(weatherCode[i]);
    let hour = parseInt(time[i].split("T")[1].split(":")[0]);
    let period = hour >= 12 ? "pm" : "am";
    let displayTime = hour % 12 || 12; // Convert 0 to 12 for 12am
    displayTime = `${displayTime} ${period}`;
    let precipDisplay = `${precipitationProbability[i]}%`;
    let windDirectionDisplay = `${windDirection[i]}°`;
    let windSpeedDisplay = `${windSpeed[i]} km/h`;

    const wrapper = document.createElement("div");
    wrapper.classList.add(
      "hour-wrapper",
      "flex-shrink-0",
      "snap-start",
      "w-24",
      "p-2",
      "rounded-lg",
      "flex",
      "flex-col",
      "justify-start",
      "items-center",
      "text-center",
      "gap-1"
    );

    wrapper.innerHTML = `
      <div class="time mt-1  w-20 h-5">${displayTime}</div>
      <div class="mt-2 text-sm font-bold text-white-100 w-10 h-10" >${svgIcon}</div>
      <div class="text-sm mb-3 text-white-100">Rain: ${precipDisplay}</div>`;

    container.appendChild(wrapper);

    wrapper.addEventListener("click", () => {
      const infoContainer = document.querySelector(
        "#weather-location-info-hourly"
      );
      const adviceContainer = document.querySelector("#advice-info-hourly");

      const ctx = buildHourlyContext(synthesizedData, i);
      const advice = composeHourlyAdvice(ctx);

      infoContainer.classList.add(
        "grid",
        "grid-cols-2",
        "gap-4",
        "text-center",
        "w-full"
      );

      infoContainer.innerHTML = `
            <div class=" rounded-xl p-3 "> Time: <span class="font-bold">${displayTime}</span></div>
            <div class=" rounded-xl p-3  ">Temp: <span class="font-bold">${temperature[i]}°C</span></div>
            <div class=" rounded-xl p-3 ">Rain Chance: <span class="font-bold">${precipitationProbability[i]}%</span></div>
            <div class=" rounded-xl p-3 ">UV index: <span class="font-bold">${uvIndex[i]}</span></div>
            <div class=" rounded-xl p-3 ">Humidity: <span class="font-bold">${humidity[i]}%</span></div>
            <div class=" rounded-xl p-3 ">Wind Direction: <span class="font-bold">${windDirectionDisplay}</span></div>
            <div class=" rounded-xl p-3 ">Wind Speed: <span class="font-bold">${windSpeedDisplay}</span></div>  
      `;

      adviceContainer.textContent = advice;
      // infoContainer.appendChild(info);
    });
  }
}

// 4
function broadcastSynthesizedData(synthesizedData) {
  log("Broadcasting synthesized data", synthesizedData);
  const event = new CustomEvent("synthesizedData", () => {
    detail: {
      synthesizedData: synthesizedData;
    }
  });
  log("broadcasted event: ", event);
  document.dispatchEvent(event);
}

export function hourIndicatorMain() {
  // Only add the listener once
  const listener = (event) => {
    console.log(
      "Received payload keys at hourly indicator.js:",
      Object.keys(event.detail?.allCacheData || {})
    );
    const payload = event.detail?.allCacheData;

    if (!payload) {
      warn("No cache data received");
      return;
    }

    // Extract caches
    weatherRawData = payload.weatherRawDataCache;
    countryRawData = payload.countryRawDataCache;
    populationRawData = payload.populationRawDataCache;

    log("Updated caches at hourly indicator.js:", {
      hasWeatherData: !!weatherRawData,
      hasCountryData: !!countryRawData,
      hasPopulationData: !!populationRawData,
    });

    // Only run if weather data exists
    if (weatherRawData) {
      const hourlyData = getHourlyData(weatherRawData);
      const synthesizedData = synthesizeHourlyData(hourlyData);
      makeIndividualWrapper(synthesizedData);
    }
  };

  // Add event listener once
  document.addEventListener("allCacheData", listener);
}
