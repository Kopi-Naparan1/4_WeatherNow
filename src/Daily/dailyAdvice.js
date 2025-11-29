// --------------------------------------------------
// DAILY ADVICE SYSTEM
// --------------------------------------------------

// 1. Convert ECMWF daily weather codes to readable text
export function mapDailyWeatherCode(code) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if (code === 45) return "Fog";
  if (code === 61) return "Rain";
  if (code === 71) return "Snow";
  if (code === 95) return "Thunderstorm";
  return "Unknown";
}

// 2. Build a single day context from synthesized arrays
export function buildDailyContext(data, i) {
  return {
    time: data.time[i],
    min: data.tempMin[i],
    max: data.tempMax[i],
    rainChance: data.pop[i],
    rainVolume: data.rainVolume[i],
    condition: mapDailyWeatherCode(data.weatherCode[i]),
    description: data.weatherDescription[i],
  };
}

// 3. Generate human-readable daily advice
export function composeDailyAdvice(ctx) {
  const day = new Date(ctx.time).toLocaleDateString("en-US", {
    weekday: "long",
  });

  const parts = [];

  // --- Rain / storm logic ---
  if (ctx.condition === "Thunderstorm" || ctx.rainChance >= 80) {
    parts.push("Severe weather — best to stay indoors");
  } else if (ctx.rainChance >= 50) {
    parts.push("Rain likely — bring an umbrella");
  } else if (ctx.rainChance >= 20) {
    parts.push("Light showers possible");
  }

  // --- Temperature ---
  if (ctx.max >= 33) {
    parts.push("High heat — stay hydrated");
  } else if (ctx.max <= 10) {
    parts.push("Cold day — layer up");
  }

  // --- Fog ---
  if (ctx.condition === "Fog") {
    parts.push("Reduced visibility — be cautious");
  }

  //---------------------------------------------------
  // If nothing special, say it's normal
  //---------------------------------------------------
  if (!parts.length) {
    return `${day}: Normal weather expected.`;
  }

  return `${day}: ${parts.join(", ")}.`;
}
