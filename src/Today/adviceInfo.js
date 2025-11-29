// adviceInfo.js

// --------------------------------------------------
// Logger Helper
// --------------------------------------------------
const TAG = "adviceInfo.js";
const log = (...args) => console.log(`[${TAG}]`, ...args);
const warn = (...args) => console.warn(`[${TAG}] ⚠️`, ...args);
const error = (...args) => console.error(`[${TAG}] ❌`, ...args);

log("Module loaded");

// --------------------------------------------------
// State
// --------------------------------------------------

let weatherQueue = null;

export let timeCategory = null;
export let currentTimeISO = new Date().toISOString();

window.weatherAdviceContext = window.weatherAdviceContext || null;

// --------------------------------------------------
// Utility helpers
// --------------------------------------------------
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function safe(arr, idx, fallback) {
  return Array.isArray(arr) && idx >= 0 && idx < arr.length
    ? arr[idx]
    : fallback;
}

function getCategoryFromHour(h) {
  if (h >= 4 && h < 11) return "morning";
  if (h >= 11 && h < 16) return "afternoon";
  if (h >= 16 && h < 20) return "evening";
  return "night";
}

function setTimeCategoryFromISO(isoString) {
  const d = isoString ? new Date(isoString) : new Date();
  if (isNaN(d.getTime())) {
    warn("Invalid ISO date passed:", isoString);
    return;
  }
  currentTimeISO = d.toISOString(); // <--- add this
  timeCategory = getCategoryFromHour(d.getHours());
  log("Time category set from ISO:", timeCategory);
}

// --------------------------------------------------
// Weather mapping
// --------------------------------------------------
function mapWeatherCode(code) {
  log("mapWeatherCode called:", code);

  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  warn("Unknown weather code:", code);
  return "Unknown";
}

// --------------------------------------------------
// Tone banks
// --------------------------------------------------
const TONE = {
  morning: {
    greeting: ["Good morning", "Morning"],
    positive: ["lovely", "bright", "great"],
    casual: ["perfect for a jog", "great for a walk", "nice for errands"],
  },
  afternoon: {
    greeting: ["This afternoon", "This afternoon"],
    positive: ["pleasant", "nice", "fine"],
    casual: ["ok for outdoor plans", "suitable for short trips"],
  },
  evening: {
    greeting: ["This evening", "Tonight", "Evening"],
    positive: ["calm", "mild", "relaxed"],
    casual: ["good for a stroll", "nice to unwind outside"],
  },
  night: {
    greeting: ["Tonight", "At night"],
    positive: ["quiet", "cool", "calm"],
    casual: ["low activity hours", "stay cautious on the roads"],
  },
};

// --------------------------------------------------
// Phrasing banks
// --------------------------------------------------
const PHRASES = {
  severe: ["Severe weather — stay indoors for safety"],
  rainHigh: ["Rain likely — bring an umbrella"],
  rainLight: ["Light showers possible — minor chance of drizzle"],
  heat: ["Hot and humid — stay hydrated"],
  cold: ["Cold weather — wrap up warmly"],
  uv: ["High UV — use sunscreen"],
  wind: ["Windy conditions — secure loose items"],
  visibility: ["Low visibility — drive carefully"],
  overcast: ["Overcast skies — little sunlight"],
  neutral: ["Weather looks normal for now"],
};

// --------------------------------------------------
// Generate the advice sentence
// --------------------------------------------------
function composeAdvice(ctx) {
  log("composeAdvice() called with:", ctx);

  const parts = [];

  // Rain + severe
  if (
    ctx.condition?.toLowerCase().includes("thunderstorm") ||
    ctx.rainChance >= 80
  ) {
    parts.push(
      `${pick(TONE[timeCategory].greeting)}: Severe weather — stay indoors`
    );
  } else if (ctx.rainChance >= 50) {
    parts.push(
      `${pick(TONE[timeCategory].greeting)}: Rain likely — bring an umbrella`
    );
  } else if (ctx.rainChance >= 20) {
    parts.push("Light showers possible — minor chance of drizzle");
  }

  // Temperature
  if (ctx.feels >= 35) parts.push("Hot and humid — stay hydrated");
  else if (ctx.feels <= 10) parts.push("Cold weather — wrap up warmly");

  // UV
  if (ctx.uv >= 11) {
    parts.push("Extreme UV — avoid sun exposure");
  } else if (
    ctx.uv >= 8 &&
    (timeCategory === "morning" || timeCategory === "afternoon")
  ) {
    parts.push("Moderate UV — wear sunscreen if outside");
  }

  // Wind
  if (ctx.windSpeed >= 35) parts.push("Windy conditions — secure loose items");
  else if (ctx.windSpeed >= 20 && timeCategory !== "night") {
    parts.push("Moderate wind — be cautious outdoors");
  }

  // Visibility
  if (ctx.visibilityKm !== null && ctx.visibilityKm <= 5) {
    parts.push("Low visibility — drive carefully");
  }

  // Cloud cover
  if (ctx.cloudCover >= 90 && parts.length === 0) {
    if (timeCategory === "morning")
      parts.push("Overcast morning — take it easy outside");
    else if (timeCategory === "afternoon")
      parts.push("Cloudy afternoon — muted sunlight");
    else if (timeCategory === "evening")
      parts.push("Cloudy evening — cool and calm");
    else parts.push("Cloudy night — low visibility outside");
  }

  // Dew point
  if (ctx.dewPoint >= 24 && ctx.temp >= 30) {
    parts.push("High dew point — feels muggy");
  }

  // Nothing special → neutral tone sentence
  if (!parts.length) {
    const tone = TONE[timeCategory] || TONE.afternoon;
    const line = `${pick(tone.greeting)}! It's ${pick(tone.positive)} — ${pick(tone.casual)}.`;
    log("composeAdvice() neutral output:", line);
    return line;
  }

  // Build sentence
  const greeting =
    Math.random() < 0.5 ? `${pick(TONE[timeCategory].greeting)}:` : "";
  const sentence = `${greeting} ${parts.join(", ")}`.trim() + ".";
  log("composeAdvice() final output:", sentence);

  return sentence;
}

