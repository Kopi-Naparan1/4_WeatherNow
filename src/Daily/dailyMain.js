// src/Daily/dailyMain.js
import { dailyIndicatorMain } from "./dailyIndicators.js";

export const dailyView = {
  initialize() {
    this.render(); // render once (persistent)
    this.setupEventListeners();
    dailyIndicatorMain();
  },

  render() {
    const container = document.querySelector("#weather-info-container");

    // Correct guard: if daily-view exists → do nothing
    if (container.querySelector("#daily-view")) return;

    // Create wrapper
    const view = document.createElement("div");
    view.id = "daily-view";
    view.classList.add("view-pane");

    view.innerHTML = `
      <div class="grid grid-cols-1 grid-rows-[32%_68%] m-auto w-[96%] mt-2 h-100 gap-2">

        <!-- top -->
        <div class="text-white-100 rounded-2xl bg-black-85 flex flex-col items-center justify-center p-2"
          id="daily-view-indicators">
          <div id="daily-indicators" class="flex overflow-x-auto snap-x snap-mandatory space-x-4 w-[96%] scroll-smooth"></div>
        </div>

        <!-- Bottom full width -->
        <div class="flex flex-col gap-2 text-white-100 rounded-2xl bg-black-85 items-center justify-center p-2 h-[94%] ">

          <div class="py-3 flex h-12 w-full bg-black-90 rounded-2xl justify-center items-center text-sm overflow-y-auto" 
               id="advice-info-daily">
          </div>

          <div class="p-3 overflow-y-auto w-[95.4%] h-[84%] text-white-100 text-sm" 
               id="weather-location-info-daily">
          </div>

        </div>
      </div>
    `;

    container.appendChild(view);
  },

  setupEventListeners() {
    document.addEventListener(
      "allCacheData",
      this.handleCacheUpdate.bind(this)
    );
  },

  handleCacheUpdate(event) {
    const cacheData = event.detail?.allCacheData;
    if (!cacheData) return;

    if (cacheData.dailyWeatherDataCache) {
      console.log("Inside dailyMain.js - handleCacheUpdate()");
      // Later you will plug daily-specific update logic here
    }
  },
};
