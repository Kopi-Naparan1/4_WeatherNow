// src/Hourly/hourlyMain.js
import { hourIndicatorMain } from "./indicator.js";

const TAG = "src/Hourly/hourlyMain.js";
const log = (...args) => console.log(`[${TAG}]`, ...args);
const warn = (...args) => console.warn(`[${TAG}] ⚠️`, ...args);
const error = (...args) => console.error(`[${TAG}] ❌`, ...args);

export const hourlyView = {
  initialize() {
    this.render(); // render once (persistent)
    this.setupEventListeners();
    hourIndicatorMain();
  },

  render() {
    const container = document.querySelector("#weather-info-container");

    if (!container) {
      error("#hourly-indicators not found in DOM");
      return;
    }

    // If already rendered → do NOT re-render
    if (container.querySelector("#hourly-view")) return;

    // Create wrapper div
    const view = document.createElement("div");
    view.id = "hourly-view";
    view.classList.add("view-pane"); // very important for show/hide

    view.innerHTML = `
      <div class="grid grid-cols-1 grid-rows-[32%_68%]  m-auto w-[96%] mt-2 h-100 gap-2">

        <!-- top -->
        <div class="text-white-100 rounded-2xl bg-black-85 flex flex-col items-center justify-center p-2 w-full"
          id="hourly-view-indicators">
          <div id="hourly-indicators" class="flex overflow-x-auto snap-x snap-mandatory space-x-4 w-[96%] scroll-smooth"></div>

        </div>

        <!-- Bottom full width -->
        <div class="flex flex-col gap-2 text-white-100 rounded-2xl bg-black-85 w-full items-center justify-center p-2 h-[94%] ">

          <div class="py-3 flex h-12 w-full bg-black-90 rounded-2xl justify-center items-center text-sm overflow-y-auto" 
               id="advice-info-hourly">
          </div>

          <div class="p-3 overflow-y-auto w-[95.4%] h-[84%] text-white-100 text-sm" 
               id="weather-location-info-hourly">
          </div>

        </div>
      </div>
    `;

    container.appendChild(view);
  },
  setupEventListeners() {
    // Move your event listeners here
    document.addEventListener(
      "allCacheData",
      this.handleCacheUpdate.bind(this)
    );
  },

  handleCacheUpdate(event) {
    // Handle cache updates
    const cacheData = event.detail?.allCacheData;
    if (!cacheData) return;

    // Update your UI components here
    if (cacheData.weatherRawDataCache) {
    }
  },
};
