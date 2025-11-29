// navMovement.js

import { todayView } from "./Today/todayMain.js";
import { dailyView } from "./Daily/dailyMain.js";
import { hourlyView } from "./Hourly/hourlyMain.js";

const TAG = "NavMovement";
const log = (...args) => console.log(`[${TAG}]`, ...args);

// -----------------------------------------
// SHOW SELECTED VIEW (persistent panels)
// -----------------------------------------
function showView(mode) {
  const container = document.getElementById("weather-info-container");

  // Hide all view panes
  const views = container.querySelectorAll(".view-pane");
  views.forEach((v) => (v.style.display = "none"));

  // Show the correct pane
  const selected = document.getElementById(`${mode}-view`);
  if (selected) {
    selected.style.display = "block";
  } else {
    console.warn(`View for mode="${mode}" not found`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const highlight = document.querySelector("#highlight");
  const tabs = document.querySelectorAll(".tab");

  // -----------------------------------------
  // Render the views once (persistent UI)
  // -----------------------------------------
  todayView.initialize();
  hourlyView.initialize();
  dailyView.initialize();

  // -----------------------------------------
  // Activate default view
  // -----------------------------------------
  showView("today");

  // -----------------------------------------
  // Highlight Movement
  // -----------------------------------------
  function moveHighlight(tab) {
    const rect = tab.getBoundingClientRect();
    const parentRect = tab.parentElement.getBoundingClientRect();
    const extra = 16;

    highlight.style.width = rect.width + extra + "px";
    highlight.style.left = rect.left - parentRect.left - extra / 2 + "px";
  }

  function activateTab(tab) {
    const mode = tab.dataset.mode;
    moveHighlight(tab);
    showView(mode);
  }

  // Default active tab → today
  const defaultTab = document.querySelector('[data-mode="today"]');
  activateTab(defaultTab);

  // -----------------------------------------
  // Click Events for Tabs
  // -----------------------------------------
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));
  });

  log("Navigation initialized");
});
