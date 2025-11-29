// src/Today/todayMain.js
import { updateWeatherIndicator } from "./indicatorBlock.js";
import { countryBlock } from "./countryDataBlock.js";
import { updateWeatherInfo } from "./weatherInfoBlock.js";
import { renderAdviceIfReady } from "./adviceInfo.js";

export const todayView = {
  initialize() {
    console.log("Today view initialized🔥");
    this.render(); // <- Render once (persistent UI)
    this.setupEventListeners();
  },

  render() {
    const container = document.querySelector("#weather-info-container");

    // If today-view is already created, DON'T re-render
    if (container.querySelector("#today-view")) return;

    // Create root wrapper
    const view = document.createElement("div");
    view.id = "today-view";
    view.classList.add("view-pane"); // <--- very important (for show/hid25

    view.innerHTML = `
      <div class="grid grid-cols-2 grid-rows-[32%_68%]  m-auto w-[96%] mt-2 h-100 gap-2">

        <!-- Left top -->
        <div class="text-white-100 rounded-2xl bg-black-85 flex flex-col items-center justify-center p-2"
            id="indicator-icon">
        </div>

        <!-- Right top -->
        <div class="text-white-100 rounded-2xl bg-black-85 flex flex-col items-center justify-center p-2"
            id="country-location-info">
        </div>

        <!-- Bottom full width -->
        <div class="flex flex-col gap-2 text-white-100 rounded-2xl bg-black-85 items-center justify-center p-2 h-[94%] col-span-2">
          <div class="py-3 flex h-12 w-full bg-black-90 rounded-2xl justify-center items-center text-sm overflow-y-auto" 
              id="advice-info">
          </div>

          <div class="p-3 overflow-y-auto w-[95.4%] h-[84%] text-white-100 text-sm" 
              id="weather-location-info">
          </div>
        </div>

      </div>
    `;

    // Attach it permanently
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
      updateWeatherIndicator(cacheData.weatherRawDataCache);
      updateWeatherInfo(cacheData.weatherRawDataCache);
      countryBlock();
      renderAdviceIfReady();
    }
  },
};

// Keep these as separate exports if needed by other modules
export { updateWeatherIndicator } from "./indicatorBlock.js";
export { countryBlock } from "./countryDataBlock.js";
export { updateWeatherInfo } from "./weatherInfoBlock.js";
export { renderAdviceIfReady } from "./adviceInfo.js";
