
// --------------------------------------------------
// hourlyAdvice.js
// --------------------------------------------------

const TAG = "hourlyAdvice.js";
const log = (...args) => console.log(`[${TAG}]`, ...args);

// --------------------------------------------------
// Tone banks (simple)
// --------------------------------------------------
const TIME_TONE = {
  morning: ["Good morning", "Morning"],
  afternoon: ["This afternoon", "Afternoon"],
  evening: ["This evening", "Evening"],
  night: ["Tonight", "At night"],
};

// --------------------------------------------------
// Weather code → readable text
// --------------------------------------------------
export function mapHourlyWeatherCode(code) {
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

// --------------------------------------------------
// Determine time category
// --------------------------------------------------
export function getTimeCategoryFromISO(isoStr) {
  const d = new Date(isoStr);
  const h = d.getHours();
  if (h >= 4 && h < 11) return "morning";
  if (h >= 11 && h < 16) return "afternoon";
  if (h >= 16 && h < 20) return "evening";
  return "night";
}

// --------------------------------------------------
// Turn hourly arrays into a context for hour i
// --------------------------------------------------
export function buildHourlyContext(data, i) {
  return {
    time: data.time[i],
    temperature: data.temperature[i],
    rainChance: data.precipitationProbability[i],
    rainAmount: data.precipitation[i],
    uv: data.uvIndex[i],
    humidity: data.humidity[i],
    windSpeed: data.windSpeed[i],
    windDir: data.windDirection[i],
    condition: mapHourlyWeatherCode(data.weatherCode[i]),
    timeCategory: getTimeCategoryFromISO(data.time[i]),
  };
}

// --------------------------------------------------
// Generate advice sentence based on one hour
// --------------------------------------------------
export function composeHourlyAdvice(ctx) {
  const tone = TIME_TONE[ctx.timeCategory] || TIME_TONE.afternoon;
  const greeting = tone[Math.floor(Math.random() * tone.length)];

  const parts = [];

  // rain logic
  if (ctx.condition.toLowerCase().includes("thunderstorm") || ctx.rainChance >= 80)
    parts.push("Severe weather — best to stay indoors");
  else if (ctx.rainChance >= 50)
    parts.push("Rain likely — bring an umbrella");
  else if (ctx.rainChance >= 20)
    parts.push("Light showers possible");

  // temperature
  if (ctx.temperature >= 33)
    parts.push("High heat — stay hydrated");
  else if (ctx.temperature <= 10)
    parts.push("Cold conditions — layer up");

  // UV
  if (ctx.uv >= 8 && ["morning", "afternoon"].includes(ctx.timeCategory))
    parts.push("High UV — consider sunscreen");

  // Wind
  if (ctx.windSpeed >= 35)
    parts.push("Strong winds — be cautious outside");
  else if (ctx.windSpeed >= 20)
    parts.push("Moderate winds");

  if (!parts.length)
    return `${greeting}: Weather looks normal.`

  return `${greeting}: ${parts.join(", ")}.`;
}