// --------------------------------------------------
// Parse raw API weather into context object
// --------------------------------------------------
let weatherRawData = null;
let countryRawData = null;
let populationRawData = null;

// --------------------------------------------------
// Receive Cache Updates
// --------------------------------------------------
document.addEventListener("allCacheData", (event) => {
  console.log('Received payload keys:', Object.keys(event.detail?.allCacheData || {}));
  const payload = event.detail?.allCacheData;
  
  if (!payload) {
    warn("No cache data received");
    return;
  }

  // Use the exact property names that are being broadcast
  weatherRawData = payload.weatherRawDataCache;
  countryRawData = payload.countryRawDataCache;  // Fixed property name
  populationRawData = payload.populationRawDataCache;  // Fixed property name
  window.weatherAdviceContext = parseWeatherRaw(weatherRawData);
  renderAdviceIfReady();

  log("Updated caches:", {
    hasWeatherData: !!weatherRawData,
    hasCountryData: !!countryRawData,
    hasPopulationData: !!populationRawData
  });
});


function parseWeatherRaw(raw = weatherRawData) {
  log("parseWeatherRaw() called:", raw);

  if (!raw) {
    warn("parseWeatherRaw received null raw");
    return null;
  }

  const hourly = raw.hourly || {};
  const current = raw.current_weather || {};

  let hourIndex =
    Array.isArray(hourly.time) && current.time
      ? hourly.time.indexOf(current.time)
      : -1;

  if (hourIndex === -1) hourIndex = new Date().getHours();

  const temp = Number(
    current.temperature ?? safe(hourly.temperature_2m, hourIndex, 0)
  );
  const feels = Number(safe(hourly.apparent_temperature, hourIndex, temp));
  const rainChance = Number(
    safe(hourly.precipitation_probability, hourIndex, 0)
  );
  const rainAmount = Number(safe(hourly.precipitation, hourIndex, 0));
  const humidity = Number(safe(hourly.relative_humidity_2m, hourIndex, 0));
  const uv = Number(safe(hourly.uv_index, hourIndex, 0));
  const windSpeed = Number(safe(hourly.wind_speed_10m, hourIndex, 0));
  const windDir = Number(safe(hourly.wind_direction_10m, hourIndex, 0));
  const visibility = safe(hourly.visibility, hourIndex, null);
  const visibilityKm =
    visibility === null ? null : +(visibility / 1000).toFixed(1);
  const cloudCover = Number(safe(hourly.cloud_cover, hourIndex, 0));
  const dewPoint = Number(safe(hourly.dew_point_2m, hourIndex, 0));
  const pressure = Number(safe(hourly.pressure_msl, hourIndex, 1013));
  const code = Number(
    current.weather_code ?? safe(hourly.weather_code, hourIndex, 0)
  );
  const condition = mapWeatherCode(code);

  const parsed = {
    temp,
    feels,
    rainChance,
    rainAmount,
    humidity,
    uv,
    windSpeed,
    windDir,
    visibility,
    visibilityKm,
    cloudCover,
    dewPoint,
    pressure,
    condition,
  };

  log("Parsed weather raw:", parsed);
  return parsed;
}

// --------------------------------------------------
// Render advice
// --------------------------------------------------
export function renderAdviceIfReady() {
  log("renderAdviceIfReady() called", {
    timeCategory,
    context: window.weatherAdviceContext,
  });

  if (!timeCategory || !window.weatherAdviceContext) {
    log("Waiting for both time + weather context");
    return;
  }

  const el = document.querySelector("#advice-info");
  if (!el) {
    warn("#advice-info element not found");
    return;
  }

  const line = composeAdvice(window.weatherAdviceContext);
  el.textContent = line;
  log("Advice updated →", line);
}

// --------------------------------------------------
// Event listeners
// --------------------------------------------------
document.addEventListener("timeUpdate", ({ detail }) => {
  log("timeUpdate event received:", detail);

  try {
    const now = detail?.time ? new Date(detail.time) : new Date();
    if (!isNaN(now.getTime())) {
      currentTimeISO = now.toISOString(); // export current ISO time
      if (detail?.category && ["morning", "afternoon", "evening", "night"].includes(detail.category)) {
        timeCategory = detail.category;
        log("Time category set explicitly:", timeCategory);
      } else {
        timeCategory = getCategoryFromHour(now.getHours());
        log("Time category computed:", timeCategory);
      }
      renderAdviceIfReady();
    }
  } catch (err) {
    error("Error running timeUpdate:", err);
  }
});

function broadcastTimeUpdate() {
  const event = new CustomEvent("timeUpdate", {
    detail: {
      category: timeCategory,
      time: currentTimeISO,
    },
  });
  document.dispatchEvent(event);
  log("Broadcasted timeUpdate event:", { timeCategory, currentTimeISO });
}

setTimeCategoryFromISO(weatherRawData?.current_weather?.time);
broadcastTimeUpdate();