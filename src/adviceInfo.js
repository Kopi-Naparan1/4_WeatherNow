// advice.js
import "./style.css";

// NOTE TO SELF: I DON'T UNDERSTAND 70% OF EACH LINE IN HERE

/**
 * Time-aware single-line weather advice module.
 * Listens to:
 *  - "weatherUpdate" { detail: { weather } }
 *  - "timeUpdate" { detail: { time, category? } } (optional)
 * Updates #advice-info element in DOM.
 */

/* -------------------------
   Utility functions
------------------------- */

let timeCategory = null; // initially unknown
let weatherQueue = null; // store weather if received before time

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function safe(arr, idx, fallback) {
  return Array.isArray(arr) && typeof idx === "number" && idx >= 0 && idx < arr.length
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
  if (isNaN(d.getTime())) return;
  timeCategory = getCategoryFromHour(d.getHours());
}

/* -------------------------
   Time and context
------------------------- */
window.weatherAdviceContext = window.weatherAdviceContext || null;

/* -------------------------
   Weather mapping
------------------------- */
function mapWeatherCode(code) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
}

/* -------------------------
   Tone banks
------------------------- */
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

/* -------------------------
   Weather phrases
------------------------- */
const PHRASES = {
  severe: [
    "Severe weather — stay indoors for safety",
    "Thunderstorms expected — better stay cozy inside",
    "Stormy conditions — avoid outdoor activities",
  ],
  rainHigh: [
    "Rain likely — bring an umbrella",
    "Expect showers — don’t forget your raincoat",
    "Rainy conditions — keep dry",
  ],
  rainLight: [
    "Light showers possible — minor chance of drizzle",
    "Some drizzle may occur — take a small umbrella just in case",
  ],
  heat: [
    "Hot and humid — stay hydrated",
    "Heat is intense — drink plenty of water",
  ],
  cold: [
    "Cold weather — wrap up warmly",
    "Chilly conditions — wear a jacket",
  ],
  uv: [
    "High UV — use sunscreen",
    "UV is strong — wear a hat and sunscreen",
  ],
  wind: [
    "Windy conditions — secure loose items",
    "Strong gusts — be cautious outdoors",
  ],
  visibility: [
    "Low visibility — drive carefully",
    "Hazy conditions — reduce speed while driving",
  ],
  overcast: [
    "Overcast skies — little sunlight",
    "Cloudy conditions — muted daylight",
  ],
  neutral: [
    "Weather looks normal for now",
    "No major alerts — have a good day",
  ],
};

