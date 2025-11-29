// src/Daily/indicator.js
import { returnWeatherIcon } from "../svg";
import { composeDailyAdvice, buildDailyContext } from "./dailyAdvice";

const TAG = "./src/Daily/dailyIndicator.js";
const log = (...args) => console.log(`[${TAG}]`, ...args);
const warn = (...args) => console.warn(`[${TAG}] ⚠️`, ...args);
const error = (...args) => console.error(`[${TAG}] ❌`, ...args);

/* ----------------------------------------------------
   WEATHER CODE MAPPER (OpenWeather → ECMWF)
---------------------------------------------------- */
function mapOpenWeatherToECMWF(code) {
  if (code === 800) return 0; // clear
  if (code === 801) return 1; // few clouds
  if (code === 802) return 2; // scattered clouds
  if (code === 803 || code === 804) return 3; // overcast

  if (code >= 500 && code <= 531) return 61; // rain
  if (code >= 600 && code <= 622) return 71; // snow
  if (code >= 200 && code <= 232) return 95; // thunder
  if (code >= 701 && code <= 799) return 45; // fog/mist

  return 0;
}

/* ----------------------------------------------------
   1. Extract DAILY data
---------------------------------------------------- */
function getDailyData(weatherData) {
  if (!weatherData) {
    error("Daily data missing or incomplete:", weatherData);
    return null;
  }

  return weatherData.list;
}

/* ----------------------------------------------------
   2. Synthesize data into arrays
---------------------------------------------------- */
function synthesizeDailyData(dailyData) {
  if (!dailyData) return null;

  let time = [];
  let tempMin = [];
  let tempMax = [];
  let pop = [];
  let rainVolume = [];
  let weatherCode = [];
  let weatherDescription = [];

  for (let d of dailyData) {
    const rawCode = d.weather?.[0]?.id ?? 800;

    time.push(d.dt * 1000);
    tempMin.push(d.temp.min);
    tempMax.push(d.temp.max);
    pop.push(Math.round((d.pop || 0) * 100));
    rainVolume.push(d.rain || 0);
    weatherCode.push(mapOpenWeatherToECMWF(rawCode));
    weatherDescription.push(d.weather?.[0]?.description || "Unknown");
  }

  return {
    time,
    tempMin,
    tempMax,
    pop,
    rainVolume,
    weatherCode,
    weatherDescription,
  };
}

/* ----------------------------------------------------
   3. Generate UI cards
---------------------------------------------------- */
function makeDailyWrapper(data) {
  if (!data || !data.time?.length) return;

  const container = document.querySelector("#daily-indicators");
  if (!container) return;

  const {
    time,
    tempMin,
    tempMax,
    pop,
    rainVolume,
    weatherCode,
    weatherDescription,
  } = data;

  container.innerHTML = "";

  for (let i = 0; i < time.length; i++) {
    const dateObj = new Date(time[i]);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
    const dateLabel = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const svgIcon = returnWeatherIcon(weatherCode[i]);

    const card = document.createElement("div");
    card.classList.add(
      "day-wrapper",
      "flex-shrink-0",
      "snap-start",
      "w-24",
      "p-2",
      "rounded-lg",
      "flex",
      "flex-col",
      "items-center",
      "text-center",
      "gap-1"
    );

    card.innerHTML = `
      <div class="text-xs opacity-80">${dayName}</div>
      <div class="text-[10px] opacity-70">${dateLabel}</div>
      <div class="mt-1 w-10 h-10">${svgIcon}</div>
      <div class="text-xs mt-1">Rain: ${pop[i]}%</div>
    `;

    container.appendChild(card);

    card.addEventListener("click", () => {
      const infoPanel = document.querySelector("#weather-location-info-daily");
      if (!infoPanel) return;

      const adviceContainer = document.querySelector("#advice-info-daily");

      const ctx = buildDailyContext(data, i);
      const advice = composeDailyAdvice(ctx);

      infoPanel.classList.add(
        "grid",
        "grid-cols-2",
        "gap-4",
        "text-left",
        "w-full"
      );

      infoPanel.innerHTML = `
        <div>Date: <span class="font-bold">${dateObj.toDateString()}</span></div>
        <div>High: <span class="font-bold">${tempMax[i]}°C</span></div>
        <div>Low: <span class="font-bold">${tempMin[i]}°C</span></div>
        <div>Rain Chance: <span class="font-bold">${pop[i]}%</span></div>
        <div>Rain Volume: <span class="font-bold">${rainVolume[i]} mm</span></div>
        <div>Condition: <span class="font-bold">${weatherDescription[i]}</span></div>
      `;

      adviceContainer.textContent = advice;
    });
  }
}

/* ----------------------------------------------------
   4. Broadcast for other modules
---------------------------------------------------- */
function broadcastSynthesizedDailyData(data) {
  const event = new CustomEvent("dailySynthesizedData", {
    detail: { synthesizedData: data },
  });
  document.dispatchEvent(event);
}

/* ----------------------------------------------------
   5. ENTRY FUNCTION
---------------------------------------------------- */
export function dailyIndicatorMain() {
  const listener = (event) => {
    const payload = event.detail?.allCacheData;
    if (!payload) return;

    const dailyWeatherData = payload.dailyWeatherDataCache;

    if (dailyWeatherData) {
      const dailyData = getDailyData(dailyWeatherData);
      const synthesizedData = synthesizeDailyData(dailyData);
      makeDailyWrapper(synthesizedData);
    }
  };

  if (!document.dailyIndicatorListenerAdded) {
    document.addEventListener("allCacheData", listener);
    document.dailyIndicatorListenerAdded = true;
  }
}
