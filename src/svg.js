// Animated SVG icons for weather conditions
const icons = {
  sun: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
    <defs>
      <style>
        @keyframes rotate { to { transform: rotate(360deg); } }
        .sun-rays { animation: rotate 20s linear infinite; transform-origin: center; }
      </style>
    </defs>
    <g class="sun-rays">
      <circle cx="32" cy="32" r="10" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
      <line x1="32" y1="10" x2="32" y2="4" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
      <line x1="32" y1="60" x2="32" y2="54" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
      <line x1="10" y1="32" x2="4" y2="32" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
      <line x1="60" y1="32" x2="54" y2="32" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
      <line x1="16" y1="16" x2="12" y2="12" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
      <line x1="52" y1="52" x2="48" y2="48" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
      <line x1="48" y1="16" x2="52" y2="12" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
      <line x1="12" y1="52" x2="16" y2="48" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>`,

  partlyCloudy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
    <defs>
      <style>
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .cloud { animation: float 3s ease-in-out infinite; }
      </style>
    </defs>
    <circle cx="24" cy="20" r="8" fill="#FFD700"/>
    <g class="cloud">
      <ellipse cx="40" cy="35" rx="12" ry="8" fill="#E0E0E0"/>
      <ellipse cx="32" cy="38" rx="10" ry="7" fill="#E0E0E0"/>
      <ellipse cx="48" cy="38" rx="10" ry="7" fill="#E0E0E0"/>
    </g>
  </svg>`,

  cloudy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
    <defs>
      <style>
        @keyframes drift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
        .cloud { animation: drift 4s ease-in-out infinite; }
      </style>
    </defs>
    <g class="cloud">
      <ellipse cx="32" cy="28" rx="14" ry="10" fill="#B0B0B0"/>
      <ellipse cx="22" cy="32" rx="12" ry="8" fill="#B0B0B0"/>
      <ellipse cx="42" cy="32" rx="12" ry="8" fill="#B0B0B0"/>
    </g>
  </svg>`,

  rain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
    <defs>
      <style>
        @keyframes fall { 0% { transform: translateY(-5px); opacity: 1; } 100% { transform: translateY(20px); opacity: 0; } }
        .raindrop { animation: fall 1s linear infinite; }
        .raindrop:nth-child(2) { animation-delay: 0.3s; }
        .raindrop:nth-child(3) { animation-delay: 0.6s; }
      </style>
    </defs>
    <ellipse cx="32" cy="20" rx="14" ry="10" fill="#808080"/>
    <ellipse cx="22" cy="24" rx="12" ry="8" fill="#808080"/>
    <ellipse cx="42" cy="24" rx="12" ry="8" fill="#808080"/>
    <line class="raindrop" x1="24" y1="35" x2="24" y2="45" stroke="#4A90E2" stroke-width="2" stroke-linecap="round"/>
    <line class="raindrop" x1="32" y1="35" x2="32" y2="45" stroke="#4A90E2" stroke-width="2" stroke-linecap="round"/>
    <line class="raindrop" x1="40" y1="35" x2="40" y2="45" stroke="#4A90E2" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  snow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
    <defs>
      <style>
        @keyframes snowfall { 0% { transform: translateY(-5px); opacity: 1; } 100% { transform: translateY(20px); opacity: 0; } }
        .snowflake { animation: snowfall 2s linear infinite; }
        .snowflake:nth-child(2) { animation-delay: 0.5s; }
        .snowflake:nth-child(3) { animation-delay: 1s; }
      </style>
    </defs>
    <ellipse cx="32" cy="20" rx="14" ry="10" fill="#C0C0C0"/>
    <ellipse cx="22" cy="24" rx="12" ry="8" fill="#C0C0C0"/>
    <ellipse cx="42" cy="24" rx="12" ry="8" fill="#C0C0C0"/>
    <circle class="snowflake" cx="24" cy="38" r="3" fill="#FFFFFF" stroke="#E0E0E0"/>
    <circle class="snowflake" cx="32" cy="38" r="3" fill="#FFFFFF" stroke="#E0E0E0"/>
    <circle class="snowflake" cx="40" cy="38" r="3" fill="#FFFFFF" stroke="#E0E0E0"/>
  </svg>`,

  thunderstorm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
    <defs>
      <style>
        @keyframes flash { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
        .lightning { animation: flash 2s ease-in-out infinite; }
      </style>
    </defs>
    <ellipse cx="32" cy="18" rx="14" ry="10" fill="#404040"/>
    <ellipse cx="22" cy="22" rx="12" ry="8" fill="#404040"/>
    <ellipse cx="42" cy="22" rx="12" ry="8" fill="#404040"/>
    <path class="lightning" d="M 32 28 L 28 38 L 32 38 L 30 48 L 38 34 L 34 34 L 36 28 Z" fill="#FFD700"/>
  </svg>`,

  fog: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
    <defs>
      <style>
        @keyframes fade { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        .fog-line { animation: fade 3s ease-in-out infinite; }
        .fog-line:nth-child(2) { animation-delay: 1s; }
        .fog-line:nth-child(3) { animation-delay: 2s; }
      </style>
    </defs>
    <line class="fog-line" x1="10" y1="25" x2="54" y2="25" stroke="#A0A0A0" stroke-width="3" stroke-linecap="round"/>
    <line class="fog-line" x1="10" y1="32" x2="54" y2="32" stroke="#A0A0A0" stroke-width="3" stroke-linecap="round"/>
    <line class="fog-line" x1="10" y1="39" x2="54" y2="39" stroke="#A0A0A0" stroke-width="3" stroke-linecap="round"/>
  </svg>`
};

// Weather code to animated icon mapping
export function returnWeatherIcon(weatherCode) {
  const iconMap = {
    0: icons.sun,
    1: icons.partlyCloudy,
    2: icons.partlyCloudy,
    3: icons.cloudy,
    45: icons.fog,
    46: icons.fog,
    47: icons.fog,
    48: icons.fog,
    51: icons.rain,
    53: icons.rain,
    55: icons.rain,
    56: icons.rain,
    57: icons.rain,
    61: icons.rain,
    63: icons.rain,
    65: icons.rain,
    66: icons.rain,
    67: icons.rain,
    71: icons.snow,
    73: icons.snow,
    75: icons.snow,
    77: icons.snow,
    79: icons.snow,
    80: icons.rain,
    81: icons.rain,
    82: icons.rain,
    85: icons.snow,
    86: icons.snow,
    95: icons.thunderstorm,
    96: icons.thunderstorm,
    99: icons.thunderstorm
  };

  return iconMap[weatherCode] || icons.sun;
}
