// countryDataBlock.js

// --------------------------------------------------
// Logger Helper
// --------------------------------------------------
const TAG = "countryDataBlock.js";
const log = (...args) => console.log(`[${TAG}]`, ...args);
const warn = (...args) => console.warn(`[${TAG}] ⚠️`, ...args);
const error = (...args) => console.error(`[${TAG}] ❌`, ...args);

log(`${TAG} loaded`);

// --------------------------------------------------
// Cached Data Variables
// --------------------------------------------------
let weatherRawData = null;
let countryRawData = null;
let populationRawData = null;

let timeCategory = null;
let currentTimeISO = new Date().toISOString();

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

  log("Updated caches:", {
    hasWeatherData: !!weatherRawData,
    hasCountryData: !!countryRawData,
    hasPopulationData: !!populationRawData
  });
});

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function getTimezone() {
  const tz =
    weatherRawData?.timezone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "UTC";

  log("Resolved timezone:", tz);
  return tz;
}

// --------------------------------------------------
// DOM Helpers
// --------------------------------------------------
function getCountryInfoElementBlock() {
  const element = document.querySelector("#country-location-info");

  if (!element) {
    error("Element #country-location-info not found");
    return null;
  }

  log("Country info element found.");
  return element;
}

// --------------------------------------------------
// Build API Data Object
// --------------------------------------------------
async function getAPIData() {
  try {
    if (!countryRawData) {
      warn("countryRawData is missing. Cannot build country info.");
      throw new Error("Missing countryRawData");
    }

    const population = populationRawData?.historical_population?.[0] || {
      year: "N/A",
      population: "N/A",
      percentage_of_world_population: "N/A",
    };

    log("Population data:", population);

    return {
      country: countryRawData.name || "N/A",
      countryCode: countryRawData.iso2|| "N/A",
      yearPopulation: population.year,
      formattedCountryPopulation:
        population.population !== "N/A"
          ? Number(population.population).toLocaleString()
          : "N/A",
      capital: countryRawData.capital || "N/A",
      region: countryRawData.region || "N/A",
      area: countryRawData.surface_area
        ? Number(countryRawData.surface_area).toLocaleString() + " km²"
        : "N/A",
      currency: countryRawData.currency?.name || "N/A",
      gdp: countryRawData.gdp
        ? "$" + Number(countryRawData.gdp).toLocaleString()
        : "N/A",
      worldPopulationPercentage: population.percentage_of_world_population
        ? `${population.percentage_of_world_population}%`
        : "N/A",
    };
  } catch (err) {
    error("Error building API data:", err);

    // Return safe fallback object
    return {
      country: "N/A",
      countryCode: "N/A",
      yearPopulation: "N/A",
      formattedCountryPopulation: "N/A",
      capital: "N/A",
      region: "N/A",
      area: "N/A",
      currency: "N/A",
      gdp: "N/A",
      worldPopulationPercentage: "N/A",
    };
  }
}

// --------------------------------------------------
// Clock + Country Info Renderer
// --------------------------------------------------
let clockInterval = null;

export async function countryBlock() {
  log("Rendering country block...");

  const element = getCountryInfoElementBlock();
  if (!element) return;

  if (!weatherRawData || !countryRawData) {
    warn("Country block cannot render yet. Missing cache data.");
    
  }

  if (clockInterval) {
    log("Clearing previous clock interval");
    clearInterval(clockInterval);
  }

  const apiData = await getAPIData();
  log("API data for rendering:", apiData);

  const {
    yearPopulation,
    country,
    countryCode,
    formattedCountryPopulation,
    capital,
    region,
    area,
    currency,
    gdp,
    worldPopulationPercentage,
  } = apiData;

  element.innerHTML = `
    <div class="pl-1 mt-2 pb-2 overflow-y-auto flex flex-col text-left justify-start gap-6 w-[90%] h-[90%]">
      <div class="text-white-100 text-xs">Country: <b>${country} (${countryCode})</b></div>
      <div class="text-white-100 text-xs time-display"></div>
      <div class="text-white-100 text-xs">Capital: <b>${capital}</b></div>
      <div class="text-white-100 text-xs">Region: <b>${region}</b></div>
      <div class="text-white-100 text-xs">Area: <b>${area}</b></div>
      <div class="text-white-100 text-xs">${countryCode}'s Population (${yearPopulation}): <b>${formattedCountryPopulation}</b></div>
      <div class="text-white-100 text-xs">World Population %: <b>${worldPopulationPercentage}</b></div>
      <div class="text-white-100 text-xs">GDP: <b>${gdp}</b></div>
      <div class="text-white-100 text-xs">Currency: <b>${currency}</b></div>
    </div>
  `;

  // -------------------------
  // Clock Renderer
  // -------------------------
  const timeElement = element.querySelector(".time-display");
  const tz = getTimezone();

  const options = {
    timeZone: tz,
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  function updateClock() {
    const now = new Date();
    const formatted = now.toLocaleTimeString("en-US", options);

    const tzAbbr =
      new Intl.DateTimeFormat("en", {
        timeZone: tz,
        timeZoneName: "short",
      })
        .formatToParts(now)
        .find((p) => p.type === "timeZoneName")?.value || tz;

    if (timeElement) {
      timeElement.innerHTML = `Time (${tzAbbr}): <b>${formatted}</b>`;
    }

    // log("Clock tick:", formatted);
  }

  updateClock();
  clockInterval = setInterval(updateClock, 1000);

  log("Country block rendered successfully.");
}


function broadcastTimeUpdate(category, iso) {
  const event = new CustomEvent("timeUpdate", {
    detail: { category, time: iso },
  });
  document.dispatchEvent(event);
  log("Broadcasted timeUpdate event:", { category, time: iso });
}
// Call this after setting timeCategory, e.g. after caches load:
broadcastTimeUpdate(timeCategory, currentTimeISO);