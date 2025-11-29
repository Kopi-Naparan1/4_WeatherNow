console.log("🔥🔥🔥 main.js - Start 🔥🔥🔥");

import "./style.css";

// Core modules
import { setupSearchedLocation } from "./weatherManagerHelper.js";
import "./navMovement.js";
import "./weatherManager.js";
import "./darkLightMode.js";

// --------------------------------------------------
// HTML Initialization
// --------------------------------------------------
document.querySelector("#app").innerHTML = `

<div>
  <div class="bg-black-90 min-h-screen min-w-screen flex flex-col items-center text-center text-white-95">
    <header class=" bg-black-100 font-medium w-screen h-12">
      <h1 class="flex items-center justify-center relative text-[2rem] text-white-100">WeatherNow</h1>
      <button id="themeToggle" class="switch absolute left-28 bottom-8">
      <span class="knob"></span>
      </button>

    </header>
<main class="flex flex-col justify-start mt-4 gap-4 w-[98%] flex-1">
  <div>
    <input 
      id="inputLocation" 
      type="text" 
      class="mt-2 self-center w-[90%] h-8 bg-black-80 rounded-2xl text-white-95 pl-5.5 placeholder-white-60" 
      placeholder="Search a city..." 
    />
  </div>

  <div class="flex flex-col self-center bg-black-80 w-[90%] rounded-2xl h-full" id="weather-container">

    <div 
      class="text-[1.2rem] font-medium flex text-white-95 p-1 h-[20%] rounded-t-2xl items-center justify-center w-full bg-black-80" 
      id="location"
    >
      Input a city
    </div>

    <div 
      class="relative text-white-95 h-[10%] w-full bg-black-80 flex flex-row justify-evenly items-center text-center" 
      id="navInfo"
    >
      <div class="absolute rounded-2xl items-center justify-center transition-all duration-300 bg-black-70 h-[90%]" 
        id="highlight">
      </div>
      <button class="tab relative" data-mode="hourly">Hourly</button>
      <button class="tab relative" data-mode="today">Today</button>
      <button class="tab relative" data-mode="daily">Daily</button>
    </div>

    <div 
      class="flex flex-col self-center justify-center w-[94%] rounded-2xl h-full" 
      id="weather-info-container"
    >
    </div>

  </div>
</main>

<footer class="w-screen mt-2 text-sm bg-black-80 text-white-60 h-6">v_1.0.1 | Nyro</footer>


  </div>
</div>
`;

// --------------------------------------------------
// DOM Ready Initialization
// --------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded, initializing app...");

  // Setup search input (handles Enter key and broadcasts)
  setupSearchedLocation();

  // Initialize Today view (renders default today weather)
  // todayView.initialize();
});
