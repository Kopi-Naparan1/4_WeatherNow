// countryData.js
import "./style.css";
import { getCountry, getCountryCode } from "./weatherInfo.js";

function fileTag() { return "countryData.js"; }
const log = (...args) => console.log(`[${TAG}]`, ...args);
const warn = (...args) => console.warn(`[${TAG}] ⚠️`, ...args);
const error = (...args) => console.error(`[${TAG}] ❌`, ...args);

// ───────────────────────────────────
// Helpers
// ───────────────────────────────────
function getTimezone(weatherData) {
  return (
    weatherData?.timezone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "UTC"
  );
}

// ───────────────────────────────────
// Population API
// ───────────────────────────────────
async function getPopulation(country) {
  if (!country) throw new Error(`[${TAG}] Country name not provided`);
  const apiKey = import.meta.env?.VITE_API_KEY || process.env.API_KEY;

  try {
    const res = await fetch(
      `https://api.api-ninjas.com/v1/population?country=${encodeURIComponent(country)}`,
      { headers: { "X-Api-Key": apiKey } }
    );
    if (!res.ok) throw new Error(`[${TAG}] HTTP ${res.status}`);

    const data = await res.json();
    if (!data?.historical_population)
      warn(TAG, "No population data returned for", country);

    return data;
  } catch (err) {
    error(TAG, "Population API error:", err);
    return { historical_population: [{ year: "N/A", population: "N/A" }] };
  }
}

// ───────────────────────────────────
// Country Info API
// ───────────────────────────────────
async function getCountryInfo(country) {
  if (!country) throw new Error(`[${TAG}] Country name not provided`);
  const apiKey = import.meta.env?.VITE_API_KEY || process.env.API_KEY;

  try {
    const res = await fetch(
      `https://api.api-ninjas.com/v1/country?name=${encodeURIComponent(country)}`,
      { headers: { "X-Api-Key": apiKey } }
    );

    if (!res.ok) throw new Error(`[${TAG}] HTTP ${res.status}`);

    const data = await res.json();
    if (!data?.[0]) {
      warn(TAG, "No country info returned for", country);
      return {};
    }
    return data[0];
  } catch (err) {
    error(TAG, "Country API error:", err);
    return {};
  }
}

// ───────────────────────────────────
// DOM Helper
// ───────────────────────────────────
function getCountryInfoBlock() {
  const element = document.querySelector("#country-location-info");
  if (!element) {
    error(TAG, "Element not found");
    return null;
  }
  return element;
}

// ───────────────────────────────────
// Fetch population + country info
// ───────────────────────────────────
async function getAPIData() {
  const country = getCountry();
  const countryCode = getCountryCode();

  if (!country) throw new Error(`[${TAG}] Country name is missing`);

  try {
    const [populationData, countryInfo] = await Promise.all([
      getPopulation(country),
      getCountryInfo(country),
    ]);

    const population =
      populationData.historical_population?.[0] || {
        year: "N/A",
        population: "N/A",
        percentage_of_world_population: "N/A",
      };

    return {
      country,
      countryCode,
      yearPopulation: population.year,
      formattedCountryPopulation:
        population.population !== "N/A"
          ? Number(population.population).toLocaleString()
          : "N/A",
      capital: countryInfo.capital || "N/A",
      region: countryInfo.region || "N/A",
      area: countryInfo.surface_area
        ? Number(countryInfo.surface_area).toLocaleString() + " km²"
        : "N/A",
      currency: countryInfo.currency?.name || "N/A",
      gdp: countryInfo.gdp
        ? "$" + Number(countryInfo.gdp).toLocaleString()
        : "N/A",
      worldPopulationPercentage: population.percentage_of_world_population
        ? `${population.percentage_of_world_population}%`
        : "N/A",
    };
  } catch (err) {
    error(TAG, "Error fetching country API data:", err);

    return {
      country: country || "N/A",
      countryCode: countryCode || "N/A",
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

// ───────────────────────────────────
// Clock + bottom block renderer
// ───────────────────────────────────
let clockInterval;
let formatted; // Required by your modules

async function bottomBlock(weatherData, coordinates) {
  const element = getCountryInfoBlock();
  if (!element) return;

  if (clockInterval) clearInterval(clockInterval);

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
  } = await getAPIData();

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

  const timeElement = element.querySelector(".time-display");
  const tz = getTimezone(weatherData);

  const options = {
    timeZone: tz,
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  function updateClock() {
    const now = new Date();
    formatted = now.toLocaleTimeString("en-US", options);

    const tzAbbr =
      new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "short" })
        .formatToParts(now)
        .find((p) => p.type === "timeZoneName")?.value || tz;

    if (timeElement) {
      timeElement.innerHTML = `Time (${tzAbbr}): <b>${formatted}</b>`;
    }
  }

  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}

// ───────────────────────────────────
// Export formatted time
// ───────────────────────────────────
export async function returnFormattedTime() {
  return formatted;
}


function broadcastTime(formattedTime) {
    const event = new CustomEvent("timeUpdate", { detail: { formattedTime } });
    document.dispatchEvent(event);
    log(fileTag(), "Time update broadcasted:", formattedTime);
}

// ───────────────────────────────────
// Weather update listener
// ───────────────────────────────────
document.addEventListener("weatherUpdate", async ({ detail }) => {
  const { weather, coordinates } = detail;
  await bottomBlock(weather, coordinates);
  const timeString = await returnFormattedTime();

  broadcastTime(timeString);
});
