import "./style.css";

const WEATHER_CODES = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    95: "Thunderstorm",
    96: "Thunderstorm With Hail",
};


function updateWeatherInfo(weatherData) {
    const element = document.querySelector("#weather-location-info");
    if (!element) {
        console.error("Weather info element not found");
        return;
    }

    const hourly = weatherData.hourly;
    const current = weatherData.current_weather;
    const h = new Date().getHours();

    // Extract all values using correct data sources
    const data = {
        temperature: Math.round(current.temperature),
        feelsLike: Math.round(hourly.apparent_temperature[h]),
        humidity: hourly.relative_humidity_2m[h],
        rainChance: hourly.precipitation_probability[h],
        rainAmount: hourly.precipitation[h],
        weatherCode: WEATHER_CODES[current.weathercode] || "Unknown",
        cloudCover: hourly.cloud_cover[h],
        windSpeed: Math.round(hourly.wind_speed_10m[h]),
        windDirection: hourly.wind_direction_10m[h],
        uvIndex: hourly.uv_index[h] || 0,
        visibility: Math.round(hourly.visibility[h] / 1000),
        dewPoint: Math.round(hourly.dew_point_2m[h]),
        pressure: Math.round(hourly.pressure_msl[h]),
    };

    element.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <!-- HIGH RELEVANCE -->
            <div>Temperature: <span class="font-bold">${data.temperature}°C</span></div>
            <div>Feels Like: <span class="font-bold">${data.feelsLike}°C</span></div>

            <div>Weather: <span class="font-bold">${data.weatherCode}</span></div>
            <div>Rain Chance: <span class="font-bold">${data.rainChance}%</span></div>

            <div>Humidity: <span class="font-bold">${data.humidity}%</span></div>
            <div>UV Index: <span class="font-bold">${data.uvIndex}</span></div>

            <div>Wind Speed: <span class="font-bold">${data.windSpeed} km/h</span></div>
            <div>Wind Direction: <span class="font-bold">${data.windDirection}°</span></div>

            <div>Visibility: <span class="font-bold">${data.visibility} km</span></div>
            <div>Cloud Cover: <span class="font-bold">${data.cloudCover}%</span></div>

            <!-- MID RELEVANCE -->
            <div>Rain Amount: <span class="font-bold">${data.rainAmount} mm</span></div>
            <div>Dew Point: <span class="font-bold">${data.dewPoint}°C</span></div>

            <!-- LOW RELEVANCE -->
            <div>Pressure: <span class="font-bold">${data.pressure} hPa</span></div>

        </div>

    `;
}

document.addEventListener("weatherUpdate", ({ detail }) => {
    updateWeatherInfo(detail.weather);
});