/* -------------------------
   Compose advice
------------------------- */
function composeAdvice(ctx) {
  const parts = [];

  // ---- Severe / Rain first ----
  if (ctx.condition?.toLowerCase().includes("thunderstorm") || ctx.rainChance >= 80) {
    parts.push(`${pick(TONE[timeCategory].greeting)}: Severe weather — stay indoors`);
  } else if (ctx.rainChance >= 50) {
    parts.push(`${pick(TONE[timeCategory].greeting)}: Rain likely — bring an umbrella`);
  } else if (ctx.rainChance >= 20) {
    parts.push(`Light showers possible — minor chance of drizzle`);
  }

  // ---- Temperature ----
  if (ctx.feels >= 35) {
    parts.push("Hot and humid — stay hydrated");
  } else if (ctx.feels <= 10) {
    parts.push("Cold weather — wrap up warmly");
  }

  // ---- UV ----
  if (ctx.uv >= 11) {
    parts.push("Extreme UV — avoid sun exposure");
  } else if (ctx.uv >= 8) {
    if (timeCategory === "morning" || timeCategory === "afternoon") {
      parts.push("Moderate UV — wear sunscreen if outside");
    }
  }

  // ---- Wind ----
  if (ctx.windSpeed >= 35) {
    parts.push("Windy conditions — secure loose items");
  } else if (ctx.windSpeed >= 20 && timeCategory !== "night") {
    parts.push("Moderate wind — be cautious outdoors");
  }

  // ---- Visibility ----
  if (ctx.visibilityKm !== null && ctx.visibilityKm <= 5) {
    parts.push("Low visibility — drive carefully");
  }

  // ---- Cloud cover (time-aware) ----
  if (ctx.cloudCover >= 90 && parts.length === 0) {
    if (timeCategory === "morning") parts.push("Overcast morning — take it easy outside");
    else if (timeCategory === "afternoon") parts.push("Cloudy afternoon — muted sunlight");
    else if (timeCategory === "evening") parts.push("Cloudy evening — cool and calm");
    else parts.push("Cloudy night — low visibility outside");
  }

  // ---- Dew point ----
  if (ctx.dewPoint >= 24 && ctx.temp >= 30) {
    parts.push("High dew point — feels muggy");
  }

  // ---- Neutral ----
  if (!parts.length) {
    const tone = TONE[timeCategory] || TONE.afternoon;
    return `${pick(tone.greeting)}! It's ${pick(tone.positive)} — ${pick(tone.casual)}.`;
  }

  // ---- Combine advice ----
  const greeting = Math.random() < 0.5 ? `${pick(TONE[timeCategory].greeting)}:` : "";
  const sentence = `${greeting} ${parts.join(", ")}`.replace(/\s+/g, " ").trim();
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

/* -------------------------
   Parse raw API weather
------------------------- */
function parseWeatherRaw(raw) {
  if (!raw) return null;
  const hourly = raw.hourly || {};
  const current = raw.current_weather || {};
  let hourIndex = Array.isArray(hourly.time) && current.time ? hourly.time.indexOf(current.time) : -1;
  if (hourIndex === -1) hourIndex = new Date().getHours();

  const temp = Number(current.temperature ?? safe(hourly.temperature_2m, hourIndex, 0));
  const feels = Number(safe(hourly.apparent_temperature, hourIndex, temp));
  const rainChance = Number(safe(hourly.precipitation_probability, hourIndex, 0));
  const rainAmount = Number(safe(hourly.precipitation, hourIndex, 0));
  const humidity = Number(safe(hourly.relative_humidity_2m, hourIndex, 0));
  const uv = Number(safe(hourly.uv_index, hourIndex, 0));
  const windSpeed = Number(safe(hourly.wind_speed_10m, hourIndex, 0));
  const windDir = Number(safe(hourly.wind_direction_10m, hourIndex, 0));
  const visibility = safe(hourly.visibility, hourIndex, null);
  const visibilityKm = visibility === null ? null : +(visibility / 1000).toFixed(1);
  const cloudCover = Number(safe(hourly.cloud_cover, hourIndex, 0));
  const dewPoint = Number(safe(hourly.dew_point_2m, hourIndex, 0));
  const pressure = Number(safe(hourly.pressure_msl, hourIndex, 1013));
  const code = Number(current.weather_code ?? safe(hourly.weather_code, hourIndex, 0));
  const condition = mapWeatherCode(code);

  return {
    temp, feels, rainChance, rainAmount, humidity, uv,
    windSpeed, windDir, visibility, visibilityKm,
    cloudCover, dewPoint, pressure, condition,
  };
}

/* -------------------------
   Render advice into DOM
------------------------- */
let lastAdvice = "";

function renderAdviceIfReady() {
  if (!timeCategory || !window.weatherAdviceContext) return;
  const line = composeAdvice(window.weatherAdviceContext);
  const el = document.querySelector("#advice-info");
  if (!el) return;
  el.textContent = line;
}



/* -------------------------
   Event listeners
------------------------- */


// Weather listener
document.addEventListener("weatherUpdate", ({ detail }) => {
  if (!detail || !detail.weather) return;
  window.weatherAdviceContext = parseWeatherRaw(detail.weather);
  renderAdviceIfReady();
});

// Time listener
document.addEventListener("timeUpdate", ({ detail }) => {
  try {
    if (detail?.category && ["morning","afternoon","evening","night"].includes(detail.category)) {
      timeCategory = detail.category;
    } else {
      const d = detail?.time ? new Date(detail.time) : new Date();
      if (!isNaN(d.getTime())) timeCategory = getCategoryFromHour(d.getHours());
    }
    renderAdviceIfReady();
  } catch (err) {
    console.error(err);
  }
});


/* -------------------------
   Exports
------------------------- */
export { composeAdvice, parseWeatherRaw, mapWeatherCode };
