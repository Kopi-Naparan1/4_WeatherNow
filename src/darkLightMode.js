document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded, initializing app...");

  const themeToggle = document.querySelector("#themeToggle");
  const body = document.body;

  themeToggle.addEventListener("click", () => {
    console.log("Toggle is clicked!");
    body.classList.toggle("lights");
    console.log("Theme toggled:", body.classList.contains("lights"));
  });
});
