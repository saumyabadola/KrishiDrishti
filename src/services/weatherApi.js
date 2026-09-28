// ─────────────────────────────────────────────────────────────────────────────
// Open-Meteo API — Free real-time weather forecasts (no API key needed)
// https://open-meteo.com/
// ─────────────────────────────────────────────────────────────────────────────

const BASE = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch a 5-day weather forecast for given coordinates.
 * Returns { days: [...], current: {...} } or null on error.
 */
export async function fetchForecast(lat, lng) {
  try {
    const params = new URLSearchParams({
      latitude: lat.toFixed(4),
      longitude: lng.toFixed(4),
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'relative_humidity_2m_max',
        'relative_humidity_2m_min',
        'weather_code',
      ].join(','),
      current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code',
      timezone: 'Asia/Kolkata',
      forecast_days: 5,
    });

    const res = await fetch(`${BASE}?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const days = data.daily.time.map((date, i) => {
      const code = data.daily.weather_code[i];
      return {
        date,
        dateLabel: new Date(date).toLocaleDateString('en-IN', {
          weekday: 'short', month: 'short', day: 'numeric',
        }),
        tempHigh: data.daily.temperature_2m_max[i],
        tempLow: data.daily.temperature_2m_min[i],
        rainfall: data.daily.precipitation_sum[i],
        rainProb: data.daily.precipitation_probability_max[i],
        windSpeed: data.daily.wind_speed_10m_max[i],
        humidityMax: data.daily.relative_humidity_2m_max[i],
        humidityMin: data.daily.relative_humidity_2m_min[i],
        humidity: Math.round(
          (data.daily.relative_humidity_2m_max[i] + data.daily.relative_humidity_2m_min[i]) / 2
        ),
        weatherCode: code,
        icon: wmoIcon(code),
        // Generate uncertainty band approximations from the data
        tempHighUpper: +(data.daily.temperature_2m_max[i] + 1.5 + i * 0.4).toFixed(1),
        tempHighLower: +(data.daily.temperature_2m_max[i] - 1.5 - i * 0.4).toFixed(1),
        tempLowUpper: +(data.daily.temperature_2m_min[i] + 1.2 + i * 0.3).toFixed(1),
        tempLowLower: +(data.daily.temperature_2m_min[i] - 1.2 - i * 0.3).toFixed(1),
        rainfallUpper: +(data.daily.precipitation_sum[i] + 5 + i * 1.5).toFixed(1),
        rainfallLower: +Math.max(0, data.daily.precipitation_sum[i] - 4 - i * 1.2).toFixed(1),
        confidence: Math.max(60, 92 - i * 5 - (code > 60 ? 8 : 0)),
      };
    });

    const current = data.current
      ? {
          temp: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          precipitation: data.current.precipitation,
          icon: wmoIcon(data.current.weather_code),
        }
      : null;

    return { days, current, isLive: true };
  } catch (err) {
    console.warn('Open-Meteo fetch failed, using mock data:', err.message);
    return null;
  }
}

/**
 * Map WMO weather codes to emoji icons
 */
function wmoIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 49) return '🌫️';
  if (code <= 59) return '🌦️';
  if (code <= 69) return '🌧️';
  if (code <= 79) return '🌨️';
  if (code <= 84) return '🌧️';
  if (code <= 94) return '⛈️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}

// Simple cache to avoid refetching for the same location within 10 minutes
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000;

export async function fetchForecastCached(lat, lng) {
  const key = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }
  const data = await fetchForecast(lat, lng);
  if (data) {
    cache.set(key, { data, ts: Date.now() });
  }
  return data;
}
